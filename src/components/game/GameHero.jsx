/**
 * GAME HERO — Adventure Character
 * ================================
 * A cleaner, more detailed SVG character with chibi/adventure style.
 * Replaces the old 16x16 pixel grid with a polished game character.
 *
 * Props:
 *   color     – hero accent color (default cyan)
 *   size      – overall height in pixels (default 80)
 *   animation – "idle", "walk", "attack", "hurt", "victory"
 *   flip      – mirror horizontally (default false)
 */

import { useState, useEffect } from "react";

function GameHero({ color = "#00d4ff", size = 80, animation = "idle", flip = false }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const speed = animation === "attack" ? 150 : animation === "walk" ? 300 : 600;
    const timer = setInterval(() => setFrame((p) => (p + 1) % 4), speed);
    return () => clearInterval(timer);
  }, [animation]);

  const darker = darken(color, 50);
  const lighter = lighten(color, 40);

  // Animation transforms
  let bodyY = 0, legAngle = 0, armAngle = 0, headTilt = 0, opacity = 1, scale = 1;
  if (animation === "idle") {
    bodyY = frame % 2 === 0 ? 0 : -1.5;
  } else if (animation === "walk") {
    bodyY = frame % 2 === 0 ? 0 : -2;
    legAngle = frame % 2 === 0 ? 15 : -15;
    armAngle = frame % 2 === 0 ? -20 : 20;
  } else if (animation === "attack") {
    armAngle = frame < 2 ? -40 : 60;
    bodyY = frame < 2 ? 0 : -2;
  } else if (animation === "hurt") {
    bodyY = frame % 2 === 0 ? 0 : 3;
    opacity = frame % 2 === 0 ? 1 : 0.4;
  } else if (animation === "victory") {
    bodyY = frame < 2 ? 0 : -6;
    armAngle = frame < 2 ? -30 : -150;
    scale = frame < 2 ? 1 : 1.05;
  }

  return (
    <svg
      width={size * 0.7}
      height={size}
      viewBox="0 0 50 70"
      style={{
        transform: `${flip ? "scaleX(-1)" : ""} scale(${scale})`,
        opacity,
        transition: "transform 0.2s, opacity 0.15s",
      }}
    >
      <defs>
        <radialGradient id={`heroGlow-${color.replace('#','')}`} cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground glow */}
      <ellipse cx="25" cy="67" rx="18" ry="4" fill={`url(#heroGlow-${color.replace('#','')})`} />

      <g transform={`translate(0, ${bodyY})`}>
        {/* Left leg */}
        <g transform={`rotate(${legAngle}, 20, 50)`}>
          <rect x="16" y="50" width="7" height="14" rx="2" fill={darker} />
          <rect x="15" y="61" width="9" height="4" rx="2" fill="#3d2b1f" />
        </g>

        {/* Right leg */}
        <g transform={`rotate(${-legAngle}, 30, 50)`}>
          <rect x="27" y="50" width="7" height="14" rx="2" fill={darker} />
          <rect x="26" y="61" width="9" height="4" rx="2" fill="#3d2b1f" />
        </g>

        {/* Body */}
        <rect x="14" y="32" width="22" height="20" rx="4" fill={color} />
        {/* Body shading */}
        <rect x="14" y="32" width="11" height="20" rx="4" fill={lighter} opacity="0.15" />
        {/* Belt */}
        <rect x="14" y="46" width="22" height="3" rx="1" fill={darker} />
        <rect x="23" y="45" width="4" height="5" rx="1" fill="#f59e0b" />

        {/* Left arm */}
        <g transform={`rotate(${armAngle}, 14, 36)`}>
          <rect x="6" y="33" width="9" height="5" rx="2.5" fill={color} />
          <circle cx="7" cy="36" r="3.5" fill="#f5c6a0" />
        </g>

        {/* Right arm */}
        <g transform={`rotate(${-armAngle}, 36, 36)`}>
          <rect x="35" y="33" width="9" height="5" rx="2.5" fill={color} />
          <circle cx="43" cy="36" r="3.5" fill="#f5c6a0" />
          {/* Sword during attack */}
          {animation === "attack" && (
            <g>
              <rect x="42" y="22" width="3" height="16" rx="1" fill="#c0c0c0" />
              <rect x="42" y="20" width="3" height="4" rx="1" fill="#e0e0e0" />
              <rect x="39" y="37" width="9" height="3" rx="1" fill="#8B6914" />
            </g>
          )}
        </g>

        {/* Neck */}
        <rect x="21" y="28" width="8" height="6" rx="2" fill="#f5c6a0" />

        {/* Head */}
        <ellipse cx="25" cy="21" rx="11" ry="12" fill="#f5c6a0" />

        {/* Hair / helmet */}
        <ellipse cx="25" cy="16" rx="12" ry="9" fill={darker} />
        <ellipse cx="25" cy="14" rx="11" ry="7" fill={color} />
        {/* Hair highlight */}
        <ellipse cx="22" cy="12" rx="5" ry="3" fill={lighter} opacity="0.3" />

        {/* Eyes */}
        <ellipse cx="20" cy="22" rx="2.5" ry="2.8" fill="white" />
        <ellipse cx="30" cy="22" rx="2.5" ry="2.8" fill="white" />
        <circle cx={20 + (animation === "walk" ? 1 : 0)} cy="22.5" r="1.5" fill="#1a1a2e" />
        <circle cx={30 + (animation === "walk" ? 1 : 0)} cy="22.5" r="1.5" fill="#1a1a2e" />
        {/* Eye shine */}
        <circle cx="19.5" cy="21.5" r="0.6" fill="white" />
        <circle cx="29.5" cy="21.5" r="0.6" fill="white" />

        {/* Mouth */}
        {animation === "victory" ? (
          <path d="M 21,27 Q 25,30 29,27" stroke="#c47a5a" strokeWidth="1" fill="none" />
        ) : animation === "hurt" ? (
          <ellipse cx="25" cy="27.5" rx="2" ry="1.5" fill="#c47a5a" />
        ) : (
          <path d="M 22,27 Q 25,28.5 28,27" stroke="#c47a5a" strokeWidth="0.8" fill="none" />
        )}

        {/* Victory sparkles */}
        {animation === "victory" && frame >= 2 && (
          <>
            <circle cx="8" cy="10" r="1.5" fill="#f59e0b" opacity="0.8">
              <animate attributeName="opacity" values="0.8;0;0.8" dur="0.6s" repeatCount="indefinite" />
            </circle>
            <circle cx="42" cy="8" r="1.5" fill="#f59e0b" opacity="0.6">
              <animate attributeName="opacity" values="0.6;0;0.6" dur="0.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="25" cy="2" r="2" fill={color} opacity="0.7">
              <animate attributeName="opacity" values="0.7;0.2;0.7" dur="0.5s" repeatCount="indefinite" />
            </circle>
          </>
        )}
      </g>
    </svg>
  );
}

function darken(hex, amount) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function lighten(hex, amount) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export default GameHero;
