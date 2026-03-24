/**
 * PIXEL ART ENEMY
 * ===============
 * Different enemy types rendered as pixel art SVGs.
 *
 * Props:
 *   type      – "slime", "bat", "skeleton", "boss"
 *   size      – overall size in pixels (default 48)
 *   animation – "idle", "hurt", "defeated"
 *   color     – override color (optional)
 */

import { useState, useEffect } from "react";

// Slime (12x12)
const SLIME_GRID = [
  [0,0,0,0,1,1,1,1,0,0,0,0],
  [0,0,0,1,3,3,3,3,1,0,0,0],
  [0,0,1,3,3,3,3,3,3,1,0,0],
  [0,1,3,3,3,3,3,3,3,3,1,0],
  [0,1,3,5,5,3,3,5,5,3,1,0],
  [0,1,3,1,5,3,3,1,5,3,1,0],
  [1,3,3,3,3,3,3,3,3,3,3,1],
  [1,3,3,3,3,3,3,3,3,3,3,1],
  [1,3,3,3,3,3,3,3,3,3,3,1],
  [0,1,3,3,3,3,3,3,3,3,1,0],
  [0,0,1,3,3,3,3,3,3,1,0,0],
  [0,0,0,1,1,1,1,1,1,0,0,0],
];

// Bat (12x10)
const BAT_GRID = [
  [0,1,1,0,0,0,0,0,0,1,1,0],
  [1,4,4,1,0,0,0,0,1,4,4,1],
  [1,4,4,4,1,0,0,1,4,4,4,1],
  [0,1,4,4,4,1,1,4,4,4,1,0],
  [0,0,1,4,5,4,4,5,4,1,0,0],
  [0,0,0,1,1,4,4,1,1,0,0,0],
  [0,0,0,0,1,4,4,1,0,0,0,0],
  [0,0,0,0,1,4,4,1,0,0,0,0],
  [0,0,0,0,0,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
];

// Skeleton (12x14)
const SKELETON_GRID = [
  [0,0,0,0,1,1,1,1,0,0,0,0],
  [0,0,0,1,5,5,5,5,1,0,0,0],
  [0,0,1,5,5,5,5,5,5,1,0,0],
  [0,0,1,5,1,5,5,1,5,1,0,0],
  [0,0,1,5,5,5,5,5,5,1,0,0],
  [0,0,0,1,5,1,1,5,1,0,0,0],
  [0,0,0,0,1,1,1,1,0,0,0,0],
  [0,0,0,1,5,5,5,5,1,0,0,0],
  [0,0,1,1,5,5,5,5,1,1,0,0],
  [0,1,0,1,5,5,5,5,1,0,1,0],
  [0,0,0,1,5,5,5,5,1,0,0,0],
  [0,0,0,0,1,1,1,1,0,0,0,0],
  [0,0,0,1,1,0,0,1,1,0,0,0],
  [0,0,1,1,0,0,0,0,1,1,0,0],
];

const ENEMY_GRIDS = {
  slime: SLIME_GRID,
  bat: BAT_GRID,
  skeleton: SKELETON_GRID,
  boss: SKELETON_GRID, // Boss uses skeleton grid but bigger + different color
};

const ENEMY_COLORS = {
  slime: "#00ff88",
  bat: "#a855f7",
  skeleton: "#e0e0e0",
  boss: "#ff6b35",
};

function PixelEnemy({ type = "slime", size = 48, animation = "idle", color }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % 4);
    }, 600);
    return () => clearInterval(timer);
  }, []);

  const grid = ENEMY_GRIDS[type] || SLIME_GRID;
  const accentColor = color || ENEMY_COLORS[type] || "#00ff88";
  const darkAccent = darkenColor(accentColor, 50);
  const rows = grid.length;
  const cols = grid[0].length;

  const colorMap = {
    0: "transparent",
    1: "#1a1a2e",
    2: "#f5c6a0",
    3: accentColor,
    4: darkAccent,
    5: "#ffffff",
  };

  let offsetY = 0;
  let opacity = 1;
  let scale = 1;

  if (animation === "idle") {
    offsetY = frame % 2 === 0 ? 0 : -0.5;
  } else if (animation === "hurt") {
    opacity = frame % 2 === 0 ? 1 : 0.3;
    offsetY = frame % 2 === 0 ? 0 : 1;
  } else if (animation === "defeated") {
    opacity = 0.2;
    scale = 0.8;
    offsetY = 2;
  }

  const displaySize = type === "boss" ? size * 1.5 : size;

  return (
    <svg
      width={displaySize}
      height={displaySize}
      viewBox={`0 0 ${cols} ${rows}`}
      style={{
        opacity,
        transform: `scale(${scale})`,
        transition: "opacity 0.3s, transform 0.3s",
        imageRendering: "pixelated",
      }}
    >
      <g transform={`translate(0, ${offsetY * 0.3})`}>
        {grid.map((row, y) =>
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
    </svg>
  );
}

function darkenColor(hex, amount) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount);
  const b = Math.max(0, (num & 0x0000ff) - amount);
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
}

export default PixelEnemy;
