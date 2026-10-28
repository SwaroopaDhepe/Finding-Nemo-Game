// client/src/components/JourneyMap.jsx
import React from 'react';
import NemoFish from './NemoFish';
import { Waves, Sparkles, Anchor, Compass, CheckCircle2 } from 'lucide-react';

export default function JourneyMap({ completedCount = 0 }) {
  const total = 15;
  const progressPercent = Math.min(100, Math.round((completedCount / total) * 100));

  const stages = [
    { label: "Open Ocean", desc: "0-25%", min: 0, max: 25, icon: Waves },
    { label: "Coral Reef", desc: "26-50%", min: 26, max: 50, icon: Sparkles },
    { label: "Sunken Ship", desc: "51-75%", min: 51, max: 75, icon: Anchor },
    { label: "Nemo's Hideout", desc: "76-99%", min: 76, max: 99, icon: Compass },
    { label: "Nemo Found!", desc: "100%", min: 100, max: 100, icon: CheckCircle2 }
  ];

  let currentStageText = "Exploring the Open Ocean";
  if (progressPercent >= 100) currentStageText = "Mission Complete — Nemo Found!";
  else if (progressPercent >= 76) currentStageText = "Approaching Nemo's Hideout";
  else if (progressPercent >= 51) currentStageText = "Searching the Sunken Ship";
  else if (progressPercent >= 26) currentStageText = "Entering the Coral Reef";

  return (
    <div className="w-full rounded-3xl bg-slate-900/80 border border-cyan-500/20 p-5 sm:p-6 backdrop-blur-md shadow-2xl mb-8">
      {/* Top Header of Map */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-400">
              EXPEDITION ROUTE
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold text-slate-300">
              {completedCount} of 15 Waypoints Cleared
            </span>
          </div>
          <h4 className="text-lg font-black text-white mt-0.5 flex items-center gap-2">
            <span>{currentStageText}</span>
            {progressPercent === 100 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                Rescued!
              </span>
            )}
          </h4>
        </div>

        <div className="text-right">
          <div className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">
            {progressPercent}%
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Search Progress
          </div>
        </div>
      </div>

      {/* Visual Journey Track */}
      <div className="relative pt-6 pb-2">
        {/* Background Track line */}
        <div className="h-3 w-full rounded-full bg-slate-800/90 overflow-hidden relative border border-slate-700/60">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-amber-400 transition-all duration-700 ease-out rounded-full shadow-lg shadow-cyan-400/40"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Swimming Nemo Marker moving across track */}
        <div 
          className="absolute top-0 transition-all duration-700 ease-out -translate-x-1/2 pointer-events-none"
          style={{ 
            left: `${Math.max(4, Math.min(96, progressPercent))}%`,
            marginTop: '-6px'
          }}
        >
          <div className="relative flex flex-col items-center">
            <NemoFish size={38} className="drop-shadow-lg" />
            <div className="w-2 h-2 rounded-full bg-cyan-300 mt-1 animate-ping" />
          </div>
        </div>

        {/* 5 Stage Node Anchors */}
        <div className="flex justify-between items-center mt-4">
          {stages.map((st, i) => {
            const isCompleted = progressPercent >= st.min;
            const isCurrent = progressPercent >= st.min && (i === 4 ? progressPercent === 100 : progressPercent <= st.max);
            const Icon = st.icon;

            return (
              <div key={i} className="flex flex-col items-center text-center max-w-[80px]">
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all mb-1.5 ${
                    isCompleted
                      ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-300/40 shadow-md shadow-cyan-500/30'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  <Icon size={14} />
                </div>
                <span className={`text-[11px] font-bold tracking-tight leading-tight ${isCurrent ? 'text-amber-300' : (isCompleted ? 'text-slate-200' : 'text-slate-500')}`}>
                  {st.label}
                </span>
                <span className="text-[9px] text-slate-500 hidden sm:block">
                  {st.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
