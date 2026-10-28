// client/src/components/DashboardView.jsx
import React, { useState, useEffect } from 'react';
import JourneyMap from './JourneyMap';
import NemoFish from './NemoFish';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, Lightbulb, Compass, ShieldAlert, Award } from 'lucide-react';
import { sound } from '../utils/sound';

export default function DashboardView({ currentTeam, onTeamUpdate, onFinished }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [questionData, setQuestionData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch current question for team
  const loadQuestion = async (index) => {
    setLoading(true);
    setError('');
    setSelectedOption(null);
    setFeedback(null);

    try {
      const res = await fetch(`/api/team/${currentTeam.teamId}/question/${index}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to load question');
      }

      setQuestionData(data);
      setCurrentQIndex(index);

      // If question was already answered previously (e.g. review or resume)
      if (data.alreadyAnswered && data.answeredData) {
        setSelectedOption(data.answeredData.selected);
        setFeedback({
          isCorrect: data.answeredData.isCorrect,
          pointsAwarded: data.answeredData.pointsAwarded,
          explanation: data.answeredData.explanation,
          clue: data.answeredData.clue
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Start at current question index or 0
    const startIdx = Math.min(14, currentTeam.currentQuestionIndex || 0);
    loadQuestion(startIdx);
  }, [currentTeam.teamId]);

  const handleSubmit = async () => {
    if (!selectedOption || submitting || feedback) return;

    setSubmitting(true);
    setError('');
    sound.playBubble();

    try {
      const res = await fetch(`/api/team/${currentTeam.teamId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: questionData.question.id,
          selectedOption
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      if (data.isCorrect) {
        sound.playCorrect();
      } else {
        sound.playIncorrect();
      }

      setFeedback({
        isCorrect: data.isCorrect,
        pointsAwarded: data.pointsAwarded,
        clue: data.clue,
        explanation: data.explanation,
        completedCount: data.completedCount,
        isFinished: data.isFinished
      });

      // Update team in parent state
      onTeamUpdate({
        ...currentTeam,
        mainScore: data.mainScore,
        finalScore: data.finalScore,
        currentQuestionIndex: Math.min(15, data.completedCount)
      });
    } catch (err) {
      setError(err.message);
      sound.playIncorrect();
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    sound.playBubble();
    if (feedback && feedback.isFinished) {
      onFinished();
      return;
    }

    const nextIndex = currentQIndex + 1;
    if (nextIndex >= 15) {
      onFinished();
    } else {
      loadQuestion(nextIndex);
    }
  };

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 py-6 sm:py-10">
      
      {/* Top Journey Map & Progress Tracking */}
      <JourneyMap completedCount={currentTeam.completedCount || currentTeam.currentQuestionIndex || 0} />

      {/* Team Status / Score Bar */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 mb-6 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center">
            <NemoFish size={32} />
          </div>
          <div>
            <div className="text-sm font-black text-white flex items-center gap-2">
              <span>{currentTeam.teamName}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                {currentTeam.teamId}
              </span>
            </div>
            <div className="text-xs text-slate-400 uppercase font-semibold">
              Track: <span className="text-cyan-400">{currentTeam.section}</span> • Leader: {currentTeam.leaderName}
            </div>
          </div>
        </div>

        {/* Score Pills */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Main Score</div>
            <div className="text-lg font-black text-amber-300">
              {currentTeam.mainScore || 0} <span className="text-xs text-slate-500 font-normal">/ 150</span>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Shark Bonus</div>
            <div className="text-lg font-black text-emerald-400">
              +{currentTeam.bonusPoints || 0}
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 text-center">
            <div className="text-[10px] text-amber-300 font-bold uppercase">Final Score</div>
            <div className="text-lg font-black text-amber-200">
              {currentTeam.finalScore || currentTeam.mainScore || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Main Question Display */}
      {loading ? (
        <div className="p-16 rounded-3xl bg-slate-900/80 border border-slate-800 text-center text-cyan-300 animate-pulse">
          <NemoFish size={48} className="mx-auto mb-3" />
          <p className="font-bold text-sm">Swimming to next coordinate...</p>
        </div>
      ) : error ? (
        <div className="p-8 rounded-3xl bg-rose-950/40 border border-rose-500 text-rose-300 text-center">
          <p className="font-bold mb-3">{error}</p>
          <button
            onClick={() => loadQuestion(currentQIndex)}
            className="py-2 px-5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold"
          >
            Retry Loading
          </button>
        </div>
      ) : questionData && questionData.question ? (
        <div className="rounded-3xl bg-slate-900/85 border border-cyan-500/30 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          
          {/* Question Header & Previous Clue Carryover */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-black uppercase tracking-wider">
              <span>WAYPOINT {questionData.question.number} OF 15</span>
            </div>

            {/* If there's an unlocked previous clue from the interconnected story */}
            {questionData.previousClue && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold">
                <Lightbulb size={13} className="text-amber-400 shrink-0" />
                <span>Previous Clue: <strong>{questionData.previousClue}</strong></span>
              </div>
            )}
          </div>

          {/* Story Context Box */}
          <div className="mb-4 p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-xs sm:text-sm text-cyan-100/90 leading-relaxed italic">
            "{questionData.question.story}"
          </div>

          {/* Technical Question Text */}
          <h3 className="text-lg sm:text-xl font-black text-white leading-snug mb-4">
            {questionData.question.question}
          </h3>

          {/* Code or Formula Snippet Box */}
          {questionData.question.code && (
            <div className="mb-6 rounded-2xl bg-slate-950 border border-slate-800 p-4 overflow-x-auto shadow-inner">
              <pre className="font-mono text-xs sm:text-sm text-cyan-300 leading-relaxed">
                {questionData.question.code}
              </pre>
            </div>
          )}

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
            {questionData.question.options.map((opt) => {
              const isSelected = selectedOption === opt.key;
              const isAnswered = !!feedback;

              return (
                <button
                  key={opt.key}
                  disabled={isAnswered || submitting}
                  onClick={() => {
                    sound.playBubble();
                    setSelectedOption(opt.key);
                  }}
                  className={`p-4 rounded-2xl font-bold text-xs sm:text-sm text-left flex items-start gap-3 transition-all transform active:scale-98 ${
                    isSelected
                      ? 'bg-cyan-500/20 border-2 border-cyan-400 text-white shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-cyan-400/40'
                  } disabled:cursor-not-allowed`}
                >
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition ${
                    isSelected
                      ? 'bg-cyan-400 text-slate-950 shadow-md'
                      : 'bg-slate-900 text-cyan-400 border border-slate-700'
                  }`}>
                    {opt.key}
                  </span>
                  <span className="mt-0.5 leading-relaxed">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Submit Button (if not yet submitted) */}
          {!feedback && (
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={!selectedOption || submitting}
                className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-cyan-500 hover:from-orange-600 hover:via-amber-600 hover:to-cyan-600 text-slate-950 font-black text-sm tracking-wide flex items-center gap-2 shadow-lg shadow-orange-500/25 transition transform active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
              >
                {submitting ? (
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full" />
                ) : (
                  <>
                    <span>Submit Answer</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          )}

          {/* RECOVERY & FEEDBACK PANEL */}
          {feedback && (
            <div className="mt-6 pt-6 border-t border-slate-800 animate-fade-in">
              <div className={`p-5 rounded-2xl border ${
                feedback.isCorrect
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                  : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
              }`}>
                {/* Result Title */}
                <div className="flex items-center gap-2 mb-2 font-black text-base sm:text-lg">
                  {feedback.isCorrect ? (
                    <>
                      <CheckCircle2 size={22} className="text-emerald-400" />
                      <span className="text-emerald-300">Correct! +10 Points Earned</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={22} className="text-amber-400" />
                      <span className="text-amber-300">Incorrect (0 Points), but Dory Found The Way!</span>
                    </>
                  )}
                </div>

                {/* Explanation */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {feedback.explanation}
                </p>

                {/* Unlocked Clue for Next Question (Recovery Mechanism) */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                  <Award size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-amber-300 block uppercase tracking-wide">
                      Mission Clue Unlocked for Next Step:
                    </span>
                    <span className="text-white font-medium">
                      {feedback.clue || "Continue along this waypoint frequency!"}
                    </span>
                  </div>
                </div>

                {/* Next Button */}
                <div className="mt-5 flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-600 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm tracking-wide flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition transform active:scale-95"
                  >
                    <span>
                      {feedback.isFinished ? "Proceed to Mission Completion!" : "Swim to Next Question →"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      ) : null}

    </div>
  );
}
