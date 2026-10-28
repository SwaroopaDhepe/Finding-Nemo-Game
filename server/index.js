// server/index.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { DB } from './db.js';
import { SECTIONS, QUESTIONS, SHARK_ATTACK_QUESTIONS } from './questions.js';
import { generateLeaderboardWorkbook } from './export.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nemo@2026';
const ADMIN_TOKEN = 'secret-nemo-admin-token-2026';

app.use(cors());
app.use(express.json());

// Initialize Database
DB.init();

// Middleware: Admin Authentication
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.replace('Bearer ', '') === ADMIN_TOKEN) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
}

// Helper: Sanitize question for client (Hides correctKey and internal answer logic)
function sanitizeQuestion(q) {
  if (!q) return null;
  return {
    id: q.id,
    number: q.number,
    story: q.story,
    question: q.question,
    code: q.code || null,
    options: q.options
  };
}

// ---------------- API ROUTES ---------------- //

// 1. Config & Sections
app.get('/api/config', (req, res) => {
  const settings = DB.getSettings();
  res.json({
    eventState: settings.eventState,
    leaderboardRevealed: settings.leaderboardRevealed,
    mainPointsPerQuestion: settings.mainPointsPerQuestion,
    sharkAttackPoints: settings.sharkAttackPoints,
    sharkAttackActive: settings.sharkAttackActive,
    sharkAttackDeadline: settings.sharkAttackDeadline,
    sections: SECTIONS
  });
});

