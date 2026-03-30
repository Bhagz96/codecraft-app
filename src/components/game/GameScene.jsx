/**
 * GAME SCENE — Mountain Quest Edition (v3 — Immersive)
 * =====================================================
 * Rich, layered SVG environments that react to the user's code.
 * Each scene has detailed backgrounds with depth, lighting, and atmosphere.
 */

import { useState, useEffect, useRef } from "react";
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

function Chest({ x = 47, open = false }) {
  return (
    <div className="absolute z-[9]" style={{ left: `${x}%`, bottom: "72px", transform: "translateX(-50%)" }}>
      <svg width="38" height="34" viewBox="0 0 38 34">
        {/* Shadow */}
        <ellipse cx="19" cy="33" rx="16" ry="2" fill="black" opacity="0.18" />
        {/* Body */}
        <rect x="2" y="15" width="34" height="17" rx="2" fill="#7a4e18" />
        <rect x="2" y="18" width="34" height="2" fill="#5a3a10" />
        <rect x="2" y="24" width="34" height="2" fill="#5a3a10" />
        {/* Lock plate */}
        <rect x="14" y="14" width="10" height="8" rx="1.5" fill="#c8a820" />
        <circle cx="19" cy="17.5" r="2.5" fill="#9a8010" />
        <circle cx="19" cy="17.5" r="1" fill="#7a6010" />
        {/* Lid */}
        {open ? (
          <>
            {/* Open lid flipped back */}
            <path d="M 2,15 L 2,5 Q 2,1 19,1 Q 36,1 36,5 L 36,15" fill="#9a6820" />
            <path d="M 2,5 Q 2,1 19,1 Q 36,1 36,5" fill="#c08030" />
            {/* Golden glow inside */}
            <ellipse cx="19" cy="15" rx="14" ry="3.5" fill="#ffd700" opacity="0.55">
              <animate attributeName="opacity" values="0.3;0.75;0.3" dur="0.7s" repeatCount="indefinite" />
            </ellipse>
          </>
        ) : (
          <>
            <rect x="2" y="5" width="34" height="10" rx="2" fill="#9a6820" />
            <rect x="2" y="5" width="34" height="3" rx="1" fill="#c08030" />
          </>
        )}
      </svg>
      {open && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-14 h-5 rounded-full bg-yellow-400/25 blur-md pointer-events-none" />
      )}
    </div>
  );
}

// =======================================================
// SCENE 1: BASE CAMP
// =======================================================
function BaseCampScene({ phase, heroColor, heroName, hero, gameAction, sceneConfig }) {
  const [heroX, setHeroX] = useState(25);
  const [heroFlip, setHeroFlip] = useState(false);
  const [heroAnim, setHeroAnim] = useState("walk");
  const [heroTransition, setHeroTransition] = useState("none");
  const [chestOpen, setChestOpen] = useState(false);
  const [showItem, setShowItem] = useState(false);
  const goingRight = useRef(true);
  const intervalRef = useRef(null);
  const t1Ref = useRef(null);
  const t2Ref = useRef(null);

  const clearAll = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (t1Ref.current) { clearTimeout(t1Ref.current); t1Ref.current = null; }
    if (t2Ref.current) { clearTimeout(t2Ref.current); t2Ref.current = null; }
  };

  useEffect(() => {
    clearAll();

    if (phase === "idle") {
      setChestOpen(false);
      setShowItem(false);
      setHeroTransition("none");
      setHeroAnim("walk");
      goingRight.current = true;
      setHeroFlip(false);

      intervalRef.current = setInterval(() => {
        setHeroX(prev => {
          const next = prev + (goingRight.current ? 0.25 : -0.25);
          if (next >= 37) { goingRight.current = false; setHeroFlip(true); }
          else if (next <= 18) { goingRight.current = true; setHeroFlip(false); }
          return next;
        });
      }, 60);

    } else if (phase === "success") {
      // Walk hero to chest then open it
      setHeroTransition("left 0.9s ease-in-out");
      setHeroFlip(false);
      setHeroAnim("walk");
      setHeroX(43);

      t1Ref.current = setTimeout(() => {
        setHeroAnim("attack");
        t2Ref.current = setTimeout(() => {
          setChestOpen(true);
          setShowItem(true);
          setHeroAnim("victory");
        }, 500);
      }, 950);

    } else if (phase === "fail") {
      setHeroAnim("hurt");
    }

    return clearAll;
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

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

      {/* Treasure chest — between campfire and crates */}
      <Chest x={47} open={chestOpen} />

      {/* Floating item reward */}
      {showItem && (
        <div className="absolute z-20 pointer-events-none animate-bounce"
          style={{ left: "45%", bottom: "130px" }}>
          <div className="text-center">
            <div className="text-xl">✨</div>
            <div className="text-yellow-300 text-xs font-mono font-bold" style={{ color: heroColor }}>+XP</div>
          </div>
        </div>
      )}

      {/* Supply crates near tent */}
      <div className="absolute z-[7]" style={{ left: "53%", bottom: "72px" }}>
        <svg width="28" height="24" viewBox="0 0 28 24">
          <rect x="1" y="5" width="26" height="19" rx="2" fill="#6b5030" />
          <rect x="1" y="5" width="26" height="4" rx="2" fill="#8a6a3a" />
          <line x1="14" y1="5" x2="14" y2="24" stroke="#5a4020" strokeWidth="2" />
          <rect x="12" y="11" width="4" height="3" rx="1" fill="#8a7a5a" />
        </svg>
      </div>

      {/* Backpack near hero start */}
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

      {phase === "success" && sceneConfig?.statChange && (
        <div className="absolute top-4 right-4 animate-bounce z-20">
          <span className="bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-mono px-2 py-1 rounded">
            {sceneConfig.statChange}
          </span>
        </div>
      )}

      {/* Hero — walks around the camp */}
      <div className="absolute z-10"
        style={{ left: `${heroX}%`, bottom: "62px", transition: heroTransition }}>
        <GameHero color={heroColor} size={80} animation={heroAnim} flip={heroFlip} />
      </div>

      <StatusMessage phase={phase} successMsg={successMsg}
        failMsg="Code error — check your variables" idleMsg="Write code to set up camp..." />
    </div>
  );
}

// =======================================================
// SCENE 2: MOUNTAIN TRAIL — Cliff Face Climb
// =======================================================

// Perspective trail — vanishing point is high up so it feels like a steep uphill climb
const TRAIL_POSITIONS = [
  { bottom: "18px",  size: 85 },
  { bottom: "65px",  size: 70 },
  { bottom: "108px", size: 57 },
  { bottom: "147px", size: 45 },
  { bottom: "180px", size: 34 },
  { bottom: "207px", size: 24 },
];

