// client/src/components/LoginModal.jsx
import React, { useState } from 'react';
import { Compass, X, AlertCircle, ArrowRight } from 'lucide-react';
import NemoFish from './NemoFish';
import { sound } from '../utils/sound';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, onSwitchToRegister }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const clean = query.trim();
    if (!clean) {
      setError('Please enter your Team ID, Team Name, or Contact Number');
      return;
    }

    setLoading(true);
    sound.playBubble();

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: clean })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to resume session');
      }

      sound.playCorrect();
      onLoginSuccess(data.team);
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
            Resume Your Mission
          </h2>
          <p className="text-sm text-cyan-200/70 mt-1">
            Rejoin your ongoing quest without losing any saved progress!
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
              Enter Team ID, Team Name, or Phone
            </label>
            <div className="relative">
              <Compass size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/60" />
              <input
                type="text"
                required
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="e.g. NEMO-4081, Coral Crushers, or 9876543210"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-slate-500 outline-none transition text-sm font-medium"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Tip: You can use the unique Team ID assigned during registration.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:from-cyan-600 hover:via-teal-500 hover:to-emerald-500 text-slate-950 font-black text-base tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all transform active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-spin inline-block w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full" />
            ) : (
              <>
                <Compass size={18} />
                <span>Resume Journey</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Switch to Register */}
        <div className="text-center mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
          Haven't registered yet?{' '}
          <button
            onClick={() => { sound.playBubble(); onSwitchToRegister(); }}
            className="text-orange-400 font-bold hover:underline ml-1"
          >
            Register New Team
          </button>
        </div>

      </div>
    </div>
  );
}
