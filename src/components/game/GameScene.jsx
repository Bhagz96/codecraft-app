/**
 * GAME SCENE — Mountain Quest Edition (v3 — Immersive)
 * =====================================================
 * Rich, layered SVG environments that react to the user's code.
 * Each scene has detailed backgrounds with depth, lighting, and atmosphere.
 */

import { useState, useEffect } from "react";
import GameHero from "./GameHero";

function GameScene({ sceneId = "hero-spawn", result, hero, gameAction, sceneConfig }) {
  const [phase, setPhase] = useState("idle");

  useEffect(() => {
    if (result === "correct") {
      setPhase("success");
      const timer = setTimeout(() => setPhase("idle"), 2500);
      return () => clearTimeout(timer);
    } else if (result === "incorrect") {
      setPhase("fail");
      const timer = setTimeout(() => setPhase("idle"), 2000);
      return () => clearTimeout(timer);
    } else {
      setPhase("idle");
    }
  }, [result]);

  const heroColor = hero?.color || "#00d4ff";
  const heroName = hero?.name || "Hero";
  const sceneProps = { phase, heroColor, heroName, hero, gameAction, sceneConfig };

  const sceneLabels = {
    "hero-spawn": "base camp — hero arrives",
    "mountain-camp": "base camp — preparing",
    "mountain-trail": "mountain trail — climbing",
    "mountain-battle": "mountain trail — encounter",
    "mountain-obstacle": "mountain path — obstacle ahead",
  };

  const renderScene = () => {
    switch (sceneId) {
      case "hero-spawn": return <BaseCampScene {...sceneProps} />;
      case "mountain-camp":
      case "dungeon-room": return <BaseCampScene {...sceneProps} />;
      case "mountain-trail": return <MountainTrailScene {...sceneProps} />;
      case "mountain-battle":
      case "combat-arena": return <BattleScene {...sceneProps} />;
      case "mountain-obstacle":
      case "the-gate": return <ObstacleScene {...sceneProps} />;
      default: return <BaseCampScene {...sceneProps} />;
    }
  };

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden">
      {/* Scene header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#161b22] border-b border-[#30363d]">
        <span className="text-xs text-gray-500 font-mono">
          {sceneLabels[sceneId] || sceneId.replace(/-/g, " ")}
        </span>
        {hero?.name && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono" style={{ color: heroColor }}>{heroName}</span>
            <span className="text-xs text-green-400 font-mono">HP {hero?.health || 100}/{hero?.maxHealth || 100}</span>
            <span className="text-xs text-yellow-400 font-mono">{hero?.gold || 0}g</span>
          </div>
        )}
      </div>

      {/* Scene — taller for immersion */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
        {renderScene()}
      </div>
    </div>
  );
}

// =======================================================
// SHARED SVG ELEMENTS
// =======================================================