function MountainPathPerspective({ scrolling = false }) {
  // Vanishing point high up — creates steep uphill perspective
  const vx = 200, vy = 68;
  const pathL = 55, pathR = 345; // path width at bottom

  return (
    <svg className="absolute inset-0 w-full h-full z-[4]" viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="lWall" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#304255" />
          <stop offset="55%" stopColor="#1c2d40" />
          <stop offset="100%" stopColor="#0c1520" />
        </linearGradient>
        <linearGradient id="rWall" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#304255" />
          <stop offset="55%" stopColor="#1c2d40" />
          <stop offset="100%" stopColor="#0c1520" />
        </linearGradient>
        <linearGradient id="trailSurf" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a2a14" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#6a5030" stopOpacity="0.95" />
        </linearGradient>
        <radialGradient id="vpMist" cx="50%" cy="0%" r="60%">
          <stop offset="0%" stopColor="#1e3a5a" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#1e3a5a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vpGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5a8ab0" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#5a8ab0" stopOpacity="0" />
        </radialGradient>
        <clipPath id="trailClip">
          <polygon points={`${pathL},300 ${pathR},300 ${vx},${vy}`} />
        </clipPath>
      </defs>

      {/* LEFT wall — tall, imposing */}
      <polygon points={`0,300 ${pathL},300 ${vx},${vy} 0,${vy}`} fill="url(#lWall)" />
      {/* Inner shadow on left wall face */}
      <polygon points={`0,300 25,285 ${vx},${vy} 0,140`} fill="#080f18" opacity="0.4" />
      <polygon points={`25,285 ${pathL},300 ${vx},${vy}`} fill="#253545" opacity="0.18" />

      {/* Left wall horizontal rock strata — very prominent due to tall walls */}
      {[0.08,0.18,0.30,0.42,0.55,0.68,0.80,0.91].map((t, i) => {
        const y = vy + t * (300 - vy);
        const x = t * pathL;
        return <line key={i} x1={0} y1={y + (1-t)*5} x2={x} y2={y}
          stroke="#1c2d3e" strokeWidth={0.6 + t} opacity="0.5" />;
      })}
      {/* Left wall highlight edge */}
      <line x1={0} y1={vy} x2={pathL} y2={300} stroke="#3a5060" strokeWidth="1" opacity="0.2" />

      {/* RIGHT wall */}
      <polygon points={`${pathR},300 400,300 400,${vy} ${vx},${vy}`} fill="url(#rWall)" />
      <polygon points={`375,285 400,300 400,140 ${vx},${vy}`} fill="#080f18" opacity="0.35" />
      <polygon points={`${pathR},300 375,285 ${vx},${vy}`} fill="#253545" opacity="0.18" />

      {/* Right wall strata */}
      {[0.08,0.18,0.30,0.42,0.55,0.68,0.80,0.91].map((t, i) => {
        const y = vy + t * (300 - vy);
        const x = pathR + t * (400 - pathR);
        return <line key={i} x1={x} y1={y} x2={400} y2={y + (1-t)*5}
          stroke="#1c2d3e" strokeWidth={0.6 + t} opacity="0.5" />;
      })}
      <line x1={pathR} y1={300} x2={vx} y2={vy} stroke="#3a5060" strokeWidth="1" opacity="0.2" />

      {/* TRAIL SURFACE */}
      <polygon points={`${pathL},300 ${pathR},300 ${vx},${vy}`} fill="url(#trailSurf)" />

      {/* Trail depth lines — tightly packed near vanishing point (steep illusion) */}
      {[0.05,0.13,0.23,0.35,0.48,0.62,0.75,0.86,0.94].map((t, i) => {
        const y = vy + t * (300 - vy);
        const hw = t * (pathR - vx); // half-width at this depth
        return <line key={i} x1={vx - hw} y1={y} x2={vx + hw} y2={y}
          stroke="#9a7848" strokeWidth={t * 1.8} opacity={0.08 + t * 0.14} />;
      })}

      {/* Trail edges — sharp converging lines */}
      <line x1={vx} y1={vy} x2={pathL} y2={300} stroke="#b09060" strokeWidth="1.5" opacity="0.28" />
      <line x1={vx} y1={vy} x2={pathR} y2={300} stroke="#b09060" strokeWidth="1.5" opacity="0.28" />

      {/* BOULDERS left — scaled by perspective distance */}
      <ellipse cx="18"  cy="290" rx="30" ry="15" fill="#182030" />
      <ellipse cx="10"  cy="284" rx="18" ry="9"  fill="#243040" />
      <ellipse cx="80"  cy="252" rx="18" ry="9"  fill="#182030" />
      <ellipse cx="74"  cy="247" rx="10" ry="5"  fill="#243040" />
      <ellipse cx="118" cy="220" rx="11" ry="5.5" fill="#182030" />
      <ellipse cx="140" cy="196" rx="7"  ry="3.5" fill="#182030" />
      <ellipse cx="158" cy="172" rx="4"  ry="2"   fill="#182030" />

      {/* BOULDERS right */}
      <ellipse cx="382" cy="290" rx="28" ry="14" fill="#182030" />
      <ellipse cx="390" cy="284" rx="16" ry="8"  fill="#243040" />
      <ellipse cx="320" cy="252" rx="17" ry="8"  fill="#182030" />
      <ellipse cx="326" cy="247" rx="9"  ry="4.5" fill="#243040" />
      <ellipse cx="282" cy="220" rx="10" ry="5"  fill="#182030" />
      <ellipse cx="260" cy="196" rx="6"  ry="3"  fill="#182030" />
      <ellipse cx="242" cy="172" rx="4"  ry="2"  fill="#182030" />

      {/* VEGETATION left */}
      <line x1="50"  y1="278" x2="50"  y2="265" stroke="#264820" strokeWidth="2.2" />
      <ellipse cx="50"  cy="263" rx="9"  ry="7"  fill="#1a3a16" opacity="0.9" />
      <line x1="100" y1="242" x2="100" y2="232" stroke="#264820" strokeWidth="1.8" />
      <ellipse cx="100" cy="230" rx="7"  ry="5.5" fill="#1a3a16" opacity="0.8" />
      <line x1="132" y1="213" x2="132" y2="205" stroke="#264820" strokeWidth="1.4" />
      <ellipse cx="132" cy="204" rx="5"  ry="4"  fill="#1a3a16" opacity="0.7" />
      <line x1="152" y1="187" x2="152" y2="181" stroke="#264820" strokeWidth="1" />
      <ellipse cx="152" cy="180" rx="3.5" ry="3" fill="#1a3a16" opacity="0.6" />

      {/* VEGETATION right */}
      <line x1="350" y1="278" x2="350" y2="265" stroke="#264820" strokeWidth="2.2" />
      <ellipse cx="350" cy="263" rx="8"  ry="6.5" fill="#1a3a16" opacity="0.85" />
      <line x1="300" y1="242" x2="300" y2="232" stroke="#264820" strokeWidth="1.8" />
      <ellipse cx="300" cy="230" rx="6"  ry="5"  fill="#1a3a16" opacity="0.75" />
      <line x1="268" y1="213" x2="268" y2="205" stroke="#264820" strokeWidth="1.4" />
      <ellipse cx="268" cy="204" rx="4.5" ry="3.5" fill="#1a3a16" opacity="0.65" />

      {/* TREADMILL scrolling lines — animate when hero is walking */}
      {scrolling && (
        <g clipPath="url(#trailClip)">
          {[0,1,2,3,4,5,6,7].map(i => {
            const dur = 2.5;
            const delay = -(i * dur / 8);
            return (
              <line key={`t${i}`} x1={vx} y1={vy} x2={vx} y2={vy} stroke="#c4a870">
                <animate attributeName="x1" values={`${vx};${pathL}`} dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
                <animate attributeName="x2" values={`${vx};${pathR}`} dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
                <animate attributeName="y1" values={`${vy};300`} dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
                <animate attributeName="y2" values={`${vy};300`} dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;0.45;0.35;0" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
                <animate attributeName="stroke-width" values="0.3;3" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
              </line>
            );
          })}
        </g>
      )}

      {/* Atmospheric mist near vanishing point */}
      <ellipse cx={vx} cy={vy + 18} rx="180" ry="28" fill="url(#vpMist)" />

      {/* Summit glow */}
      <ellipse cx={vx} cy={vy} rx="22" ry="10" fill="url(#vpGlow)">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
      </ellipse>

      {/* SUMMIT FLAG — embedded in SVG at vanishing point, tiny and far away */}
      <g transform={`translate(${vx - 3}, ${vy - 18})`}>
        <rect x="0" y="0" width="1.8" height="18" fill="#8a7a60" />
        <polygon points="1.8,0 11,3 1.8,6" fill="#ef4444" opacity="0.95">
          <animateTransform attributeName="transform" type="rotate" values="0,1.8,3;2,1.8,3;0,1.8,3" dur="2.5s" repeatCount="indefinite" />
        </polygon>
      </g>

      {/* Snow on wall tops near vanishing point */}
      <path d={`M 0,${vy} Q 28,${vy-6} ${pathL},${vy+8}`} fill="none" stroke="white" strokeWidth="2" opacity="0.14" />
      <path d={`M 400,${vy} Q 372,${vy-6} ${pathR},${vy+8}`} fill="none" stroke="white" strokeWidth="2" opacity="0.14" />
    </svg>
  );
}

