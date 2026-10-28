// client/src/components/LeaderboardView.jsx
import React, { useState, useEffect } from 'react';
import NemoFish from './NemoFish';
import { Trophy, Table, Code2, Database, Sparkles, Lock, RefreshCw, Award, ArrowLeft } from 'lucide-react';
import { sound } from '../utils/sound';

export default function LeaderboardView({ onBackToGame }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overall'); // 'overall', 'excel', 'python', 'sql'

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leaderboard');
      const resData = await res.json();
      setData(resData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const isRevealed = data?.revealed;
  const currentList = activeTab === 'overall' 
    ? (data?.overall || []) 
    : (data?.bySection?.[activeTab] || []);

  const top3 = currentList.slice(0, 3);

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Top Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-3">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400/40 flex items-center justify-center text-amber-300 shadow-lg shadow-amber-500/20">
            <Trophy size={32} />
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Event Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-cyan-200/70 mt-1 max-w-md mx-auto">
          Finding Nemo — Find the Data • Official Technical Standings
        </p>

        {onBackToGame && (
          <button
            onClick={() => { sound.playBubble(); onBackToGame(); }}
            className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
          >
            <ArrowLeft size={14} />
            <span>Return to Mission</span>
          </button>
        )}
      </div>

      {/* Hidden / Teaser State if not yet revealed by organizers */}
      {!loading && !isRevealed ? (
        <div className="max-w-xl mx-auto rounded-3xl bg-slate-900/80 border border-cyan-500/30 p-8 backdrop-blur-md text-center shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-4 border border-cyan-400/40">
            <Lock size={28} />
          </div>

          <h3 className="text-2xl font-black text-white mb-2">
            Scores Kept Secret During Gameplay!
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            To maintain suspense and fair play, individual scores are tracked privately. 
            The full leaderboard and winners will be announced by the event organizers after all teams complete their dives.
          </p>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-cyan-300 font-semibold mb-6">
            Total Teams Swimming: <strong>{data?.summary?.totalTeams || 0}</strong>
          </div>

          <button
            onClick={() => { sound.playBubble(); fetchLeaderboard(); }}
            className="py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 mx-auto transition"
          >
            <RefreshCw size={14} />
            <span>Check for Organizer Reveal</span>
          </button>
        </div>
      ) : (
        <>
          {/* Section Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {[
              { id: 'overall', label: 'Overall Standings', icon: Trophy },
              { id: 'excel', label: "Dory's Excel", icon: Table },
              { id: 'python', label: "Crush's Python", icon: Code2 },
              { id: 'sql', label: "Sunken SQL", icon: Database }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { sound.playBubble(); setActiveTab(tab.id); }}
                  className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
                    activeTab === tab.id
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                      : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Top 3 Podium Cards */}
          {top3.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {/* 2nd Place */}
              {top3[1] && (
                <div className="rounded-3xl bg-slate-900/80 border border-slate-500/40 p-5 text-center flex flex-col justify-between order-2 sm:order-1 sm:translate-y-3">
                  <div>
                    <span className="text-2xl mb-1 block">🥈</span>
                    <div className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">2nd Place</div>
                    <h3 className="text-lg font-black text-white mt-1">{top3[1].teamName}</h3>
                    <p className="text-xs text-slate-400 font-mono">{top3[1].teamId}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <span className="text-2xl font-black text-slate-200">{top3[1].finalScore} pts</span>
                    <div className="text-[10px] text-slate-500">Track: {top3[1].section}</div>
                  </div>
                </div>
              )}

              {/* 1st Place Champion */}
              {top3[0] && (
                <div className="rounded-3xl bg-gradient-to-b from-amber-500/20 to-slate-900/90 border-2 border-amber-400 p-6 text-center flex flex-col justify-between order-1 sm:order-2 shadow-xl shadow-amber-500/20">
                  <div>
                    <span className="text-3xl mb-1 block">🥇</span>
                    <div className="text-xs font-black text-amber-300 uppercase tracking-widest">Champion</div>
                    <h3 className="text-xl font-black text-white mt-1">{top3[0].teamName}</h3>
                    <p className="text-xs text-cyan-300 font-mono font-bold">{top3[0].teamId}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-amber-400/30">
                    <span className="text-3xl font-black text-amber-300">{top3[0].finalScore} pts</span>
                    <div className="text-[11px] text-amber-200/80 font-bold">Track: {top3[0].section}</div>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {top3[2] && (
                <div className="rounded-3xl bg-slate-900/80 border border-amber-700/40 p-5 text-center flex flex-col justify-between order-3 sm:order-3 sm:translate-y-4">
                  <div>
                    <span className="text-2xl mb-1 block">🥉</span>
                    <div className="text-xs font-extrabold text-amber-600 uppercase tracking-widest">3rd Place</div>
                    <h3 className="text-lg font-black text-white mt-1">{top3[2].teamName}</h3>
                    <p className="text-xs text-slate-400 font-mono">{top3[2].teamId}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <span className="text-2xl font-black text-amber-600">{top3[2].finalScore} pts</span>
                    <div className="text-[10px] text-slate-500">Track: {top3[2].section}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Full Ranked Table */}
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                    <th className="py-3 px-3 text-center">Rank</th>
                    <th className="py-3 px-3 text-center">Team ID</th>
                    <th className="py-3 px-4">Team Name</th>
                    <th className="py-3 px-3">Leader</th>
                    <th className="py-3 px-3 text-center">Section</th>
                    <th className="py-3 px-3 text-center">Completed</th>
                    <th className="py-3 px-3 text-center">Main Score</th>
                    <th className="py-3 px-3 text-center">Shark Bonus</th>
                    <th className="py-3 px-3 text-center">Final Score</th>
                    <th className="py-3 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {currentList.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-500">
                        No team results available yet in this category.
                      </td>
                    </tr>
                  ) : (
                    currentList.map(t => (
                      <tr key={t.teamId} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-3 text-center font-black">
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
                        <td className="py-3 px-3 text-center font-bold uppercase text-cyan-400">
                          {t.section}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {t.completedQuestions} / 15
                        </td>
                        <td className="py-3 px-3 text-center text-amber-300 font-bold">
                          {t.mainScore}
                        </td>
                        <td className="py-3 px-3 text-center text-emerald-400 font-bold">
                          +{t.bonusPoints}
                        </td>
                        <td className="py-3 px-3 text-center text-amber-200 font-black text-sm">
                          {t.finalScore}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t.status === 'Completed'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Tie Breaker Legend */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-3">
              <div>
                <strong className="text-slate-300">Tie-Breaking Rules:</strong> 1. Highest Main Quiz Score &bull; 2. More Correct Questions &bull; 3. Earliest Completion Timestamp
              </div>
              <div className="text-slate-500">
                Contact numbers hidden for participant privacy.
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
