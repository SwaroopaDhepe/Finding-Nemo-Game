// client/src/components/UnderwaterBackground.jsx
import React, { useMemo } from 'react';

export default function UnderwaterBackground() {
  // Generate random bubbles with stable positions
  const bubbles = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      size: Math.floor(6 + Math.random() * 22),
      left: Math.floor(Math.random() * 100),
      duration: Math.floor(8 + Math.random() * 14),
      delay: Math.floor(Math.random() * 10),
      opacity: (0.2 + Math.random() * 0.4).toFixed(2)
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Deep Ocean Ambient Gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, #0d3864 0%, #062241 40%, #020f1e 80%, #010811 100%)'
        }}
      />

      {/* Caustic Light Beams */}
      <div 
        className="absolute top-0 left-1/4 w-3/4 h-96 opacity-20 transform -rotate-12 blur-2xl"
        style={{
          background: 'linear-gradient(180deg, rgba(0, 245, 212, 0.4) 0%, rgba(0, 180, 216, 0.1) 60%, transparent 100%)',
          animation: 'caustics 9s ease-in-out infinite'
        }}
      />
      <div 
        className="absolute top-0 right-1/4 w-1/2 h-80 opacity-15 transform rotate-6 blur-2xl"
        style={{
          background: 'linear-gradient(180deg, rgba(255, 214, 10, 0.3) 0%, rgba(0, 245, 212, 0.05) 70%, transparent 100%)',
          animation: 'caustics 12s ease-in-out infinite reverse'
        }}
      />

      {/* Floating Bubbles */}
      {bubbles.map(b => (
        <div
          key={b.id}
          className="absolute rounded-full border border-cyan-200/40"
          style={{
            width: `${b.size}px`,
            height: `${b.size}px`,
            left: `${b.left}%`,
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(0, 245, 212, 0.2) 60%, rgba(0, 180, 216, 0.4))',
            boxShadow: 'inset -2px -2px 4px rgba(255, 255, 255, 0.5), 0 0 6px rgba(0, 245, 212, 0.3)',
            animation: `rise ${b.duration}s linear infinite`,
            animationDelay: `${b.delay}s`,
            opacity: b.opacity
          }}
        />
      ))}

      {/* Background Swimming Clownfish Silhouette */}
      <div 
        className="absolute bottom-1/3 -left-32 opacity-35"
        style={{
          animation: 'swim-across 35s linear infinite',
          animationDelay: '3s'
        }}
      >
        <svg width="60" height="36" viewBox="0 0 100 60" fill="none">
          <ellipse cx="45" cy="30" rx="35" ry="20" fill="#FF7A00" />
          <polygon points="12,30 -5,15 -5,45" fill="#FF7A00" />
          <path d="M 35 12 Q 40 30 35 48" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
          <path d="M 55 14 Q 58 30 55 46" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
          <circle cx="68" cy="24" r="3.5" fill="#FFFFFF" />
          <circle cx="69" cy="24" r="1.8" fill="#111111" />
          <polygon points="40,32 30,36 34,42" fill="#FF5500" />
        </svg>
      </div>

      {/* Another distant swimming fish */}
      <div 
        className="absolute top-1/4 -right-24 opacity-25 scale-75 transform -scale-x-100"
        style={{
          animation: 'swim-across-reverse 28s linear infinite',
          animationDelay: '12s'
        }}
      >
        <svg width="60" height="36" viewBox="0 0 100 60" fill="none">
          <ellipse cx="45" cy="30" rx="35" ry="20" fill="#00B4D8" />
          <polygon points="12,30 -5,15 -5,45" fill="#0096C7" />
          <circle cx="68" cy="24" r="3.5" fill="#FFFFFF" />
          <circle cx="69" cy="24" r="1.8" fill="#023E8A" />
        </svg>
      </div>

      {/* Coral Reef & Seaweed silhouettes along the bottom */}
      <div className="absolute bottom-0 inset-x-0 h-28 pointer-events-none opacity-25 flex justify-between items-end overflow-hidden">
        {/* Left Coral Clump */}
        <svg width="240" height="110" viewBox="0 0 240 110" fill="none">
          <path d="M 0 110 Q 20 40 40 110" fill="#FF6B6B" />
          <path d="M 25 110 Q 55 30 80 110" fill="#FF8E72" />
          <path d="M 60 110 Q 90 50 120 110" fill="#FFAA85" />
          <path d="M 100 110 Q 130 20 160 110" fill="#FF6B6B" />
          <path d="M 140 110 Q 180 40 210 110" fill="#FF8E72" />
        </svg>

        {/* Center Seaweed stalks */}
        <div className="flex gap-4 items-end pb-0">
          <div className="w-2.5 h-24 bg-gradient-to-t from-teal-800 to-emerald-400 rounded-t-full animate-seaweed" />
          <div className="w-3 h-32 bg-gradient-to-t from-teal-900 to-teal-400 rounded-t-full animate-seaweed" style={{ animationDelay: '1.2s' }} />
          <div className="w-2 h-20 bg-gradient-to-t from-teal-800 to-emerald-500 rounded-t-full animate-seaweed" style={{ animationDelay: '2.5s' }} />
          <div className="w-3 h-28 bg-gradient-to-t from-teal-900 to-cyan-400 rounded-t-full animate-seaweed" style={{ animationDelay: '0.8s' }} />
        </div>

        {/* Right Coral Clump */}
        <svg width="260" height="110" viewBox="0 0 260 110" fill="none">
          <path d="M 30 110 Q 60 25 90 110" fill="#FF758F" />
          <path d="M 70 110 Q 110 45 150 110" fill="#FF8FA3" />
          <path d="M 130 110 Q 170 30 210 110" fill="#FFA5AB" />
          <path d="M 190 110 Q 230 40 260 110" fill="#FF758F" />
        </svg>
      </div>

      <style>{`
        @keyframes swim-across {
          0% { transform: translateX(-100px) translateY(0); }
          50% { transform: translateX(50vw) translateY(-25px); }
          100% { transform: translateX(110vw) translateY(10px); }
        }
        @keyframes swim-across-reverse {
          0% { transform: scaleX(-1) translateX(-100px) translateY(0); }
          50% { transform: scaleX(-1) translateX(50vw) translateY(20px); }
          100% { transform: scaleX(-1) translateX(110vw) translateY(-15px); }
        }
      `}</style>
    </div>
  );
}