function MountainTrailScene({ phase, heroColor, heroName, hero, gameAction, sceneConfig }) {
  const [stepsClimbed, setStepsClimbed] = useState(0);
  const [items, setItems] = useState([]);
  const [heroAnim, setHeroAnim] = useState("idle");
  const [showPickup, setShowPickup] = useState(false);
  const [pickupEmoji, setPickupEmoji] = useState("💎");

  useEffect(() => {
    if (phase === "success") {
      setHeroAnim("walk");
      const t = setTimeout(() => setHeroAnim("idle"), 900);
      if (gameAction === "heroCollectLoop") {
        const emoji = sceneConfig?.itemEmoji || "💎";
        setItems(prev => [...prev, emoji]);
        setPickupEmoji(emoji);
        setShowPickup(true);
        setTimeout(() => setShowPickup(false), 1300);
      } else {
        setStepsClimbed(prev => prev + 1);
      }
      return () => clearTimeout(t);
    } else if (phase === "fail") {
      setHeroAnim("hurt");
    } else {
      setHeroAnim("idle");
    }
  }, [phase, gameAction, sceneConfig]);

  const totalSteps = TRAIL_POSITIONS.length - 1;
  const step = Math.min(stepsClimbed, totalSteps);

  // Hero stays fixed at base — path scrolls beneath (treadmill)
  const heroPos = TRAIL_POSITIONS[0];

  // Sky darkens gradually as altitude increases
  const altitudeFog = Math.min(stepsClimbed * 0.07, 0.38);

  const successMsg = {
    heroClimbSteps: `${heroName} climbed higher! (${step}/${totalSteps})`,
    heroCollectLoop: `${heroName} collected an item! (${items.length} total)`,
    heroTrainLoop: `${heroName} completed training!`,
    heroStoreData: `Trail data recorded!`,
  }[gameAction] || "Loop complete!";

  return (
    <div className="w-full h-full relative overflow-hidden">
      <SkyBackground night />

      {/* Altitude atmosphere — sky darkens as hero climbs higher */}
      <div className="absolute inset-0 z-[3] pointer-events-none"
        style={{ backgroundColor: `rgba(5, 12, 35, ${altitudeFog})`, transition: "background-color 1.5s ease" }} />

      {/* Trail — scrolling when walking */}
      <MountainPathPerspective scrolling={heroAnim === "walk"} />

      {/* Step progress bar */}
      <div className="absolute bottom-3 left-3 z-20 flex items-end gap-1">
        {[...Array(totalSteps)].map((_, i) => (
          <div key={i} className={`rounded transition-all duration-500 ${
            i < step ? "bg-green-500/70 border border-green-400/40" : "bg-gray-700/40 border border-gray-600/20"
          }`} style={{ width: 14, height: 7 + i * 4 }} />
        ))}
        <span className="text-[10px] text-gray-400 font-mono ml-1">{step}/{totalSteps}</span>
      </div>

      {/* Collected items tray */}
      {items.length > 0 && (
        <div className="absolute top-3 left-3 z-20 flex gap-1 bg-[#161b22]/70 rounded px-2 py-1 border border-[#30363d]/50">
          <span className="text-[10px] text-gray-400 font-mono mr-1">x{items.length}</span>
          {items.slice(-6).map((emoji, i) => (
            <span key={i} style={{ fontSize: "0.75rem" }}>{emoji}</span>
          ))}
        </div>
      )}

      {phase === "success" && <Sparkles heroColor={heroColor} />}

      {/* Floating item pickup animation */}
      {showPickup && (
        <div className="absolute z-20 pointer-events-none"
          style={{ left: "50%", bottom: "130px", animation: "floatUp 1.3s ease-out forwards" }}>
          <span style={{ fontSize: "2rem" }}>{pickupEmoji}</span>
        </div>
      )}

      {/* Hero — stays at base, treadmill gives movement illusion */}
      <div className="absolute z-10"
        style={{ left: "50%", bottom: heroPos.bottom, transform: "translateX(-50%)" }}>
        <GameHero color={heroColor} size={heroPos.size} animation={heroAnim} />
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
  const [showSlash, setShowSlash] = useState(false);
  const [heroAnim, setHeroAnim] = useState("idle");
  const slashRef = useRef(null);

  useEffect(() => {
    if (slashRef.current) clearTimeout(slashRef.current);
    if (phase === "success") {
      setDefeated(prev => prev + 1);
      setHeroAnim("attack");
      setShowSlash(true);
      slashRef.current = setTimeout(() => setShowSlash(false), 600);
    } else if (phase === "fail") {
      setHeroAnim("hurt");
      setShowSlash(false);
    } else {
      setHeroAnim("idle");
      setShowSlash(false);
    }
    return () => { if (slashRef.current) clearTimeout(slashRef.current); };
  }, [phase]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <SkyBackground night />
      {/* Red-tinted danger ground */}
      <div className="absolute bottom-0 left-0 right-0 h-20 z-[5]"
        style={{ background: "linear-gradient(180deg, #3a2525 0%, #2a1818 40%, #1a0f0f 100%)" }} />

      <Rock x={5} scale={0.8} />
      <Rock x={85} scale={0.9} />
      <Rock x={45} scale={0.6} />
      <div className="absolute bottom-16 left-0 right-0 h-12 bg-red-900/5 z-[6]" />

      {/* Hero — lunges forward on attack */}
      <div className={`absolute z-10 transition-all duration-250 ${
        phase === "success" ? "translate-x-14" : phase === "fail" ? "-translate-x-5" : ""
      }`} style={{ left: "10%", bottom: "60px" }}>
        <GameHero color={heroColor} size={85} animation={heroAnim} />
      </div>

      {/* Sword slash impact lines */}
      {showSlash && (
        <div className="absolute z-[15]" style={{ left: "36%", bottom: "65px" }}>
          <svg width="70" height="70" viewBox="0 0 70 70">
            <line x1="8" y1="62" x2="62" y2="8" stroke="white" strokeWidth="3.5" strokeLinecap="round">
              <animate attributeName="opacity" values="1;0" dur="0.45s" fill="freeze" />
            </line>
            <line x1="4" y1="50" x2="54" y2="4" stroke={heroColor} strokeWidth="2.5" strokeLinecap="round">
              <animate attributeName="opacity" values="0.8;0" dur="0.45s" fill="freeze" />
            </line>
            <line x1="14" y1="66" x2="66" y2="18" stroke={heroColor} strokeWidth="1.5" strokeLinecap="round">
              <animate attributeName="opacity" values="0.5;0" dur="0.45s" fill="freeze" />
            </line>
            {/* Impact starburst */}
            <circle cx="35" cy="35" r="10" fill="white" opacity="0.4">
              <animate attributeName="r" values="8;18;8" dur="0.3s" fill="freeze" />
              <animate attributeName="opacity" values="0.4;0" dur="0.4s" fill="freeze" />
            </circle>
          </svg>
        </div>
      )}

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

      {/* Enemy creature — glowing eyes idle, flashes white on hit */}
      <div className={`absolute z-10 transition-all duration-250 ${
        phase === "success" ? "opacity-35 scale-90 translate-x-6" : phase === "fail" ? "scale-110" : ""
      }`} style={{ right: "12%", bottom: "62px" }}>
        <svg width="70" height="80" viewBox="0 0 70 80">
          <ellipse cx="35" cy="75" rx="20" ry="5" fill="black" opacity="0.2" />
          {/* Body */}
          <ellipse cx="35" cy="42" rx="22" ry="26" fill="#6b3a6b" />
          <ellipse cx="28" cy="36" rx="10" ry="16" fill="#7a4a7a" opacity="0.25" />
          {/* Arms */}
          <ellipse cx="13" cy="45" rx="7" ry="5" fill="#5a2a5a" transform="rotate(-20,13,45)" />
          <ellipse cx="57" cy="45" rx="7" ry="5" fill="#5a2a5a" transform="rotate(20,57,45)" />
          {/* Eyes white */}
          <ellipse cx="27" cy="37" rx="7" ry="8" fill="white" opacity={phase === "success" ? "0.2" : "1"} />
          <ellipse cx="43" cy="37" rx="7" ry="8" fill="white" opacity={phase === "success" ? "0.2" : "1"} />
          {/* Red pupils with glow */}
          <circle cx="28" cy="38" r="4" fill="#ff2222" opacity={phase === "success" ? "0.15" : "0.9"} />
          <circle cx="44" cy="38" r="4" fill="#ff2222" opacity={phase === "success" ? "0.15" : "0.9"} />
          {/* Glow animate */}
          {phase === "idle" && (
            <>
              <circle cx="28" cy="38" r="4" fill="#ff4444">
                <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle cx="44" cy="38" r="4" fill="#ff4444">
                <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.1s" repeatCount="indefinite" />
              </circle>
            </>
          )}
          <circle cx="26" cy="36" r="1.5" fill="white" opacity="0.6" />
          <circle cx="42" cy="36" r="1.5" fill="white" opacity="0.6" />
          {/* Mouth with teeth */}
          <path d="M 23,54 Q 35,62 47,54" stroke="#3a1a3a" strokeWidth="2" fill="#3a1a3a" fillOpacity="0.5" />
          <line x1="28" y1="54" x2="28" y2="59" stroke="#2a0a2a" strokeWidth="1.8" />
          <line x1="35" y1="55" x2="35" y2="61" stroke="#2a0a2a" strokeWidth="1.8" />
          <line x1="42" y1="54" x2="42" y2="59" stroke="#2a0a2a" strokeWidth="1.8" />
          {/* Hit flash */}
          {phase === "success" && (
            <ellipse cx="35" cy="42" rx="24" ry="28" fill="white" opacity="0">
              <animate attributeName="opacity" values="0.5;0;0.3;0" dur="0.4s" fill="freeze" />
            </ellipse>
          )}
        </svg>
      </div>

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
// SCENE 4: OBSTACLE — context-aware if/else visuals
// =======================================================
function ObstacleScene({ phase, heroColor, heroName, hero, gameAction, sceneConfig }) {
  const [cleared, setCleared] = useState(0);
  const [heroX, setHeroX] = useState(12);
  const [heroAnim, setHeroAnim] = useState("walk");
  const [heroTransition, setHeroTransition] = useState("none");
  const intervalRef = useRef(null);

  const isSuccess = phase === "success";
  const isFail = phase === "fail";

  useEffect(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }

    if (phase === "idle") {
      setHeroAnim("walk");
      setHeroTransition("none");
      setHeroX(10);
      const maxX = gameAction === "heroForkPath" ? 45 : 33;
      intervalRef.current = setInterval(() => {
        setHeroX(prev => prev >= maxX ? maxX : prev + 0.12);
      }, 60);
    } else if (phase === "success") {
      setCleared(prev => prev + 1);
      setHeroAnim("walk");
      setHeroTransition("left 0.8s ease-in-out");
      setHeroX(gameAction === "heroForkPath" ? 72 : 70);
    } else if (phase === "fail") {
      setHeroAnim("hurt");
      setHeroTransition("left 0.35s ease-out");
      setHeroX(prev => Math.max(prev - 12, 6));
    }

    return () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } };
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const successMsg = {
    heroCheckWeather: `${heroName} reads conditions — right call!`,
    heroForkPath: `${heroName} picks the safer route!`,
    heroObstacle: `${heroName} clears the obstacle!`,
    heroEnergyGate: `${heroName} powers up and charges through!`,
    heroFinalGate: `${heroName} unlocks the gate!`,
  }[gameAction] || `${heroName}'s condition passed!`;

  const failMsg = {
    heroCheckWeather: "Condition is False — check your logic",
    heroForkPath: "Condition is False — wrong path",
    heroObstacle: "Condition is False — can't pass",
    heroEnergyGate: "Not enough energy — hero must rest",
    heroFinalGate: "Condition is False — gate stays locked",
  }[gameAction] || "Condition is False — try again";

  const idleMsg = {
    heroCheckWeather: "Check the weather conditions...",
    heroForkPath: "Evaluate which path is safer...",
    heroObstacle: "Can the hero pass?",
    heroEnergyGate: "Does the hero have enough energy?",
    heroFinalGate: "Does the hero have what it takes?",
  }[gameAction] || "Write conditions to navigate...";

  const heroEl = (
    <div className="absolute z-10" style={{ left: `${heroX}%`, bottom: "60px", transition: heroTransition }}>
      <GameHero color={heroColor} size={82} animation={heroAnim} />
    </div>
  );

  const clearedBadge = cleared > 0 && (
    <div className="absolute top-3 left-3 z-20">
      <span className="text-emerald-400 text-xs font-mono bg-[#161b22]/70 px-2 py-1 rounded border border-emerald-500/20">
        {cleared} cleared
      </span>
    </div>
  );

  // ── WEATHER CHECK: thermometer + dynamic sky + two outcome zones ──────
  if (gameAction === "heroCheckWeather") {
    // Sky: always warm (temp=35 in code), blazing on success, dim red on fail
    const skyBg = isFail
      ? "linear-gradient(180deg, #3b1a1a 0%, #5a2020 40%, #2a1010 100%)"
      : isSuccess
        ? "linear-gradient(180deg, #92400e 0%, #b45309 40%, #78350f 100%)"
        : "linear-gradient(180deg, #4a2a0a 0%, #7c3d0d 50%, #5a2d0a 100%)";

    return (
      <div className="w-full h-full relative overflow-hidden">
        <div className="absolute inset-0 transition-all duration-700" style={{ background: skyBg }} />

        {/* Sun — always visible since temp=35 */}
        <svg className="absolute top-3 right-10 z-10" width="60" height="60" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r={isSuccess ? 14 : 11} fill="#fbbf24" opacity={isSuccess ? "0.95" : "0.55"}>
            {isSuccess && <animate attributeName="r" values="13;17;13" dur="2s" repeatCount="indefinite" />}
          </circle>
          {[0,45,90,135,180,225,270,315].map((a, i) => (
            <line key={i}
              x1={30 + Math.cos(a * Math.PI/180) * 17} y1={30 + Math.sin(a * Math.PI/180) * 17}
              x2={30 + Math.cos(a * Math.PI/180) * 24} y2={30 + Math.sin(a * Math.PI/180) * 24}
              stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity={isSuccess ? "0.85" : "0.4"} />
          ))}
        </svg>

        <Ground variant="rocky" />

        {/* Thermometer — always shows 35° */}
        <div className="absolute z-20" style={{ right: "30%", bottom: "85px" }}>
          <svg width="38" height="115" viewBox="0 0 38 115">
            <circle cx="19" cy="98" r="12" fill="#ef4444" opacity="0.9" />
            <circle cx="19" cy="98" r="7" fill="#fca5a5" opacity="0.65" />
            <rect x="15" y="8" width="8" height="90" rx="4" fill="#374151" opacity="0.5" />
            <rect x="16" y="8" width="6" height="90" rx="3" fill="#1f2937" />
            <rect x="17" y="35" width="4" height="63" rx="2" fill="#ef4444">
              <animate attributeName="y" values="35;30;35" dur="2s" repeatCount="indefinite" />
            </rect>
            {[18, 32, 46, 60, 74, 88].map((y, i) => (
              <line key={i} x1="24" y1={y} x2="30" y2={y} stroke="#6b7280" strokeWidth="1" />
            ))}
            <text x="19" y="5" textAnchor="middle" fill="#fca5a5" fontSize="8" fontFamily="monospace" fontWeight="bold">
              35°
            </text>
          </svg>
        </div>

        {/* Outcome zones — shade tree (if True: too hot → rest) vs mountain path (else → climb) */}
        <div className="absolute z-[8]" style={{ left: "50%", bottom: "60px" }}>
          <svg width="76" height="88" viewBox="0 0 76 88">
            <rect x="34" y="52" width="7" height="30" rx="2" fill="#5c3d1e" />
            <ellipse cx="37" cy="44" rx="24" ry="18" fill="#166534" opacity="0.85" />
            <ellipse cx="37" cy="36" rx="18" ry="14" fill="#15803d" opacity="0.8" />
            {isSuccess && (
              <ellipse cx="37" cy="84" rx="28" ry="5" fill="#22c55e" opacity="0.3">
                <animate attributeName="opacity" values="0.15;0.4;0.15" dur="1.2s" repeatCount="indefinite" />
              </ellipse>
            )}
          </svg>
          <div className={`text-center text-xs font-mono px-2 py-0.5 rounded border transition-all duration-400 ${
            isSuccess ? "text-green-400 border-green-500/40 bg-green-500/10" : "text-gray-600 border-[#30363d]/40"
          }`}>
            {isSuccess ? "✓ rest in shade" : "rest in shade"}
          </div>
        </div>

        <div className="absolute z-[8]" style={{ right: "5%", bottom: "60px" }}>
          <svg width="64" height="78" viewBox="0 0 64 78">
            <polygon points="32,4 4,74 60,74" fill="#374151" opacity="0.65" />
            <polygon points="32,4 18,38 46,38" fill="#4b5563" opacity="0.5" />
            <line x1="32" y1="74" x2="32" y2="28" stroke="#c4a870" strokeWidth="2" strokeDasharray="4,4" opacity="0.4" />
          </svg>
          <div className="text-center text-xs font-mono px-2 py-0.5 rounded border text-gray-600 border-[#30363d]/40">
            keep climbing
          </div>
        </div>

        {/* Code condition panel */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
          <div className="px-2.5 py-1.5 rounded-lg text-xs font-mono border text-orange-400 border-orange-500/30 bg-orange-500/10">
            {sceneConfig?.varDisplay || "temp = 35"}
          </div>
          <div className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all duration-300 ${
            isSuccess ? "text-green-400 border-green-500/30 bg-green-500/10"
            : isFail ? "text-red-400 border-red-500/30 bg-red-500/10"
            : "text-gray-400 border-[#484f58]/60"
          }`}>
            {sceneConfig?.conditionLabel || "if temp > 30:"} {isSuccess ? "✓ True" : isFail ? "✗ False" : "?"}
          </div>
          {isSuccess && (
            <div className="px-2.5 py-1 rounded text-xs font-mono text-orange-300 border border-orange-500/20 bg-orange-500/5">
              {sceneConfig?.successAction || "→ Too hot! Rest."}
            </div>
          )}
        </div>

        {clearedBadge}
        {isSuccess && <Sparkles heroColor={heroColor} />}
        {heroEl}
        <StatusMessage phase={phase} successMsg={successMsg} failMsg={failMsg} idleMsg={idleMsg} />
      </div>
    );
  }

  // ── FORK PATH: ground-level Y-fork with mountains behind ────────────
  if (gameAction === "heroForkPath") {
    // Layout: sky + mountains in top 45%, ground + roads in bottom 55%
    const hz = 130;    // horizon line y — mountains sit above, ground below
    const fy = 195;    // fork y — where the road splits (on the ground)
    const topY = 138;  // where fork roads vanish (just below horizon)

    // Approach road (single lane, narrows toward fork — perspective)
    const apL = 148, apR = 252;    // bottom edges at y=300
    const fkL = 175, fkR = 225;    // road edges at fork (y=fy)

    // Divider tip — the V-point where road splits
    const tipL = 193, tipR = 207;

    // Left fork road (Path A) at horizon y=topY
    const aOut = 82, aIn = 148;    // outer / inner edges
    // Right fork road (Path B) at horizon y=topY
    const bIn = 252, bOut = 318;

    // Center lines for each road segment
    const aCx0 = (fkL + tipL) / 2, aCx1 = (aOut + aIn) / 2;
    const bCx0 = (tipR + fkR) / 2, bCx1 = (bIn + bOut) / 2;

    return (
      <div className="w-full h-full relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full z-[4]" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="yfSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#050a18" />
              <stop offset="60%" stopColor="#0e1a2e" />
              <stop offset="100%" stopColor="#182840" />
            </linearGradient>
            <linearGradient id="yfRoad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2a2418" />
              <stop offset="100%" stopColor="#4e3c28" />
            </linearGradient>
            <linearGradient id="yfForkL" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isSuccess ? "#38120a" : "#2a2418"} />
              <stop offset="100%" stopColor={isSuccess ? "#58261a" : "#4e3c28"} />
            </linearGradient>
            <linearGradient id="yfForkR" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isSuccess ? "#0a2c12" : "#2a2418"} />
              <stop offset="100%" stopColor={isSuccess ? "#144820" : "#4e3c28"} />
            </linearGradient>
            <linearGradient id="yfGnd" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#121a26" />
              <stop offset="100%" stopColor="#0c1520" />
            </linearGradient>
            <linearGradient id="yfMtn" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2c3848" />
              <stop offset="100%" stopColor="#141e2c" />
            </linearGradient>
          </defs>

          {/* ── SKY (upper portion) ── */}
          <rect x="0" y="0" width="400" height={hz + 10} fill="url(#yfSky)" />

          {/* ── STARS ── */}
          {[[30,18],[70,8],[120,28],[160,12],[240,16],[290,10],[340,22],[380,14],[60,42],[310,38],[200,6],[150,50]].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r="1" fill="#8a9ab8" opacity={0.4 + (i % 3) * 0.2} />
          ))}

          {/* ── MOUNTAINS (left range) ── */}
          <polygon points={`0,${hz} 0,55 50,18 95,62 125,38 175,${hz}`} fill="url(#yfMtn)" />
          <polygon points="50,18 36,48 64,48" fill="#3a4a5c" opacity="0.85" />
          <polygon points="125,38 113,62 137,62" fill="#3a4a5c" opacity="0.7" />
          <polygon points={`0,${hz} 0,55 50,18 62,50 30,${hz}`} fill="#080d18" opacity="0.4" />

          {/* ── MOUNTAINS (right range) ── */}
          <polygon points={`225,${hz} 275,38 310,62 350,18 400,55 400,${hz}`} fill="url(#yfMtn)" />
          <polygon points="350,18 338,48 362,48" fill="#3a4a5c" opacity="0.85" />
          <polygon points="275,38 263,62 287,62" fill="#3a4a5c" opacity="0.7" />
          <polygon points={`400,${hz} 400,55 350,18 338,50 370,${hz}`} fill="#080d18" opacity="0.4" />

          {/* ── DISTANT MOUNTAIN (center, behind fork) ── */}
          <polygon points={`165,${hz} 200,75 235,${hz}`} fill="#1a2535" opacity="0.7" />
          <polygon points="200,75 192,95 208,95" fill="#2a3a50" opacity="0.5" />

          {/* ── GROUND PLANE (below horizon) ── */}
          <rect x="0" y={hz} width="400" height={300 - hz} fill="url(#yfGnd)" />

          {/* Horizon glow line */}
          <line x1="0" y1={hz} x2="400" y2={hz} stroke="#2a4a6a" strokeWidth="1.5" opacity="0.3" />

          {/* ── GROUND WEDGE between fork roads (V-shaped terrain) ── */}
          <polygon points={`${aIn},${topY} ${bIn},${topY} ${tipR},${fy} ${tipL},${fy}`} fill="#101a26" />
          {/* Wedge terrain texture */}
          {[0.15, 0.35, 0.55, 0.75, 0.92].map((t, i) => {
            const y = topY + t * (fy - topY);
            const lx = aIn + t * (tipL - aIn);
            const rx = bIn - t * (bIn - tipR);
            return <line key={i} x1={lx} y1={y} x2={rx} y2={y}
              stroke="#1c2c3c" strokeWidth={0.4 + t * 0.6} opacity="0.6" />;
          })}
          {/* Grass tufts in wedge */}
          {[[185,172],[200,160],[215,172],[200,150],[192,165],[208,165]].map(([cx, cy], i) => (
            <g key={i} opacity="0.55">
              <line x1={cx-3} y1={cy} x2={cx-5} y2={cy-6} stroke="#1c3416" strokeWidth="1" />
              <line x1={cx}   y1={cy} x2={cx}   y2={cy-7} stroke="#1c3416" strokeWidth="1" />
              <line x1={cx+3} y1={cy} x2={cx+4} y2={cy-6} stroke="#1c3416" strokeWidth="1" />
            </g>
          ))}

          {/* ── OUTER TERRAIN (left side of left fork → ground) ── */}
          <polygon points={`0,${topY} ${aOut},${topY} ${fkL},${fy} ${apL},300 0,300`} fill="url(#yfGnd)" />
          {/* OUTER TERRAIN (right side of right fork → ground) */}
          <polygon points={`${bOut},${topY} 400,${topY} 400,300 ${apR},300 ${fkR},${fy}`} fill="url(#yfGnd)" />

          {/* ── APPROACH ROAD (single lane, below fork) ── */}
          <polygon points={`${apL},300 ${apR},300 ${fkR},${fy} ${tipR},${fy} ${tipL},${fy} ${fkL},${fy}`}
            fill="url(#yfRoad)" />
          {/* Road outer edge lines */}
          <line x1={apL} y1={300} x2={fkL} y2={fy} stroke="#7a6040" strokeWidth="2.4" opacity="0.9" />
          <line x1={apR} y1={300} x2={fkR} y2={fy} stroke="#7a6040" strokeWidth="2.4" opacity="0.9" />
          {/* Center dashed line on approach */}
          <line x1="200" y1="300" x2="200" y2={fy + 2}
            stroke="#c8b060" strokeWidth="3" strokeDasharray="20 14" opacity="0.8" />
          {/* Approach perspective shading bands */}
          {[0.15, 0.32, 0.50, 0.68, 0.84].map((t, i) => {
            const y = fy + t * (300 - fy);
            const lx = fkL + t * (apL - fkL);
            const rx = fkR + t * (apR - fkR);
            return <line key={i} x1={lx} y1={y} x2={rx} y2={y}
              stroke="#c4a870" strokeWidth={t * 1.5} opacity={0.04 + t * 0.09} />;
          })}

          {/* ── LEFT FORK ROAD (Path A) ── */}
          <polygon points={`${aOut},${topY} ${aIn},${topY} ${tipL},${fy} ${fkL},${fy}`}
            fill="url(#yfForkL)" />
          <line x1={fkL} y1={fy} x2={aOut} y2={topY} stroke="#7a6040" strokeWidth="2" opacity="0.85" />
          <line x1={tipL} y1={fy} x2={aIn}  y2={topY} stroke="#7a6040" strokeWidth="1.8" opacity="0.7" />
          {/* Left fork center dashes */}
          <line x1={aCx0} y1={fy} x2={aCx1} y2={topY}
            stroke="#c8b060" strokeWidth="2" strokeDasharray="10 8" opacity="0.6" />

          {/* ── RIGHT FORK ROAD (Path B) ── */}
          <polygon points={`${bIn},${topY} ${bOut},${topY} ${fkR},${fy} ${tipR},${fy}`}
            fill="url(#yfForkR)" />
          <line x1={tipR} y1={fy} x2={bIn}  y2={topY} stroke="#7a6040" strokeWidth="1.8" opacity="0.7" />
          <line x1={fkR}  y1={fy} x2={bOut} y2={topY} stroke="#7a6040" strokeWidth="2" opacity="0.85" />
          {/* Right fork center dashes */}
          <line x1={bCx0} y1={fy} x2={bCx1} y2={topY}
            stroke="#c8b060" strokeWidth="2" strokeDasharray="10 8" opacity="0.6" />

          {/* ── VEGETATION on left terrain ── */}
          <ellipse cx="50"  cy="250" rx="20" ry="10" fill="#0c1520" opacity="0.8" />
          <line x1="75" y1="225" x2="73" y2="213" stroke="#1c3416" strokeWidth="2.2" />
          <ellipse cx="73" cy="211" rx="10" ry="7" fill="#182e14" opacity="0.8" />
          <line x1="30" y1="210" x2="28" y2="200" stroke="#1c3416" strokeWidth="1.6" />
          <ellipse cx="28" cy="198" rx="7" ry="5" fill="#182e14" opacity="0.7" />
          <ellipse cx="100" cy="260" rx="14" ry="7" fill="#0c1520" opacity="0.7" />

          {/* ── VEGETATION on right terrain ── */}
          <ellipse cx="350" cy="250" rx="20" ry="10" fill="#0c1520" opacity="0.8" />
          <line x1="325" y1="225" x2="327" y2="213" stroke="#1c3416" strokeWidth="2.2" />
          <ellipse cx="327" cy="211" rx="10" ry="7" fill="#182e14" opacity="0.8" />
          <line x1="370" y1="210" x2="372" y2="200" stroke="#1c3416" strokeWidth="1.6" />
          <ellipse cx="372" cy="198" rx="7" ry="5" fill="#182e14" opacity="0.7" />
          <ellipse cx="300" cy="260" rx="14" ry="7" fill="#0c1520" opacity="0.7" />

          {/* ── PATH A SUCCESS GLOW (red — wrong path) ── */}
          {isSuccess && (
            <polygon points={`${aOut},${topY} ${aIn},${topY} ${tipL},${fy} ${fkL},${fy}`} fill="#ef4444" opacity="0.07">
              <animate attributeName="opacity" values="0.03;0.13;0.03" dur="1.2s" repeatCount="indefinite" />
            </polygon>
          )}

          {/* ── PATH B SUCCESS GLOW + SPARKLES (green — correct path) ── */}
          {isSuccess && (
            <>
              <polygon points={`${bIn},${topY} ${bOut},${topY} ${fkR},${fy} ${tipR},${fy}`} fill="#22c55e" opacity="0.1">
                <animate attributeName="opacity" values="0.05;0.18;0.05" dur="1.1s" repeatCount="indefinite" />
              </polygon>
              {[0, 1, 2].map(i => (
                <circle key={i} r="3" fill="#22c55e">
                  <animate attributeName="cx"
                    values={`${bCx0};${bCx0 + (bCx1 - bCx0) * 0.55};${bCx1}`}
                    dur={`${1.3 + i * 0.2}s`} begin={`${i * 0.35}s`} repeatCount="indefinite" />
                  <animate attributeName="cy"
                    values={`${fy - 3};${topY + (fy - topY) * 0.5};${topY + 4}`}
                    dur={`${1.3 + i * 0.2}s`} begin={`${i * 0.35}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0;1;0"
                    dur={`${1.3 + i * 0.2}s`} begin={`${i * 0.35}s`} repeatCount="indefinite" />
                </circle>
              ))}
            </>
          )}

          {/* ── DANGER WARNING on Path A ── */}
          <polygon points={`${aCx1},${topY+6} ${aCx1+7},${topY+18} ${aCx1-7},${topY+18}`}
            fill="#f59e0b" opacity={isSuccess ? "0.2" : "0.9"} />
          <text x={aCx1} y={topY + 16} fill="#1a1200" fontSize="6" textAnchor="middle" fontWeight="bold">!</text>

          {/* ── PATH LABELS ── */}
          <text x={aCx1} y={topY + 2} textAnchor="middle"
            fill={isSuccess ? "#fca5a5" : "#94a3b8"} fontSize="8" fontFamily="monospace" fontWeight="bold">
            PATH A
          </text>
          <text x={bCx1} y={topY + 2} textAnchor="middle"
            fill={isSuccess ? "#86efac" : "#94a3b8"} fontSize="8" fontFamily="monospace" fontWeight="bold">
            PATH B
          </text>

          {/* ── SIGNPOST at fork ── */}
          <rect x="198" y={fy - 48} width="4" height="50" rx="2" fill="#7a5c35" />
          {/* Sign A — angled left */}
          <g transform={`translate(200,${fy - 42}) rotate(-28)`}>
            <rect x="-48" y="-9" width="48" height="18" rx="3"
              fill={isSuccess ? "#4b0808" : "#2d3748"} opacity="0.95" />
            <rect x="-48" y="-9" width="48" height="18" rx="3" fill="none"
              stroke={isSuccess ? "#ef4444" : "#4a5568"} strokeWidth="1.5" opacity="0.9" />
            <text x="-24" y="4" textAnchor="middle" fill={isSuccess ? "#fca5a5" : "#e2e8f0"}
              fontSize="8" fontFamily="monospace" fontWeight="bold">{sceneConfig?.pathALabel || "⚠ A: 7"}</text>
          </g>
          {/* Sign B — angled right */}
          <g transform={`translate(202,${fy - 20}) rotate(23)`}>
            <rect x="0" y="-9" width="48" height="18" rx="3"
              fill={isSuccess ? "#14532d" : "#2d3748"} opacity="0.95" />
            <rect x="0" y="-9" width="48" height="18" rx="3" fill="none"
              stroke={isSuccess ? "#22c55e" : "#4a5568"} strokeWidth="1.5" opacity="0.9" />
            <text x="24" y="4" textAnchor="middle" fill={isSuccess ? "#86efac" : "#e2e8f0"}
              fontSize="8" fontFamily="monospace" fontWeight="bold">{sceneConfig?.pathBLabel || "✓ B: 3"}</text>
          </g>
        </svg>

        {/* Condition panel */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
          <div className="px-2.5 py-1.5 rounded-lg text-xs font-mono border text-violet-400 border-violet-500/30 bg-violet-500/10">
            {sceneConfig?.varDisplay || "a=7 · b=3"}
          </div>
          <div className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all duration-300 ${
            isSuccess ? "text-green-400 border-green-500/30 bg-green-500/10"
            : isFail ? "text-red-400 border-red-500/30 bg-red-500/10"
            : "text-gray-400 border-[#484f58]/60"
          }`}>
            {sceneConfig?.conditionLabel || "if a > b:"} {isSuccess ? "✓ True" : isFail ? "✗ False" : "?"}
          </div>
          {isSuccess && (
            <div className="px-2.5 py-1 rounded text-xs font-mono text-green-300 border border-green-500/20 bg-green-500/5">
              {sceneConfig?.successAction || "→ take path B"}
            </div>
          )}
        </div>

        {clearedBadge}
        {isSuccess && <Sparkles heroColor={heroColor} />}
        {heroEl}
        <StatusMessage phase={phase} successMsg={successMsg} failMsg={failMsg} idleMsg={idleMsg} />
      </div>
    );
  }

  // ── FINAL GATE: mystical gate with key/rune lock ──────────────────────
  if (gameAction === "heroFinalGate") {
    const gateOpen = isSuccess;
    const gateDenied = isFail;
    const barrierColor = gateOpen ? "#22c55e" : gateDenied ? "#ef4444" : "#a855f7";

    return (
      <div className="w-full h-full relative overflow-hidden">
        <SkyBackground />
        <Ground variant="rocky" />
        <Tree x={2} scale={0.75} />
        <Tree x={88} scale={0.65} />
        <Rock x={75} scale={0.5} />

        <svg className="absolute bottom-0 left-0 w-full z-[5]" viewBox="0 0 400 80" preserveAspectRatio="none" style={{ height: "38%" }}>
          <path d="M 0,65 Q 150,58 400,52" stroke="#7a6a50" strokeWidth="22" fill="none" opacity="0.22" strokeLinecap="round" />
          {gateOpen && (
            <path d="M 0,65 Q 150,58 400,52" stroke="#22c55e" strokeWidth="6" fill="none" opacity="0.3">
              <animate attributeName="opacity" values="0.1;0.4;0.1" dur="0.8s" repeatCount="indefinite" />
            </path>
          )}
        </svg>

        {/* Gate structure */}
        <div className="absolute z-[9]" style={{ left: "50%", bottom: "68px", transform: "translateX(-50%)" }}>
          <svg width="104" height="120" viewBox="0 0 104 120">
            <ellipse cx="52" cy="104" rx="48" ry="8" fill={barrierColor} opacity="0.1">
              <animate attributeName="opacity" values="0.05;0.18;0.05" dur={gateDenied ? "0.3s" : "2.5s"} repeatCount="indefinite" />
            </ellipse>
            {/* Left pillar */}
            <rect x="3" y="14" width="18" height="100" rx="3" fill="#5a4a38" />
            <rect x="3" y="14" width="7" height="100" rx="3" fill="#7a6a58" opacity="0.35" />
            <rect x="0" y="6" width="24" height="10" rx="2" fill="#8a7a62" />
            {/* Right pillar */}
            <rect x="83" y="14" width="18" height="100" rx="3" fill="#5a4a38" />
            <rect x="83" y="14" width="7" height="100" rx="3" fill="#7a6a58" opacity="0.35" />
            <rect x="80" y="6" width="24" height="10" rx="2" fill="#8a7a62" />
            {/* Arch header */}
            <rect x="3" y="6" width="98" height="12" rx="4" fill="#6a5a45" />
            {/* Lock / energy barrier */}
            {!gateOpen && (
              <>
                <rect x="22" y="18" width="60" height="98" fill={barrierColor} opacity={gateDenied ? "0" : "0.07"}>
                  {!gateDenied && <animate attributeName="opacity" values="0.04;0.13;0.04" dur="2s" repeatCount="indefinite" />}
                </rect>
                {[0,1,2,3,4].map(i => (
                  <rect key={i} x={25 + i * 11} y="18" width="4" height="98" rx="2"
                    fill={barrierColor} opacity={gateDenied ? "0" : "0.45"}>
                    {!gateDenied && <animate attributeName="opacity" values="0.25;0.55;0.25" dur={`${1.4+i*0.2}s`} repeatCount="indefinite" />}
                    {gateDenied && <animate attributeName="opacity" values="0.6;0;0" dur="0.35s" repeatCount="1" fill="freeze" />}
                  </rect>
                ))}
                {/* Padlock */}
                <rect x="43" y="60" width="18" height="14" rx="3" fill={gateDenied ? "#7f1d1d" : "#581c87"} opacity="0.85" />
                <path d="M 47 60 Q 47 50 52 50 Q 57 50 57 60" stroke={barrierColor} strokeWidth="3.5" fill="none" opacity="0.8" strokeLinecap="round" />
                <circle cx="52" cy="67" r="3" fill={barrierColor} opacity="0.6" />
              </>
            )}
            {gateOpen && (
              <>
                <circle cx="52" cy="60" r="20" fill="#22c55e" opacity="0.1">
                  <animate attributeName="r" values="10;24;10" dur="0.7s" repeatCount="indefinite" />
                </circle>
                {[0,1,2,3].map(i => (
                  <circle key={i} cx={34 + i * 13} cy={32 + i * 10} r="2.5" fill="#22c55e" opacity="0.8">
                    <animate attributeName="cy" values={`${32+i*10};${12+i*7};${32+i*10}`} dur={`${0.65+i*0.12}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0;0.8" dur={`${0.65+i*0.12}s`} repeatCount="indefinite" />
                  </circle>
                ))}
              </>
            )}
          </svg>

          <div className={`absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg text-xs font-mono border whitespace-nowrap transition-all duration-400 ${
            gateOpen ? "text-green-400 border-green-500/40 bg-green-500/10"
            : gateDenied ? "text-red-400 border-red-500/40 bg-red-500/10"
            : "text-violet-400 border-violet-500/40 bg-violet-500/10"
          }`}>
            {gateOpen ? "✓ unlocked!" : gateDenied ? "✗ access denied" : (sceneConfig?.conditionLabel || "if condition is True?")}
          </div>
        </div>

        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
          {sceneConfig?.varDisplay && (
            <div className="px-2 py-1 rounded text-xs font-mono border text-violet-400 border-violet-500/30 bg-violet-500/10">
              {sceneConfig.varDisplay}
            </div>
          )}
          <div className={`px-2 py-1 rounded text-xs font-mono border transition-all duration-300 ${
            gateOpen ? "text-green-400 border-green-500/30 bg-green-500/10" : "text-gray-600 border-[#30363d]/40"
          }`}>if True: → gate opens ✓</div>
          <div className={`px-2 py-1 rounded text-xs font-mono border transition-all duration-300 ${
            gateDenied ? "text-red-400 border-red-500/30 bg-red-500/10" : "text-gray-600 border-[#30363d]/40"
          }`}>else: → gate locked ✗</div>
        </div>

        {clearedBadge}
        {isSuccess && <Sparkles heroColor={heroColor} />}
        {heroEl}
        <StatusMessage phase={phase} successMsg={successMsg} failMsg={failMsg} idleMsg={idleMsg} />
      </div>
    );
  }

  // ── ENERGY GATE: stamina check with visible energy bar on hero ───────
  if (gameAction === "heroEnergyGate") {
    const heroEnergy = 15;
    const requiredEnergy = 20;
    const gateColor = isSuccess ? "#22c55e" : isFail ? "#ef4444" : "#a855f7";

    // Hero with floating energy meter above
    const heroWithMeter = (
      <div className="absolute z-10" style={{ left: `${heroX}%`, bottom: "58px", transition: heroTransition }}>
        <div className="flex justify-center mb-1">
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border transition-all duration-700 ${
            isSuccess ? "border-green-500/50 bg-green-500/10" : "border-amber-500/40 bg-[#0d1117]/80"
          }`}>
            <span className={`text-xs ${isSuccess ? "text-green-400" : "text-amber-400"}`}>⚡</span>
            <div className="h-1.5 rounded-full bg-[#30363d] overflow-hidden" style={{ width: "38px" }}>
              <div className={`h-full rounded-full transition-all duration-700 ${isSuccess ? "bg-green-500" : "bg-amber-500"}`}
                style={{ width: isSuccess ? "100%" : `${(heroEnergy / requiredEnergy) * 100}%` }} />
            </div>
            <span className={`text-xs font-mono font-bold ${isSuccess ? "text-green-400" : "text-amber-400"}`}>
              {isSuccess ? `${requiredEnergy}` : `${heroEnergy}`}
            </span>
          </div>
        </div>
        <GameHero color={heroColor} size={82} animation={heroAnim} />
      </div>
    );

    return (
      <div className="w-full h-full relative overflow-hidden">
        <SkyBackground />
        <Ground variant="rocky" />
        <Tree x={3} scale={0.7} />
        <Tree x={86} scale={0.65} />

        <svg className="absolute bottom-0 left-0 w-full z-[5]" viewBox="0 0 400 80" preserveAspectRatio="none" style={{ height: "38%" }}>
          <path d="M 0,65 Q 150,58 400,52" stroke="#7a6a50" strokeWidth="22" fill="none" opacity="0.22" strokeLinecap="round" />
          {isSuccess && (
            <path d="M 0,65 Q 150,58 400,52" stroke="#22c55e" strokeWidth="5" fill="none" opacity="0.35">
              <animate attributeName="opacity" values="0.1;0.5;0.1" dur="0.7s" repeatCount="indefinite" />
            </path>
          )}
        </svg>

        {/* Energy gate */}
        <div className="absolute z-[9]" style={{ left: "50%", bottom: "62px", transform: "translateX(-50%)" }}>
          <svg width="112" height="108" viewBox="0 0 112 108">
            <ellipse cx="56" cy="104" rx="46" ry="5" fill="#000" opacity="0.18" />
            {/* Left pillar */}
            <rect x="4" y="8" width="20" height="96" rx="3" fill="#4a3a28" />
            <rect x="4" y="2" width="22" height="10" rx="2" fill="#6a5a42" />
            <rect x="4" y="8" width="8" height="96" fill="#5a4a32" opacity="0.35" />
            {/* Right pillar */}
            <rect x="88" y="8" width="20" height="96" rx="3" fill="#4a3a28" />
            <rect x="86" y="2" width="22" height="10" rx="2" fill="#6a5a42" />
            <rect x="88" y="8" width="8" height="96" fill="#5a4a32" opacity="0.35" />
            {/* Energy bars (hidden on success) */}
            {!isSuccess && [0,1,2,3,4,5].map(i => (
              <rect key={i} x="24" y={12 + i * 15} width="64" height="8" rx="4"
                fill={gateColor} opacity={isFail ? "0" : "0.55"}>
                {!isFail && <animate attributeName="opacity" values="0.3;0.7;0.3" dur={`${0.8 + i * 0.13}s`} repeatCount="indefinite" />}
                {isFail && <animate attributeName="opacity" values="0.7;0;0" dur="0.25s" repeatCount="1" fill="freeze" />}
              </rect>
            ))}
            {/* "Need: 20" badge on gate */}
            {!isSuccess && (
              <>
                <rect x="22" y="44" width="68" height="22" rx="5" fill="#0d1117" opacity="0.88" />
                <text x="56" y="58" textAnchor="middle" fill={gateColor} fontSize="11" fontFamily="monospace" fontWeight="bold">⚡ Need: {requiredEnergy}</text>
              </>
            )}
            {/* Success open-gate glow */}
            {isSuccess && (
              <>
                <ellipse cx="56" cy="54" rx="22" ry="30" fill="#22c55e" opacity="0.08">
                  <animate attributeName="ry" values="20;34;20" dur="0.65s" repeatCount="indefinite" />
                </ellipse>
                {[0,1,2,3].map(i => (
                  <circle key={i} cx={32 + i * 16} cy={24 + i * 14} r="2.5" fill="#22c55e" opacity="0.75">
                    <animate attributeName="cy" values={`${24+i*14};${8+i*10};${24+i*14}`} dur={`${0.55+i*0.1}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.75;0;0.75" dur={`${0.55+i*0.1}s`} repeatCount="indefinite" />
                  </circle>
                ))}
              </>
            )}
          </svg>

          {/* Gate status label */}
          <div className={`absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg text-xs font-mono border whitespace-nowrap transition-all duration-400 ${
            isSuccess ? "text-green-400 border-green-500/40 bg-green-500/10"
            : isFail ? "text-red-400 border-red-500/40 bg-red-500/10"
            : "text-violet-400 border-violet-500/40 bg-violet-500/10"
          }`}>
            {isSuccess ? `✓ ${heroEnergy} → ${requiredEnergy} — gate open!` : isFail ? `✗ ${heroEnergy} < ${requiredEnergy}` : `energy gate · need ${requiredEnergy}`}
          </div>
        </div>

        {/* Right panel */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
          <div className="px-2.5 py-1.5 rounded-lg text-xs font-mono border text-violet-400 border-violet-500/30 bg-violet-500/10">
            {sceneConfig?.varDisplay || "energy = 15"}
          </div>
          <div className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all duration-300 ${
            isSuccess ? "text-green-400 border-green-500/30 bg-green-500/10"
            : isFail ? "text-red-400 border-red-500/30 bg-red-500/10"
            : "text-gray-500 border-[#30363d]/40"
          }`}>
            {sceneConfig?.conditionLabel || "if energy >= 20:"} {isSuccess ? "✓" : isFail ? "✗" : "?"}
          </div>
          {isSuccess && (
            <div className="px-2.5 py-1 rounded text-xs font-mono text-green-300 border border-green-500/20 bg-green-500/5">
              {sceneConfig?.successAction || "→ charges ahead!"}
            </div>
          )}
        </div>

        {clearedBadge}
        {isSuccess && <Sparkles heroColor={heroColor} />}
        {heroWithMeter}
        <StatusMessage phase={phase} successMsg={successMsg} failMsg={failMsg} idleMsg={idleMsg} />
      </div>
    );
  }

  // ── OBSTACLE BLOCKER (default — energy / stat check with boulder) ─────
  return (
    <div className="w-full h-full relative overflow-hidden">
      <SkyBackground />
      <Ground variant="rocky" />
      <Tree x={4} scale={0.7} />
      <Tree x={84} scale={0.62} />
      <Rock x={68} scale={0.5} />

      <svg className="absolute bottom-0 left-0 w-full z-[5]" viewBox="0 0 400 80" preserveAspectRatio="none" style={{ height: "38%" }}>
        <path d="M 0,65 Q 150,58 400,52" stroke="#7a6a50" strokeWidth="22" fill="none" opacity="0.22" strokeLinecap="round" />
        {isSuccess && (
          <path d="M 0,65 Q 150,58 400,52" stroke="#22c55e" strokeWidth="5" fill="none" opacity="0.35">
            <animate attributeName="opacity" values="0.1;0.5;0.1" dur="0.7s" repeatCount="indefinite" />
          </path>
        )}
      </svg>

      {/* Boulder obstacle */}
      <div className="absolute z-[9]" style={{ left: "48%", bottom: "64px", transform: "translateX(-50%)" }}>
        <svg width="96" height="84" viewBox="0 0 96 84">
          <ellipse cx="48" cy="78" rx="40" ry="7" fill="#000" opacity="0.22" />
          <ellipse cx="48" cy="48" rx="40" ry="34"
            fill={isSuccess ? "#374151" : isFail ? "#7f1d1d" : "#4b5563"} />
          <ellipse cx="48" cy="48" rx="40" ry="34" fill="none"
            stroke={isSuccess ? "#6b7280" : isFail ? "#991b1b" : "#6b7280"} strokeWidth="2" opacity="0.4" />
          <ellipse cx="40" cy="38" rx="13" ry="9" fill="#374151" opacity="0.5" />
          <ellipse cx="58" cy="54" rx="10" ry="7" fill="#374151" opacity="0.4" />
          {/* X when blocking */}
          {!isSuccess && !isFail && (
            <>
              <line x1="34" y1="34" x2="62" y2="62" stroke="#ef4444" strokeWidth="3.5" opacity="0.55" strokeLinecap="round" />
              <line x1="62" y1="34" x2="34" y2="62" stroke="#ef4444" strokeWidth="3.5" opacity="0.55" strokeLinecap="round" />
            </>
          )}
          {/* Crack on success */}
          {isSuccess && (
            <path d="M 44 18 L 39 42 L 46 53 L 42 74" stroke="#9ca3af" strokeWidth="1.5" fill="none" opacity="0.7">
              <animate attributeName="opacity" values="0;0.8;0.7" dur="0.4s" repeatCount="1" fill="freeze" />
            </path>
          )}
        </svg>

        <div className={`absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg text-xs font-mono border whitespace-nowrap transition-all duration-400 ${
          isSuccess ? "text-green-400 border-green-500/40 bg-green-500/10"
          : isFail ? "text-red-400 border-red-500/40 bg-red-500/10"
          : "text-violet-400 border-violet-500/40 bg-violet-500/10"
        }`}>
          {isSuccess ? "✓ True — path cleared!" : isFail ? "✗ False — blocked!" : "if condition?"}
        </div>
      </div>

      {/* Condition panel */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
        <div className="px-2.5 py-1.5 rounded-lg text-xs font-mono border text-violet-400 border-violet-500/30 bg-violet-500/10">
          {sceneConfig?.varDisplay || "energy = 15"}
        </div>
        <div className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all duration-300 ${
          isSuccess ? "text-green-400 border-green-500/30 bg-green-500/10"
          : isFail ? "text-red-400 border-red-500/30 bg-red-500/10"
          : "text-gray-500 border-[#30363d]/40"
        }`}>
          {sceneConfig?.conditionLabel || "if energy >= 20:"} {isSuccess ? "✓" : isFail ? "✗" : "?"}
        </div>
        {isSuccess && (
          <div className="px-2.5 py-1 rounded text-xs font-mono text-green-300 border border-green-500/20 bg-green-500/5">
            {sceneConfig?.successAction || "→ charges ahead!"}
          </div>
        )}
      </div>

      {clearedBadge}
      {isSuccess && <Sparkles heroColor={heroColor} />}
      {heroEl}
      <StatusMessage phase={phase} successMsg={successMsg} failMsg={failMsg} idleMsg={idleMsg} />
    </div>
  );
}

export default GameScene;
