// server/db.js
// Persistent Atomic JSON Database with in-memory caching for real-time performance
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { QUESTIONS, SHARK_ATTACK_QUESTIONS } from './questions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

const DEFAULT_DATA = {
  teams: [],
  settings: {
    eventState: 'active', // 'registration' | 'active' | 'frozen' | 'ended'
    mainPointsPerQuestion: 10,
    sharkAttackPoints: 5,
    sharkAttackActive: false,
    sharkAttackQuestion: null,
    sharkAttackDeadline: null,
    sharkAttackDuration: 15, // seconds
    leaderboardRevealed: false,
    tieBreakerRule: 'standard' // 'standard' (Main Score -> Correct Count -> Timestamp)
  },
  sharkAttackHistory: []
};

let memoryStore = { ...DEFAULT_DATA };
let isLoaded = false;

export const DB = {
  init() {
    if (isLoaded) return;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        memoryStore = JSON.parse(raw);
        // Ensure settings exist
        memoryStore.settings = { ...DEFAULT_DATA.settings, ...(memoryStore.settings || {}) };
        if (!memoryStore.teams) memoryStore.teams = [];
        if (!memoryStore.sharkAttackHistory) memoryStore.sharkAttackHistory = [];
      } else {
        memoryStore = { ...DEFAULT_DATA };
        this.save();
      }
    } catch (err) {
      console.error('[DB] Error loading database file, initializing fallback:', err);
      memoryStore = { ...DEFAULT_DATA };
    }
    isLoaded = true;
  },

  save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(memoryStore, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB] Error saving database file:', err);
    }
  },

  getSettings() {
    this.init();
    return memoryStore.settings;
  },

  updateSettings(updates) {
    this.init();
    memoryStore.settings = { ...memoryStore.settings, ...updates };
    this.save();
    return memoryStore.settings;
  },

  getAllTeams() {
    this.init();
    return memoryStore.teams;
  },

  getTeamById(id) {
    this.init();
    return memoryStore.teams.find(t => t.id === id || t.teamId === id);
  },

  findTeamByLogin(query) {
    this.init();
    if (!query) return null;
    const clean = query.trim().toLowerCase();
    return memoryStore.teams.find(t => 
      t.teamId.toLowerCase() === clean ||
      t.teamName.trim().toLowerCase() === clean ||
      t.contactNumber.trim() === query.trim()
    );
  },

  registerTeam({ teamName, leaderName, contactNumber }) {
    this.init();
    const cleanTeamName = teamName.trim();
    const cleanLeaderName = leaderName.trim();
    const cleanContact = contactNumber.trim().replace(/[\s-]/g, '');

    // Duplicate checks
    const nameExists = memoryStore.teams.some(
      t => t.teamName.toLowerCase() === cleanTeamName.toLowerCase()
    );
    if (nameExists) {
      throw new Error(`Team name "${cleanTeamName}" is already registered. Please choose another name or login.`);
    }

    const contactExists = memoryStore.teams.some(
      t => t.contactNumber === cleanContact
    );
    if (contactExists) {
      throw new Error(`Contact number ${cleanContact} is already registered with another team.`);
    }

    // Generate readable Unique Team ID: NEMO-xxxx
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const teamId = `NEMO-${randSuffix}`;
    const id = `team_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newTeam = {
      id,
      teamId,
      teamName: cleanTeamName,
      leaderName: cleanLeaderName,
      contactNumber: cleanContact,
      section: null,
      currentQuestionIndex: 0,
      mainScore: 0,
      bonusPoints: 0,
      finalScore: 0,
      status: 'registered', // 'registered', 'in_progress', 'completed'
      answers: {}, // { [questionId]: { selected, isCorrect, pointsAwarded, answeredAt } }
      sharkAttackAttempted: false,
      sharkAttackAnswer: null,
      sharkAttackCorrect: false,
      registeredAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
      lastActiveAt: new Date().toISOString()
    };

    memoryStore.teams.push(newTeam);
    this.save();
    return newTeam;
  },

  selectSection(teamId, sectionId) {
    this.init();
    const team = this.getTeamById(teamId);
    if (!team) throw new Error('Team not found');

    if (team.section && team.section !== sectionId && Object.keys(team.answers).length > 0) {
      throw new Error(`Section is already locked to ${team.section.toUpperCase()}. Contact organizers to reset.`);
    }

    team.section = sectionId;
    team.status = 'in_progress';
    if (!team.startedAt) {
      team.startedAt = new Date().toISOString();
    }
    team.lastActiveAt = new Date().toISOString();
    this.save();
    return team;
  },

  submitAnswer(teamId, questionId, selectedOption) {
    this.init();
    const team = this.getTeamById(teamId);
    if (!team) throw new Error('Team not found');

    if (memoryStore.settings.eventState === 'frozen' || memoryStore.settings.eventState === 'ended') {
      throw new Error('Submissions are currently frozen or the event has concluded.');
    }

    if (!team.section) throw new Error('Section not selected yet');

    const sectionQuestions = QUESTIONS[team.section] || [];
    const question = sectionQuestions.find(q => q.id === questionId);
    if (!question) throw new Error('Invalid question ID for this section');

    // Prevent duplicate scoring
    if (team.answers[questionId]) {
      throw new Error('This question has already been submitted');
    }

    const isCorrect = (selectedOption.trim().toUpperCase() === question.correctKey.toUpperCase());
    const pointsAwarded = isCorrect ? (memoryStore.settings.mainPointsPerQuestion || 10) : 0;

    team.answers[questionId] = {
      selected: selectedOption.trim().toUpperCase(),
      isCorrect,
      pointsAwarded,
      answeredAt: new Date().toISOString()
    };

    // Calculate score
    let mainScore = 0;
    Object.values(team.answers).forEach(ans => {
      mainScore += (ans.pointsAwarded || 0);
    });
    team.mainScore = mainScore;
    team.finalScore = team.mainScore + (team.bonusPoints || 0);

    const answeredCount = Object.keys(team.answers).length;
    team.currentQuestionIndex = Math.min(answeredCount, 15);

    if (answeredCount >= 15) {
      team.status = 'completed';
      if (!team.completedAt) {
        team.completedAt = new Date().toISOString();
      }
    } else {
      team.status = 'in_progress';
    }

    team.lastActiveAt = new Date().toISOString();
    this.save();

    return {
      team,
      isCorrect,
      pointsAwarded,
      clue: question.clue,
      explanation: question.explanation,
      completedCount: answeredCount,
      isFinished: answeredCount >= 15
    };
  },

  triggerSharkAttack(questionIndex = 0) {
    this.init();
    const pool = SHARK_ATTACK_QUESTIONS;
    const selectedQ = pool[questionIndex % pool.length];
    const duration = memoryStore.settings.sharkAttackDuration || 15;
    const deadline = Date.now() + (duration * 1000);

    memoryStore.settings.sharkAttackActive = true;
    memoryStore.settings.sharkAttackQuestion = {
      id: selectedQ.id,
      title: selectedQ.title,
      question: selectedQ.question,
      options: selectedQ.options,
      correctKey: selectedQ.correctKey,
      explanation: selectedQ.explanation,
      duration,
      deadline
    };
    memoryStore.settings.sharkAttackDeadline = deadline;

    memoryStore.sharkAttackHistory.push({
      triggeredAt: new Date().toISOString(),
      questionId: selectedQ.id,
      deadline
    });

    this.save();
    return memoryStore.settings.sharkAttackQuestion;
  },

  endSharkAttack() {
    this.init();
    memoryStore.settings.sharkAttackActive = false;
    memoryStore.settings.sharkAttackQuestion = null;
    memoryStore.settings.sharkAttackDeadline = null;
    this.save();
  },

  submitSharkAttack(teamId, selectedOption) {
    this.init();
    const team = this.getTeamById(teamId);
    if (!team) throw new Error('Team not found');

    if (!memoryStore.settings.sharkAttackActive || !memoryStore.settings.sharkAttackQuestion) {
      throw new Error('No active Shark Attack event right now');
    }

    // Grace period of 1.5 seconds for network latency
    const now = Date.now();
    if (now > (memoryStore.settings.sharkAttackDeadline + 1500)) {
      throw new Error('Time expired! Bruce has already swum away.');
    }

    if (team.sharkAttackAttempted) {
      throw new Error('Team already submitted for this bonus event');
    }

    const currentQ = memoryStore.settings.sharkAttackQuestion;
    const isCorrect = (selectedOption.trim().toUpperCase() === currentQ.correctKey.toUpperCase());
    const bonusAwarded = isCorrect ? (memoryStore.settings.sharkAttackPoints || 5) : 0;

    team.sharkAttackAttempted = true;
    team.sharkAttackAnswer = selectedOption.trim().toUpperCase();
    team.sharkAttackCorrect = isCorrect;
    team.bonusPoints = (team.bonusPoints || 0) + bonusAwarded;
    team.finalScore = team.mainScore + team.bonusPoints;
    team.lastActiveAt = new Date().toISOString();

    this.save();

    return {
      team,
      isCorrect,
      bonusAwarded,
      explanation: currentQ.explanation
    };
  },

  resetTeam(teamId) {
    this.init();
    const team = this.getTeamById(teamId);
    if (!team) throw new Error('Team not found');

    team.section = null;
    team.currentQuestionIndex = 0;
    team.mainScore = 0;
    team.bonusPoints = 0;
    team.finalScore = 0;
    team.status = 'registered';
    team.answers = {};
    team.sharkAttackAttempted = false;
    team.sharkAttackAnswer = null;
    team.sharkAttackCorrect = false;
    team.startedAt = null;
    team.completedAt = null;
    team.lastActiveAt = new Date().toISOString();

    this.save();
    return team;
  },

  deleteTeam(teamId) {
    this.init();
    const idx = memoryStore.teams.findIndex(t => t.id === teamId || t.teamId === teamId);
    if (idx === -1) throw new Error('Team not found');
    const removed = memoryStore.teams.splice(idx, 1)[0];
    this.save();
    return removed;
  },

  getLeaderboardData(includePrivateInfo = false) {
    this.init();
    const teams = [...memoryStore.teams];

    // Tie-breaker sorter:
    // 1. Final score descending
    // 2. Main quiz score descending
    // 3. More correct main questions descending
    // 4. Earliest completion or last score update timestamp ascending
    teams.sort((a, b) => {
      if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
      if (b.mainScore !== a.mainScore) return b.mainScore - a.mainScore;

      const aCorrect = Object.values(a.answers || {}).filter(ans => ans.isCorrect).length;
      const bCorrect = Object.values(b.answers || {}).filter(ans => ans.isCorrect).length;
      if (bCorrect !== aCorrect) return bCorrect - aCorrect;

      const aTime = a.completedAt ? new Date(a.completedAt).getTime() : new Date(a.lastActiveAt || 0).getTime();
      const bTime = b.completedAt ? new Date(b.completedAt).getTime() : new Date(b.lastActiveAt || 0).getTime();
      return aTime - bTime;
    });

    const formatRow = (team, rank) => {
      const correctCount = Object.values(team.answers || {}).filter(ans => ans.isCorrect).length;
      const answeredCount = Object.keys(team.answers || {}).length;

      const base = {
        rank,
        teamId: team.teamId,
        teamName: team.teamName,
        leaderName: team.leaderName,
        section: team.section ? team.section.toUpperCase() : 'NOT SELECTED',
        completedQuestions: answeredCount,
        correctQuestions: correctCount,
        mainScore: team.mainScore,
        bonusPoints: team.bonusPoints || 0,
        finalScore: team.finalScore,
        status: team.status === 'completed' ? 'Completed' : (team.status === 'in_progress' ? 'In Progress' : 'Registered'),
        startedAt: team.startedAt,
        completedAt: team.completedAt
      };

      if (includePrivateInfo) {
        base.contactNumber = team.contactNumber;
      }

      return base;
    };

    const overall = teams.map((t, idx) => formatRow(t, idx + 1));
    
    // Section-wise leaderboards
    const bySection = {
      excel: teams.filter(t => t.section === 'excel').map((t, idx) => formatRow(t, idx + 1)),
      python: teams.filter(t => t.section === 'python').map((t, idx) => formatRow(t, idx + 1)),
      sql: teams.filter(t => t.section === 'sql').map((t, idx) => formatRow(t, idx + 1))
    };

    const summary = {
      totalTeams: teams.length,
      excelCount: teams.filter(t => t.section === 'excel').length,
      pythonCount: teams.filter(t => t.section === 'python').length,
      sqlCount: teams.filter(t => t.section === 'sql').length,
      unassignedCount: teams.filter(t => !t.section).length,
      completedTeams: teams.filter(t => t.status === 'completed').length,
      inProgressTeams: teams.filter(t => t.status === 'in_progress').length,
      highestScore: teams.length > 0 ? Math.max(...teams.map(t => t.finalScore)) : 0,
      averageScore: teams.length > 0 ? (teams.reduce((acc, t) => acc + t.finalScore, 0) / teams.length).toFixed(1) : 0,
      sharkAttackParticipants: teams.filter(t => t.sharkAttackAttempted).length,
      totalBonusAwarded: teams.reduce((acc, t) => acc + (t.bonusPoints || 0), 0)
    };

    return { overall, bySection, summary };
  }
};