function SkyBackground({ night = false }) {
  const id = night ? "nightSky" : "daySky";
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%">
          {night ? (
            <>
              <stop offset="0%" stopColor="#050a18" />
              <stop offset="40%" stopColor="#0f1b3d" />
              <stop offset="100%" stopColor="#1a2a4a" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#1a3a5c" />
              <stop offset="30%" stopColor="#2d5a7b" />
              <stop offset="60%" stopColor="#3d7a8a" />
              <stop offset="100%" stopColor="#4a8a6a" />
            </>
          )}
        </linearGradient>
        <linearGradient id="snowCap" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d0e0f0" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="fogGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="30%" stopColor="white" stopOpacity="0.06" />
          <stop offset="70%" stopColor="white" stopOpacity="0.06" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="800" height="400" fill={`url(#${id})`} />

      {/* Stars at night */}
      {night && [...Array(20)].map((_, i) => (
        <circle key={i} cx={40 + i * 38} cy={10 + (i * 17) % 80} r={i % 4 === 0 ? 1.2 : 0.7} fill="white" opacity={0.3 + (i % 3) * 0.15}>
          <animate attributeName="opacity" values={`${0.2 + (i % 3) * 0.1};${0.5 + (i % 2) * 0.2};${0.2 + (i % 3) * 0.1}`}
            dur={`${2 + i % 4}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Moon at night */}
      {night && (
        <g>
          <circle cx="680" cy="60" r="25" fill="#f0e68c" opacity="0.9" />
          <circle cx="690" cy="55" r="22" fill="#050a18" />
        </g>
      )}

      {/* Distant mountains */}
      <polygon points="0,400 0,200 80,160 160,190 240,140 320,170 400,120 480,155 560,130 640,145 720,110 800,150 800,400" fill={night ? "#0a1525" : "#2a4a5a"} opacity="0.5" />

      {/* Mid mountains */}
      <polygon points="0,400 0,240 100,180 200,220 280,170 380,200 480,160 560,190 660,165 760,185 800,175 800,400" fill={night ? "#0f1f35" : "#1f3f4f"} opacity="0.7" />

      {/* Snow caps on mid mountains */}
      <polygon points="280,170 265,195 295,195" fill="url(#snowCap)" opacity="0.8" />
      <polygon points="480,160 463,188 497,188" fill="url(#snowCap)" opacity="0.7" />
      <polygon points="720,110 705,140 735,140" fill="url(#snowCap)" opacity="0.6" />

      {/* Front mountain ridge */}
      <polygon points="0,400 0,280 120,240 240,270 360,230 460,260 580,235 700,255 800,240 800,400"
        fill={night ? "#15253a" : "#254535"} />

      {/* Fog layer */}
      <rect x="0" y="220" width="800" height="60" fill="url(#fogGrad)" opacity="0.5">
        <animateTransform attributeName="transform" type="translate" values="0,0;30,0;0,0" dur="12s" repeatCount="indefinite" />
      </rect>
    </svg>
  );
}

function Ground({ variant = "grass" }) {
  const colors = {
    grass: { top: "#2d5530", mid: "#1f3f25", bottom: "#152a18" },
    rocky: { top: "#4a4035", mid: "#3a3028", bottom: "#2a201a" },
    snow: { top: "#8a9aaa", mid: "#6a7a8a", bottom: "#4a5a6a" },
  }[variant] || { top: "#2d5530", mid: "#1f3f25", bottom: "#152a18" };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 z-[5]"
      style={{ background: `linear-gradient(180deg, ${colors.top} 0%, ${colors.mid} 40%, ${colors.bottom} 100%)` }}>
      {/* Ground texture dots */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 80" preserveAspectRatio="none">
        {[...Array(15)].map((_, i) => (
          <circle key={i} cx={15 + i * 26} cy={10 + (i * 7) % 40} r={1 + i % 2} fill="white" opacity="0.04" />
        ))}
      </svg>
    </div>
  );
}

function Tree({ x, scale = 1, variant = "pine" }) {
  const s = scale;
  if (variant === "pine") {
    return (
      <div className="absolute z-[6]" style={{ left: `${x}%`, bottom: `70px`, transform: `scale(${s})`, transformOrigin: "bottom center" }}>
        <svg width="30" height="50" viewBox="0 0 30 50">
          <rect x="13" y="35" width="4" height="15" fill="#4a3520" rx="1" />
          <polygon points="15,0 2,22 8,22 0,35 30,35 22,22 28,22" fill="#1a4a2e" />
          <polygon points="15,0 2,22 8,22 0,35 15,35 15,22 12,22" fill="#226b3a" opacity="0.3" />
        </svg>
      </div>
    );
  }
  return (
    <div className="absolute z-[6]" style={{ left: `${x}%`, bottom: `70px`, transform: `scale(${s})`, transformOrigin: "bottom center" }}>
      <svg width="34" height="45" viewBox="0 0 34 45">
        <rect x="15" y="28" width="4" height="17" fill="#5a4530" rx="1" />
        <ellipse cx="17" cy="18" rx="14" ry="16" fill="#2a6a35" />
        <ellipse cx="13" cy="15" rx="7" ry="9" fill="#3a8a45" opacity="0.3" />
      </svg>
    </div>
  );
}

function Rock({ x, scale = 1 }) {
  return (
    <div className="absolute z-[6]" style={{ left: `${x}%`, bottom: `72px`, transform: `scale(${scale})`, transformOrigin: "bottom center" }}>
      <svg width="24" height="16" viewBox="0 0 24 16">
        <polygon points="2,16 5,4 10,1 16,3 22,6 24,16" fill="#4a4a4a" />
        <polygon points="5,4 10,1 16,3 10,6" fill="#5a5a5a" />
      </svg>
    </div>
  );
}

function Campfire({ x = 50, size = 1 }) {
  return (
    <div className="absolute z-[8]" style={{ left: `${x}%`, bottom: `72px`, transform: `scale(${size})`, transformOrigin: "bottom center" }}>
      <svg width="40" height="50" viewBox="0 0 40 50">
        {/* Fire glow */}
        <ellipse cx="20" cy="35" rx="18" ry="10" fill="#ff6600" opacity="0.08">
          <animate attributeName="rx" values="16;20;16" dur="2s" repeatCount="indefinite" />
        </ellipse>
        {/* Logs */}
        <rect x="8" y="38" width="24" height="4" rx="2" fill="#5a3a1a" transform="rotate(-10, 20, 40)" />
        <rect x="8" y="38" width="24" height="4" rx="2" fill="#4a2a10" transform="rotate(10, 20, 40)" />
        {/* Fire */}
        <ellipse cx="20" cy="30" rx="6" ry="10" fill="#ff4400" opacity="0.9">
          <animate attributeName="ry" values="9;12;9" dur="0.4s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="20" cy="28" rx="4" ry="8" fill="#ff8800" opacity="0.8">
          <animate attributeName="ry" values="7;9;7" dur="0.3s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="20" cy="26" rx="2.5" ry="5" fill="#ffcc00" opacity="0.9">
          <animate attributeName="ry" values="4;6;4" dur="0.35s" repeatCount="indefinite" />
        </ellipse>
        {/* Sparks */}
        <circle cx="16" cy="18" r="1" fill="#ffcc00" opacity="0.6">
          <animate attributeName="cy" values="18;10;18" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="24" cy="15" r="0.8" fill="#ff8800" opacity="0.5">
          <animate attributeName="cy" values="15;6;15" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
      {/* Glow on ground */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full bg-orange-500/10 blur-lg" />
    </div>
  );
}

function Tent({ x = 70, scale = 1 }) {
  return (
    <div className="absolute z-[7]" style={{ left: `${x}%`, bottom: `72px`, transform: `scale(${scale})`, transformOrigin: "bottom center" }}>
      <svg width="100" height="85" viewBox="0 0 100 85">
        {/* Ground shadow */}
        <ellipse cx="50" cy="83" rx="45" ry="4" fill="black" opacity="0.15" />
        {/* Tent body */}
        <polygon points="5,82 50,8 95,82" fill="#8B6914" />
        <polygon points="50,8 5,82 50,82" fill="#a07a1a" opacity="0.35" />
        {/* Side stitch lines */}
        <line x1="28" y1="45" x2="15" y2="82" stroke="#7a5a10" strokeWidth="0.5" opacity="0.4" />
        <line x1="72" y1="45" x2="85" y2="82" stroke="#7a5a10" strokeWidth="0.5" opacity="0.4" />
        {/* Door */}
        <polygon points="38,82 50,35 62,82" fill="#5a4010" />
        <polygon points="38,82 50,35 50,82" fill="#4a3008" opacity="0.3" />
        {/* Door flap */}
        <path d="M 42,82 Q 46,60 50,45" stroke="#6b5020" strokeWidth="0.8" fill="none" opacity="0.5" />
        {/* Pole on top */}
        <line x1="50" y1="8" x2="50" y2="-4" stroke="#6b5030" strokeWidth="2" />
        {/* Flag */}
        <polygon points="50,-4 68,1 50,6" fill="#ef4444" opacity="0.85">
          <animateTransform attributeName="transform" type="rotate" values="0,50,1;4,50,1;0,50,1" dur="3s" repeatCount="indefinite" />
        </polygon>
        {/* Rope from tent to ground */}
        <line x1="18" y1="50" x2="2" y2="80" stroke="#8a7a5a" strokeWidth="0.8" opacity="0.3" />
        <line x1="82" y1="50" x2="98" y2="80" stroke="#8a7a5a" strokeWidth="0.8" opacity="0.3" />
      </svg>
    </div>
  );
}

function Signpost({ x = 10, text = "SUMMIT" }) {
  return (
    <div className="absolute z-[8]" style={{ left: `${x}%`, bottom: `72px` }}>
      <svg width="40" height="40" viewBox="0 0 40 40">
        <rect x="18" y="10" width="4" height="30" fill="#5a4530" rx="1" />
        <rect x="5" y="8" width="30" height="12" rx="2" fill="#6b5030" />
        <polygon points="35,8 40,14 35,20" fill="#6b5030" />
        <text x="20" y="17" textAnchor="middle" fill="#f0e0c0" fontSize="6" fontFamily="monospace">{text}</text>
      </svg>
    </div>
  );
}

function StatusMessage({ phase, successMsg, failMsg, idleMsg }) {
  return (
    <div className="absolute bottom-2 left-0 right-0 text-center z-20">
      {phase === "success" && (
        <span className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono px-3 py-1 rounded-full animate-pulse inline-block">
          {successMsg}
        </span>
      )}
      {phase === "fail" && (
        <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono px-3 py-1 rounded-full inline-block">
          {failMsg}
        </span>
      )}
      {phase === "idle" && (
        <span className="text-gray-500 text-xs font-mono">{idleMsg}</span>
      )}
    </div>
  );
}

function Sparkles({ heroColor }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="absolute w-2 h-2 rounded-full animate-ping"
          style={{ backgroundColor: heroColor, left: `${15 + Math.random() * 70}%`, top: `${15 + Math.random() * 50}%`,
            animationDelay: `${i * 0.12}s`, animationDuration: "0.8s" }} />
      ))}
    </div>
  );
}

// =======================================================
// SCENE 1: BASE CAMP
// =======================================================
function BaseCampScene({ phase, heroColor, heroName, hero, gameAction, sceneConfig }) {
  const successMsg = {
    heroNameSet: `${heroName} has arrived at base camp!`,
    heroStatsInit: `${heroName}'s stats are set!`,
    heroDataStore: `Data saved to ${heroName}'s journal!`,
    heroCollectItem: `${heroName} found ${sceneConfig?.itemName || "an item"}!`,
    heroStoreData: `${heroName} recorded camp data!`,
    heroLearnSkill: `${heroName} learned a new skill!`,
    heroBuildInventory: `Pack updated!`,
  }[gameAction] || "Code executed!";

  return (
    <div className="w-full h-full relative">
      <SkyBackground />
      <Ground variant="grass" />

      {/* Trees */}
      <Tree x={2} scale={0.9} />
      <Tree x={8} scale={0.7} variant="oak" />
      <Tree x={85} scale={0.8} />
      <Tree x={92} scale={0.65} variant="oak" />

      {/* Rocks */}
      <Rock x={15} scale={0.7} />
      <Rock x={78} scale={0.6} />

      {/* Tent — large, prominent */}
      <Tent x={58} scale={1.3} />

      {/* Campfire — between hero and tent */}
      <Campfire x={40} size={1.1} />

      {/* Signpost */}
      <Signpost x={3} text="SUMMIT" />

      {/* Supply crates near tent */}
      <div className="absolute z-[7]" style={{ left: "53%", bottom: "72px" }}>
        <svg width="28" height="24" viewBox="0 0 28 24">
          <rect x="1" y="5" width="26" height="19" rx="2" fill="#6b5030" />
          <rect x="1" y="5" width="26" height="4" rx="2" fill="#8a6a3a" />
          <line x1="14" y1="5" x2="14" y2="24" stroke="#5a4020" strokeWidth="2" />
          <rect x="12" y="11" width="4" height="3" rx="1" fill="#8a7a5a" />
        </svg>
      </div>

      {/* Backpack near hero */}
      <div className="absolute z-[7]" style={{ left: "22%", bottom: "74px" }}>
        <svg width="18" height="22" viewBox="0 0 18 22">
          <rect x="2" y="4" width="14" height="18" rx="3" fill="#5a4a3a" />
          <rect x="2" y="4" width="14" height="4" rx="3" fill="#6b5a4a" />
          <rect x="6" y="0" width="6" height="6" rx="3" fill="none" stroke="#5a4a3a" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Lantern on a post near tent */}
      <div className="absolute z-[8]" style={{ left: "55%", bottom: "100px" }}>
        <svg width="14" height="28" viewBox="0 0 14 28">
          <rect x="6" y="12" width="2" height="16" fill="#5a4530" />
          <rect x="3" y="0" width="8" height="4" rx="1" fill="#8a7a5a" />
          <rect x="2" y="4" width="10" height="14" rx="3" fill="#ffa500" opacity="0.35">
            <animate attributeName="opacity" values="0.25;0.45;0.25" dur="2.5s" repeatCount="indefinite" />
          </rect>
          <rect x="2" y="4" width="10" height="14" rx="3" fill="none" stroke="#8a7a5a" strokeWidth="0.5" />
        </svg>
      </div>

      {phase === "success" && <Sparkles heroColor={heroColor} />}

      {/* Stat popup */}
      {phase === "success" && sceneConfig?.statChange && (
        <div className="absolute top-4 right-4 animate-bounce z-20">
          <span className="bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-mono px-2 py-1 rounded">
            {sceneConfig.statChange}
          </span>
        </div>
      )}

      {/* Hero — smaller relative to tent for realistic proportion */}
      <div className={`absolute z-10 transition-all duration-500 ${
        phase === "success" ? "scale-110" : phase === "fail" ? "opacity-70" : ""
      }`} style={{ left: "28%", bottom: "62px" }}>
        <GameHero color={heroColor} size={80}
          animation={phase === "success" ? "victory" : phase === "fail" ? "hurt" : "idle"} />
      </div>

      <StatusMessage phase={phase} successMsg={successMsg}
        failMsg="Code error — check your variables" idleMsg="Write code to set up camp..." />
    </div>
  );
}

// =======================================================
// SCENE 2: MOUNTAIN TRAIL
// =======================================================
function MountainTrailScene({ phase, heroColor, heroName, hero, gameAction, sceneConfig }) {
  const [stepsClimbed, setStepsClimbed] = useState(0);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (phase === "success") {
      if (gameAction === "heroCollectLoop") {
        setItems(prev => [...prev, sceneConfig?.itemEmoji || "gem"]);
      } else {
        setStepsClimbed(prev => prev + 1);
      }
    }
  }, [phase, gameAction, sceneConfig]);

  const totalSteps = 5;
  const step = Math.min(stepsClimbed, totalSteps);

  const successMsg = {
    heroClimbSteps: `${heroName} climbed higher! (${step}/${totalSteps})`,
    heroCollectLoop: `${heroName} collected an item! (${items.length} total)`,
    heroTrainLoop: `${heroName} completed training!`,
    heroStoreData: `Trail data recorded!`,
  }[gameAction] || "Loop complete!";

  return (
    <div className="w-full h-full relative overflow-hidden">
      <SkyBackground night />
      <Ground variant="rocky" />

      {/* Winding trail path */}
      <svg className="absolute bottom-0 left-0 right-0 z-[6]" viewBox="0 0 400 160" preserveAspectRatio="none" style={{ height: "65%" }}>
        <defs>
          <linearGradient id="trailGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6b5a40" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8a7a60" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {/* Wide trail */}
        <path d="M 10,150 Q 60,130 100,110 T 180,80 T 260,55 T 340,30 T 390,15"
          stroke="url(#trailGrad)" strokeWidth="18" fill="none" strokeLinecap="round" />
        {/* Trail edge */}
        <path d="M 10,150 Q 60,130 100,110 T 180,80 T 260,55 T 340,30 T 390,15"
          stroke="#8a7a60" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="6 4" opacity="0.3" />
      </svg>

      {/* Trail rocks */}
      <Rock x={20} scale={0.5} />
      <Rock x={45} scale={0.4} />
      <Rock x={70} scale={0.5} />

      {/* Sparse trees */}
      <Tree x={5} scale={0.6} />
      <Tree x={88} scale={0.5} />

      {/* Step progress bar */}
      <div className="absolute bottom-20 left-3 z-20 flex items-end gap-1">
        {[...Array(totalSteps)].map((_, i) => (
          <div key={i} className={`rounded transition-all duration-500 ${
            i < step
              ? "bg-green-500/70 border border-green-400/40 shadow-[0_0_6px_rgba(0,255,100,0.3)]"
              : "bg-gray-700/40 border border-gray-600/20"
          }`} style={{ width: 14, height: 8 + i * 5 }} />
        ))}
        <span className="text-[10px] text-gray-400 font-mono ml-1">{step}/{totalSteps}</span>
      </div>

      {/* Collected items */}
      {items.length > 0 && (
        <div className="absolute top-3 right-3 z-20 flex gap-1 bg-[#161b22]/70 rounded px-2 py-1 border border-[#30363d]/50">
          <span className="text-[10px] text-gray-500 font-mono mr-1">x{items.length}</span>
          {items.slice(-5).map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-sm bg-purple-400/60" />
          ))}
        </div>
      )}

      {/* Summit flag */}
      <div className="absolute top-6 right-8 z-10">
        <svg width="20" height="25" viewBox="0 0 20 25">
          <rect x="3" y="0" width="2" height="25" fill="#8a7a5a" />
          <polygon points="5,1 18,5 5,9" fill="#ef4444" opacity="0.8">
            <animateTransform attributeName="transform" type="rotate" values="0,5,5;3,5,5;0,5,5" dur="2s" repeatCount="indefinite" />
          </polygon>
        </svg>
      </div>

      {phase === "success" && <Sparkles heroColor={heroColor} />}

      {/* Hero climbing */}
      <div className="absolute z-10 transition-all duration-700"
        style={{ bottom: `${55 + step * 20}px`, left: `${10 + step * 14}%` }}>
        <GameHero color={heroColor} size={75}
          animation={phase === "success" ? "walk" : phase === "fail" ? "hurt" : "idle"} />
      </div>

      <StatusMessage phase={phase} successMsg={successMsg}
        failMsg={`Loop error — ${heroName} slipped!`}
        idleMsg={stepsClimbed === 0 ? "Write loops to start climbing..." : "Keep looping to climb higher..."} />
    </div>
  );
}

