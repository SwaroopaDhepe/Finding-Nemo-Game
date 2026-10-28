// client/src/components/WelcomeView.jsx
import React from 'react';
import NemoFish from './NemoFish';
import { Sparkles, Compass, Table, Code2, Database, ShieldAlert, ChevronRight, Waves, Trophy, Flame } from 'lucide-react';
import { sound } from '../utils/sound';

export default function WelcomeView({ onStartAdventure, onResumeMission, onViewLeaderboard }) {
  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 sm:py-14 flex flex-col items-center text-center">
      
      {/* Event Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs sm:text-sm font-semibold mb-6 shadow-inner animate-pulse">
        <Waves size={16} />
        <span>College Technical Event • Engineering Inter-Branch Challenge</span>
      </div>

      {/* Main Title & Nemo Animation */}
      <div className="flex flex-col items-center justify-center gap-4 mb-3">
        <div className="relative">
          <NemoFish size={90} className="transform hover:scale-110 transition duration-300" />
          <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-amber-400/80 animate-ping" />
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight">
          <span className="block bg-gradient-to-r from-orange-400 via-amber-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-md">
            FINDING NEMO
          </span>
          <span className="block text-2xl sm:text-4xl md:text-5xl text-white font-extrabold mt-1 tracking-wider">
            FIND THE DATA
          </span>
        </h1>
      </div>

      {/* Tagline */}
      <p className="text-xl sm:text-2xl font-bold text-cyan-300 italic mb-6">
        “Just keep swimming.”
      </p>

      {/* Mission Introduction */}
      <p className="max-w-2xl text-sm sm:text-base md:text-lg text-slate-300/90 leading-relaxed mb-8">
        Nemo has drifted deep into uncharted oceanic waters! Assemble your crew, choose your technical domain, 
        and solve <span className="text-amber-300 font-bold">15 progressive, interconnected puzzles</span>. 
        Track intermediate clues, unlock sonar coordinates, survive surprise bonus shark attacks, 
        and rescue Nemo!
      </p>

      {/* Call to Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-16 w-full max-w-md">
        <button
          onClick={() => { sound.playBubble(); onStartAdventure(); }}
          className="flex-1 min-w-[200px] py-4 px-8 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-cyan-500 hover:from-orange-600 hover:via-amber-600 hover:to-cyan-600 text-slate-950 font-black text-lg tracking-wide flex items-center justify-center gap-3 shadow-xl shadow-orange-500/25 transition-all transform hover:-translate-y-1 active:translate-y-0"
        >
          <Sparkles size={20} className="animate-spin text-slate-950" style={{ animationDuration: '4s' }} />
          <span>Start Adventure</span>
          <ChevronRight size={20} />
        </button>

        <button
          onClick={() => { sound.playBubble(); onResumeMission(); }}
          className="py-4 px-6 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-400/30 hover:border-cyan-400 text-cyan-200 font-bold text-base flex items-center justify-center gap-2 backdrop-blur-md transition-all hover:-translate-y-0.5"
        >
          <Compass size={18} className="text-cyan-400" />
          <span>Resume Session</span>
        </button>
      </div>

      {/* The 3 Quest Cards Preview */}
      <div className="w-full text-left mb-14">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Choose Your Oceanic Quest
          </h2>
          <p className="text-sm text-cyan-200/70 mt-1">
            Every team selects 1 of the 3 technical sections. All sections feature 15 progressive interconnected clues.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Excel */}
          <div className="group relative rounded-3xl bg-slate-900/60 border border-emerald-500/30 p-6 backdrop-blur-md hover:border-emerald-400 transition-all duration-300 hover:-translate-y-1.5 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 mb-4 group-hover:scale-110 transition">
              <Table size={26} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Spreadsheet Track
            </span>
            <h3 className="text-xl font-black text-white mt-2 mb-1">
              Dory's Spreadsheet Challenge
            </h3>
            <p className="text-xs text-emerald-200/70 font-medium mb-3">
              Excel Formulas & Data Logic
            </p>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Decipher the S.S. Coral wreck logbook. Solve SUM, COUNTIF, nested IFs, absolute references ($A$1), and cell lookups to track the reef coordinates.
            </p>
            <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              15 Interconnected Questions • 150 Max Pts
            </div>
          </div>

          {/* Card 2: Python */}
          <div className="group relative rounded-3xl bg-slate-900/60 border border-cyan-500/30 p-6 backdrop-blur-md hover:border-cyan-400 transition-all duration-300 hover:-translate-y-1.5 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 mb-4 group-hover:scale-110 transition">
              <Code2 size={26} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              Programming Track
            </span>
            <h3 className="text-xl font-black text-white mt-2 mb-1">
              Crush's Code Quest
            </h3>
            <p className="text-xs text-cyan-200/70 font-medium mb-3">
              Python Logic & Execution Flow
            </p>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Surf the East Australian Current! Predict operator precedence, slice current channels, trace loops, evaluate sets, and debug turtle navigation algorithms.
            </p>
            <div className="text-[11px] font-semibold text-cyan-400 flex items-center gap-1">
              15 Interconnected Questions • 150 Max Pts
            </div>
          </div>

          {/* Card 3: SQL */}
          <div className="group relative rounded-3xl bg-slate-900/60 border border-amber-500/30 p-6 backdrop-blur-md hover:border-amber-400 transition-all duration-300 hover:-translate-y-1.5 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 mb-4 group-hover:scale-110 transition">
              <Database size={26} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Database Track
            </span>
            <h3 className="text-xl font-black text-white mt-2 mb-1">
              The Sunken Database
            </h3>
            <p className="text-xs text-amber-200/70 font-medium mb-3">
              SQL Queries & Aggregations
            </p>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Access the ancient OceanDB submarine database. Run SELECT, WHERE, GROUP BY, HAVING, and table JOINs to isolate the clownfish transponder signal.
            </p>
            <div className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
              15 Interconnected Questions • 150 Max Pts
            </div>
          </div>
        </div>
      </div>

      {/* Special Feature Highlight: Bruce's Shark Attack */}
      <div className="w-full max-w-3xl rounded-3xl bg-gradient-to-r from-rose-950/60 via-slate-900/80 to-rose-950/60 border border-rose-500/40 p-6 sm:p-8 backdrop-blur-md flex flex-col sm:flex-row items-center gap-6 shadow-2xl mb-12">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-400/50 flex items-center justify-center text-rose-300 shrink-0 animate-bounce">
          <ShieldAlert size={34} />
        </div>
        <div className="text-left">
          <div className="inline-block text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/40 mb-1">
            Surprise Live Event
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Bruce's Shark Attack!
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
            At a surprise moment during the competition, Bruce the Great White Shark strikes simultaneously for all active teams! 
            You have only <span className="text-amber-300 font-bold">15 synchronized seconds</span> on the server countdown to answer for <span className="text-emerald-400 font-bold">+5 bonus points</span>!
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Trophy size={15} className="text-amber-400" />
          <span>Real-time Scoring & Server Answer Key</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-cyan-400" />
          <span>Downloadable 5-Sheet Excel Leaderboard</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-2">
          <Flame size={15} className="text-orange-400" />
          <span>Private Team Gameplay</span>
        </div>
      </div>

    </div>
  );
}
