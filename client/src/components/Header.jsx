// client/src/components/Header.jsx
import React, { useState } from 'react';
import NemoFish from './NemoFish';
import { Volume2, VolumeX, Trophy, ShieldCheck, LogOut, Compass, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

export default function Header({ currentTeam, currentView, setView, onLogout, onOpenLogin }) {
  const [muted, setMuted] = useState(sound.isMuted);

  const handleToggleSound = () => {
    const isNowMuted = sound.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      sound.playBubble();
    }
  };

  return (
    <header className="relative z-30 w-full border-b border-cyan-500/20 bg-slate-950/60 backdrop-blur-md px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Logo / Brand */}
        <div 
          onClick={() => { sound.playBubble(); setView('welcome'); }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <NemoFish size={44} className="transition-transform group-hover:scale-110" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-xl tracking-wider bg-gradient-to-r from-orange-400 via-amber-200 to-cyan-300 bg-clip-text text-transparent">
                FINDING NEMO
              </span>
              <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-400/30">
                FIND THE DATA
              </span>
            </div>
            <p className="text-xs text-cyan-200/70 italic flex items-center gap-1 font-medium">
              “Just keep swimming.”
            </p>
          </div>
        </div>

        {/* Center: Team Status (if in game) */}
        {currentTeam && currentTeam.section && (
          <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-400/30 shadow-lg shadow-cyan-950/50">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold text-slate-200">{currentTeam.teamName}</span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wide">
              {currentTeam.section}
            </span>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-amber-300 font-bold">
                {currentTeam.mainScore || 0} pts
              </span>
              {currentTeam.bonusPoints > 0 && (
                <span className="text-emerald-400 font-extrabold bg-emerald-500/20 px-1.5 py-0.2 rounded border border-emerald-400/40">
                  +{currentTeam.bonusPoints} bonus
                </span>
              )}
            </div>
          </div>
        )}

        {/* Right Navigation / Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            title={muted ? "Unmute Sound" : "Mute Sound"}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700/60 transition-all hover:border-cyan-400/40"
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} className="text-cyan-400" />}
          </button>

          {/* Leaderboard Link */}
          <button
            onClick={() => { sound.playBubble(); setView('leaderboard'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
              currentView === 'leaderboard'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/20'
                : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:text-amber-300 hover:border-amber-400/40'
            }`}
          >
            <Trophy size={16} className="text-amber-400" />
            <span className="hidden sm:inline">Leaderboard</span>
          </button>

          {/* Organizer / Admin Button */}
          <button
            onClick={() => { sound.playBubble(); setView('organizer'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
              currentView === 'organizer'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:text-cyan-300 hover:border-cyan-400/40'
            }`}
          >
            <ShieldCheck size={16} className="text-cyan-400" />
            <span className="hidden sm:inline">Organizer</span>
          </button>

          {/* Team Switcher or Login */}
          {currentTeam ? (
            <button
              onClick={() => { sound.playBubble(); onLogout(); }}
              title="Leave / Switch Team"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Exit</span>
            </button>
          ) : (
            <button
              onClick={() => { sound.playBubble(); onOpenLogin(); }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/40 text-orange-200 text-xs sm:text-sm font-semibold transition-all"
            >
              <Compass size={15} />
              <span>Resume</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
