// client/src/components/CompletionView.jsx
import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import NemoFish from './NemoFish';
import { Trophy, Sparkles, CheckCircle2, ShieldCheck, Waves, ArrowRight } from 'lucide-react';
import { sound } from '../utils/sound';

export default function CompletionView({ currentTeam, onViewLeaderboard }) {
  useEffect(() => {
    sound.playFanfare();

    // Fire fireworks celebration
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      confetti({
        particleCount: 40,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: Math.random(),
          y: Math.random() - 0.2
        },
        colors: ['#FF5722', '#00F5D4', '#00B4D8', '#FFD166', '#FF7043']
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 sm:py-14 text-center">
      
      {/* Nemo Trophy Celebration Header */}
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center animate-ocean-glow">
            <NemoFish size={70} />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shadow-lg">
            ★
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs sm:text-sm font-black uppercase tracking-widest mb-3">
          <CheckCircle2 size={16} />
          <span>ALL 15 WAYPOINTS CLEARED</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          MISSION COMPLETE!
        </h1>
        <h2 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-orange-400 via-amber-200 to-cyan-300 bg-clip-text text-transparent mt-1">
          NEMO HAS BEEN FOUND!
        </h2>
        <p className="text-sm text-cyan-200/80 mt-2 max-w-md">
          Sensational work, team <strong className="text-white font-bold">{currentTeam.teamName}</strong>! 
          You navigated every treacherous ocean trench and tracked down the data.
        </p>
      </div>

      {/* Score Summary Card */}
      <div className="rounded-3xl bg-slate-900/80 border border-cyan-500/30 p-6 sm:p-8 backdrop-blur-md shadow-2xl mb-8">
        <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-4">
          Final Mission Score Breakdown
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Main Quiz */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <div className="text-xs text-slate-400 font-medium">Main Quiz (15 Qs)</div>
            <div className="text-3xl font-black text-white mt-1">
              {currentTeam.mainScore || 0}
              <span className="text-sm text-slate-500 font-normal"> / 150</span>
            </div>
            <div className="text-[11px] text-cyan-300 font-semibold mt-1">
              10 pts per question
            </div>
          </div>

          {/* Shark Bonus */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <div className="text-xs text-slate-400 font-medium">Bruce's Shark Attack</div>
            <div className="text-3xl font-black text-emerald-400 mt-1">
              +{currentTeam.bonusPoints || 0}
              <span className="text-sm text-slate-500 font-normal"> pts</span>
            </div>
            <div className="text-[11px] text-emerald-300 font-semibold mt-1">
              Surprise round bonus
            </div>
          </div>

          {/* Total Final Score */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-500/20 to-orange-500/20 border border-amber-400/40">
            <div className="text-xs text-amber-200 font-bold uppercase">Final Score</div>
            <div className="text-3xl font-black text-amber-300 mt-1">
              {currentTeam.finalScore || currentTeam.mainScore || 0}
            </div>
            <div className="text-[11px] text-amber-200/80 font-medium mt-1">
              Combined Total
            </div>
          </div>
        </div>

        {/* Selected Section & Leader Details */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-wrap items-center justify-between text-left text-xs gap-3">
          <div>
            <span className="text-slate-400 block">Technical Section</span>
            <span className="text-white font-bold uppercase tracking-wider">{currentTeam.section || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Team Leader</span>
            <span className="text-white font-bold">{currentTeam.leaderName}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Unique Team ID</span>
            <span className="text-cyan-400 font-mono font-bold">{currentTeam.teamId}</span>
          </div>
        </div>
      </div>

      {/* Organizer Announcement Notice */}
      <div className="p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs sm:text-sm text-cyan-200/90 leading-relaxed mb-8 flex items-start gap-3 text-left">
        <ShieldCheck size={22} className="text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white block mb-0.5">Official Leaderboard Release Note</strong>
          The global and section-wise leaderboards will be officially revealed by the organizers after all teams conclude their missions. 
          Your final score has been locked into the secure event database!
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => { sound.playBubble(); onViewLeaderboard(); }}
          className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm tracking-wide flex items-center gap-2 shadow-lg shadow-amber-500/25 transition transform active:scale-95"
        >
          <Trophy size={18} />
          <span>Check Leaderboard Status</span>
          <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
}
