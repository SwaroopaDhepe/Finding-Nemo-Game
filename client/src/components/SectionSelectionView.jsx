// client/src/components/SectionSelectionView.jsx
import React, { useState } from 'react';
import { Table, Code2, Database, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Shield } from 'lucide-react';
import NemoFish from './NemoFish';
import { sound } from '../utils/sound';

export default function SectionSelectionView({ currentTeam, onSectionSelected }) {
  const [selectedSection, setSelectedSection] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sections = [
    {
      id: 'excel',
      title: "Dory's Spreadsheet Challenge",
      subtitle: "Excel Formulas & Spreadsheet Logic",
      icon: Table,
      color: 'emerald',
      accentBorder: 'border-emerald-500/40 hover:border-emerald-400',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
      btnBg: 'bg-emerald-500 hover:bg-emerald-600 text-slate-950',
      topics: [
        "SUM, COUNT, COUNTA, IF, COUNTIF, LEFT, AND",
        "Relative & Absolute ($A$1) Cell References",
        "Formula & Matrix Output Prediction",
        "Data Interpretation & Trench Navigation"
      ],
      description: "Dory discovers the emergency logbook of the sunken S.S. Coral. Clean corrupted data cells and compute sonar frequencies to decode Nemo's reef sector coordinates."
    },
    {
      id: 'python',
      title: "Crush's Code Quest",
      subtitle: "Python Algorithms & Current Navigation",
      icon: Code2,
      color: 'cyan',
      accentBorder: 'border-cyan-500/40 hover:border-cyan-400',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
      btnBg: 'bg-cyan-400 hover:bg-cyan-500 text-slate-950',
      topics: [
        "Variables, Types, Precedence & Modulo",
        "Lists, Slicing, Range & Loops",
        "Boolean Logic, Functions & Variable Scoping",
        "Debugging, Try-Except & 2D Turtle Vectors"
      ],
      description: "Ride the gnarly East Australian Current with Crush the sea turtle! Solve script puzzles, trace loops, and run turtle navigation vectors to steer your crew straight to Nemo."
    },
    {
      id: 'sql',
      title: "The Sunken Database",
      subtitle: "SQL Queries & OceanDB Deep-Sea Logs",
      icon: Database,
      color: 'amber',
      accentBorder: 'border-amber-500/40 hover:border-amber-400',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
      btnBg: 'bg-amber-400 hover:bg-amber-500 text-slate-950',
      topics: [
        "SELECT, WHERE, DISTINCT, ORDER BY & LIMIT",
        "COUNT, SUM, AVG & Summary Metrics",
        "GROUP BY, HAVING & Filter Conditions",
        "INNER & LEFT JOINs, NULL handling, Subqueries"
      ],
      description: "Power up the ancient OceanDB research sub's SQL console in the Mariana Trench. Query marine life sightings, filter anomalous hydrophone logs, and locate Nemo's transponder ping."
    }
  ];

  const handleChoose = (sec) => {
    sound.playBubble();
    setSelectedSection(sec);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedSection) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/team/${currentTeam.teamId}/section`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionId: selectedSection.id })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to select section');
      }

      sound.playCorrect();
      onSectionSelected(data.team);
    } catch (err) {
      sound.playIncorrect();
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Welcome Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-3">
          <Sparkles size={14} />
          <span>Team ID: {currentTeam.teamId}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Welcome, <span className="bg-gradient-to-r from-orange-400 via-amber-200 to-cyan-300 bg-clip-text text-transparent">{currentTeam.teamName}</span>!
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mt-2">
          Select the technical track your crew will conquer. Each section contains 15 interconnected progressive questions designed to locate Nemo.
        </p>
      </div>

      {error && (
        <div className="max-w-md mx-auto mb-6 p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm text-center">
          {error}
        </div>
      )}

      {/* 3 Section Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {sections.map((sec) => {
          const Icon = sec.icon;
          return (
            <div
              key={sec.id}
              className={`relative rounded-3xl bg-slate-900/70 backdrop-blur-md border ${sec.accentBorder} p-6 sm:p-7 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:-translate-y-2 group`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${sec.badgeBg} group-hover:scale-110 transition shadow-lg`}>
                    <Icon size={28} />
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${sec.badgeBg}`}>
                    15 Questions
                  </span>
                </div>

                <h3 className="text-2xl font-black text-white mb-1">
                  {sec.title}
                </h3>
                <p className="text-xs font-semibold text-slate-300/80 mb-4">
                  {sec.subtitle}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed mb-5">
                  {sec.description}
                </p>

                {/* Topics List */}
                <div className="space-y-2 mb-6 pt-3 border-t border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Syllabus Highlights:
                  </span>
                  {sec.topics.map((t, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleChoose(sec)}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg transition transform active:scale-95 ${sec.btnBg}`}
              >
                <span>Select {sec.id.toUpperCase()} Section</span>
                <ArrowRight size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {confirmOpen && selectedSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-amber-500/40 p-6 sm:p-8 shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <AlertTriangle size={30} />
              </div>
            </div>

            <h3 className="text-xl font-black text-white text-center mb-2">
              Lock In {selectedSection.title}?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 text-center leading-relaxed mb-6">
              Once you start this quiz, your section choice is <strong className="text-amber-300">locked for your team</strong>. 
              You cannot switch to another section during gameplay without organizer intervention.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => { sound.playBubble(); setConfirmOpen(false); }}
                disabled={loading}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition"
              >
                Choose Another
              </button>

              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition transform active:scale-95"
              >
                {loading ? (
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Shield size={16} />
                    <span>Confirm & Dive In</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