// =======================================================
// SCENE 3: BATTLE
// =======================================================
function BattleScene({ phase, heroColor, heroName, hero, gameAction, sceneConfig }) {
  const [defeated, setDefeated] = useState(0);

  useEffect(() => {
    if (phase === "success") setDefeated(prev => prev + 1);
  }, [phase]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <SkyBackground night />
      {/* Red-tinted danger ground */}
      <div className="absolute bottom-0 left-0 right-0 h-20 z-[5]"
        style={{ background: "linear-gradient(180deg, #3a2525 0%, #2a1818 40%, #1a0f0f 100%)" }} />

      {/* Rocky outcrops */}
      <Rock x={5} scale={0.8} />
      <Rock x={85} scale={0.9} />
      <Rock x={45} scale={0.6} />

      {/* Danger atmosphere */}
      <div className="absolute bottom-16 left-0 right-0 h-12 bg-red-900/5 z-[6]" />

      {/* Hero on left */}
      <div className={`absolute z-10 transition-all duration-300 ${
        phase === "success" ? "translate-x-6" : phase === "fail" ? "-translate-x-3" : ""
      }`} style={{ left: "10%", bottom: "60px" }}>
        <GameHero color={heroColor} size={85}
          animation={phase === "success" ? "attack" : phase === "fail" ? "hurt" : "idle"} />
      </div>

      {/* VS / Hit indicator */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-24 z-10">
        {phase === "success" ? (
          <span className="text-green-400 text-2xl font-bold font-mono animate-bounce">HIT!</span>
        ) : phase === "fail" ? (
          <span className="text-red-400 text-2xl font-bold font-mono">MISS</span>
        ) : (
          <span className="text-gray-600 text-lg font-mono">VS</span>
        )}
      </div>

      {/* Enemy (SVG creature) */}
      <div className={`absolute z-10 transition-all duration-300 ${
        phase === "success" ? "opacity-40 scale-90 translate-x-4" : phase === "fail" ? "scale-110" : ""
      }`} style={{ right: "12%", bottom: "62px" }}>
        <svg width="70" height="70" viewBox="0 0 70 70">
          {/* Shadow */}
          <ellipse cx="35" cy="65" rx="20" ry="5" fill="black" opacity="0.2" />
          {/* Body */}
          <ellipse cx="35" cy="40" rx="22" ry="25" fill="#6b3a6b" />
          <ellipse cx="30" cy="35" rx="10" ry="15" fill="#7a4a7a" opacity="0.3" />
          {/* Eyes */}
          <ellipse cx="27" cy="35" rx="6" ry="7" fill="white" />
          <ellipse cx="43" cy="35" rx="6" ry="7" fill="white" />
          <circle cx="28" cy="36" r="3" fill="#ff3333" />
          <circle cx="44" cy="36" r="3" fill="#ff3333" />
          <circle cx="27" cy="35" r="1" fill="white" />
          <circle cx="43" cy="35" r="1" fill="white" />
          {/* Mouth */}
          <path d="M 25,50 Q 35,55 45,50" stroke="#4a2a4a" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Combo counter */}
      {defeated > 0 && (
        <div className="absolute top-3 right-3 z-20">
          <span className="text-orange-400 text-xs font-mono font-bold bg-[#161b22]/80 px-2 py-1 rounded border border-orange-500/20">
            x{defeated} combo
          </span>
        </div>
      )}

      {phase === "success" && <Sparkles heroColor={heroColor} />}

      <StatusMessage phase={phase}
        successMsg={`${heroName}'s loop hits! Creature defeated!`}
        failMsg={`Loop error — ${heroName}'s attack missed!`}
        idleMsg="Write loop attacks to defeat the creature..." />
    </div>
  );
}

