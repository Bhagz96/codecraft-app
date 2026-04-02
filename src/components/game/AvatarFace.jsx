/**
 * AVATAR FACE — Paper Doll / Illustrated Style (Style C)
 * =======================================================
 * Realistic-ish head proportions, ink outlines on all shapes,
 * flat colour fills, visible ears, natural hair curves.
 * Closest to the original reference image pack style.
 *
 * Props:
 *   avatar   – avatar config from src/data/avatars.js
 *   size     – pixel size of the square tile (default 72)
 *   selected – show selection ring
 */

const OC = "#1a1010"; // outline colour (near-black ink)

function dk(hex, amt) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (n >> 16) - amt);
  const g = Math.max(0, ((n >> 8) & 0xff) - amt);
  const b = Math.max(0, (n & 0xff) - amt);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
function lx(hex, amt) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (n >> 16) + amt);
  const g = Math.min(255, ((n >> 8) & 0xff) + amt);
  const b = Math.min(255, (n & 0xff) + amt);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function AvatarFace({ avatar, size = 72, selected = false }) {
  if (!avatar) return null;
  const {
    skinTone, hairColor, hairStyle, eyeColor, eyebrowColor, lipColor,
    hasGlasses, hasCap, hasBeard, hasEarrings, bgColor, outfitColor,
  } = avatar;

  const skinShadow = dk(skinTone, 18);
  const hairDk     = dk(hairColor, 24);

  // ── Layout (viewBox 0 0 80 88) ───────────────────────────
  const cx = 40, cy = 44;
  const headRx = 20, headRy = 24;
  const hairTop = cy - headRy;   // 20

  const eyeY   = cy - 4;         // 40
  const eyeLX  = cx - 10;
  const eyeRX  = cx + 10;
  const noseY  = cy + 7;         // 51
  const mouthY = cy + 14;        // 58

  // shared outline props
  const o = { stroke: OC, strokeWidth: 1.6, strokeLinejoin: "round" };

  // ── Hair behind head ─────────────────────────────────────
  function HairBack() {
    if (hasCap) return null;
    switch (hairStyle) {
      case "long":
      case "long_bow":
        // Two separate side strands — never connected at the bottom (avoids beard look)
        return (
          <>
            <path
              d={`M ${cx - headRx - 2},${cy - 6}
                  C ${cx - headRx - 12},${cy + 8}
                    ${cx - headRx - 10},${cy + 28}
                    ${cx - headRx},${cy + 44}
                  Q ${cx - headRx + 6},${cy + 44}
                    ${cx - headRx + 8},${cy + 28}
                  C ${cx - headRx + 6},${cy + 8}
                    ${cx - headRx + 4},${cy - 6}
                    ${cx - headRx - 2},${cy - 6} Z`}
              fill={hairColor} stroke={OC} strokeWidth="1.6" />
            <path
              d={`M ${cx + headRx + 2},${cy - 6}
                  C ${cx + headRx + 12},${cy + 8}
                    ${cx + headRx + 10},${cy + 28}
                    ${cx + headRx},${cy + 44}
                  Q ${cx + headRx - 6},${cy + 44}
                    ${cx + headRx - 8},${cy + 28}
                  C ${cx + headRx - 6},${cy + 8}
                    ${cx + headRx - 4},${cy - 6}
                    ${cx + headRx + 2},${cy - 6} Z`}
              fill={hairColor} stroke={OC} strokeWidth="1.6" />
          </>
        );
      case "bob":
        return (
          <>
            <path
              d={`M ${cx - headRx - 2},${cy - 4}
                  C ${cx - headRx - 10},${cy + 4}
                    ${cx - headRx - 8},${cy + 18}
                    ${cx - headRx},${cy + 28}
                  Q ${cx - headRx + 6},${cy + 28}
                    ${cx - headRx + 8},${cy + 18}
                  C ${cx - headRx + 6},${cy + 4}
                    ${cx - headRx + 4},${cy - 4}
                    ${cx - headRx - 2},${cy - 4} Z`}
              fill={hairColor} stroke={OC} strokeWidth="1.6" />
            <path
              d={`M ${cx + headRx + 2},${cy - 4}
                  C ${cx + headRx + 10},${cy + 4}
                    ${cx + headRx + 8},${cy + 18}
                    ${cx + headRx},${cy + 28}
                  Q ${cx + headRx - 6},${cy + 28}
                    ${cx + headRx - 8},${cy + 18}
                  C ${cx + headRx - 6},${cy + 4}
                    ${cx + headRx - 4},${cy - 4}
                    ${cx + headRx + 2},${cy - 4} Z`}
              fill={hairColor} stroke={OC} strokeWidth="1.6" />
          </>
        );
      case "curly":
        return (
          <>
            <circle cx={cx - headRx + 2} cy={cy + 8}  r={13} fill={hairColor} stroke={OC} strokeWidth="1.6" />
            <circle cx={cx + headRx - 2} cy={cy + 8}  r={13} fill={hairColor} stroke={OC} strokeWidth="1.6" />
          </>
        );
      default: return null;
    }
  }

  // ── Hair on top / front ───────────────────────────────────
  function HairFront() {
    if (hasCap) {
      return (
        <>
          {/* Hair peeking at sides below brim */}
          <path d={`M ${cx - headRx},${hairTop + 20} Q ${cx - headRx - 4},${hairTop + 26} ${cx - headRx - 2},${hairTop + 32}`}
            fill={hairColor} stroke={OC} strokeWidth="1.4" />
          <path d={`M ${cx + headRx},${hairTop + 20} Q ${cx + headRx + 4},${hairTop + 26} ${cx + headRx + 2},${hairTop + 32}`}
            fill={hairColor} stroke={OC} strokeWidth="1.4" />
          {/* Cap dome */}
          <path
            d={`M ${cx - headRx + 1},${hairTop + 18}
                Q ${cx - headRx},${hairTop - 2} ${cx},${hairTop - 8}
                Q ${cx + headRx},${hairTop - 2} ${cx + headRx - 1},${hairTop + 18} Z`}
            fill="#2a2a2a" stroke={OC} strokeWidth="1.8" />
          {/* Brim */}
          <rect x={cx - headRx - 6} y={hairTop + 16} width={(headRx + 6) * 2} height={7} rx={3.5}
            fill="#1a1a1a" stroke={OC} strokeWidth="1.6" />
          {/* Button */}
          <circle cx={cx} cy={hairTop - 6} r={2.5} fill="#1a1a1a" stroke={OC} strokeWidth="1" />
        </>
      );
    }

    switch (hairStyle) {
      case "long":
        return (
          <path
            d={`M ${cx - headRx - 1},${cy - 2}
                Q ${cx - headRx - 2},${hairTop + 6} ${cx - headRx + 2},${hairTop + 2}
                Q ${cx - 8},${hairTop - 6} ${cx},${hairTop - 8}
                Q ${cx + 8},${hairTop - 6} ${cx + headRx - 2},${hairTop + 2}
                Q ${cx + headRx + 2},${hairTop + 6} ${cx + headRx + 1},${cy - 2}
                Q ${cx + 8},${cy - 8} ${cx},${cy - 9}
                Q ${cx - 8},${cy - 8} ${cx - headRx - 1},${cy - 2} Z`}
            fill={hairColor} stroke={OC} strokeWidth="1.8" />
        );

      case "long_bow":
        return (
          <>
            <path
              d={`M ${cx - headRx - 1},${cy - 2}
                  Q ${cx - headRx - 2},${hairTop + 6} ${cx - headRx + 2},${hairTop + 2}
                  Q ${cx - 8},${hairTop - 6} ${cx},${hairTop - 8}
                  Q ${cx + 8},${hairTop - 6} ${cx + headRx - 2},${hairTop + 2}
                  Q ${cx + headRx + 2},${hairTop + 6} ${cx + headRx + 1},${cy - 2}
                  Q ${cx + 8},${cy - 8} ${cx},${cy - 9}
                  Q ${cx - 8},${cy - 8} ${cx - headRx - 1},${cy - 2} Z`}
              fill={hairColor} stroke={OC} strokeWidth="1.8" />
            {/* Bow */}
            <g transform={`translate(${cx + headRx - 2}, ${hairTop + 10})`}>
              <ellipse cx={-5} cy={0} rx={7} ry={5} fill="#f472b6" stroke={OC} strokeWidth="1.2" />
              <ellipse cx={5}  cy={0} rx={7} ry={5} fill="#f472b6" stroke={OC} strokeWidth="1.2" />
              <circle  cx={0}  cy={0} r={4}  fill="#ec4899"  stroke={OC} strokeWidth="1.2" />
            </g>
          </>
        );

      case "short":
        return (
          <path
            d={`M ${cx - headRx + 2},${cy - 4}
                Q ${cx - headRx},${hairTop + 6} ${cx - headRx + 4},${hairTop + 2}
                Q ${cx - 6},${hairTop - 6} ${cx},${hairTop - 7}
                Q ${cx + 6},${hairTop - 6} ${cx + headRx - 4},${hairTop + 2}
                Q ${cx + headRx},${hairTop + 6} ${cx + headRx - 2},${cy - 4}
                Q ${cx + 6},${cy - 10} ${cx},${cy - 11}
                Q ${cx - 6},${cy - 10} ${cx - headRx + 2},${cy - 4} Z`}
            fill={hairColor} stroke={OC} strokeWidth="1.8" />
        );

      case "bob":
        return (
          <path
            d={`M ${cx - headRx - 1},${cy + 2}
                Q ${cx - headRx - 2},${hairTop + 4} ${cx - headRx + 2},${hairTop + 2}
                Q ${cx - 8},${hairTop - 7} ${cx},${hairTop - 8}
                Q ${cx + 8},${hairTop - 7} ${cx + headRx - 2},${hairTop + 2}
                Q ${cx + headRx + 2},${hairTop + 4} ${cx + headRx + 1},${cy + 2}
                Q ${cx + 8},${cy - 4} ${cx},${cy - 5}
                Q ${cx - 8},${cy - 4} ${cx - headRx - 1},${cy + 2} Z`}
            fill={hairColor} stroke={OC} strokeWidth="1.8" />
        );

      case "curly":
        return (
          <>
            {/* Central dome */}
            <path
              d={`M ${cx - headRx - 2},${cy - 2}
                  Q ${cx - headRx - 4},${hairTop + 2} ${cx - headRx},${hairTop - 2}
                  Q ${cx},${hairTop - 14} ${cx + headRx},${hairTop - 2}
                  Q ${cx + headRx + 4},${hairTop + 2} ${cx + headRx + 2},${cy - 2} Z`}
              fill={hairColor} stroke={OC} strokeWidth="1.8" />
            {/* Bumps */}
            <circle cx={cx - 16} cy={hairTop + 4}  r={9} fill={hairColor} stroke={OC} strokeWidth="1.6" />
            <circle cx={cx}      cy={hairTop - 4}  r={9} fill={hairColor} stroke={OC} strokeWidth="1.6" />
            <circle cx={cx + 16} cy={hairTop + 4}  r={9} fill={hairColor} stroke={OC} strokeWidth="1.6" />
            <circle cx={cx - 8}  cy={hairTop - 2}  r={8} fill={hairColor} stroke={OC} strokeWidth="1.6" />
            <circle cx={cx + 8}  cy={hairTop - 2}  r={8} fill={hairColor} stroke={OC} strokeWidth="1.6" />
          </>
        );

      case "spiky":
        return (
          <>
            {/* Base */}
            <path
              d={`M ${cx - headRx - 1},${cy - 2}
                  Q ${cx - headRx},${hairTop + 8} ${cx - headRx + 2},${hairTop + 4}
                  Q ${cx},${hairTop - 2} ${cx + headRx - 2},${hairTop + 4}
                  Q ${cx + headRx},${hairTop + 8} ${cx + headRx + 1},${cy - 2} Z`}
              fill={hairColor} stroke={OC} strokeWidth="1.8" />
            {/* Spikes */}
            <polygon points={`${cx},${hairTop - 16} ${cx - 6},${hairTop + 2} ${cx + 6},${hairTop + 2}`}
              fill={hairColor} stroke={OC} strokeWidth="1.4" strokeLinejoin="round" />
            <polygon points={`${cx - 16},${hairTop - 8} ${cx - 22},${hairTop + 8} ${cx - 8},${hairTop + 6}`}
              fill={hairColor} stroke={OC} strokeWidth="1.4" strokeLinejoin="round" />
            <polygon points={`${cx + 16},${hairTop - 8} ${cx + 22},${hairTop + 8} ${cx + 8},${hairTop + 6}`}
              fill={hairColor} stroke={OC} strokeWidth="1.4" strokeLinejoin="round" />
          </>
        );

      case "messy":
        return (
          <>
            <path
              d={`M ${cx - headRx - 1},${cy - 2}
                  Q ${cx - headRx},${hairTop + 6} ${cx - headRx + 2},${hairTop + 4}
                  Q ${cx},${hairTop - 2} ${cx + headRx - 2},${hairTop + 4}
                  Q ${cx + headRx},${hairTop + 6} ${cx + headRx + 1},${cy - 2} Z`}
              fill={hairColor} stroke={OC} strokeWidth="1.8" />
            {/* Tufts */}
            <path d={`M ${cx - 14},${hairTop + 4} Q ${cx - 18},${hairTop - 8} ${cx - 8},${hairTop - 2}`}
              fill={hairColor} stroke={OC} strokeWidth="1.4" />
            <path d={`M ${cx + 4},${hairTop + 2} Q ${cx + 10},${hairTop - 10} ${cx + 16},${hairTop + 2}`}
              fill={hairColor} stroke={OC} strokeWidth="1.4" />
            <path d={`M ${cx - 4},${hairTop + 2} Q ${cx},${hairTop - 12} ${cx + 6},${hairTop + 2}`}
              fill={hairColor} stroke={OC} strokeWidth="1.4" />
          </>
        );

      case "straight":
        return (
          <path
            d={`M ${cx - headRx - 1},${cy - 2}
                Q ${cx - headRx - 1},${hairTop + 4} ${cx - headRx + 2},${hairTop + 2}
                Q ${cx - 4},${hairTop - 6} ${cx + 2},${hairTop - 7}
                Q ${cx + headRx - 2},${hairTop - 4} ${cx + headRx - 1},${hairTop + 2}
                Q ${cx + headRx + 1},${hairTop + 4} ${cx + headRx + 1},${cy - 2}
                Q ${cx + 6},${cy - 8} ${cx + 2},${cy - 9}
                Q ${cx - 4},${cy - 8} ${cx - headRx - 1},${cy - 2} Z`}
            fill={hairColor} stroke={OC} strokeWidth="1.8" />
        );

      default:
        return (
          <path
            d={`M ${cx - headRx},${cy - 4}
                Q ${cx},${hairTop - 8} ${cx + headRx},${cy - 4}
                Q ${cx + 4},${cy - 10} ${cx},${cy - 11}
                Q ${cx - 4},${cy - 10} ${cx - headRx},${cy - 4} Z`}
            fill={hairColor} stroke={OC} strokeWidth="1.8" />
        );
    }
  }

  // ── Accessories ──────────────────────────────────────────
  function Earrings() {
    if (!hasEarrings) return null;
    const ex = cx - headRx - 2, erx = cx + headRx + 2, ey = cy + 4;
    return (
      <>
        <circle cx={ex}  cy={ey} r={4}   fill="#f59e0b" stroke={OC} strokeWidth="1.2" />
        <circle cx={erx} cy={ey} r={4}   fill="#f59e0b" stroke={OC} strokeWidth="1.2" />
        <circle cx={ex}  cy={ey} r={2}   fill="#fcd34d" />
        <circle cx={erx} cy={ey} r={2}   fill="#fcd34d" />
      </>
    );
  }

  function Glasses() {
    if (!hasGlasses) return null;
    const gy = eyeY;
    const lW = 14, lH = 11;
    const lL = cx - 17, lR = cx + 3;
    return (
      <g>
        <rect x={lL} y={gy - lH/2} width={lW} height={lH} rx={5.5}
          fill="#b8d4e8" fillOpacity="0.3" stroke={OC} strokeWidth="1.6" />
        <rect x={lR} y={gy - lH/2} width={lW} height={lH} rx={5.5}
          fill="#b8d4e8" fillOpacity="0.3" stroke={OC} strokeWidth="1.6" />
        <line x1={lL + lW} y1={gy} x2={lR}        y2={gy} stroke={OC} strokeWidth="1.6" />
        <line x1={lL}      y1={gy} x2={lL - 5}    y2={gy + 3} stroke={OC} strokeWidth="1.6" strokeLinecap="round" />
        <line x1={lR + lW} y1={gy} x2={lR + lW + 5} y2={gy + 3} stroke={OC} strokeWidth="1.6" strokeLinecap="round" />
        <line x1={lL + 2} y1={gy - lH/2 + 2} x2={lL + 5} y2={gy - lH/2 + 5}
          stroke="white" strokeWidth="1.2" opacity="0.6" strokeLinecap="round" />
        <line x1={lR + 2} y1={gy - lH/2 + 2} x2={lR + 5} y2={gy - lH/2 + 5}
          stroke="white" strokeWidth="1.2" opacity="0.6" strokeLinecap="round" />
      </g>
    );
  }

  function Beard() {
    if (!hasBeard) return null;
    return (
      <>
        {/* Moustache */}
        <path
          d={`M ${cx - 10},${mouthY - 3}
              Q ${cx - 5},${mouthY - 8} ${cx},${mouthY - 4}
              Q ${cx + 5},${mouthY - 8} ${cx + 10},${mouthY - 3}`}
          fill={hairColor} stroke={OC} strokeWidth="1.4" strokeLinecap="round" />
        {/* Beard body */}
        <path
          d={`M ${cx - 14},${mouthY + 1}
              Q ${cx - 18},${mouthY + 14} ${cx - 10},${mouthY + 22}
              Q ${cx},${mouthY + 26} ${cx + 10},${mouthY + 22}
              Q ${cx + 18},${mouthY + 14} ${cx + 14},${mouthY + 1} Z`}
          fill={hairColor} stroke={OC} strokeWidth="1.4" />
      </>
    );
  }

  // ── Render ───────────────────────────────────────────────
  return (
    <div style={{
      width: size, height: size,
      borderRadius: 10,
      overflow: "hidden",
      outline: selected ? `3px solid white` : `3px solid transparent`,
      outlineOffset: -2,
      boxShadow: selected ? `0 0 0 4px rgba(255,255,255,0.28)` : "none",
      cursor: "pointer",
      transition: "outline 0.12s, box-shadow 0.12s",
      flexShrink: 0,
    }}>
      <svg width={size} height={size} viewBox="0 0 80 88" style={{ display: "block" }}>

        {/* ── Background ── */}
        <rect width="80" height="88" fill={bgColor} />

        {/* ── Shoulders / outfit ── */}
        <path
          d={`M 0,88 L 0,74 Q 16,68 28,66 L ${cx},65 L 52,66 Q 64,68 80,74 L 80,88 Z`}
          fill={outfitColor} stroke={OC} strokeWidth="1.6" />
        {/* Collar V-neck hint */}
        <path d={`M 30,68 L ${cx},76 L 50,68`} fill="none"
          stroke={OC} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />

        {/* ── Neck ── */}
        <rect x={cx - 8} y={cy + headRy - 3} width={16} height={13} rx={5}
          fill={skinTone} stroke={OC} strokeWidth="1.6" />

        {/* ── Hair behind ── */}
        <HairBack />

        {/* ── Earrings behind head ── */}
        <Earrings />

        {/* ── Ears ── */}
        <ellipse cx={cx - headRx}     cy={cy + 2} rx={5} ry={6.5}
          fill={skinTone} stroke={OC} strokeWidth="1.6" />
        <ellipse cx={cx + headRx}     cy={cy + 2} rx={5} ry={6.5}
          fill={skinTone} stroke={OC} strokeWidth="1.6" />
        {/* Inner ear */}
        <ellipse cx={cx - headRx}     cy={cy + 3} rx={2.5} ry={3.5} fill={skinShadow} opacity="0.35" />
        <ellipse cx={cx + headRx}     cy={cy + 3} rx={2.5} ry={3.5} fill={skinShadow} opacity="0.35" />

        {/* ── Head ── */}
        <ellipse cx={cx} cy={cy} rx={headRx} ry={headRy}
          fill={skinTone} stroke={OC} strokeWidth="1.8" />

        {/* ── Cheek blush ── */}
        <ellipse cx={cx - 13} cy={cy + 8} rx={7} ry={4.5} fill="#ff8888" opacity="0.14" />
        <ellipse cx={cx + 13} cy={cy + 8} rx={7} ry={4.5} fill="#ff8888" opacity="0.14" />

        {/* ── Eyebrows — filled arched shapes ── */}
        <path
          d={`M ${eyeLX - 7},${eyeY - 7} Q ${eyeLX},${eyeY - 12} ${eyeLX + 7},${eyeY - 7}
              Q ${eyeLX + 6},${eyeY - 9} ${eyeLX},${eyeY - 10.5}
              Q ${eyeLX - 6},${eyeY - 9} ${eyeLX - 7},${eyeY - 7} Z`}
          fill={eyebrowColor} />
        <path
          d={`M ${eyeRX - 7},${eyeY - 7} Q ${eyeRX},${eyeY - 12} ${eyeRX + 7},${eyeY - 7}
              Q ${eyeRX + 6},${eyeY - 9} ${eyeRX},${eyeY - 10.5}
              Q ${eyeRX - 6},${eyeY - 9} ${eyeRX - 7},${eyeY - 7} Z`}
          fill={eyebrowColor} />

        {/* ── Eyes ── */}
        {/* White sclera */}
        <ellipse cx={eyeLX} cy={eyeY} rx={5.5} ry={6} fill="white" stroke={OC} strokeWidth="1.4" />
        <ellipse cx={eyeRX} cy={eyeY} rx={5.5} ry={6} fill="white" stroke={OC} strokeWidth="1.4" />
        {/* Iris */}
        <circle cx={eyeLX} cy={eyeY} r={3.8} fill={eyeColor} />
        <circle cx={eyeRX} cy={eyeY} r={3.8} fill={eyeColor} />
        {/* Pupil */}
        <circle cx={eyeLX} cy={eyeY} r={2.2} fill="#0a0a18" />
        <circle cx={eyeRX} cy={eyeY} r={2.2} fill="#0a0a18" />
        {/* Highlight */}
        <circle cx={eyeLX - 1.4} cy={eyeY - 1.8} r={1.2} fill="white" />
        <circle cx={eyeRX - 1.4} cy={eyeY - 1.8} r={1.2} fill="white" />
        <circle cx={eyeLX + 1.2} cy={eyeY + 1.4} r={0.6} fill="white" opacity="0.55" />
        <circle cx={eyeRX + 1.2} cy={eyeY + 1.4} r={0.6} fill="white" opacity="0.55" />

        {/* ── Glasses ── */}
        <Glasses />

        {/* ── Nose ── */}
        <path d={`M ${cx - 2},${noseY} Q ${cx},${noseY + 4} ${cx + 2},${noseY}`}
          stroke={skinShadow} strokeWidth="1.4" fill="none" strokeLinecap="round" />
        {/* Nostrils */}
        <ellipse cx={cx - 3} cy={noseY + 3} rx={2} ry={1.2} fill={skinShadow} opacity="0.35" />
        <ellipse cx={cx + 3} cy={noseY + 3} rx={2} ry={1.2} fill={skinShadow} opacity="0.35" />

        {/* ── Beard (drawn before mouth) ── */}
        <Beard />

        {/* ── Mouth ── */}
        {!hasBeard && (
          <>
            {/* Upper lip */}
            <path
              d={`M ${cx - 7},${mouthY}
                  Q ${cx - 3.5},${mouthY - 2} ${cx},${mouthY}
                  Q ${cx + 3.5},${mouthY - 2} ${cx + 7},${mouthY}`}
              stroke={lipColor} strokeWidth="1.4" fill="none" strokeLinecap="round" />
            {/* Smile / lower lip */}
            <path d={`M ${cx - 7},${mouthY} Q ${cx},${mouthY + 7} ${cx + 7},${mouthY}`}
              stroke={lipColor} strokeWidth="1.6" fill={lipColor} fillOpacity="0.15"
              strokeLinecap="round" />
          </>
        )}

        {/* ── Hair on top ── */}
        <HairFront />

      </svg>
    </div>
  );
}

export default AvatarFace;
