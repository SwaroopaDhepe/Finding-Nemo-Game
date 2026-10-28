// client/src/components/NemoFish.jsx
import React from 'react';

export default function NemoFish({ size = 48, className = '', isSwimming = true, flip = false }) {
  const width = size;
  const height = Math.round(size * 0.6);

  return (
    <div 
      className={`inline-block select-none ${isSwimming ? 'animate-swim' : ''} ${className}`}
      style={{
        transform: flip ? 'scaleX(-1)' : 'none',
        filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.4))'
      }}
    >
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 100 60" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dorsal Fin */}
        <path d="M 38 12 Q 50 2 58 14 Z" fill="#E65100" stroke="#BF360C" strokeWidth="1.5" />
        
        {/* Tail Fin */}
        <path d="M 12 30 Q 0 10 -4 16 L 2 30 L -4 44 Q 0 50 12 30 Z" fill="#FF7043" stroke="#BF360C" strokeWidth="1.5" />
        
        {/* Main Body */}
        <ellipse cx="48" cy="30" rx="36" ry="20" fill="url(#nemoBodyGrad)" stroke="#BF360C" strokeWidth="1.5" />

        {/* White Stripes with dark borders (Nemo's iconic 3 bands) */}
        {/* Stripe 1: Tail band */}
        <path d="M 22 20 Q 20 30 22 40" stroke="#212121" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M 22 20 Q 20 30 22 40" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />

        {/* Stripe 2: Middle band */}
        <path d="M 46 12 Q 40 30 46 48" stroke="#212121" strokeWidth="7.5" strokeLinecap="round" />
        <path d="M 46 12 Q 40 30 46 48" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />

        {/* Stripe 3: Head band */}
        <path d="M 68 15 Q 64 30 68 45" stroke="#212121" strokeWidth="6" strokeLinecap="round" />
        <path d="M 68 15 Q 64 30 68 45" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />

        {/* Lucky Fin (Nemo's cute small fin on one side) */}
        <ellipse cx="44" cy="34" rx="7" ry="4" fill="#FF8A65" stroke="#BF360C" strokeWidth="1.2" transform="rotate(15 44 34)" />

        {/* Eye */}
        <circle cx="72" cy="24" r="5" fill="#FFFFFF" stroke="#212121" strokeWidth="1" />
        <circle cx="73" cy="24" r="2.8" fill="#8D4004" />
        <circle cx="73.8" cy="23.5" r="1.5" fill="#1A1A1A" />
        <circle cx="74.5" cy="22.5" r="0.8" fill="#FFFFFF" />

        {/* Cute Smile */}
        <path d="M 80 30 Q 77 34 74 33" stroke="#5D2005" strokeWidth="1.2" strokeLinecap="round" fill="none" />

        {/* Gradient Defs */}
        <defs>
          <linearGradient id="nemoBodyGrad" x1="12" y1="30" x2="84" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF5722" />
            <stop offset="45%" stopColor="#FF7043" />
            <stop offset="85%" stopColor="#FF8A65" />
            <stop offset="100%" stopColor="#FFA270" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