// =======================================================
// SCENE 4: OBSTACLE
// =======================================================
function ObstacleScene({ phase, heroColor, heroName, hero, gameAction, sceneConfig }) {
  const [cleared, setCleared] = useState(0);

  useEffect(() => {
    if (phase === "success") setCleared(prev => prev + 1);
  }, [phase]);

  const obstacleType = {
    heroCheckWeather: { label: "weather", emoji: "cloud" },
    heroForkPath: { label: "fork", emoji: "sign" },
    heroObstacle: { label: "boulder", emoji: "rock" },
    heroFinalGate: { label: "gate", emoji: "gate" },
  }[gameAction] || { label: "obstacle", emoji: "rock" };

  const successMsg = {
    heroCheckWeather: `${heroName} read the weather — safe to proceed!`,
    heroForkPath: `${heroName} chose the right path!`,
    heroObstacle: `${heroName} cleared the obstacle!`,
    heroFinalGate: `${heroName} opened the gate!`,
  }[gameAction] || `${heroName}'s condition passed!`;

  const failMsg = {
    heroCheckWeather: "Weather check failed — wrong condition",
    heroForkPath: "Wrong path — check your logic",
    heroObstacle: "Blocked — code error",
    heroFinalGate: "Gate locked — condition is False",
  }[gameAction] || "Condition failed — try again";

  return (
    <div className="w-full h-full relative overflow-hidden">
      <SkyBackground />
      <Ground variant="grass" />

      {/* Forking path SVG */}
      <svg className="absolute bottom-0 left-0 right-0 z-[6]" viewBox="0 0 400 120" preserveAspectRatio="none" style={{ height: "45%" }}>
        {/* Main path */}
        <path d="M 0,100 Q 80,90 160,75 T 250,60" stroke="#6b5a40" strokeWidth="14" fill="none" opacity="0.3" strokeLinecap="round" />
        {/* True path (up) */}
        <path d="M 250,60 Q 310,40 400,25" stroke={phase === "success" ? "#22c55e" : "#6b5a40"}
          strokeWidth="10" fill="none" opacity={phase === "success" ? "0.4" : "0.15"} strokeLinecap="round" />
        {/* False path (down) */}
        <path d="M 250,60 Q 310,80 400,95" stroke={phase === "fail" ? "#ef4444" : "#6b5a40"}
          strokeWidth="10" fill="none" opacity={phase === "fail" ? "0.4" : "0.15"} strokeLinecap="round" />
      </svg>

      {/* True/False labels */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5">
        <span className={`px-2 py-0.5 rounded text-xs font-mono border transition-all ${
          phase === "success" ? "text-green-400 border-green-500/30 bg-green-500/10" : "text-gray-600 border-gray-700/30"
        }`}>if True →</span>
        <span className={`px-2 py-0.5 rounded text-xs font-mono border transition-all ${
          phase === "fail" ? "text-red-400 border-red-500/30 bg-red-500/10" : "text-gray-600 border-gray-700/30"
        }`}>else →</span>
      </div>

      {/* Obstacle in the middle */}
      <div className={`absolute z-10 transition-all duration-500 ${
        phase === "success" ? "scale-75 opacity-40" : phase === "fail" ? "scale-110" : ""
      }`} style={{ left: "55%", bottom: "75px" }}>
        <svg width="50" height="50" viewBox="0 0 50 50">
          {obstacleType.emoji === "rock" ? (
            <>
              <polygon points="5,48 10,15 25,5 40,12 48,48" fill="#5a5a5a" />
              <polygon points="10,15 25,5 25,25 10,30" fill="#6a6a6a" />
            </>
          ) : obstacleType.emoji === "gate" ? (
            <>
              <rect x="5" y="5" width="8" height="43" fill="#6a5a4a" rx="1" />
              <rect x="37" y="5" width="8" height="43" fill="#6a5a4a" rx="1" />
              <rect x="5" y="5" width="40" height="6" rx="2" fill="#7a6a5a" />
              <rect x="13" y="11" width="24" height="37" fill="#4a3a2a" opacity="0.5" />
            </>
          ) : obstacleType.emoji === "sign" ? (
            <>
              <rect x="23" y="20" width="4" height="28" fill="#5a4530" rx="1" />
              <polygon points="15,5 35,10 35,22 15,18" fill="#6b5030" />
              <polygon points="15,22 35,18 35,30 15,34" fill="#5a4520" />
            </>
          ) : (
            <>
              <ellipse cx="25" cy="20" rx="20" ry="15" fill="#8a8a9a" opacity="0.6" />
              <ellipse cx="25" cy="25" rx="18" ry="12" fill="#9a9aaa" opacity="0.3" />
            </>
          )}
        </svg>
        <div className="text-center mt-1">
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
            phase === "success" ? "text-green-400 bg-green-500/10 border border-green-500/20"
            : phase === "fail" ? "text-red-400 bg-red-500/10 border border-red-500/20"
            : "text-gray-500 bg-gray-800/40 border border-gray-700/20"
          }`}>
            {phase === "success" ? "CLEARED" : phase === "fail" ? "BLOCKED" : "if ???"}
          </span>
        </div>
      </div>

      <Tree x={3} scale={0.7} />
      <Tree x={90} scale={0.6} />
      <Rock x={20} scale={0.5} />

      {/* Cleared counter */}
      {cleared > 0 && (
        <div className="absolute top-3 left-3 z-20">
          <span className="text-emerald-400 text-xs font-mono bg-[#161b22]/60 px-2 py-1 rounded border border-emerald-500/20">
            {cleared} cleared
          </span>
        </div>
      )}

      {phase === "success" && <Sparkles heroColor={heroColor} />}

      {/* Hero approaching */}
      <div className={`absolute z-10 transition-all duration-700 ${
        phase === "success" ? "translate-x-16" : phase === "fail" ? "-translate-x-3 opacity-80" : ""
      }`} style={{ left: "12%", bottom: "58px" }}>
        <GameHero color={heroColor} size={80}
          animation={phase === "success" ? "walk" : phase === "fail" ? "hurt" : "idle"} />
      </div>

      <StatusMessage phase={phase} successMsg={successMsg} failMsg={failMsg}
        idleMsg="Write conditions to navigate the obstacle..." />
    </div>
  );
}

export default GameScene;
