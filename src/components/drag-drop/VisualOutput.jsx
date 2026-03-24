/**
 * VISUAL OUTPUT — SVG Animation
 * ==============================
 * Shows a visual representation of whether the code is working.
 * The character climbs a mountain when code is correct,
 * or falls down when incorrect.
 *
 * Props:
 *   result  – null (waiting), "correct", or "incorrect"
 *   scene   – "mountain" (default)
 */

import { useState, useEffect } from "react";

function VisualOutput({ result, scene = "mountain" }) {
  const [animationPhase, setAnimationPhase] = useState("idle");

  useEffect(() => {
    if (result === "correct") {
      setAnimationPhase("climbing");
      const timer = setTimeout(() => setAnimationPhase("summit"), 1500);
      return () => clearTimeout(timer);
    } else if (result === "incorrect") {
      setAnimationPhase("falling");
    } else {
      setAnimationPhase("idle");
    }
  }, [result]);

  // Character Y position based on animation phase
  const getCharacterY = () => {
    switch (animationPhase) {
      case "climbing": return 80;
      case "summit": return 35;
      case "falling": return 170;
      default: return 130;
    }
  };

  const getCharacterRotation = () => {
    return animationPhase === "falling" ? "rotate(30)" : "rotate(0)";
  };

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-3 py-1.5 bg-[#161b22] border-b border-[#30363d]">
        <span className="text-xs text-gray-500 font-mono">output</span>
      </div>

      <svg viewBox="0 0 200 200" className="w-full h-40">
        {/* Sky gradient */}
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d1117" />
            <stop offset="100%" stopColor="#161b22" />
          </linearGradient>
          <linearGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#4c1d95" />
          </linearGradient>
        </defs>

        <rect width="200" height="200" fill="url(#sky)" />

        {/* Stars */}
        <circle cx="30" cy="20" r="1" fill="#fff" opacity="0.5" />
        <circle cx="80" cy="15" r="1" fill="#fff" opacity="0.3" />
        <circle cx="150" cy="25" r="1.5" fill="#fff" opacity="0.4" />
        <circle cx="170" cy="10" r="1" fill="#fff" opacity="0.6" />

        {/* Mountain */}
        <polygon
          points="100,30 20,180 180,180"
          fill="url(#mountainGrad)"
          stroke="#8b5cf6"
          strokeWidth="1"
          opacity="0.8"
        />

        {/* Mountain snow cap */}
        <polygon points="100,30 88,60 112,60" fill="#e0e7ff" opacity="0.6" />

        {/* Path dots up the mountain */}
        <circle cx="80" cy="140" r="2" fill="#00ff88" opacity="0.3" />
        <circle cx="90" cy="120" r="2" fill="#00ff88" opacity="0.3" />
        <circle cx="95" cy="100" r="2" fill="#00ff88" opacity="0.3" />
        <circle cx="98" cy="80" r="2" fill="#00ff88" opacity="0.3" />
        <circle cx="100" cy="60" r="2" fill="#00ff88" opacity="0.3" />

        {/* Flag at summit */}
        {animationPhase === "summit" && (
          <g>
            <line x1="100" y1="25" x2="100" y2="35" stroke="#00ff88" strokeWidth="1.5" />
            <polygon points="100,25 115,28 100,31" fill="#00ff88" opacity="0.8" />
          </g>
        )}

        {/* Character */}
        <g
          className="transition-all duration-1000 ease-out"
          style={{
            transform: `translate(85px, ${getCharacterY()}px) ${getCharacterRotation()}`,
            opacity: animationPhase === "falling" ? 0.3 : 1,
          }}
        >
          {/* Body */}
          <circle cx="10" cy="0" r="6" fill="#00d4ff" />
          {/* Eyes */}
          <circle cx="8" cy="-1" r="1" fill="#0d1117" />
          <circle cx="12" cy="-1" r="1" fill="#0d1117" />
          {/* Smile or frown */}
          {animationPhase === "falling" ? (
            <path d="M 7 3 Q 10 1 13 3" fill="none" stroke="#0d1117" strokeWidth="0.8" />
          ) : (
            <path d="M 7 1 Q 10 4 13 1" fill="none" stroke="#0d1117" strokeWidth="0.8" />
          )}
        </g>

        {/* Result text */}
        {animationPhase === "summit" && (
          <text x="100" y="18" textAnchor="middle" fill="#00ff88" fontSize="8" fontWeight="bold">
            SUCCESS!
          </text>
        )}
        {animationPhase === "falling" && (
          <text x="100" y="195" textAnchor="middle" fill="#ff6b35" fontSize="8" fontWeight="bold">
            TRY AGAIN
          </text>
        )}
      </svg>
    </div>
  );
}

export default VisualOutput;