// 2. Team Registration
app.post('/api/register', (req, res) => {
  try {
    const { teamName, leaderName, contactNumber } = req.body;

    if (!teamName || !teamName.trim()) {
      return res.status(400).json({ error: 'Team Name is required' });
    }
    if (!leaderName || !leaderName.trim()) {
      return res.status(400).json({ error: 'Team Leader Name is required' });
    }
    if (!contactNumber || !contactNumber.trim()) {
      return res.status(400).json({ error: 'Contact Number is required' });
    }

    // Validate 10-digit Indian mobile number format (6-9 followed by 9 digits) or 7-15 digits international
    const cleanPhone = contactNumber.trim().replace(/[\s-]/g, '');
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({ 
        error: 'Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9)' 
      });
    }

    const settings = DB.getSettings();
    if (settings.eventState === 'ended') {
      return res.status(400).json({ error: 'Event registration is closed as the event has concluded' });
    }

    const team = DB.registerTeam({
      teamName,
      leaderName,
      contactNumber: cleanPhone
    });

    // Notify admins via socket
    io.emit('team-registered', {
      teamId: team.teamId,
      teamName: team.teamName,
      leaderName: team.leaderName,
      registeredAt: team.registeredAt
    });

    res.status(201).json({
      message: `Welcome aboard, ${team.teamName}! Your Team ID is ${team.teamId}`,
      team: {
        id: team.id,
        teamId: team.teamId,
        teamName: team.teamName,
        leaderName: team.leaderName,
        section: team.section,
        status: team.status
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. Team Login / Resume Session
app.post('/api/login', (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Please provide Team ID, Team Name, or Contact Number' });

    const team = DB.findTeamByLogin(query);
    if (!team) {
      return res.status(404).json({ error: 'No team found with that Team ID, Team Name, or Contact Number' });
    }

    team.lastActiveAt = new Date().toISOString();
    DB.save();

    res.json({
      message: `Welcome back, ${team.teamName}!`,
      team: {
        id: team.id,
        teamId: team.teamId,
        teamName: team.teamName,
        leaderName: team.leaderName,
        section: team.section,
        status: team.status,
        mainScore: team.mainScore,
        bonusPoints: team.bonusPoints,
        finalScore: team.finalScore
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. Get Team Details (Private Dashboard)
app.get('/api/team/:teamId', (req, res) => {
  const team = DB.getTeamById(req.params.teamId);
  if (!team) return res.status(404).json({ error: 'Team not found' });

  // Compute answers summary without exposing answers
  const answeredCount = Object.keys(team.answers || {}).length;
  const progressPercent = Math.round((answeredCount / 15) * 100);

  // Determine stage label
  let stageLabel = "Exploring the Open Ocean";
  if (progressPercent >= 100) stageLabel = "Mission Complete — Nemo Found!";
  else if (progressPercent >= 76) stageLabel = "Approaching Nemo's Hideout";
  else if (progressPercent >= 51) stageLabel = "Searching the Sunken Ship";
  else if (progressPercent >= 26) stageLabel = "Entering the Coral Reef";

  res.json({
    team: {
      id: team.id,
      teamId: team.teamId,
      teamName: team.teamName,
      leaderName: team.leaderName,
      section: team.section,
      currentQuestionIndex: team.currentQuestionIndex,
      mainScore: team.mainScore,
      bonusPoints: team.bonusPoints || 0,
      finalScore: team.finalScore,
      status: team.status,
      sharkAttackAttempted: team.sharkAttackAttempted,
      sharkAttackCorrect: team.sharkAttackCorrect,
      completedCount: answeredCount,
      progressPercent,
      stageLabel,
      completedAt: team.completedAt
    }
  });
});

// 5. Select Section
app.post('/api/team/:teamId/section', (req, res) => {
  try {
    const { sectionId } = req.body;
    if (!['excel', 'python', 'sql'].includes(sectionId)) {
      return res.status(400).json({ error: 'Invalid section. Choose excel, python, or sql.' });
    }

    const team = DB.selectSection(req.params.teamId, sectionId);
    io.emit('team-updated', { teamId: team.teamId, section: team.section, status: team.status });

    res.json({
      message: `Section locked to ${SECTIONS[sectionId].title}!`,
      team: {
        id: team.id,
        teamId: team.teamId,
        teamName: team.teamName,
        section: team.section,
        status: team.status
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 6. Get Current / Specific Question
app.get('/api/team/:teamId/question/:index', (req, res) => {
  try {
    const team = DB.getTeamById(req.params.teamId);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    if (!team.section) return res.status(400).json({ error: 'Section not selected' });

    const qIndex = parseInt(req.params.index, 10);
    const sectionQuestions = QUESTIONS[team.section] || [];
    if (qIndex < 0 || qIndex >= sectionQuestions.length) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const question = sectionQuestions[qIndex];
    const prevQuestion = qIndex > 0 ? sectionQuestions[qIndex - 1] : null;

    // Check if team has already answered this question
    const existingAnswer = team.answers ? team.answers[question.id] : null;

    res.json({
      question: sanitizeQuestion(question),
      totalQuestions: sectionQuestions.length,
      previousClue: prevQuestion ? prevQuestion.clue : null,
      alreadyAnswered: !!existingAnswer,
      answeredData: existingAnswer ? {
        selected: existingAnswer.selected,
        isCorrect: existingAnswer.isCorrect,
        pointsAwarded: existingAnswer.pointsAwarded,
        explanation: question.explanation,
        clue: question.clue
      } : null
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 7. Submit Answer to Main Question
app.post('/api/team/:teamId/submit', (req, res) => {
  try {
    const { questionId, selectedOption } = req.body;
    if (!questionId || !selectedOption) {
      return res.status(400).json({ error: 'Question ID and Selected Option are required' });
    }

    const result = DB.submitAnswer(req.params.teamId, questionId, selectedOption);

    // Broadcast update to Admin monitors
    io.emit('team-updated', {
      teamId: result.team.teamId,
      mainScore: result.team.mainScore,
      finalScore: result.team.finalScore,
      status: result.team.status,
      currentQuestionIndex: result.team.currentQuestionIndex
    });

    res.json({
      isCorrect: result.isCorrect,
      pointsAwarded: result.pointsAwarded,
      clue: result.clue,
      explanation: result.explanation,
      completedCount: result.completedCount,
      isFinished: result.isFinished,
      mainScore: result.team.mainScore,
      finalScore: result.team.finalScore
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 8. Submit Shark Attack Bonus
app.post('/api/team/:teamId/shark-attack', (req, res) => {
  try {
    const { selectedOption } = req.body;
    if (!selectedOption) return res.status(400).json({ error: 'Option is required' });

    const result = DB.submitSharkAttack(req.params.teamId, selectedOption);

    io.emit('team-updated', {
      teamId: result.team.teamId,
      bonusPoints: result.team.bonusPoints,
      finalScore: result.team.finalScore
    });

    res.json({
      message: result.isCorrect ? 'Fantastic! You survived Bruce and scored +5 bonus points!' : 'Time was close, but Bruce was too fast! 0 bonus points.',
      isCorrect: result.isCorrect,
      bonusAwarded: result.bonusAwarded,
      explanation: result.explanation,
      finalScore: result.team.finalScore
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 9. Public Leaderboard
app.get('/api/leaderboard', (req, res) => {
  const settings = DB.getSettings();
  
  // If leaderboard is not revealed yet and not finished, give status
  if (!settings.leaderboardRevealed && settings.eventState !== 'ended') {
    return res.json({
      revealed: false,
      message: "The final leaderboard is currently hidden to keep gameplay thrilling! Organizers will reveal the final standings after the event concludes.",
      summary: {
        totalTeams: DB.getAllTeams().length,
        status: settings.eventState
      }
    });
  }

  const data = DB.getLeaderboardData(false); // false = omit phone numbers for public privacy
  res.json({
    revealed: true,
    overall: data.overall,
    bySection: data.bySection,
    summary: data.summary
  });
});

// ---------------- ORGANIZER / ADMIN ROUTES ---------------- //

// 10. Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === ADMIN_PASSWORD) {
    return res.json({
      token: ADMIN_TOKEN,
      message: 'Admin authorization granted'
    });
  }
  return res.status(401).json({ error: 'Invalid admin credentials' });
});

// 11. Admin Teams Overview
app.get('/api/admin/teams', requireAdmin, (req, res) => {
  const teams = DB.getAllTeams();
  const settings = DB.getSettings();
  const data = DB.getLeaderboardData(true); // true = include contacts
  res.json({
    teams: data.overall,
    bySection: data.bySection,
    summary: data.summary,
    settings
  });
});

// 12. Admin Reset Team Session
app.post('/api/admin/reset-team', requireAdmin, (req, res) => {
  try {
    const { teamId } = req.body;
    const team = DB.resetTeam(teamId);
    io.emit('team-updated', { teamId: team.teamId, status: team.status });
    res.json({ message: `Team ${team.teamName} (${team.teamId}) has been reset.`, team });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 13. Admin Delete Team
app.delete('/api/admin/team/:teamId', requireAdmin, (req, res) => {
  try {
    const removed = DB.deleteTeam(req.params.teamId);
    io.emit('team-removed', { teamId: removed.teamId });
    res.json({ message: `Team ${removed.teamName} removed successfully.` });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 14. Admin Update Settings
app.post('/api/admin/settings', requireAdmin, (req, res) => {
  try {
    const updated = DB.updateSettings(req.body);
    io.emit('settings-updated', updated);
    res.json({ message: 'Settings updated successfully', settings: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 15. Admin Trigger Bruce's Shark Attack
app.post('/api/admin/shark-attack/trigger', requireAdmin, (req, res) => {
  try {
    const { questionIndex = 0 } = req.body;
    const attackQ = DB.triggerSharkAttack(questionIndex);

    // Broadcast synchronized bonus event to all active clients!
    io.emit('shark-attack-start', {
      title: attackQ.title,
      question: attackQ.question,
      options: attackQ.options,
      duration: attackQ.duration,
      deadline: attackQ.deadline
    });

    // Auto schedule end on server after 16.5 seconds
    setTimeout(() => {
      DB.endSharkAttack();
      io.emit('shark-attack-end');
    }, (attackQ.duration + 2) * 1000);

    res.json({
      message: "Bruce's Shark Attack triggered across all active teams!",
      sharkAttack: attackQ
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 16. Admin Cancel Shark Attack
app.post('/api/admin/shark-attack/end', requireAdmin, (req, res) => {
  DB.endSharkAttack();
  io.emit('shark-attack-end');
  res.json({ message: "Shark Attack concluded." });
});

// 17. Admin Download Excel Leaderboard
app.get('/api/admin/export-excel', requireAdmin, async (req, res) => {
  try {
    const buffer = await generateLeaderboardWorkbook();
    const today = new Date().toISOString().split('T')[0];
    const filename = `Finding_Nemo_Leaderboard_${today}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err) {
    console.error('Excel generation error:', err);
    res.status(500).json({ error: 'Failed to generate Excel workbook' });
  }
});

// 18. Admin Seed Demo Data (Optional for testing)
app.post('/api/admin/seed-demo', requireAdmin, (req, res) => {
  try {
    const demoTeams = [
      { name: "Coral Crushers", leader: "Aarav Sharma", phone: "9876543210", sec: "python", score: 140, bonus: 5, comp: 15 },
      { name: "Dory's Dynamos", leader: "Priya Patel", phone: "9812345678", sec: "excel", score: 130, bonus: 5, comp: 15 },
      { name: "SQL Sirens", leader: "Rohan Iyer", phone: "9765432109", sec: "sql", score: 120, bonus: 0, comp: 15 },
      { name: "Sydney Swimmers", leader: "Sneha Reddy", phone: "9654321098", sec: "python", score: 90, bonus: 5, comp: 10 },
      { name: "Nemo Navigators", leader: "Vikram Das", phone: "9543210987", sec: "excel", score: 60, bonus: 0, comp: 7 }
    ];

    demoTeams.forEach((dt, i) => {
      try {
        const team = DB.registerTeam({ teamName: dt.name, leaderName: dt.leader, contactNumber: dt.phone });
        DB.selectSection(team.teamId, dt.sec);
        // Simulate questions answered
        const secQs = QUESTIONS[dt.sec];
        for (let j = 0; j < dt.comp; j++) {
          const q = secQs[j];
          team.answers[q.id] = {
            selected: q.correctKey,
            isCorrect: true,
            pointsAwarded: 10,
            answeredAt: new Date(Date.now() - (15 - j) * 60000).toISOString()
          };
        }
        team.mainScore = dt.score;
        team.bonusPoints = dt.bonus;
        team.finalScore = dt.score + dt.bonus;
        team.currentQuestionIndex = dt.comp;
        if (dt.comp >= 15) {
          team.status = 'completed';
          team.completedAt = new Date().toISOString();
        } else {
          team.status = 'in_progress';
        }
        team.sharkAttackAttempted = dt.bonus > 0;
        team.sharkAttackCorrect = dt.bonus > 0;
      } catch (e) {
        // ignore duplicate
      }
    });

    DB.save();
    res.json({ message: 'Demo teams seeded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Socket.io Connection Logic
io.on('connection', (socket) => {
  // Can track active connections
  socket.on('join-team', (teamId) => {
    socket.join(`team_${teamId}`);
  });

  socket.on('disconnect', () => {
    // disconnected
  });
});

// Serve frontend in production if dist exists
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.sendFile(path.join(clientDist, 'index.html'));
});

server.listen(PORT, () => {
  console.log(`[Finding Nemo Server] running on http://localhost:${PORT}`);
});
