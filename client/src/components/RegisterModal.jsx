// client/src/components/RegisterModal.jsx
import React, { useState } from 'react';
import { Users, User, Phone, Sparkles, X, AlertCircle, ArrowRight } from 'lucide-react';
import NemoFish from './NemoFish';
import { sound } from '../utils/sound';

export default function RegisterModal({ isOpen, onClose, onRegisterSuccess, onSwitchToLogin }) {
  const [teamName, setTeamName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanTeam = teamName.trim();
    const cleanLeader = leaderName.trim();
    const cleanPhone = contactNumber.trim().replace(/[\s-]/g, '');

    if (!cleanTeam) {
      setError('Please provide a team name');
      return;
    }
    if (!cleanLeader) {
      setError('Please provide the team leader name');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)');
      return;
    }

    setLoading(true);
    sound.playBubble();

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName: cleanTeam,
          leaderName: cleanLeader,
          contactNumber: cleanPhone
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register');
      }

      sound.playCorrect();
      onRegisterSuccess(data.team);
    } catch (err) {
      sound.playIncorrect();
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl shadow-cyan-950/80">
        
        {/* Close Button */}
        <button
          onClick={() => { sound.playBubble(); onClose(); }}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <NemoFish size={56} />
          </div>
          <h2 className="text-2xl font-black text-white tracking-wide">
            Register Your Crew
          </h2>
          <p className="text-sm text-cyan-200/70 mt-1">
            Sign up your team to embark on the search for Nemo!
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-2.5">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-1.5">
              Team Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Users size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/60" />
              <input
                type="text"
                required
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
                placeholder="e.g. Reef Explorers, Ocean Hackers"
                maxLength={40}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-slate-500 outline-none transition text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-1.5">
              Team Leader Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/60" />
              <input
                type="text"
                required
                value={leaderName}
                onChange={e => setLeaderName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                maxLength={50}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-slate-500 outline-none transition text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-1.5">
              Team Leader Contact Number <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/60" />
              <input
                type="tel"
                required
                value={contactNumber}
                onChange={e => setContactNumber(e.target.value)}
                placeholder="10-digit mobile (e.g. 9876543210)"
                maxLength={14}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-slate-500 outline-none transition text-sm font-medium"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Private: Your contact number is never displayed on the public leaderboard.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-cyan-500 hover:from-orange-600 hover:via-amber-600 hover:to-cyan-600 text-slate-950 font-black text-base tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all transform active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-spin inline-block w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full" />
            ) : (
              <>
                <Sparkles size={18} />
                <span>Launch Adventure</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Switch to Login */}
        <div className="text-center mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
          Already registered your team?{' '}
          <button
            onClick={() => { sound.playBubble(); onSwitchToLogin(); }}
            className="text-cyan-400 font-bold hover:underline ml-1"
          >
            Resume Session
          </button>
        </div>

      </div>
    </div>
  );
}
