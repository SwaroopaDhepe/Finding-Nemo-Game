// client/src/components/SharkAttackOverlay.jsx
import React, { useState, useEffect } from 'react';
import { ShieldAlert, Clock, CheckCircle2, XCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

export default function SharkAttackOverlay({ eventData, currentTeam, onSubmitAnswer, onClose }) {
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    sound.playSharkSiren();

    const interval = setInterval(() => {
      if (!eventData || !eventData.deadline) return;
      const remainingMs = eventData.deadline - Date.now();
      const seconds = Math.max(0, Math.ceil(remainingMs / 1000));
      setTimeLeft(seconds);

      if (seconds <= 0) {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [eventData]);

  const handleSelect = async (key) => {
    if (selectedOpt || submitting || result || timeLeft <= 0) return;
    setSelectedOpt(key);
    setSubmitting(true);
    sound.playBubble();

    try {
      const res = await onSubmitAnswer(key);
      setResult(res);
      if (res && res.isCorrect) {
        sound.playCorrect();
      } else {
        sound.playIncorrect();
      }
    } catch (e) {
      setResult({ isCorrect: false, error: e.message });
      sound.playIncorrect();
    } finally {
      setSubmitting(false);
    }
  };

  if (!eventData) return null;

  const progressPercent = Math.max(0, Math.min(100, (timeLeft / (eventData.duration || 15)) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-gradient-to-b from-rose-950/90 via-slate-900 to-slate-950 border-2 border-rose-500 p-6 sm:p-8 shadow-2xl shadow-rose-950/90 overflow-hidden">
        
        {/* Animated Shark Fin Background Silhouette */}
        <div className="absolute -top-10 -right-10 opacity-15 pointer-events-none">
          <svg width="220" height="220" viewBox="0 0 100 100" fill="none">
            <path d="M 10 90 Q 50 10 90 90 Z" fill="#FF4D4D" />
          </svg>
        </div>

        {/* Warning Badge & Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-400 text-rose-300 text-xs sm:text-sm font-extrabold uppercase tracking-widest mb-3 animate-pulse">
            <ShieldAlert size={18} />
            <span>SURPRISE BONUS CHALLENGE!</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
            BRUCE'S SHARK ATTACK!
          </h2>
          <p className="text-xs sm:text-sm text-rose-200/80 mt-1 font-semibold">
            “Fish are friends, not food! Quick, answer before time runs out!”
          </p>
        </div>

        {/* Synchronized Countdown Timer */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-rose-300 mb-2">
            <span className="flex items-center gap-1.5">
              <Clock size={16} className={timeLeft <= 5 ? "animate-ping text-rose-400" : ""} />
              <span>SERVER COUNTDOWN</span>
            </span>
            <span className="text-lg font-black text-amber-300">
              {timeLeft}s REMAINING
            </span>
          </div>

          {/* Progress Countdown Bar */}
          <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden border border-rose-500/30">
            <div 
              className={`h-full transition-all duration-200 rounded-full ${
                timeLeft <= 5 ? 'bg-rose-500 animate-pulse' : 'bg-gradient-to-r from-amber-400 to-rose-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Bonus Question Card */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>Worth +5 Bonus Points</span>
          </div>
          <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
            {eventData.question}
          </p>
        </div>

        {/* Options or Result */}
        {!result ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {eventData.options.map(opt => (
              <button
                key={opt.key}
                disabled={submitting || timeLeft <= 0}
                onClick={() => handleSelect(opt.key)}
                className={`py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-left flex items-center gap-3 transition-all transform active:scale-95 ${
                  selectedOpt === opt.key
                    ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-cyan-400'
                } disabled:opacity-40`}
              >
                <span className="w-6 h-6 rounded-lg bg-slate-900/60 flex items-center justify-center font-black text-cyan-300 text-xs shrink-0">
                  {opt.key}
                </span>
                <span className="leading-tight">{opt.text}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mb-4 p-5 rounded-2xl border text-center animate-fade-in bg-slate-900/90">
            {result.isCorrect ? (
              <div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-400">
                  <CheckCircle2 size={28} />
                </div>
                <h4 className="text-xl font-black text-emerald-300">
                  +5 Bonus Points Secured!
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-2">
                  {result.explanation || "Great reflexes! You escaped Bruce's jaws and gained valuable bonus points."}
                </p>
              </div>
            ) : (
              <div>
                <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-2 border border-rose-400">
                  <XCircle size={28} />
                </div>
                <h4 className="text-xl font-black text-rose-300">
                  Bruce Was Too Fast!
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-2">
                  {result.explanation || "0 bonus points awarded. Don't worry, your main quiz points are untouched!"}
                </p>
              </div>
            )}

            <button
              onClick={() => { sound.playBubble(); onClose(); }}
              className="mt-4 py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition"
            >
              Continue Main Quiz
            </button>
          </div>
        )}

        {/* Timeout Message */}
        {timeLeft <= 0 && !result && (
          <div className="text-center text-rose-300 text-sm font-semibold mb-4 flex items-center justify-center gap-2">
            <AlertTriangle size={16} />
            <span>Time expired! Bruce swum back into the deep.</span>
          </div>
        )}

        {/* Close Button if expired */}
        {timeLeft <= 0 && !result && (
          <button
            onClick={() => { sound.playBubble(); onClose(); }}
            className="w-full py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider hover:bg-slate-700 transition"
          >
            Close Alert
          </button>
        )}

      </div>
    </div>
  );
}
