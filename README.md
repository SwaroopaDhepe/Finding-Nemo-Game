# Finding Nemo — Find the Data 🐠

> **College Technical Event Competition Platform**  
> *Tagline:* “Just keep swimming.”  
> *Audience:* 1st to 4th year engineering students across all branches.

---

## 🌊 Overview

**Finding Nemo — Find the Data** is an interactive, responsive quiz competition website built for a college technical festival. Teams solve progressive technical and logical puzzles to find Nemo. The system privately tracks each team's progress, introduces surprise synchronized bonus challenges ("Bruce's Shark Attack!"), and generates an organizer-downloadable multi-sheet `.xlsx` Excel leaderboard with rankings and tie-breakers.

---

## 🚀 Key Features

### 1. Visual Ocean Adventure Theme
- Ocean blue, turquoise, coral orange, white, and deep-sea navy palette.
- Animated rising bubbles, caustics light sheen, swaying coral reefs and seaweeds.
- Scalable vector clownfish mascot (Nemo) with authentic animations.
- Web Audio API procedural sound effects (bubble pops, correct chimes, alert sirens, victory fanfare) — zero external audio files required, toggleable via Mute/Unmute.
- Fully responsive across mobile, tablets, laptops, and desktop displays.

### 2. Team Registration & Session Persistence
- **Fields:** Team Name, Team Leader Name, Team Leader Contact Number (with Indian mobile number format validation: 10 digits starting with 6–9).
- Generates a human-friendly unique Team ID (e.g., `NEMO-4081`).
- Duplicate registration prevention by team name and phone number.
- Returning teams can easily resume their session using Team ID, Team Name, or Contact Number without losing progress.
- Contact numbers are kept private and never shown on the public leaderboard.

### 3. Three Technical Tracks (Section Selection)
Teams choose one of 3 technical sections:
- **Dory's Spreadsheet Challenge (Excel):** SUM, COUNT, COUNTA, IF, COUNTIF, LEFT, AND, absolute references (`$A$1`), lookup logic, formula output prediction.
- **Crush's Code Quest (Python):** Operator precedence, list indexing/slicing, loops, `range()`, boolean conditions, functions, scoping, exceptions, and 2D turtle navigation vectors.
- **The Sunken Database (SQL):** SELECT, WHERE, ORDER BY, DISTINCT, aggregate functions (COUNT, SUM, AVG), GROUP BY, HAVING, INNER & LEFT JOINs, NULL handling, and transponder queries.
- Section choice is locked once started to ensure fairness.

### 4. 45 Progressive, Interconnected Questions
- Exactly 15 questions per section (Total 45 main questions).
- Interconnected storyline: answers and clues discovered in earlier questions help teams solve subsequent challenges.
- **Built-in Recovery Mechanism:** If a team selects an incorrect answer, server feedback explains the logic and provides the confirmed intermediate clue so teams are never blocked or stuck.
- **Strict Server-Side Scoring & Security:** Correct answers are evaluated on the server and are never sent to the client beforehand. Resubmission of already answered questions is prevented.
- Standard scoring: 10 points per question (Max 150 points for the main quiz).

### 5. Bruce's Shark Attack! (Surprise Bonus Round)
- Synchronized live surprise event for all active teams.
- Friendly alert with siren sound: *“BRUCE'S SHARK ATTACK! Quick, answer before time runs out!”*
- Synchronized 15-second countdown tied to the server deadline.
- First valid submission within the deadline earns **+5 bonus points** (0 points for wrong answer or timeout; no deductions).
- Does not affect the main 15-question progress percentage.

### 6. Private Team Progress Dashboard & Journey Map
- Teams see only their own gameplay, scores, and progress.
- 5 Visual Milestones on the Expedition Map:
  1. `0% – 25%`: **Exploring the Open Ocean**
  2. `26% – 50%`: **Entering the Coral Reef**
  3. `51% – 75%`: **Searching the Sunken Ship**
  4. `76% – 99%`: **Approaching Nemo's Hideout**
  5. `100%`: **Mission Complete — Nemo Found!**
- Animated swimming Nemo marker advances as questions are completed.

### 7. Organizer / Admin Control Center
- Protected with admin authentication:
  - **Username:** `admin`
  - **Password:** `nemo@2026`
- **Live Team Monitoring:** Real-time Socket.io updates for teams, scores, bonus points, question progress, and completion status.
- **Event State Controls:** Toggle between `Quiz Active`, `Freeze Submissions`, and `End & Reveal Leaderboard`.
- **Shark Attack Broadcast:** Trigger the 15-second surprise bonus challenge across all connected teams with 1 click.
- **Team Management:** Ability to reset a team's session (with confirmation dialog) or delete a test team.
- **One-Click Demo Seed:** Populate demo teams for instant testing and presentation.

### 8. Download Leaderboard as Excel (`.xlsx`)
Generates a 5-sheet `.xlsx` workbook using `exceljs`:
- **Sheet 1 — Overall Leaderboard:** Rank, Team ID, Team Name, Team Leader, Contact Number, Section, Completed Questions, Main Score, Bonus Points, Final Score, Status.
- **Sheet 2 — Excel Section:** Teams ranked in the Excel track.
- **Sheet 3 — Python Section:** Teams ranked in the Python track.
- **Sheet 4 — SQL Section:** Teams ranked in the SQL track.
- **Sheet 5 — Event Summary:** Total registered teams, track breakdown, completion rate, top score, average score, shark attack participants, and bonus points awarded.
- **Professional Formatting:** Deep Navy header fill, bold text, frozen top row, auto-filters, gold/silver/bronze highlights for Top 3, and auto-adjusted column widths.

---

## 🛠️ Tech Stack

- **Backend:** Node.js (v22), Express 5, Socket.io (WebSocket synchronization), ExcelJS, CORS.
- **Database:** Persistent atomic JSON storage with in-memory caching for zero latency.
- **Frontend:** React 19, Tailwind CSS v4, Lucide Icons, Canvas-Confetti, Web Audio API sound synthesis.
- **Build Tool:** Vite 8.

---

## 🏃 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
cd client && npm install && npm run build && cd ..
```

### 2. Start the Server
```bash
npm start
```
The application will be live at:
👉 **http://localhost:5000**

### 3. Run Automated Verification Tests
```bash
node test/verify.js
```

---

## 🔑 Default Credentials

- **Organizer Username:** `admin`
- **Organizer Password:** `nemo@2026`
- **Organizer URL:** Click "Organizer" in the top navigation bar or visit the dashboard.
