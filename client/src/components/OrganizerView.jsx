// client/src/components/OrganizerView.jsx
import React, { useState, useEffect } from 'react';
import NemoFish from './NemoFish';
import { 
  ShieldCheck, ShieldAlert, Users, Table, Code2, Database, 
  Download, RefreshCw, Trash2, RotateCcw, Play, CheckCircle2, 
  Clock, Award, AlertTriangle, Eye, EyeOff, Sparkles, LogOut 
} from 'lucide-react';
import { sound } from '../utils/sound';

export default function OrganizerView({ onBackToWelcome }) {
  const [token, setToken] = useState(localStorage.getItem('nemo_admin_token') || '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Admin Data State
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [resetConfirmTeam, setResetConfirmTeam] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'excel', 'python', 'sql'
  const [selectedSharkQ, setSelectedSharkQ] = useState(0);

  // Authenticate Admin
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    sound.playBubble();

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password })
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Authentication failed');
      }

      setToken(resData.token);
      localStorage.setItem('nemo_admin_token', resData.token);
      sound.playCorrect();
    } catch (err) {
      sound.playIncorrect();
      setLoginError(err.message);
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sound.playBubble();
    setToken('');
    localStorage.removeItem('nemo_admin_token');
    setData(null);
  };

  // Fetch admin teams & stats
  const fetchAdminData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/teams', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      const resData = await res.json();
      setData(resData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminData();
      const interval = setInterval(fetchAdminData, 4000); // Poll live monitoring every 4s
      return () => clearInterval(interval);
    }
  }, [token]);

  // Update Settings (Event State, Leaderboard Reveal)
  const updateSettings = async (updates) => {
    sound.playBubble();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      const resData = await res.json();
      setActionMessage(resData.message || 'Settings updated');
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger Bruce's Shark Attack
  const handleTriggerSharkAttack = async () => {
    sound.playSharkSiren();
    try {
      const res = await fetch('/api/admin/shark-attack/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ questionIndex: selectedSharkQ })
      });
      const resData = await res.json();
      setActionMessage(resData.message || "Shark Attack broadcasted!");
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Reset Team Session
  const handleResetTeam = async (teamId) => {
    sound.playBubble();
    try {
      const res = await fetch('/api/admin/reset-team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ teamId })
      });
      const resData = await res.json();
      setActionMessage(resData.message || 'Team reset');
      setResetConfirmTeam(null);
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Team
  const handleDeleteTeam = async (teamId) => {
    if (!confirm('Are you sure you want to permanently remove this team?')) return;
    sound.playBubble();
    try {
      const res = await fetch(`/api/admin/team/${teamId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const resData = await res.json();
      setActionMessage(resData.message || 'Team removed');
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Seed Demo Teams
  const handleSeedDemo = async () => {
    sound.playBubble();
    try {
      const res = await fetch('/api/admin/seed-demo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const resData = await res.json();
      setActionMessage(resData.message || 'Demo seeded');
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Download Excel Workbook
  const handleDownloadExcel = () => {
    sound.playBubble();
    const today = new Date().toISOString().split('T')[0];
    const downloadUrl = `/api/admin/export-excel`;

    // Fetch with auth header
    fetch(downloadUrl, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Finding_Nemo_Leaderboard_${today}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        sound.playCorrect();
      })
      .catch(err => {
        console.error(err);
        sound.playIncorrect();
      });
  };

  // ---------------- LOGIN FORM IF NOT AUTHENTICATED ---------------- //
  if (!token) {
    return (
      <div className="relative z-10 max-w-md mx-auto px-4 py-16 text-center">
        <div className="rounded-3xl bg-slate-900/90 border border-cyan-500/30 p-8 backdrop-blur-md shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 mx-auto mb-4">
            <ShieldCheck size={36} />
          </div>

          <h2 className="text-2xl font-black text-white">
            Organizer Portal
          </h2>
          <p className="text-xs text-cyan-200/70 mt-1 mb-6">
            Authenticated event administrators only. Controls scoring, Shark Attack triggers, and exports.
          </p>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter organizer password (default: nemo@2026)"
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-600 hover:to-teal-500 text-slate-950 font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition transform active:scale-95 disabled:opacity-50"
            >
              {loggingIn ? "Verifying..." : "Access Control Center"}
            </button>
          </form>

          <button
            onClick={() => { sound.playBubble(); onBackToWelcome(); }}
            className="mt-6 text-xs text-slate-400 hover:text-white transition"
          >
            ← Back to Welcome Page
          </button>
        </div>
      </div>
    );
  }

  // ---------------- ADMIN CONSOLE ---------------- //
  const summary = data?.summary || {};
  const settings = data?.settings || {};
  const teamsList = activeTab === 'all' 
    ? (data?.teams || [])
    : (data?.bySection?.[activeTab] || []);

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <span>Organizer Control Center</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-mono">
                LIVE
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Finding Nemo — Find the Data • Technical Competition Command
            </p>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={() => { sound.playBubble(); fetchAdminData(); }}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700 transition"
            title="Refresh Live Data"
          >
            <RefreshCw size={18} className={loading ? "animate-spin text-cyan-400" : ""} />
          </button>

          {/* Download Excel Button */}
          <button
            onClick={handleDownloadExcel}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition transform active:scale-95"
          >
            <Download size={16} />
            <span>Download Excel Leaderboard (.xlsx)</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 transition"
            title="Sign Out Admin"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div className="mb-6 p-3.5 rounded-2xl bg-cyan-950/60 border border-cyan-400/40 text-cyan-200 text-xs sm:text-sm flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage('')} className="text-cyan-400 font-bold ml-4">✕</button>
        </div>
      )}

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3.5 mb-8">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-bold uppercase">Total Teams</div>
          <div className="text-2xl font-black text-white mt-1">{summary.totalTeams || 0}</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/20">
          <div className="text-[11px] text-emerald-400 font-bold uppercase">Excel Track</div>
          <div className="text-2xl font-black text-white mt-1">{summary.excelCount || 0}</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/20">
          <div className="text-[11px] text-cyan-400 font-bold uppercase">Python Track</div>
          <div className="text-2xl font-black text-white mt-1">{summary.pythonCount || 0}</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20">
          <div className="text-[11px] text-amber-400 font-bold uppercase">SQL Track</div>
          <div className="text-2xl font-black text-white mt-1">{summary.sqlCount || 0}</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-bold uppercase">Completed (15/15)</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{summary.completedTeams || 0}</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-bold uppercase">Top Score</div>
          <div className="text-2xl font-black text-amber-300 mt-1">{summary.highestScore || 0}</div>
        </div>
      </div>

      {/* Control Panels: Bruce's Shark Attack & Event Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Panel 1: Bruce's Shark Attack Trigger */}
        <div className="rounded-3xl bg-gradient-to-br from-rose-950/60 via-slate-900/90 to-slate-900 border border-rose-500/40 p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/50 flex items-center justify-center text-rose-300">
              <ShieldAlert size={22} />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                Bruce's Shark Attack! Controller
              </h3>
              <p className="text-xs text-rose-200/70">
                Synchronized 15-second bonus round (+5 pts)
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Broadcasting this event will pop up a high-priority 15-second countdown on the screens of all active teams simultaneously.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedSharkQ}
              onChange={e => setSelectedSharkQ(parseInt(e.target.value, 10))}
              className="px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 outline-none"
            >
              <option value={0}>Bonus Question 1 (Python List Type)</option>
              <option value={1}>Bonus Question 2 (SQL WHERE vs HAVING)</option>
              <option value={2}>Bonus Question 3 (Excel Formula Toggle)</option>
            </select>

            <button
              onClick={handleTriggerSharkAttack}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-rose-500/30 transition transform active:scale-95"
            >
              <Play size={15} />
              <span>Broadcast Attack (15s)</span>
            </button>
          </div>
        </div>

        {/* Panel 2: Event State & Leaderboard Reveal */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Sparkles size={22} />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                Event State & Public Visibility
              </h3>
              <p className="text-xs text-cyan-200/70">
                Current State: <strong className="uppercase text-amber-300">{settings.eventState}</strong>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            <button
              onClick={() => updateSettings({ eventState: 'active' })}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                settings.eventState === 'active'
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              ● Quiz Active
            </button>

            <button
              onClick={() => updateSettings({ eventState: 'frozen' })}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                settings.eventState === 'frozen'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              ❄ Freeze Submissions
            </button>

            <button
              onClick={() => updateSettings({ eventState: 'ended', leaderboardRevealed: true })}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                settings.eventState === 'ended'
                  ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              ⏹ End & Reveal
            </button>
          </div>

          {/* Toggle Public Leaderboard Reveal */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <div className="text-xs text-slate-300">
              <span className="font-bold text-white block">Public Leaderboard Display</span>
              {settings.leaderboardRevealed ? 'Currently Revealed to Public' : 'Currently Hidden from Public'}
            </div>

            <button
              onClick={() => updateSettings({ leaderboardRevealed: !settings.leaderboardRevealed })}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                settings.leaderboardRevealed
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:text-white'
              }`}
            >
              {settings.leaderboardRevealed ? <Eye size={15} /> : <EyeOff size={15} />}
              <span>{settings.leaderboardRevealed ? 'Hide from Public' : 'Reveal to Public'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Live Monitoring Table with Section Filter Tabs */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-black text-white">
              Live Team Monitoring Table
            </h3>
            <p className="text-xs text-slate-400">
              Showing {teamsList.length} registered teams. Real-time score updates enabled.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'All Teams' },
              { id: 'excel', label: 'Excel' },
              { id: 'python', label: 'Python' },
              { id: 'sql', label: 'SQL' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { sound.playBubble(); setActiveTab(tab.id); }}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition ${
                  activeTab === tab.id
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}

            <button
              onClick={handleSeedDemo}
              className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-cyan-400/30 transition"
              title="Populate test teams for demonstration"
            >
              + Seed Demo
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-3 px-3 text-center">Rank</th>
                <th className="py-3 px-3 text-center">Team ID</th>
                <th className="py-3 px-4">Team Name</th>
                <th className="py-3 px-3">Leader</th>
                <th className="py-3 px-3 text-center">Contact (Private)</th>
                <th className="py-3 px-3 text-center">Section</th>
                <th className="py-3 px-3 text-center">Completed</th>
                <th className="py-3 px-3 text-center">Main</th>
                <th className="py-3 px-3 text-center">Bonus</th>
                <th className="py-3 px-3 text-center">Final</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {teamsList.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-slate-500">
                    No teams registered in this track yet.
                  </td>
                </tr>
              ) : (
                teamsList.map((t) => (
                  <tr key={t.teamId} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 text-center font-bold">
                      {t.rank === 1 ? '🥇 1' : t.rank === 2 ? '🥈 2' : t.rank === 3 ? '🥉 3' : t.rank}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-cyan-300 font-bold">
                      {t.teamId}
                    </td>
                    <td className="py-3 px-4 text-white font-bold">
                      {t.teamName}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {t.leaderName}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-400 font-mono">
                      {t.contactNumber || '—'}
                    </td>
                    <td className="py-3 px-3 text-center font-bold uppercase text-cyan-400">
                      {t.section}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 font-semibold">
                        {t.completedQuestions} / 15
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center text-amber-300 font-bold">
                      {t.mainScore}
                    </td>
                    <td className="py-3 px-3 text-center text-emerald-400 font-bold">
                      +{t.bonusPoints}
                    </td>
                    <td className="py-3 px-3 text-center text-amber-200 font-extrabold text-sm">
                      {t.finalScore}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : t.status === 'In Progress'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setResetConfirmTeam(t)}
                          title="Reset Team Progress"
                          className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition"
                        >
                          <RotateCcw size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteTeam(t.teamId)}
                          title="Delete Team"
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Resetting Team */}
      {resetConfirmTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-amber-500/40 p-6 shadow-2xl">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <AlertTriangle size={26} />
              </div>
            </div>

            <h3 className="text-xl font-black text-white text-center mb-2">
              Reset Team Progress?
            </h3>
            <p className="text-xs text-slate-300 text-center leading-relaxed mb-6">
              This will clear all answered questions and reset the score of <strong className="text-white">{resetConfirmTeam.teamName}</strong> ({resetConfirmTeam.teamId}) to 0, unlocking their section selection.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setResetConfirmTeam(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleResetTeam(resetConfirmTeam.teamId)}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
