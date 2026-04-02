/**
 * GAME HERO — Paper Doll / Illustrated Style
 * ============================================
 * Ink outlines on all shapes, flat fills, visible ears,
 * natural hair curves — matches the picker avatar art.
 *
 * Props:
 *   color     – outfit/armor accent colour
 *   size      – overall height px (default 80)
 *   animation – "idle" | "walk" | "attack" | "hurt" | "victory"
 *   flip      – mirror horizontally
 *   avatarId  – id from src/data/avatars.js
 */

import { useState, useEffect } from "react";
import { getAvatar } from "../../data/avatars";

const OC = "#1a1010"; // ink outline colour

function darken(hex, amt) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (n >> 16) - amt);
  const g = Math.max(0, ((n >> 8) & 0xff) - amt);
  const b = Math.max(0, (n & 0xff) - amt);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
function lighten(hex, amt) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (n >> 16) + amt);
  const g = Math.min(255, ((n >> 8) & 0xff) + amt);
  const b = Math.min(255, (n & 0xff) + amt);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function GameHero({ color = "#00d4ff", size = 80, animation = "idle", flip = false, avatarId = "m01" }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const speed = animation === "attack" ? 150 : animation === "walk" ? 300 : 600;
    const timer = setInterval(() => setFrame((p) => (p + 1) % 4), speed);
    return () => clearInterval(timer);
  }, [animation]);

  const avatar   = getAvatar(avatarId);
  const outfit   = color;
  const outfitDk = darken(outfit, 50);
  const outfitLt = lighten(outfit, 35);

  // ── Animations ──────────────────────────────────────────
  let bodyY = 0, legAngle = 0, armAngle = 0, opacity = 1, scale = 1, swayY = 0;
  if (animation === "idle") {
    bodyY = frame % 2 === 0 ? 0 : -1.5;
  } else if (animation === "walk") {
    bodyY    = frame % 2 === 0 ? 0 : -2;
    legAngle = frame % 2 === 0 ? 18 : -18;
    armAngle = frame % 2 === 0 ? -22 : 22;
    swayY    = frame % 2 === 0 ? 0 : 1;
  } else if (animation === "attack") {
    armAngle = frame < 2 ? -70 : 35;
    bodyY    = frame < 2 ? 0 : -2;
  } else if (animation === "hurt") {
    bodyY   = frame % 2 === 0 ? 0 : 3;
    opacity = frame % 2 === 0 ? 1 : 0.4;
  } else if (animation === "victory") {
    bodyY    = frame < 2 ? 0 : -6;
    armAngle = frame < 2 ? -50 : -130;
    scale    = frame < 2 ? 1 : 1.05;
  }

  const {
    skinTone, hairColor, hairStyle, eyeColor, eyebrowColor, lipColor,
    hasGlasses, hasCap, hasBeard, hasEarrings,
  } = avatar;

  const skinShadow = darken(skinTone, 16);

  // ── Head geometry (viewBox 0 0 50 70) ──────────────────
  const cx = 25, cy = 20;
  const headRx = 10, headRy = 11;
  const hairTopY = cy - headRy;   // = 9

  const eyeY  = cy - 1;
  const eyeLX = 20, eyeRX = 30;
  const noseY = cy + 5;
  const mouthY = cy + 8;

  const pupilDx = animation === "walk" ? 0.5 : 0;

  // ── Hair behind ─────────────────────────────────────────
  function HairBack() {
    if (hasCap) return null;
    switch (hairStyle) {
      case "long": case "long_bow":
        // Two separate side strands — never connected at the bottom (avoids beard look)
        return (
          <>
            <path
              d={`M ${cx - headRx - 1},${cy - 4}
                  Q ${cx - headRx - 5},${cy + 4} ${cx - headRx - 3},${cy + 14}
                  Q ${cx - headRx - 1},${cy + 22} ${cx - headRx + 2},${cy + 22}
                  Q ${cx - headRx + 4},${cy + 14} ${cx - headRx + 3},${cy + 4}
                  Q ${cx - headRx + 2},${cy - 4} ${cx - headRx - 1},${cy - 4} Z`}
              fill={hairColor} stroke={OC} strokeWidth="1" />
            <path
              d={`M ${cx + headRx + 1},${cy - 4}
                  Q ${cx + headRx + 5},${cy + 4} ${cx + headRx + 3},${cy + 14}
                  Q ${cx + headRx + 1},${cy + 22} ${cx + headRx - 2},${cy + 22}
                  Q ${cx + headRx - 4},${cy + 14} ${cx + headRx - 3},${cy + 4}
                  Q ${cx + headRx - 2},${cy - 4} ${cx + headRx + 1},${cy - 4} Z`}
              fill={hairColor} stroke={OC} strokeWidth="1" />
          </>
        );
      case "bob":
        // Two separate shorter side strands
        return (
          <>
            <path
              d={`M ${cx - headRx - 1},${cy - 3}
                  Q ${cx - headRx - 4},${cy + 4} ${cx - headRx - 2},${cy + 13}
                  Q ${cx - headRx + 1},${cy + 16} ${cx - headRx + 3},${cy + 13}
                  Q ${cx - headRx + 4},${cy + 4} ${cx - headRx + 2},${cy - 3}
                  Q ${cx - headRx},${cy - 4} ${cx - headRx - 1},${cy - 3} Z`}
              fill={hairColor} stroke={OC} strokeWidth="1" />
            <path
              d={`M ${cx + headRx + 1},${cy - 3}
                  Q ${cx + headRx + 4},${cy + 4} ${cx + headRx + 2},${cy + 13}
                  Q ${cx + headRx - 1},${cy + 16} ${cx + headRx - 3},${cy + 13}
                  Q ${cx + headRx - 4},${cy + 4} ${cx + headRx - 2},${cy - 3}
                  Q ${cx + headRx},${cy - 4} ${cx + headRx + 1},${cy - 3} Z`}
              fill={hairColor} stroke={OC} strokeWidth="1" />
          </>
        );
      case "curly":
        return (
          <>
            <circle cx={cx - headRx + 1} cy={cy + 4} r={6} fill={hairColor} stroke={OC} strokeWidth="1.2" />
            <circle cx={cx + headRx - 1} cy={cy + 4} r={6} fill={hairColor} stroke={OC} strokeWidth="1.2" />
          </>
        );
      default: return null;
    }
  }

  // ── Hair front ───────────────────────────────────────────
  function HairFront() {
    if (hasCap) {
      return (
        <>
          <path d={`M ${cx - headRx},${hairTopY + 8} Q ${cx - headRx - 2},${hairTopY + 12} ${cx - headRx - 1},${hairTopY + 16}`}
            fill={hairColor} stroke={OC} strokeWidth="1" />
          <path d={`M ${cx + headRx},${hairTopY + 8} Q ${cx + headRx + 2},${hairTopY + 12} ${cx + headRx + 1},${hairTopY + 16}`}
            fill={hairColor} stroke={OC} strokeWidth="1" />
          <path
            d={`M ${cx - headRx + 1},${hairTopY + 9}
                Q ${cx - headRx},${hairTopY - 1} ${cx},${hairTopY - 4}
                Q ${cx + headRx},${hairTopY - 1} ${cx + headRx - 1},${hairTopY + 9} Z`}
            fill="#252525" stroke={OC} strokeWidth="1.3" />
          <rect x={cx - headRx - 3} y={hairTopY + 7} width={(headRx + 3) * 2} height={4} rx={2}
            fill="#181818" stroke={OC} strokeWidth="1.2" />
          <circle cx={cx} cy={hairTopY - 2} r={1.2} fill="#181818" />
        </>
      );
    }
    switch (hairStyle) {
      case "long": case "long_bow":
        return (
          <>
            <path
              d={`M ${cx - headRx - 1},${cy - 1}
                  Q ${cx - headRx - 1},${hairTopY + 3} ${cx - headRx + 1},${hairTopY + 1}
                  Q ${cx - 4},${hairTopY - 3} ${cx},${hairTopY - 4}
                  Q ${cx + 4},${hairTopY - 3} ${cx + headRx - 1},${hairTopY + 1}
                  Q ${cx + headRx + 1},${hairTopY + 3} ${cx + headRx + 1},${cy - 1}
                  Q ${cx + 4},${cy - 4} ${cx},${cy - 5}
                  Q ${cx - 4},${cy - 4} ${cx - headRx - 1},${cy - 1} Z`}
              fill={hairColor} stroke={OC} strokeWidth="1.3" />
            {hairStyle === "long_bow" && (
              <g transform={`translate(${cx + headRx - 1}, ${hairTopY + 4})`}>
                <ellipse cx={-3} cy={0} rx={4} ry={3} fill="#f472b6" stroke={OC} strokeWidth="0.9" />
                <ellipse cx={3}  cy={0} rx={4} ry={3} fill="#f472b6" stroke={OC} strokeWidth="0.9" />
                <circle  cx={0}  cy={0} r={2.2} fill="#ec4899" stroke={OC} strokeWidth="0.9" />
              </g>
            )}
          </>
        );
      case "short":
        return (
          <path
            d={`M ${cx - headRx + 1},${cy - 2}
                Q ${cx - headRx},${hairTopY + 3} ${cx - headRx + 2},${hairTopY + 1}
                Q ${cx - 3},${hairTopY - 3} ${cx},${hairTopY - 4}
                Q ${cx + 3},${hairTopY - 3} ${cx + headRx - 2},${hairTopY + 1}
                Q ${cx + headRx},${hairTopY + 3} ${cx + headRx - 1},${cy - 2}
                Q ${cx + 3},${cy - 5} ${cx},${cy - 5.5}
                Q ${cx - 3},${cy - 5} ${cx - headRx + 1},${cy - 2} Z`}
            fill={hairColor} stroke={OC} strokeWidth="1.3" />
        );
      case "bob":
        return (
          <path
            d={`M ${cx - headRx - 1},${cy + 1}
                Q ${cx - headRx - 1},${hairTopY + 2} ${cx - headRx + 1},${hairTopY + 1}
                Q ${cx - 4},${hairTopY - 4} ${cx},${hairTopY - 4}
                Q ${cx + 4},${hairTopY - 4} ${cx + headRx - 1},${hairTopY + 1}
                Q ${cx + headRx + 1},${hairTopY + 2} ${cx + headRx + 1},${cy + 1}
                Q ${cx + 4},${cy - 3} ${cx},${cy - 4}
                Q ${cx - 4},${cy - 3} ${cx - headRx - 1},${cy + 1} Z`}
            fill={hairColor} stroke={OC} strokeWidth="1.3" />
        );
      case "curly":
        return (
          <>
            <path
              d={`M ${cx - headRx - 1},${cy - 1}
                  Q ${cx - headRx - 2},${hairTopY + 1} ${cx - headRx},${hairTopY - 1}
                  Q ${cx},${hairTopY - 7} ${cx + headRx},${hairTopY - 1}
                  Q ${cx + headRx + 2},${hairTopY + 1} ${cx + headRx + 1},${cy - 1} Z`}
              fill={hairColor} stroke={OC} strokeWidth="1.3" />
            <circle cx={cx - 8} cy={hairTopY + 2} r={5} fill={hairColor} stroke={OC} strokeWidth="1.2" />
            <circle cx={cx}     cy={hairTopY - 2} r={5} fill={hairColor} stroke={OC} strokeWidth="1.2" />
            <circle cx={cx + 8} cy={hairTopY + 2} r={5} fill={hairColor} stroke={OC} strokeWidth="1.2" />
          </>
        );
      case "spiky":
        return (
          <>
            <path
              d={`M ${cx - headRx - 1},${cy - 1}
                  Q ${cx - headRx},${hairTopY + 4} ${cx - headRx + 1},${hairTopY + 2}
                  Q ${cx},${hairTopY - 1} ${cx + headRx - 1},${hairTopY + 2}
                  Q ${cx + headRx},${hairTopY + 4} ${cx + headRx + 1},${cy - 1} Z`}
              fill={hairColor} stroke={OC} strokeWidth="1.3" />
            <polygon points={`${cx},${hairTopY - 8} ${cx - 4},${hairTopY + 2} ${cx + 4},${hairTopY + 2}`}
              fill={hairColor} stroke={OC} strokeWidth="1" strokeLinejoin="round" />
            <polygon points={`${cx - 9},${hairTopY - 4} ${cx - 13},${hairTopY + 4} ${cx - 5},${hairTopY + 3}`}
              fill={hairColor} stroke={OC} strokeWidth="1" strokeLinejoin="round" />
            <polygon points={`${cx + 9},${hairTopY - 4} ${cx + 13},${hairTopY + 4} ${cx + 5},${hairTopY + 3}`}
              fill={hairColor} stroke={OC} strokeWidth="1" strokeLinejoin="round" />
          </>
        );
      case "messy":
        return (
          <>
            <path
              d={`M ${cx - headRx - 1},${cy - 1}
                  Q ${cx - headRx},${hairTopY + 3} ${cx - headRx + 1},${hairTopY + 2}
                  Q ${cx},${hairTopY - 1} ${cx + headRx - 1},${hairTopY + 2}
                  Q ${cx + headRx},${hairTopY + 3} ${cx + headRx + 1},${cy - 1} Z`}
              fill={hairColor} stroke={OC} strokeWidth="1.3" />
            <path d={`M ${cx - 8},${hairTopY + 2} Q ${cx - 10},${hairTopY - 5} ${cx - 4},${hairTopY - 1}`}
              fill={hairColor} stroke={OC} strokeWidth="1" />
            <path d={`M ${cx + 2},${hairTopY + 1} Q ${cx + 6},${hairTopY - 6} ${cx + 10},${hairTopY + 1}`}
              fill={hairColor} stroke={OC} strokeWidth="1" />
            <path d={`M ${cx - 2},${hairTopY + 1} Q ${cx + 1},${hairTopY - 6} ${cx + 4},${hairTopY + 1}`}
              fill={hairColor} stroke={OC} strokeWidth="1" />
          </>
        );
      case "straight":
        return (
          <path
            d={`M ${cx - headRx - 1},${cy - 1}
                Q ${cx - headRx - 1},${hairTopY + 2} ${cx - headRx + 1},${hairTopY + 1}
                Q ${cx - 2},${hairTopY - 3} ${cx + 1},${hairTopY - 3.5}
                Q ${cx + headRx - 1},${hairTopY - 2} ${cx + headRx + 1},${hairTopY + 1}
                Q ${cx + headRx + 1},${hairTopY + 2} ${cx + headRx + 1},${cy - 1}
                Q ${cx + 3},${cy - 4} ${cx + 1},${cy - 4.5}
                Q ${cx - 2},${cy - 4} ${cx - headRx - 1},${cy - 1} Z`}
            fill={hairColor} stroke={OC} strokeWidth="1.3" />
        );
      default:
        return (
          <path
            d={`M ${cx - headRx},${cy - 2}
                Q ${cx},${hairTopY - 5} ${cx + headRx},${cy - 2}
                Q ${cx + 3},${cy - 5} ${cx},${cy - 6}
                Q ${cx - 3},${cy - 5} ${cx - headRx},${cy - 2} Z`}
            fill={hairColor} stroke={OC} strokeWidth="1.3" />
        );
    }
  }

  function Earrings() {
    if (!hasEarrings) return null;
    return (
      <>
        <circle cx={cx - headRx - 2.5} cy={cy + 2.5} r={2} fill="#f59e0b" stroke={OC} strokeWidth="0.9" />
        <circle cx={cx + headRx + 2.5} cy={cy + 2.5} r={2} fill="#f59e0b" stroke={OC} strokeWidth="0.9" />
        <circle cx={cx - headRx - 2.5} cy={cy + 2.5} r={1} fill="#fcd34d" />
        <circle cx={cx + headRx + 2.5} cy={cy + 2.5} r={1} fill="#fcd34d" />
      </>
    );
  }

  function Glasses() {
    if (!hasGlasses) return null;
    const gW = 7.5, gH = 6;
    const lL = eyeLX - gW / 2, lR = eyeRX - gW / 2;
    return (
      <g>
        <rect x={lL} y={eyeY - gH/2} width={gW} height={gH} rx={3}
          fill="#b8d4e8" fillOpacity="0.28" stroke={OC} strokeWidth="0.9" />
        <rect x={lR} y={eyeY - gH/2} width={gW} height={gH} rx={3}
          fill="#b8d4e8" fillOpacity="0.28" stroke={OC} strokeWidth="0.9" />
        <line x1={lL + gW} y1={eyeY} x2={lR}         y2={eyeY} stroke={OC} strokeWidth="0.9" />
        <line x1={lL}      y1={eyeY} x2={lL - 2.5}   y2={eyeY + 1.5} stroke={OC} strokeWidth="0.9" strokeLinecap="round" />
        <line x1={lR + gW} y1={eyeY} x2={lR + gW + 2.5} y2={eyeY + 1.5} stroke={OC} strokeWidth="0.9" strokeLinecap="round" />
        <line x1={lL + 1} y1={eyeY - gH/2 + 1} x2={lL + 2.2} y2={eyeY - gH/2 + 2.2}
          stroke="white" strokeWidth="0.7" opacity="0.55" strokeLinecap="round" />
        <line x1={lR + 1} y1={eyeY - gH/2 + 1} x2={lR + 2.2} y2={eyeY - gH/2 + 2.2}
          stroke="white" strokeWidth="0.7" opacity="0.55" strokeLinecap="round" />
      </g>
    );
  }

  function Beard() {
    if (!hasBeard) return null;
    return (
      <>
        <path d={`M ${cx - 6},${mouthY - 1} Q ${cx - 3},${mouthY - 4} ${cx},${mouthY - 2} Q ${cx + 3},${mouthY - 4} ${cx + 6},${mouthY - 1}`}
          fill={hairColor} stroke={OC} strokeWidth="0.9" strokeLinecap="round" />
        <path
          d={`M ${cx - 8},${mouthY + 1}
              Q ${cx - 10},${mouthY + 8} ${cx - 6},${mouthY + 13}
              Q ${cx},${mouthY + 16} ${cx + 6},${mouthY + 13}
              Q ${cx + 10},${mouthY + 8} ${cx + 8},${mouthY + 1} Z`}
          fill={hairColor} stroke={OC} strokeWidth="0.9" />
      </>
    );
  }

  // ── Full-body render ─────────────────────────────────────
  return (
    <svg
      width={size * 0.7}
      height={size}
      viewBox="0 0 50 70"
      style={{
        transform: `${flip ? "scaleX(-1)" : ""} scale(${scale})`,
        opacity,
        transition: "transform 0.2s, opacity 0.15s",
        overflow: "visible",
      }}
    >
      <defs>
        <radialGradient id={`hg-${outfit.replace('#', '')}`} cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor={outfit} stopOpacity="0.25" />
          <stop offset="100%" stopColor={outfit} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="25" cy="67" rx="18" ry="4" fill={`url(#hg-${outfit.replace('#', '')})`} />

      <g transform={`translate(0, ${bodyY + swayY})`}>

        {/* ── Legs ── */}
        <g transform={`rotate(${legAngle}, 20, 50)`}>
          <rect x="16" y="50" width="7" height="14" rx="2" fill={outfitDk} stroke={OC} strokeWidth="1" />
          <rect x="15" y="61" width="9" height="4"  rx="2" fill="#3d2b1f" stroke={OC} strokeWidth="0.8" />
        </g>
        <g transform={`rotate(${-legAngle}, 30, 50)`}>
          <rect x="27" y="50" width="7" height="14" rx="2" fill={outfitDk} stroke={OC} strokeWidth="1" />
          <rect x="26" y="61" width="9" height="4"  rx="2" fill="#3d2b1f" stroke={OC} strokeWidth="0.8" />
        </g>

        {/* ── Body ── */}
        <rect x="14" y="32" width="22" height="20" rx="4" fill={outfit}   stroke={OC} strokeWidth="1.2" />
        <rect x="14" y="32" width="11" height="20" rx="4" fill={outfitLt} opacity="0.12" />
        <rect x="14" y="46" width="22" height="3"  rx="1" fill={outfitDk} stroke={OC} strokeWidth="0.8" />
        <rect x="23" y="45" width="4"  height="5"  rx="1" fill="#f59e0b"  stroke={OC} strokeWidth="0.8" />

        {/* ── Arms ── */}
        <g transform={`rotate(${armAngle}, 14, 36)`}>
          <rect x="9" y="35" width="6" height="15" rx="3" fill={outfit}   stroke={OC} strokeWidth="1" />
          <circle cx="12" cy="51" r="3.5" fill={skinTone} stroke={OC} strokeWidth="1" />
        </g>
        <g transform={`rotate(${-armAngle}, 36, 36)`}>
          <rect x="35" y="35" width="6" height="15" rx="3" fill={outfit}   stroke={OC} strokeWidth="1" />
          <circle cx="38" cy="51" r="3.5" fill={skinTone} stroke={OC} strokeWidth="1" />
          {animation === "attack" && (
            <>
              <rect x="36" y="20" width="3" height="28" rx="1" fill="#c0c0c0" stroke={OC} strokeWidth="0.7" />
              <rect x="36" y="17" width="3" height="5"  rx="1" fill="#e8e8e8" stroke={OC} strokeWidth="0.7" />
              <rect x="31" y="45" width="14" height="3" rx="1" fill="#8B6914" stroke={OC} strokeWidth="0.7" />
            </>
          )}
        </g>

        {/* ── Neck ── */}
        <rect x="22" y="29" width="6" height="5" rx="2" fill={skinTone} stroke={OC} strokeWidth="1" />

        {/* ── Hair behind ── */}
        <HairBack />

        {/* ── Earrings ── */}
        <Earrings />

        {/* ── Ears ── */}
        <ellipse cx={cx - headRx} cy={cy + 1} rx={2.8} ry={3.5}
          fill={skinTone} stroke={OC} strokeWidth="1" />
        <ellipse cx={cx + headRx} cy={cy + 1} rx={2.8} ry={3.5}
          fill={skinTone} stroke={OC} strokeWidth="1" />

        {/* ── Head ── */}
        <ellipse cx={cx} cy={cy} rx={headRx} ry={headRy}
          fill={skinTone} stroke={OC} strokeWidth="1.4" />

        {/* ── Cheek blush ── */}
        <ellipse cx={cx - 7} cy={cy + 5} rx={3.5} ry={2.2} fill="#ff8888" opacity="0.16" />
        <ellipse cx={cx + 7} cy={cy + 5} rx={3.5} ry={2.2} fill="#ff8888" opacity="0.16" />

        {/* ── Eyebrows — filled shape ── */}
        <path
          d={`M ${eyeLX - 4},${eyeY - 4}
              Q ${eyeLX},${eyeY - 7} ${eyeLX + 4},${eyeY - 4}
              Q ${eyeLX + 3},${eyeY - 5.5} ${eyeLX},${eyeY - 6}
              Q ${eyeLX - 3},${eyeY - 5.5} ${eyeLX - 4},${eyeY - 4} Z`}
          fill={eyebrowColor} />
        <path
          d={`M ${eyeRX - 4},${eyeY - 4}
              Q ${eyeRX},${eyeY - 7} ${eyeRX + 4},${eyeY - 4}
              Q ${eyeRX + 3},${eyeY - 5.5} ${eyeRX},${eyeY - 6}
              Q ${eyeRX - 3},${eyeY - 5.5} ${eyeRX - 4},${eyeY - 4} Z`}
          fill={eyebrowColor} />

        {/* ── Eyes ── */}
        <ellipse cx={eyeLX} cy={eyeY} rx={2.6} ry={3}   fill="white" stroke={OC} strokeWidth="0.9" />
        <ellipse cx={eyeRX} cy={eyeY} rx={2.6} ry={3}   fill="white" stroke={OC} strokeWidth="0.9" />
        <circle  cx={eyeLX + pupilDx} cy={eyeY} r={1.8} fill={eyeColor} />
        <circle  cx={eyeRX + pupilDx} cy={eyeY} r={1.8} fill={eyeColor} />
        <circle  cx={eyeLX + pupilDx} cy={eyeY} r={1.0} fill="#0a0a18" />
        <circle  cx={eyeRX + pupilDx} cy={eyeY} r={1.0} fill="#0a0a18" />
        <circle  cx={eyeLX - 0.7}     cy={eyeY - 1.1} r={0.7} fill="white" />
        <circle  cx={eyeRX - 0.7}     cy={eyeY - 1.1} r={0.7} fill="white" />

        {/* ── Glasses ── */}
        <Glasses />

        {/* ── Nose ── */}
        <path d={`M ${cx - 1},${noseY} Q ${cx},${noseY + 2.5} ${cx + 1},${noseY}`}
          stroke={skinShadow} strokeWidth="1" fill="none" strokeLinecap="round" />
        <ellipse cx={cx - 1.8} cy={noseY + 2} rx={1.3} ry={0.8} fill={skinShadow} opacity="0.35" />
        <ellipse cx={cx + 1.8} cy={noseY + 2} rx={1.3} ry={0.8} fill={skinShadow} opacity="0.35" />

        {/* ── Beard ── */}
        <Beard />

        {/* ── Mouth ── */}
        {!hasBeard && (
          animation === "victory" ? (
            <path d={`M ${cx - 4},${mouthY} Q ${cx},${mouthY + 5} ${cx + 4},${mouthY}`}
              stroke={lipColor} strokeWidth="1.2" fill={lipColor} fillOpacity="0.15"
              strokeLinecap="round" />
          ) : animation === "hurt" ? (
            <path d={`M ${cx - 3},${mouthY + 2} Q ${cx},${mouthY - 1} ${cx + 3},${mouthY + 2}`}
              stroke={lipColor} strokeWidth="1.1" fill="none" strokeLinecap="round" />
          ) : (
            <>
              <path d={`M ${cx - 4},${mouthY} Q ${cx - 2},${mouthY - 1} ${cx},${mouthY} Q ${cx + 2},${mouthY - 1} ${cx + 4},${mouthY}`}
                stroke={lipColor} strokeWidth="1" fill="none" strokeLinecap="round" />
              <path d={`M ${cx - 4},${mouthY} Q ${cx},${mouthY + 4.5} ${cx + 4},${mouthY}`}
                stroke={lipColor} strokeWidth="1.1" fill={lipColor} fillOpacity="0.12"
                strokeLinecap="round" />
            </>
          )
        )}

        {/* ── Hair on top ── */}
        <HairFront />

        {/* ── Victory sparkles ── */}
        {animation === "victory" && frame >= 2 && (
          <>
            <circle cx="8"  cy="10" r="1.5" fill="#f59e0b" opacity="0.8">
              <animate attributeName="opacity" values="0.8;0;0.8" dur="0.6s" repeatCount="indefinite" />
            </circle>
            <circle cx="42" cy="8"  r="1.5" fill="#f59e0b" opacity="0.6">
              <animate attributeName="opacity" values="0.6;0;0.6" dur="0.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="25" cy="2"  r="2"   fill={outfit}  opacity="0.7">
              <animate attributeName="opacity" values="0.7;0.2;0.7" dur="0.5s" repeatCount="indefinite" />
            </circle>
          </>
        )}
      </g>
    </svg>
  );
}

export default GameHero;
