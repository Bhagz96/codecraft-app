/**
 * PIXEL ART HERO
 * ==============
 * An SVG-based pixel art character rendered from a grid.
 * Each cell in the grid is a small square, creating that retro pixel look.
 *
 * Props:
 *   color     – hero accent color (default cyan)
 *   size      – overall size in pixels (default 64)
 *   animation – "idle", "walk", "attack", "hurt", "victory" (default "idle")
 *   flip      – mirror horizontally (default false)
 */

import { useState, useEffect } from "react";

// Pixel grid for the hero character (16x16)
// 0 = transparent, 1 = outline (dark), 2 = skin, 3 = accent color, 4 = dark accent, 5 = white/eyes
const HERO_GRID = [
  [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,1,3,3,3,3,1,0,0,0,0,0],
  [0,0,0,0,1,3,3,3,3,3,3,1,0,0,0,0],
  [0,0,0,0,1,3,4,3,3,4,3,1,0,0,0,0],
  [0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0],
  [0,0,0,0,1,2,5,2,2,5,2,1,0,0,0,0],
  [0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0],
  [0,0,0,0,0,1,2,1,1,2,1,0,0,0,0,0],
  [0,0,0,1,1,1,3,3,3,3,1,1,1,0,0,0],
  [0,0,1,2,1,3,3,3,3,3,3,1,2,1,0,0],
  [0,0,1,2,1,3,3,3,3,3,3,1,2,1,0,0],
  [0,0,0,1,1,3,3,3,3,3,3,1,1,0,0,0],
  [0,0,0,0,1,4,4,1,1,4,4,1,0,0,0,0],
  [0,0,0,0,1,4,4,1,1,4,4,1,0,0,0,0],
  [0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0],
  [0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0],
];

// Sword pixel art (8x16, shown during attack)
const SWORD_GRID = [
  [0,0,0,0,0,1,1,0],
  [0,0,0,0,1,5,1,0],
  [0,0,0,1,5,1,0,0],
  [0,0,1,5,1,0,0,0],
  [0,1,5,1,0,0,0,0],
  [1,5,1,0,0,0,0,0],
  [1,1,0,0,0,0,0,0],
  [0,1,0,0,0,0,0,0],
];

function PixelHero({ color = "#00d4ff", size = 64, animation = "idle", flip = false }) {
  const [frame, setFrame] = useState(0);

  // Simple animation frame loop
  useEffect(() => {
    const speed = animation === "attack" ? 150 : 500;
    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % 4);
    }, speed);
    return () => clearInterval(timer);
  }, [animation]);

  const pixelSize = size / 16;

  // Color mapping
  const darkerColor = darkenColor(color, 40);
  const colorMap = {
    0: "transparent",
    1: "#1a1a2e",      // outline
    2: "#f5c6a0",      // skin
    3: color,           // accent
    4: darkerColor,     // dark accent
    5: "#ffffff",       // white/eyes
  };

  // Animation offsets
  let offsetY = 0;
  let rotation = 0;
  let showSword = false;
  let opacity = 1;

  if (animation === "idle") {
    offsetY = frame % 2 === 0 ? 0 : -1;
  } else if (animation === "walk") {
    offsetY = frame % 2 === 0 ? 0 : -2;
  } else if (animation === "attack") {
    showSword = true;
    rotation = frame < 2 ? -5 : 5;
  } else if (animation === "hurt") {
    offsetY = frame % 2 === 0 ? 0 : 2;
    opacity = frame % 2 === 0 ? 1 : 0.5;
  } else if (animation === "victory") {
    offsetY = frame < 2 ? 0 : -4;
  }

  const viewWidth = showSword ? 24 : 16;

  return (
    <svg
      width={showSword ? size * 1.5 : size}
      height={size}
      viewBox={`0 0 ${viewWidth} 16`}
      style={{
        transform: `${flip ? "scaleX(-1)" : ""} rotate(${rotation}deg)`,
        opacity,
        transition: "transform 0.15s, opacity 0.15s",
        imageRendering: "pixelated",
      }}
    >
      {/* Hero body */}
      <g transform={`translate(0, ${offsetY * 0.3})`}>
        {HERO_GRID.map((row, y) =>
          row.map((cell, x) => {
            if (cell === 0) return null;
            return (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width={1.05}
                height={1.05}
                fill={colorMap[cell]}
              />
            );
          })
        )}
      </g>

      {/* Sword (during attack) */}
      {showSword && (
        <g transform={`translate(15, ${offsetY * 0.3 - 2})`}>
          {SWORD_GRID.map((row, y) =>
            row.map((cell, x) => {
              if (cell === 0) return null;
              return (
                <rect
                  key={`sw-${x}-${y}`}
                  x={x}
                  y={y}
                  width={1.05}
                  height={1.05}
                  fill={colorMap[cell]}
                />
              );
            })
          )}
        </g>
      )}
    </svg>
  );
}

/**
 * Darken a hex colour by a given amount.
 */
function darkenColor(hex, amount) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount);
  const b = Math.max(0, (num & 0x0000ff) - amount);
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
}

export default PixelHero;
