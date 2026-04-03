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
  const heroAvatarId = hero?.avatarId || "m01";
  const sceneProps = { phase, heroColor, heroName, heroAvatarId, hero, gameAction, sceneConfig };

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
function BaseCampScene({ phase, heroColor, heroName, heroAvatarId, hero, gameAction, sceneConfig }) {
  const [heroX, setHeroX] = useState(25);
  const [heroY, setHeroY] = useState(0);   // vertical offset in px for natural path
  const [heroFlip, setHeroFlip] = useState(false);
  const [heroAnim, setHeroAnim] = useState("walk");
  const [heroTransition, setHeroTransition] = useState("none");
  const [chestOpen, setChestOpen] = useState(false);
  const [showItem, setShowItem] = useState(false);
  const goingRight = useRef(true);
  const stepCount = useRef(0);
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
      stepCount.current = 0;
      setHeroFlip(false);

      intervalRef.current = setInterval(() => {
        stepCount.current += 1;
        // Natural Y-axis wander: gentle sine-like path so hero moves diagonally
        const yOffset = Math.sin(stepCount.current * 0.06) * 8;
        setHeroY(yOffset);

        setHeroX(prev => {
          const speed = 0.22 + Math.abs(Math.cos(stepCount.current * 0.04)) * 0.1; // variable speed
          const next = prev + (goingRight.current ? speed : -speed);
          if (next >= 38) { goingRight.current = false; setHeroFlip(true); }
          else if (next <= 17) { goingRight.current = true; setHeroFlip(false); }
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

      {/* Hero — walks around the camp with natural path */}
      <div className="absolute z-10"
        style={{ left: `${heroX}%`, bottom: `${62 - heroY}px`, transition: heroTransition }}>
        <GameHero color={heroColor} size={80} animation={heroAnim} flip={heroFlip} avatarId={heroAvatarId} />
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

function MountainTrailScene({ phase, heroColor, heroName, heroAvatarId, hero, gameAction, sceneConfig }) {
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
        <GameHero color={heroColor} size={heroPos.size} animation={heroAnim} avatarId={heroAvatarId} />
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
function BattleScene({ phase, heroColor, heroName, heroAvatarId, hero, gameAction, sceneConfig }) {
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
        <GameHero color={heroColor} size={85} animation={heroAnim} avatarId={heroAvatarId} />
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
function ObstacleScene({ phase, heroColor, heroName, heroAvatarId, hero, gameAction, sceneConfig }) {
  const [cleared, setCleared] = useState(0);
  const [heroX, setHeroX] = useState(12);
  const [heroAnim, setHeroAnim] = useState("walk");
  const [heroTransition, setHeroTransition] = useState("none");
  const intervalRef = useRef(null);
  const timerRef = useRef(null);

  const isSuccess = phase === "success";
  const isFail = phase === "fail";

  useEffect(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }

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
      // Weather check: hero walks to the shade tree (not forward past it)
      const targetX = gameAction === "heroForkPath" ? 72
        : gameAction === "heroCheckWeather" ? 34
        : 70;
      setHeroAnim("walk");
      setHeroTransition("left 0.9s ease-in-out");
      setHeroX(targetX);
      // After arriving at tree, switch to idle (resting) animation
      if (gameAction === "heroCheckWeather") {
        timerRef.current = setTimeout(() => setHeroAnim("idle"), 1000);
      }
    } else if (phase === "fail") {
      setHeroAnim("hurt");
      setHeroTransition("left 0.35s ease-out");
      setHeroX(prev => Math.max(prev - 12, 6));
    }

    return () => {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    };
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const successMsg = {
    heroCheckWeather: `${heroName} reads conditions — right call!`,
    heroForkPath: `${heroName} picks the safer route!`,
    heroObstacle: `${heroName} clears the obstacle!`,
    heroFinalGate: `${heroName} unlocks the gate!`,
  }[gameAction] || `${heroName}'s condition passed!`;

  const failMsg = {
    heroCheckWeather: "Condition is False — check your logic",
    heroForkPath: "Condition is False — wrong path",
    heroObstacle: "Condition is False — can't pass",
    heroFinalGate: "Condition is False — gate stays locked",
  }[gameAction] || "Condition is False — try again";

  const idleMsg = {
    heroCheckWeather: "Check the weather conditions...",
    heroForkPath: "Evaluate which path is safer...",
    heroObstacle: "Can the hero pass?",
    heroFinalGate: "Does the hero have what it takes?",
  }[gameAction] || "Write conditions to navigate...";

  const heroEl = (
    <div className="absolute z-10" style={{ left: `${heroX}%`, bottom: "60px", transition: heroTransition }}>
      <GameHero color={heroColor} size={82} animation={heroAnim} avatarId={heroAvatarId} />
    </div>
  );

  const clearedBadge = cleared > 0 && (
    <div className="absolute top-3 left-3 z-20">
      <span className="text-emerald-400 text-xs font-mono bg-[#161b22]/70 px-2 py-1 rounded border border-emerald-500/20">
        {cleared} cleared
      </span>
    </div>
  );

  // ── WEATHER CHECK — Mountain Trail with Rocky Shelter ──────────────
  if (gameAction === "heroCheckWeather") {
    const skyBg = isFail
      ? "linear-gradient(180deg, #0e0202 0%, #240505 55%, #160905 100%)"
      : isSuccess
        ? "linear-gradient(180deg, #091422 0%, #152e4a 40%, #1e4260 58%, #7a3e18 82%, #3e1c08 100%)"
        : "linear-gradient(180deg, #0d1c30 0%, #1a2e4a 38%, #284462 56%, #8a4c1e 80%, #4e2208 100%)";

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: skyBg, transition: "background 0.8s ease" }}>

        {/* ══ ONE COHESIVE SCENE SVG ══
            viewBox 800x300, preserveAspectRatio="none" — y scales 1:1 with container.
            SVG y=235 aligns with CSS bottom=65px (top of ground strip).
            Cliff, overhang, trees, boulders all live here as one integrated scene. */}
        <svg className="absolute inset-0 w-full h-full z-[2]" viewBox="0 0 800 300" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cwCliff" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#141008" />
              <stop offset="55%" stopColor="#221a0e" />
              <stop offset="100%" stopColor="#302410" />
            </linearGradient>
            <linearGradient id="cwLedge" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2a2010" />
              <stop offset="100%" stopColor="#181208" />
            </linearGradient>
          </defs>

          {/* ── Faint distant ridge silhouettes (atmospheric, barely visible) ── */}
          <polygon points="0,238 62,198 128,215 210,182 295,205 385,170 472,196 558,163 645,190 730,160 800,178 800,245 0,245"
            fill="#1a2e48" opacity="0.2" />
          <polygon points="0,248 52,220 118,236 195,205 278,226 368,192 455,218 542,186 628,212 712,182 800,200 800,252 0,252"
            fill="#12203a" opacity="0.28" />

          {/* ── Sun: small, upper-center sky, feels truly distant ── */}
          <circle cx="165" cy="58" r="11" fill="#fbbf24" opacity="0.88" />
          <circle cx="165" cy="58" r="19" fill="#fb923c" opacity="0.09">
            <animate attributeName="r" values="17;23;17" dur="4s" repeatCount="indefinite" />
          </circle>
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * 45) * Math.PI / 180;
            return <line key={i} x1={165 + Math.cos(a)*13} y1={58 + Math.sin(a)*13} x2={165 + Math.cos(a)*22} y2={58 + Math.sin(a)*22} stroke="#fde68a" strokeWidth="1.3" opacity="0.5" />;
          })}
          {/* Thermometer beside sun */}
          <g transform="translate(188, 46)">
            <circle cx="5" cy="23" r="4" fill="#ef4444" />
            <rect x="2.5" y="2" width="5" height="21" rx="2.5" fill="#374151" />
            <rect x="3.5" y="4" width="3" height="17" rx="1.5" fill="#ef4444">
              <animate attributeName="height" values="17;11;17" dur="2.8s" repeatCount="indefinite" />
              <animate attributeName="y" values="4;10;4" dur="2.8s" repeatCount="indefinite" />
            </rect>
            <text x="5" y="1" textAnchor="middle" fill="#fca5a5" fontSize="6" fontFamily="monospace">35°</text>
          </g>

          {/* ══ LEFT CLIFF FACE: rocky wall anchored to scene, runs full height ══ */}
          <polygon points="0,300 0,0 48,0 64,22 56,65 76,52 84,98 70,145 86,134 94,182 76,225 60,240 0,240"
            fill="url(#cwCliff)" />
          {/* Rock texture: cracks and strata */}
          <path d="M 18,38 Q 38,50 28,84 Q 18,116 32,132" stroke="#0c0806" strokeWidth="1.8" fill="none" opacity="0.5" />
          <path d="M 42,16 Q 56,30 52,56 Q 48,80 58,94" stroke="#0c0806" strokeWidth="1.5" fill="none" opacity="0.42" />
          <path d="M 10,116 Q 22,130 16,160 Q 10,186 24,210" stroke="#0c0806" strokeWidth="1.5" fill="none" opacity="0.4" />
          <path d="M 0,76 Q 32,73 54,78 Q 74,80 86,76" stroke="#1a1408" strokeWidth="1.2" fill="none" opacity="0.55" />
          <path d="M 0,136 Q 30,132 60,138 Q 78,140 92,136" stroke="#1a1408" strokeWidth="1.2" fill="none" opacity="0.5" />
          <path d="M 0,192 Q 26,188 54,195 Q 70,198 80,194" stroke="#1a1408" strokeWidth="1.2" fill="none" opacity="0.45" />
          {/* Moss on cliff face */}
          {[[5,64],[14,94],[6,124],[16,154],[5,184],[12,210]].map(([x,y],i) => (
            <ellipse key={i} cx={x} cy={y} rx={8} ry={3.5} fill="#1a3808" opacity={0.4} />
          ))}

          {/* ══ ROCKY OVERHANG: short thick rock slab growing from cliff ══ */}
          {/* Only ~155 units wide — clearly a slab of rock, not a plank */}
          {/* Main slab body — thick enough to read as a rock */}
          <polygon points="0,112 155,100 168,116 165,148 158,162 145,170 0,175"
            fill="url(#cwLedge)" />
          {/* Top surface lighter */}
          <polygon points="0,112 155,100 168,116 0,120"
            fill="#3e3220" opacity="0.7" />
          {/* Jagged underside — looks like rock, not a board */}
          <path d="M 0,168 L 18,162 L 36,172 L 55,164 L 76,174 L 95,165 L 115,170 L 135,162 L 150,168 L 158,162 L 165,148"
            fill="#141008" stroke="none" />
          {/* Deep shadow cast by overhang onto cliff face below */}
          <polygon points="0,172 165,148 165,175 0,185"
            fill="#050302" opacity="0.82" />
          {/* Crack lines on slab face */}
          {[[62,122,80,148],[100,118,115,144],[132,114,145,140]].map(([x1,y1,x2,y2],i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0a0804" strokeWidth={1.5} opacity={0.52} />
          ))}
          <path d="M 0,138 Q 80,130 160,120" stroke="#0a0804" strokeWidth="0.8" fill="none" opacity="0.4" />
          {/* Water drips from slab edge */}
          {[58,102,138].map((x,i) => (
            <circle key={i} cx={x} cy={168} r={1.8} fill="#5a9ab0" opacity={0.38}>
              <animate attributeName="cy" values={`${168};${190};${168}`} dur={`${2.6+i*0.55}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.38;0;0.38" dur={`${2.6+i*0.55}s`} repeatCount="indefinite" />
            </circle>
          ))}
          {/* Dappled light under slab on success */}
          {isSuccess && [[22,180],[58,177],[96,174],[130,171]].map(([x,y],i) => (
            <ellipse key={i} cx={x} cy={y} rx={5} ry={2.5} fill="#fde68a" opacity={0.1}>
              <animate attributeName="opacity" values="0.04;0.2;0.04" dur={`${1.2+i*0.4}s`} repeatCount="indefinite" />
            </ellipse>
          ))}

          {/* ══ PINE TREES — properly scaled, standing alongside trail ══ */}
          {/* Bases at y=235 (ground level), ground strip (CSS z-5) covers their base roots */}
          {/* Far/small trees — right background */}
          {[[710,235,0.30],[748,235,0.26],[776,235,0.23]].map(([tx,ty,sc],i) => (
            <g key={`ft${i}`} transform={`translate(${tx},${ty}) scale(${sc})`}>
              <rect x="-5" y="-52" width="10" height="52" fill="#5c3212" rx="1" />
              <polygon points="0,-145 -32,-60 32,-60" fill="#1a4818" />
              <polygon points="0,-112 -42,-28 42,-28" fill="#1e5620" />
              <polygon points="0,-74 -52,0 52,0" fill="#165222" />
            </g>
          ))}
          {/* Mid-distance trees */}
          {[[572,235,0.43],[614,235,0.40],[650,235,0.37],[505,235,0.46]].map(([tx,ty,sc],i) => (
            <g key={`mt${i}`} transform={`translate(${tx},${ty}) scale(${sc})`}>
              <rect x="-5" y="-52" width="10" height="52" fill="#5c3212" rx="1" />
              <polygon points="0,-145 -32,-60 32,-60" fill="#1a4818" />
              <polygon points="0,-112 -42,-28 42,-28" fill="#1e5620" />
              <polygon points="0,-74 -52,0 52,0" fill="#165222" />
            </g>
          ))}
          {/* Larger closer trees — more prominent, right side */}
          {[[436,235,0.60],[466,235,0.55]].map(([tx,ty,sc],i) => (
            <g key={`lt${i}`} transform={`translate(${tx},${ty}) scale(${sc})`}>
              <rect x="-6" y="-54" width="12" height="54" fill="#5c3212" rx="2" />
              <polygon points="0,-152 -36,-62 36,-62" fill="#184818" />
              <polygon points="0,-118 -46,-28 46,-28" fill="#1c561e" />
              <polygon points="0,-78 -58,0 58,0" fill="#155020" />
            </g>
          ))}
          {/* Trees visible past cliff edge */}
          {[[392,235,0.48],[360,235,0.42]].map(([tx,ty,sc],i) => (
            <g key={`cl${i}`} transform={`translate(${tx},${ty}) scale(${sc})`}>
              <rect x="-5" y="-52" width="10" height="52" fill="#5c3212" rx="1" />
              <polygon points="0,-145 -32,-60 32,-60" fill="#1a4818" />
              <polygon points="0,-112 -42,-28 42,-28" fill="#1e5620" />
              <polygon points="0,-74 -52,0 52,0" fill="#165222" />
            </g>
          ))}

          {/* ══ BOULDERS on trail edges ══ */}
          {[[408,228,1.0],[470,231,0.82],[534,226,0.92],[598,229,0.76],[662,227,0.88],[724,231,0.72]].map(([bx,by,sc],i) => (
            <g key={i} transform={`translate(${bx},${by}) scale(${sc})`}>
              <ellipse cx="0" cy="0" rx="16" ry="9" fill="#241c0c" />
              <ellipse cx="-5" cy="-3" rx="9" ry="5" fill="#2e2412" opacity="0.55" />
              <ellipse cx="5" cy="2" rx="7" ry="4" fill="#1a1408" opacity="0.45" />
            </g>
          ))}
        </svg>

        {/* ══ CSS GROUND STRIP — rocky mountain trail, hero walks here ══ */}
        {/* z-5 renders above scene SVG. Hero bottom:60px sits 5px into this 65px strip. */}
        <div className="absolute bottom-0 left-0 right-0 z-[5]" style={{ height: "65px" }}>
          <svg width="100%" height="65" viewBox="0 0 800 65" preserveAspectRatio="none">
            <defs>
              <linearGradient id="cwGround" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4e3820" />
                <stop offset="30%" stopColor="#3a2a10" />
                <stop offset="100%" stopColor="#22180c" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="800" height="65" fill="url(#cwGround)" />

            {/* Jagged rocky top edge — irregular, not a straight line */}
            <path d="M 0,0 L 0,6 L 15,2 L 32,9 L 50,3 L 68,11 L 85,5 L 104,13 L 120,4 L 140,10 L 158,2 L 178,8 L 198,5 L 218,12 L 238,3 L 258,10 L 278,6 L 298,14 L 318,4 L 338,11 L 358,5 L 380,13 L 400,3 L 420,10 L 442,5 L 462,13 L 482,4 L 502,11 L 524,7 L 545,14 L 565,4 L 586,12 L 606,6 L 628,13 L 648,3 L 668,10 L 690,5 L 710,13 L 730,4 L 752,11 L 772,6 L 792,12 L 800,8 L 800,0 Z"
              fill="#5e4428" opacity="0.65" />

            {/* Embedded rocks poking through trail surface */}
            <ellipse cx="108" cy="21" rx="21" ry="11" fill="#221a0a" opacity="0.88" />
            <ellipse cx="105" cy="17" rx="12" ry="7" fill="#302412" opacity="0.65" />
            <ellipse cx="115" cy="23" rx="9" ry="5" fill="#181208" opacity="0.7" />

            <ellipse cx="283" cy="19" rx="24" ry="10" fill="#221a0a" opacity="0.82" />
            <ellipse cx="280" cy="15" rx="14" ry="6" fill="#302412" opacity="0.6" />

            <ellipse cx="463" cy="23" rx="18" ry="9" fill="#221a0a" opacity="0.85" />
            <ellipse cx="460" cy="19" rx="10" ry="5" fill="#302412" opacity="0.62" />

            <ellipse cx="618" cy="20" rx="22" ry="10" fill="#221a0a" opacity="0.82" />
            <ellipse cx="622" cy="16" rx="13" ry="6" fill="#302412" opacity="0.58" />

            <ellipse cx="750" cy="22" rx="16" ry="8" fill="#221a0a" opacity="0.8" />

            {/* Small pebbles scattered on trail */}
            {[[52,28],[88,36],[152,23],[196,42],[242,30],[334,38],[376,21],[416,46],[454,31],[506,25],[546,44],[582,30],[640,40],[680,23],[720,46],[760,34]].map(([x,y],i) => (
              <ellipse key={i} cx={x} cy={y} rx={2+i%4} ry={1.8} fill="#1a1208" opacity={0.7} />
            ))}

            {/* Shallow dips and holes in trail */}
            <ellipse cx="170" cy="32" rx="14" ry="6" fill="#160e04" opacity="0.55" />
            <ellipse cx="167" cy="29" rx="9" ry="4" fill="#0e0804" opacity="0.65" />
            <ellipse cx="387" cy="27" rx="11" ry="5" fill="#160e04" opacity="0.5" />
            <ellipse cx="572" cy="33" rx="15" ry="6" fill="#160e04" opacity="0.52" />
            <ellipse cx="570" cy="31" rx="9" ry="3.5" fill="#0e0804" opacity="0.62" />
            <ellipse cx="714" cy="29" rx="10" ry="4.5" fill="#160e04" opacity="0.48" />

            {/* Dirt color variation patches */}
            <ellipse cx="232" cy="50" rx="56" ry="14" fill="#5a3e20" opacity="0.28" />
            <ellipse cx="492" cy="54" rx="66" ry="12" fill="#2e2008" opacity="0.32" />
            <ellipse cx="738" cy="52" rx="52" ry="13" fill="#4a3418" opacity="0.3" />

            {/* Grass and weed tufts at rocky edge */}
            {[[36,6],[108,4],[194,7],[287,4],[374,8],[457,5],[542,7],[627,4],[710,8],[782,5]].map(([x,y],i) => (
              <g key={i}>
                <line x1={x-3} y1={y+6} x2={x-7} y2={y} stroke="#3a5012" strokeWidth="1.3" opacity="0.55" />
                <line x1={x} y1={y+6} x2={x-1} y2={y-4} stroke="#4a5a14" strokeWidth="1.4" opacity="0.6" />
                <line x1={x+3} y1={y+6} x2={x+7} y2={y} stroke="#3a5012" strokeWidth="1.3" opacity="0.55" />
              </g>
            ))}
          </svg>
        </div>

        {/* ── SHELTER LABEL ── */}
        <div className="absolute z-[12]" style={{ left: "5%", bottom: "70px" }}>
          <div className={`px-3 py-1 rounded-full text-xs font-bold font-mono border transition-all duration-500 ${
            isSuccess
              ? "text-green-300 bg-green-500/20 border-green-400/50 shadow-md shadow-green-500/20"
              : "text-gray-500 bg-[#0d1117]/50 border-gray-600/20"
          }`}>
            {isSuccess ? "✓ resting in shade" : "🪨 rocky shelter"}
          </div>
        </div>

        {/* ── SUMMIT DIRECTION INDICATOR ── */}
        <div className="absolute z-[10]" style={{ right: "5%", top: "28%" }}>
          <div className="text-center bg-[#0d1117]/75 border border-gray-600/30 rounded px-2 py-1.5">
            <div className="text-cyan-400 text-xs font-mono font-bold">▲ SUMMIT</div>
            <div className="text-gray-500 text-xs font-mono">2.1 km</div>
          </div>
        </div>

        {/* ── CONDITION PANEL (top right) ── */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
          <div className="px-2.5 py-1.5 rounded-lg text-xs font-mono border text-orange-400 border-orange-500/30 bg-[#0d1117]/85">
            {sceneConfig?.varDisplay || "temp = 35"}
          </div>
          <div className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all duration-300 bg-[#0d1117]/85 ${
            isSuccess ? "text-green-400 border-green-500/30"
            : isFail ? "text-red-400 border-red-500/30"
            : "text-gray-300 border-[#484f58]/60"
          }`}>
            {sceneConfig?.conditionLabel || "if temp > 30:"}{" "}
            {isSuccess ? "✓ True" : isFail ? "✗ False" : "?"}
          </div>
          {isSuccess && (
            <div className="px-2.5 py-1 rounded text-xs font-mono text-green-300 border border-green-500/20 bg-green-500/10">
              {sceneConfig?.successAction || "→ rest in shade!"}
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

  // ── FORK PATH: Mountain Trail Junction ───────────────────────────────
  if (gameAction === "heroForkPath") {
    const pathALabel = sceneConfig?.pathALabel || "A: 7";
    const pathBLabel = sceneConfig?.pathBLabel || "B: 3";

    // Mountain trail fork geometry:
    // Hero idles at CSS ~45% (SVG x≈360), path B is right side (success → CSS 72%)
    // Junction crag is centered ~SVG x=390, path A diverges left, path B right

    return (
      <div className="w-full h-full relative overflow-hidden" style={{
        background: isSuccess
          ? "linear-gradient(180deg, #0a1628 0%, #162440 45%, #c87a30 78%, #7a3a10 100%)"
          : "linear-gradient(180deg, #0c1a2e 0%, #162438 45%, #d48838 78%, #8a4218 100%)"
      }}>
        <svg className="absolute inset-0 w-full h-full z-[2]" viewBox="0 0 800 400" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="fpPathA" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4a1a10" />
              <stop offset="100%" stopColor="#2a1008" />
            </linearGradient>
            <linearGradient id="fpPathB" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a2a1a" />
              <stop offset="100%" stopColor="#0a1808" />
            </linearGradient>
            <radialGradient id="fpVignette" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="black" stopOpacity="0" />
              <stop offset="100%" stopColor="black" stopOpacity="0.55" />
            </radialGradient>
          </defs>

          {/* ── Background mountains ── */}
          <polygon points="0,400 0,245 80,208 175,235 270,188 375,216 468,172 572,202 668,162 762,194 800,184 800,245 800,400"
            fill="#1e3050" opacity="0.38" />
          <polygon points="0,400 0,272 58,246 138,268 222,228 318,252 408,212 502,238 592,200 682,228 768,196 800,212 800,272 800,400"
            fill="#12213a" opacity="0.52" />
          {/* Summit between the two paths */}
          <polygon points="418,80 368,202 468,202" fill="#2a3848" opacity="0.72" />
          <polygon points="418,80 406,112 430,112" fill="white" opacity="0.82" />
          <line x1="418" y1="80" x2="418" y2="64" stroke="#9ca3af" strokeWidth="1.5" />
          <polygon points="418,64 432,70 418,76" fill="#ef4444" opacity="0.8" />

          {/* ── Approach trail (before fork, hero walks here from left) ── */}
          <polygon points="0,400 0,362 340,322 340,362 800,400" fill="#3d2d18" />
          <path d="M 0,380 Q 170,366 338,352" stroke="#8b6018" strokeWidth="22" fill="none" opacity="0.32" />
          <path d="M 0,380 Q 170,366 338,352" stroke="#c4a640" strokeWidth="3" fill="none" strokeDasharray="10,8" opacity="0.28" />
          {[[48,378],[112,374],[195,369],[272,362]].map(([x,y],i) => (
            <ellipse key={i} cx={x} cy={y} rx="5" ry="3" fill="#2a1a08" opacity="0.52" />
          ))}

          {/* ══ JUNCTION CRAG — big boulder where trail splits ══ */}
          <polygon points="372,258 322,362 425,382 488,362 458,258" fill="#2d2518" />
          <polygon points="372,258 322,362 395,362 372,258" fill="#1e1a10" opacity="0.48" />
          <ellipse cx="420" cy="258" rx="46" ry="23" fill="#3a3020" />
          <ellipse cx="395" cy="250" rx="30" ry="16" fill="#4a3e28" opacity="0.65" />
          <path d="M 390,256 L 402,295 L 396,332" stroke="#1a1408" strokeWidth="2" fill="none" opacity="0.58" />
          <path d="M 422,260 L 434,284" stroke="#1a1408" strokeWidth="1.5" fill="none" opacity="0.48" />
          {[[366,278,12,6],[402,272,10,5],[432,268,9,4]].map(([x,y,rx,ry],i) => (
            <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#1a3a0a" opacity="0.42" />
          ))}
          {/* Junction arrow carved on boulder */}
          <text x="406" y="244" textAnchor="middle" fill="#9ca3af" fontSize="11" fontFamily="monospace" opacity="0.65">⟨A  B⟩</text>

          {/* ══ PATH A — Dangerous scree slope (LEFT side) ══ */}
          <polygon points="0,400 0,298 188,260 265,285 340,352 340,400" fill="url(#fpPathA)" opacity="0.9" />
          {/* Loose scree rocks */}
          {[[38,372],[82,358],[128,344],[175,328],[225,312],[282,298]].map(([x,y],i) => (
            <g key={i}>
              <ellipse cx={x} cy={y} rx={9+i%2*4} ry={5+i%2*2} fill="#3a2015" />
              <ellipse cx={x-3} cy={y-2} rx="4" ry="2.5" fill="#4a2a18" opacity="0.5" />
            </g>
          ))}
          {/* Warning cairns on path A */}
          {[[95,348],[195,318]].map(([wx,wy],i) => (
            <g key={i}>
              <rect x={wx-2} y={wy} width="4" height="18" fill="#7a5a20" />
              <polygon points={`${wx},${wy} ${wx-10},${wy+16} ${wx+10},${wy+16}`} fill="#f59e0b" opacity="0.9" />
              <text x={wx} y={wy+13} textAnchor="middle" fill="#0a0800" fontSize="9" fontWeight="bold">!</text>
            </g>
          ))}
          {/* Danger cracks in scree */}
          <path d="M 105,362 L 120,346 L 110,332" stroke="#5a1a10" strokeWidth="1.5" fill="none" opacity="0.48" />
          <path d="M 205,322 L 220,308 L 208,295" stroke="#5a1a10" strokeWidth="1.5" fill="none" opacity="0.42" />
          {/* Danger glow pulse */}
          {!isSuccess && (
            <polygon points="0,400 0,298 188,260 265,285 340,352 340,400" fill="#ef4444" opacity="0.04">
              <animate attributeName="opacity" values="0.02;0.08;0.02" dur="2.5s" repeatCount="indefinite" />
            </polygon>
          )}

          {/* ══ PATH B — Safe switchback trail (RIGHT side) ══ */}
          <polygon points="340,400 340,352 528,302 668,282 800,292 800,400" fill="url(#fpPathB)" opacity="0.9" />
          {/* Switchback trail markings */}
          <path d="M 340,356 Q 458,332 576,312 Q 665,296 762,292"
            stroke="#3a5a1a" strokeWidth="20" fill="none" opacity="0.28" />
          <path d="M 340,356 Q 458,332 576,312 Q 665,296 762,292"
            stroke="#5a8a38" strokeWidth="3" fill="none" strokeDasharray="10,7"
            opacity={isSuccess ? "0.7" : "0.38"} style={{ transition: "opacity 0.6s" }} />
          {/* Cairn trail markers on path B */}
          {[[395,344],[498,320],[598,302],[708,287]].map(([cx,cy],i) => (
            <g key={i}>
              <ellipse cx={cx} cy={cy+10} rx="5" ry="3" fill="#0a0c08" opacity="0.38" />
              <rect x={cx-3} y={cy+3} width="6" height="7" rx="1" fill="#3a4a28" />
              <rect x={cx-4} y={cy-2} width="8" height="6" rx="1" fill="#4a5a34" />
              <rect x={cx-2} y={cy-8} width="5" height="7" rx="1" fill="#5a6a40" />
            </g>
          ))}
          {/* Safe glow on success */}
          {isSuccess && (
            <polygon points="340,400 340,352 528,302 668,282 800,292 800,400" fill="#22c55e" opacity="0.06">
              <animate attributeName="opacity" values="0.03;0.1;0.03" dur="1.5s" repeatCount="indefinite" />
            </polygon>
          )}

          {/* ══ STONE MARKERS with danger ratings ══ */}
          {/* Path A danger marker */}
          <ellipse cx="168" cy="278" rx="40" ry="27" fill="#1e1a12" stroke="#3e3020" strokeWidth="2" />
          <ellipse cx="168" cy="278" rx="32" ry="20" fill="#1a1610" opacity="0.7" />
          <text x="168" y="272" textAnchor="middle" fill="#ef4444"
            fontSize="11" fontFamily="monospace" fontWeight="bold">{pathALabel}</text>
          <text x="168" y="288" textAnchor="middle" fill="#9ca3af"
            fontSize="7.5" fontFamily="monospace" opacity="0.7">DANGER</text>

          {/* Path B safe marker */}
          <ellipse cx="628" cy="272" rx="40" ry="27"
            fill={isSuccess ? "#0f1e10" : "#1e1a12"}
            stroke={isSuccess ? "#1e4a1e" : "#3e3020"} strokeWidth="2"
            style={{ transition: "all 0.7s" }} />
          <ellipse cx="628" cy="272" rx="32" ry="20" fill="#1a1610" opacity="0.7" />
          <text x="628" y="266" textAnchor="middle"
            fill={isSuccess ? "#4ade80" : "#d1d5db"}
            fontSize="11" fontFamily="monospace" fontWeight="bold">{pathBLabel}</text>
          <text x="628" y="282" textAnchor="middle"
            fill={isSuccess ? "#4ade80" : "#9ca3af"}
            fontSize="7.5" fontFamily="monospace" opacity="0.8">SAFE</text>

          {/* ── Trail mist near junction ── */}
          {[346,412,478].map((mx,i) => (
            <ellipse key={i} cx={mx} cy={378} rx="35" ry="8" fill="#8ab4d4" opacity="0">
              <animate attributeName="cx" values={`${mx};${mx+22};${mx}`} dur={`${4.2+i*0.9}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.07;0.04;0.09;0" dur={`${4.2+i*0.9}s`} repeatCount="indefinite" />
            </ellipse>
          ))}

          {/* ── Vignette ── */}
          <rect x="0" y="0" width="800" height="400" fill="url(#fpVignette)" />

        </svg>

        {/* ── Condition panel ── */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
          <div className="px-2.5 py-1.5 rounded-lg text-xs font-mono border text-violet-400 border-violet-500/30 bg-[#0d1117]/85">
            {sceneConfig?.varDisplay || "a=7 · b=3"}
          </div>
          <div className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all duration-300 bg-[#0d1117]/85 ${
            isSuccess ? "text-green-400 border-green-500/30"
            : isFail ? "text-red-400 border-red-500/30"
            : "text-gray-300 border-[#484f58]/60"
          }`}>
            {sceneConfig?.conditionLabel || "if a > b:"}{" "}
            {isSuccess ? "✓ True" : isFail ? "✗ False" : "?"}
          </div>
          {isSuccess && (
            <div className="px-2.5 py-1 rounded text-xs font-mono text-green-300 border border-green-500/20 bg-green-500/10">
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

  // ── OBSTACLE BLOCKER — context-aware visuals based on sceneConfig ─────
  // Detect obstacle type from the lesson config
  const obstacleType = (() => {
    const label = sceneConfig?.conditionLabel || "";
    const vars = sceneConfig?.varDisplay || "";
    if (label.includes("energy") || vars.includes("energy"))    return "energy-gate";
    if (label.includes("key == code") || vars.includes("key=")) return "treasure-chest";
    if (label.includes("obstacle") || vars.includes("obstacle")) return "rock-block";
    if (label.includes("rope") || vars.includes("rope"))        return "rope-bridge";
    if (label.includes("poisoned") || vars.includes("poisoned")) return "poison-check";
    if (label.includes("has_key") || vars.includes("has_key"))   return "locked-door";
    return "rock-block";
  })();

  const obstacleLabels = {
    "energy-gate":    { idle: "energy barrier ahead", success: "✓ barrier down!", fail: "✗ not enough energy!" },
    "treasure-chest": { idle: "locked chest...",       success: "✓ chest unlocked!", fail: "✗ wrong key!" },
    "rock-block":     { idle: "boulder blocking path", success: "✓ path cleared!",   fail: "✗ can't move it!" },
    "rope-bridge":    { idle: "bridge ahead...",       success: "✓ safe to cross!",  fail: "✗ can't cross!" },
    "poison-check":   { idle: "status check...",       success: "✓ hero is healthy!", fail: "✗ hero is poisoned!" },
    "locked-door":    { idle: "locked gate ahead",     success: "✓ gate opened!",    fail: "✗ gate stays locked!" },
  };
  const obsLabel = obstacleLabels[obstacleType] || obstacleLabels["rock-block"];

  const renderObstacleVisual = () => {
    switch (obstacleType) {

      case "energy-gate":
        return (
          <svg width="110" height="100" viewBox="0 0 110 100">
            <ellipse cx="55" cy="95" rx="48" ry="6" fill="#000" opacity="0.2" />
            {/* Left pillar */}
            <rect x="8" y="12" width="14" height="80" rx="3" fill="#3a3a50" />
            <rect x="8" y="12" width="5" height="80" rx="2" fill="#4a4a68" opacity="0.4" />
            <rect x="5" y="6" width="20" height="8" rx="2" fill="#4a4a68" />
            {/* Right pillar */}
            <rect x="88" y="12" width="14" height="80" rx="3" fill="#3a3a50" />
            <rect x="88" y="12" width="5" height="80" rx="2" fill="#4a4a68" opacity="0.4" />
            <rect x="85" y="6" width="20" height="8" rx="2" fill="#4a4a68" />
            {/* Energy bars */}
            {!isSuccess && [0,1,2,3,4].map(i => (
              <rect key={i} x="24" y={18 + i * 15} width="62" height="4" rx="2"
                fill={isFail ? "#ef4444" : "#00d4ff"} opacity={isFail ? "0" : "0.6"}>
                {!isFail && <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${1.2 + i * 0.15}s`} repeatCount="indefinite" />}
                {isFail && <animate attributeName="opacity" values="0.7;0;0" dur="0.4s" fill="freeze" />}
              </rect>
            ))}
            {/* Energy glow */}
            {!isSuccess && !isFail && (
              <rect x="22" y="14" width="66" height="76" rx="4" fill="#00d4ff" opacity="0.04">
                <animate attributeName="opacity" values="0.02;0.08;0.02" dur="2s" repeatCount="indefinite" />
              </rect>
            )}
            {/* Success — bars dissolve, sparkles */}
            {isSuccess && [0,1,2].map(i => (
              <circle key={i} cx={35 + i * 20} cy={30 + i * 15} r="3" fill="#22c55e" opacity="0">
                <animate attributeName="cy" values={`${30 + i * 15};${10 + i * 5}`} dur="0.6s" fill="freeze" />
                <animate attributeName="opacity" values="0;0.9;0" dur="0.6s" fill="freeze" />
              </circle>
            ))}
          </svg>
        );

      case "treasure-chest":
        return (
          <svg width="100" height="90" viewBox="0 0 100 90">
            <ellipse cx="50" cy="85" rx="42" ry="6" fill="#000" opacity="0.2" />
            {/* Chest body */}
            <rect x="15" y="48" width="70" height="35" rx="4" fill="#8B4513" />
            <rect x="15" y="48" width="70" height="12" rx="4" fill="#A0522D" opacity="0.5" />
            {/* Gold bands */}
            <rect x="15" y="56" width="70" height="3" rx="1" fill="#DAA520" opacity="0.7" />
            <rect x="15" y="76" width="70" height="3" rx="1" fill="#DAA520" opacity="0.7" />
            {/* Lid — opens on success */}
            <g transform={isSuccess ? "rotate(-35 15 48)" : ""} style={{ transition: "transform 0.5s" }}>
              <rect x="15" y="30" width="70" height="20" rx="4" fill="#A0522D" />
              <rect x="15" y="30" width="70" height="8" rx="4" fill="#8B4513" opacity="0.6" />
              <rect x="15" y="44" width="70" height="3" rx="1" fill="#DAA520" opacity="0.7" />
            </g>
            {/* Keyhole */}
            {!isSuccess && (
              <g>
                <circle cx="50" cy="64" r="5" fill={isFail ? "#ef4444" : "#581c87"} opacity="0.9">
                  {!isFail && <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />}
                </circle>
                <rect x="48" y="64" width="4" height="8" rx="1" fill={isFail ? "#ef4444" : "#581c87"} opacity="0.9" />
              </g>
            )}
            {/* Gold sparkles on success */}
            {isSuccess && [0,1,2,3].map(i => (
              <circle key={i} cx={30 + i * 14} cy="42" r="2" fill="#fbbf24">
                <animate attributeName="cy" values="42;20;10" dur={`${0.5 + i * 0.1}s`} fill="freeze" />
                <animate attributeName="opacity" values="0;1;0.3" dur={`${0.5 + i * 0.1}s`} fill="freeze" />
              </circle>
            ))}
          </svg>
        );

      case "rope-bridge":
        return null; // handled by full-scene early return below

      case "poison-check":
        return (
          <svg width="90" height="95" viewBox="0 0 90 95">
            <ellipse cx="45" cy="90" rx="35" ry="5" fill="#000" opacity="0.18" />
            {/* Shield shape */}
            <path d="M 45,8 L 72,20 L 72,52 Q 72,75 45,85 Q 18,75 18,52 L 18,20 Z"
              fill={isSuccess ? "#14532d" : isFail ? "#4c1d1d" : "#1e293b"} opacity="0.9" />
            <path d="M 45,8 L 72,20 L 72,52 Q 72,75 45,85 Q 18,75 18,52 L 18,20 Z"
              fill="none" stroke={isSuccess ? "#22c55e" : isFail ? "#ef4444" : "#7c3aed"} strokeWidth="2.5" opacity="0.8" />
            {/* Heart/cross icon */}
            <path d="M 45,32 L 38,40 L 45,55 L 52,40 Z"
              fill={isSuccess ? "#22c55e" : isFail ? "#ef4444" : "#a78bfa"} opacity="0.7" />
            <line x1="38" y1="42" x2="52" y2="42" stroke={isSuccess ? "#22c55e" : isFail ? "#ef4444" : "#a78bfa"}
              strokeWidth="3" opacity="0.8" />
            <line x1="45" y1="35" x2="45" y2="52" stroke={isSuccess ? "#22c55e" : isFail ? "#ef4444" : "#a78bfa"}
              strokeWidth="3" opacity="0.8" />
            {/* Purple mist when idle/poisoned */}
            {!isSuccess && (
              <>
                <circle cx="30" cy="50" r="12" fill="#7c3aed" opacity="0.06">
                  <animate attributeName="r" values="10;16;10" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="60" cy="45" r="10" fill="#7c3aed" opacity="0.05">
                  <animate attributeName="r" values="8;14;8" dur="2.5s" repeatCount="indefinite" />
                </circle>
              </>
            )}
            {/* Green glow on success */}
            {isSuccess && (
              <path d="M 45,8 L 72,20 L 72,52 Q 72,75 45,85 Q 18,75 18,52 L 18,20 Z"
                fill="#22c55e" opacity="0.08">
                <animate attributeName="opacity" values="0.04;0.15;0.04" dur="1.2s" repeatCount="indefinite" />
              </path>
            )}
          </svg>
        );

      case "locked-door":
        return (
          <svg width="100" height="100" viewBox="0 0 100 100">
            <ellipse cx="50" cy="95" rx="44" ry="6" fill="#000" opacity="0.2" />
            {/* Door frame */}
            <rect x="15" y="8" width="70" height="84" rx="3" fill="#3d2817" />
            {/* Arch top */}
            <path d="M 15,35 L 15,8 Q 50,-5 85,8 L 85,35" fill="#4a3420" />
            {/* Door panels */}
            <rect x="20" y="35" width="27" height="52" rx="2" fill="#5a3d22" />
            <rect x="53" y="35" width="27" height="52" rx="2" fill="#5a3d22" />
            {/* Iron bands */}
            <rect x="15" y="30" width="70" height="4" rx="1" fill="#4a5568" opacity="0.8" />
            <rect x="15" y="60" width="70" height="4" rx="1" fill="#4a5568" opacity="0.8" />
            {/* Lock */}
            {!isSuccess && (
              <g>
                <rect x="42" y="48" width="16" height="12" rx="3"
                  fill={isFail ? "#7f1d1d" : "#4a5568"} opacity="0.9" />
                <path d="M 46,48 Q 46,40 50,40 Q 54,40 54,48"
                  stroke={isFail ? "#ef4444" : "#7c3aed"} strokeWidth="2.5" fill="none" opacity="0.8" strokeLinecap="round" />
                <circle cx="50" cy="54" r="2" fill={isFail ? "#ef4444" : "#a78bfa"} opacity="0.8">
                  {!isFail && <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />}
                </circle>
              </g>
            )}
            {/* Door opening on success — gap between panels */}
            {isSuccess && (
              <>
                <rect x="44" y="35" width="12" height="52" fill="#0a0a0a" opacity="0.7" />
                <rect x="44" y="35" width="12" height="52" fill="#22c55e" opacity="0.05">
                  <animate attributeName="opacity" values="0.02;0.12;0.02" dur="1s" repeatCount="indefinite" />
                </rect>
                {/* Light rays from behind door */}
                {[0,1,2].map(i => (
                  <line key={i} x1="50" y1={40 + i * 14} x2={isSuccess ? 50 : 50} y2={40 + i * 14}
                    stroke="#22c55e" strokeWidth="1" opacity="0.4">
                    <animate attributeName="x1" values="50;42" dur="0.5s" fill="freeze" />
                    <animate attributeName="x2" values="50;58" dur="0.5s" fill="freeze" />
                  </line>
                ))}
              </>
            )}
          </svg>
        );

      default: // rock-block
        return (
          <svg width="110" height="90" viewBox="0 0 110 90">
            {/* Shadow */}
            <ellipse cx="55" cy="84" rx="44" ry="7" fill="#000" opacity="0.25" />
            {/* Main boulder body — irregular polygon */}
            <polygon points="20,78 8,58 6,40 16,22 32,10 55,6 74,10 90,24 96,44 90,62 76,76 54,82 32,80"
              fill={isSuccess ? "#52525b" : isFail ? "#5a1a10" : "#4b5563"} />
            {/* Left highlight face */}
            <polygon points="20,78 8,58 6,40 16,22 32,10 55,6"
              fill="#6b7280" opacity="0.35" />
            {/* Right shadow face */}
            <polygon points="74,10 90,24 96,44 90,62 76,76 54,82"
              fill="#1f2937" opacity="0.45" />
            {/* Top highlight — light catches the peak */}
            <polygon points="32,10 55,6 74,10 62,18 42,16"
              fill="#9ca3af" opacity="0.3" />
            {/* Rock texture fracture lines */}
            <path d="M 38,14 L 44,32 L 36,52 L 42,72" stroke="#374151" strokeWidth="1.8" fill="none" opacity="0.6" />
            <path d="M 60,12 L 66,28 L 58,46 L 64,66" stroke="#374151" strokeWidth="1.2" fill="none" opacity="0.4" />
            <path d="M 28,40 L 44,46 L 38,56" stroke="#374151" strokeWidth="1" fill="none" opacity="0.35" />
            {/* Moss patch on lower left */}
            <ellipse cx="22" cy="66" rx="9" ry="6" fill="#2d4a1a" opacity="0.45" />
            <ellipse cx="34" cy="74" rx="7" ry="4" fill="#3a5a20" opacity="0.35" />
            {/* Warning triangle when blocking */}
            {!isSuccess && !isFail && (
              <g>
                <polygon points="55,22 49,38 61,38" fill="#f59e0b" opacity="0.85" />
                <text x="55" y="36" textAnchor="middle" fill="#1a0e00" fontSize="11" fontWeight="bold">!</text>
              </g>
            )}
            {/* Crack splits on success */}
            {isSuccess && (
              <>
                <path d="M 48,10 L 42,34 L 50,52 L 44,78" stroke="#d1d5db" strokeWidth="2.5" fill="none" opacity="0">
                  <animate attributeName="opacity" values="0;0.85;0.75" dur="0.35s" fill="freeze" />
                </path>
                <path d="M 56,12 L 62,36 L 54,54 L 60,76" stroke="#9ca3af" strokeWidth="1.5" fill="none" opacity="0">
                  <animate attributeName="opacity" values="0;0.6;0.5" dur="0.45s" fill="freeze" />
                </path>
                {/* Rock split glow */}
                <path d="M 52,10 L 48,38 L 54,78" stroke="#e5e7eb" strokeWidth="3" fill="none" opacity="0">
                  <animate attributeName="opacity" values="0;0.5;0" dur="0.3s" fill="freeze" />
                </path>
              </>
            )}
            {/* Red damage glow on fail */}
            {isFail && (
              <polygon points="20,78 8,58 6,40 16,22 32,10 55,6 74,10 90,24 96,44 90,62 76,76 54,82 32,80"
                fill="#ef4444" opacity="0">
                <animate attributeName="opacity" values="0;0.25;0" dur="0.4s" fill="freeze" />
              </polygon>
            )}
          </svg>
        );
    }
  };

  // ── ENERGY BARRIER: Mountain gorge with glowing barrier ─────────────────
  if (gameAction === "heroObstacle" && obstacleType === "energy-gate") {
    const barrierColor = isFail ? "#ef4444" : isSuccess ? "#22c55e" : "#00d4ff";
    const energyFill = 15; // hero's energy (15 out of 20 needed)

    return (
      <div className="w-full h-full relative overflow-hidden" style={{
        background: isFail
          ? "linear-gradient(180deg, #0a0808 0%, #1c1010 100%)"
          : "linear-gradient(180deg, #060d18 0%, #0f1824 50%, #1a2030 100%)"
      }}>
        <svg className="absolute inset-0 w-full h-full z-[2]" viewBox="0 0 800 400" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="eCliff" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1c1812" />
              <stop offset="100%" stopColor="#0e0c08" />
            </linearGradient>
            <radialGradient id="eSummitGlow" cx="50%" cy="100%" r="60%">
              <stop offset="0%" stopColor="#4a6a8a" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#4a6a8a" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="eVignette" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="black" stopOpacity="0" />
              <stop offset="100%" stopColor="black" stopOpacity="0.75" />
            </radialGradient>
          </defs>

          {/* ── Narrow sky gap at top of gorge ── */}
          <rect x="250" y="0" width="300" height="185" fill="#0d1a2e" opacity="0.8" />
          <polygon points="400,18 372,98 428,98" fill="#1e2d3e" opacity="0.65" />
          <polygon points="400,18 390,46 410,46" fill="white" opacity="0.38" />
          <ellipse cx="400" cy="0" rx="95" ry="55" fill="#1e3a5a" opacity="0.45" />
          {[[382,24],[412,34],[362,44],[428,20],[376,54]].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r="1" fill="white" opacity="0.55">
              <animate attributeName="opacity" values="0.35;0.88;0.35" dur={`${1.5+i*0.4}s`} repeatCount="indefinite" />
            </circle>
          ))}

          {/* ── LEFT CLIFF WALL (towers high) ── */}
          <polygon points="0,400 0,0 272,0 252,32 238,85 248,142 234,198 244,248 230,295 242,348 238,400"
            fill="url(#eCliff)" />
          {[`M 48,0 L 60,52 L 54,112 L 66,182 L 56,252`,
            `M 118,0 L 130,62 L 122,132`,
            `M 188,0 L 198,46 L 192,102 L 202,168`,
            `M 238,52 L 246,90`].map((d,i) => (
            <path key={i} d={d} stroke="#080604" strokeWidth={i<2?2.5:1.8} fill="none" opacity="0.62" />
          ))}
          {[[28,82,18,8],[82,122,14,6],[148,92,20,8],[196,162,16,7],[218,244,14,6]].map(([x,y,rx,ry],i) => (
            <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#1a3a0a" opacity="0.38" />
          ))}
          <rect x="60" y="0" width="5" height="215" rx="3" fill="#1a2a35" opacity="0.16" />

          {/* ── RIGHT CLIFF WALL (towers high) ── */}
          <polygon points="800,400 800,0 528,0 548,32 562,85 552,142 566,198 556,248 570,295 558,348 562,400"
            fill="url(#eCliff)" />
          {[`M 752,0 L 740,55 L 748,115 L 732,185 L 744,258`,
            `M 682,0 L 670,65 L 678,135`,
            `M 614,0 L 602,50 L 608,108 L 596,175`,
            `M 566,62 L 556,98`].map((d,i) => (
            <path key={i} d={d} stroke="#080604" strokeWidth={i<2?2.5:1.8} fill="none" opacity="0.62" />
          ))}
          {[[772,82,17,8],[718,118,14,6],[652,102,18,7],[602,172,14,6],[580,252,12,6]].map(([x,y,rx,ry],i) => (
            <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#1a3a0a" opacity="0.38" />
          ))}
          <rect x="734" y="0" width="5" height="202" rx="3" fill="#1a2a35" opacity="0.16" />

          {/* ── Stalactites hanging from cliff tops ── */}
          {[[78,0,20,52],[158,0,15,40],[228,0,18,58],[328,0,13,36],
            [472,0,15,40],[562,0,20,60],[642,0,13,36],[722,0,18,50]].map(([x,y,w,h],i) => (
            <g key={i}>
              <polygon points={`${x},0 ${x+w},0 ${x+w/2},${h}`}
                fill={["#1e1a12","#2a2016","#161210"][i%3]} />
              <circle cx={x+w/2} cy={h+2} r="1.5" fill="#5a9ab8" opacity="0.38">
                <animate attributeName="cy" values={`${h+2};${h+18};${h+2}`}
                  dur={`${2.5+i*0.4}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.38;0;0.38"
                  dur={`${2.5+i*0.4}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}

          {/* ── Gorge floor — narrow mountain trail ── */}
          <rect x="238" y="352" width="324" height="48" fill="#2a2010" />
          <path d="M 238,374 Q 400,370 562,372" stroke="#3a2e18" strokeWidth="16" fill="none" opacity="0.48" />
          {[[275,368],[322,374],[370,366],[432,372],[490,366],[532,371]].map(([x,y],i) => (
            <ellipse key={i} cx={x} cy={y} rx={5+i%2*3} ry="3" fill="#1a1408" opacity="0.58" />
          ))}
          {/* Floor mist */}
          {[285,368,452,525].map((x,i) => (
            <ellipse key={i} cx={x} cy={388} rx="38" ry="7" fill="#4a8ab0" opacity="0">
              <animate attributeName="cx" values={`${x};${x+22};${x}`} dur={`${4+i*0.8}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.07;0.04;0.09;0" dur={`${4+i*0.8}s`} repeatCount="indefinite" />
            </ellipse>
          ))}

          {/* ── Beyond barrier: trail continues to summit ── */}
          <path d="M 562,366 Q 602,350 640,334 Q 678,318 712,298"
            stroke="#4a6a8a" strokeWidth="14" fill="none" opacity={isSuccess ? "0.52" : "0.18"}
            style={{ transition: "opacity 0.8s" }} />
          <ellipse cx="688" cy="244" rx="58" ry="78" fill="url(#eSummitGlow)" opacity={isSuccess ? "0.85" : "0.28"}
            style={{ transition: "opacity 0.8s" }} />

          {/* ══ ENERGY BARRIER at ~53% from left ══ */}
          {/* Left crystal emitter in cliff face */}
          <rect x="228" y="162" width="24" height="40" rx="4" fill="#1a1628" stroke="#5a4a8a" strokeWidth="1.5" />
          <rect x="232" y="166" width="16" height="32" rx="2" fill={barrierColor} opacity="0.12">
            {!isFail && <animate attributeName="opacity" values="0.08;0.28;0.08" dur="1.5s" repeatCount="indefinite" />}
          </rect>
          <ellipse cx="240" cy="182" rx="6" ry="6" fill={barrierColor} opacity={isFail ? "0.2" : "0.92"}>
            {!isFail && !isSuccess && <animate attributeName="opacity" values="0.55;0.98;0.55" dur="1.2s" repeatCount="indefinite" />}
          </ellipse>
          <circle cx="240" cy="182" r="20" fill={barrierColor} opacity={isFail ? "0" : "0.07"}>
            {!isFail && <animate attributeName="r" values="14;24;14" dur="1.5s" repeatCount="indefinite" />}
          </circle>

          {/* Right crystal emitter */}
          <rect x="548" y="162" width="24" height="40" rx="4" fill="#1a1628" stroke="#5a4a8a" strokeWidth="1.5" />
          <rect x="552" y="166" width="16" height="32" rx="2" fill={barrierColor} opacity="0.12">
            {!isFail && <animate attributeName="opacity" values="0.08;0.28;0.08" dur="1.5s" begin="0.3s" repeatCount="indefinite" />}
          </rect>
          <ellipse cx="560" cy="182" rx="6" ry="6" fill={barrierColor} opacity={isFail ? "0.2" : "0.92"}>
            {!isFail && !isSuccess && <animate attributeName="opacity" values="0.55;0.98;0.55" dur="1.2s" begin="0.3s" repeatCount="indefinite" />}
          </ellipse>
          <circle cx="560" cy="182" r="20" fill={barrierColor} opacity={isFail ? "0" : "0.07"}>
            {!isFail && <animate attributeName="r" values="14;24;14" dur="1.5s" begin="0.3s" repeatCount="indefinite" />}
          </circle>

          {/* Barrier beams across the gorge */}
          {!isSuccess && [0,1,2,3,4].map(i => (
            <rect key={i} x="242" y={176 + i * 38} width="316" height="6" rx="3"
              fill={barrierColor} opacity={isFail ? "0" : "0.52"}>
              {!isFail && <animate attributeName="opacity" values="0.28;0.68;0.28"
                dur={`${1.1+i*0.18}s`} repeatCount="indefinite" />}
              {isFail && <animate attributeName="opacity" values="0.6;0;0" dur="0.4s" fill="freeze" />}
            </rect>
          ))}
          {/* Overall barrier glow */}
          {!isSuccess && !isFail && (
            <rect x="242" y="174" width="316" height="208" rx="4" fill="#00d4ff" opacity="0.03">
              <animate attributeName="opacity" values="0.015;0.07;0.015" dur="2s" repeatCount="indefinite" />
            </rect>
          )}
          {/* Success: barrier dissolves */}
          {isSuccess && [0,1,2].map(i => (
            <circle key={i} cx={355+i*52} cy={252+i*18} r="4" fill="#22c55e" opacity="0">
              <animate attributeName="cy" values={`${252+i*18};${175+i*10}`} dur="0.6s" fill="freeze" />
              <animate attributeName="opacity" values="0;0.88;0" dur="0.6s" fill="freeze" />
            </circle>
          ))}

          {/* ── Energy level indicator on left cliff (shows 15 out of 20 needed) ── */}
          <g transform="translate(20, 255)">
            <rect x="0" y="0" width="28" height="82" rx="4" fill="#0d0c08" stroke="#2a2418" strokeWidth="1.5" />
            <rect x="3" y="3" width="22" height="76" rx="2" fill="#1a1810" />
            <rect x="4" y={79 - Math.round(76 * (energyFill / 20))} width="20"
              height={Math.round(76 * (energyFill / 20))} rx="2"
              fill={isFail ? "#ef4444" : "#00d4ff"} opacity={isFail ? "0.5" : "0.62"}>
              {!isFail && <animate attributeName="opacity" values="0.4;0.82;0.4" dur="2s" repeatCount="indefinite" />}
            </rect>
            {/* Need line at 100% (top = needs 20, currently at 15 = 75%) */}
            <line x1="1" y1="3" x2="27" y2="3" stroke={isFail ? "#ef4444" : "#00d4ff"}
              strokeWidth="2" strokeDasharray="3,2" opacity="0.65" />
            <text x="14" y="-6" textAnchor="middle" fill="#6b7280" fontSize="6" fontFamily="monospace">⚡</text>
            <text x="14" y="95" textAnchor="middle" fill="#6b7280" fontSize="5.5" fontFamily="monospace">15</text>
          </g>

          {/* ── Vignette ── */}
          <rect x="0" y="0" width="800" height="400" fill="url(#eVignette)" />
        </svg>

        {/* Barrier status label */}
        <div className="absolute z-20" style={{ left: "50%", bottom: "76px", transform: "translateX(-50%)" }}>
          <div className={`px-3 py-1 rounded-lg text-xs font-mono border whitespace-nowrap transition-all duration-300 ${
            isSuccess ? "text-green-400 border-green-500/40 bg-green-500/10"
            : isFail ? "text-red-400 border-red-500/40 bg-red-500/10"
            : "text-cyan-400 border-cyan-500/40 bg-cyan-500/10"
          }`}>
            {isSuccess ? "✓ barrier down — path clear!" : isFail ? "✗ not enough energy!" : "⚡ energy barrier blocks the pass"}
          </div>
        </div>

        {/* Condition panel */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
          <div className="px-2.5 py-1.5 rounded-lg text-xs font-mono border text-cyan-400 border-cyan-500/30 bg-[#0d1117]/85">
            {sceneConfig?.varDisplay || "energy = 15"}
          </div>
          <div className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all duration-300 bg-[#0d1117]/85 ${
            isSuccess ? "text-green-400 border-green-500/30"
            : isFail ? "text-red-400 border-red-500/30"
            : "text-gray-300 border-[#484f58]/60"
          }`}>
            {sceneConfig?.conditionLabel || "if energy >= 20:"}{" "}
            {isSuccess ? "✓ True" : isFail ? "✗ False" : "?"}
          </div>
          {isSuccess && (
            <div className="px-2.5 py-1 rounded text-xs font-mono text-green-300 border border-green-500/20 bg-green-500/10">
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

  // ── ROPE BRIDGE: full river-gorge scene ─────────────────────────────────
  if (obstacleType === "rope-bridge") {
    const leftPost = 118, rightPost = 682;
    const postTopY = 300, plankY = 436, gorgeTop = 385;
    const sagBase = isSuccess ? 8 : isFail ? 52 : 26;
    const handMidY = postTopY + sagBase;
    const plankCount = 20;
    const bridgeSpan = rightPost - leftPost;

    return (
      <div className="w-full h-full relative overflow-hidden">
        <SkyBackground />

        <svg className="absolute inset-0 w-full h-full z-[4]"
          viewBox="0 0 800 500" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="brRiver" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e4a6a" />
              <stop offset="60%" stopColor="#163858" />
              <stop offset="100%" stopColor="#0a1e30" />
            </linearGradient>
            <linearGradient id="brBank" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3a3020" />
              <stop offset="100%" stopColor="#1a1408" />
            </linearGradient>
          </defs>

          {/* ── Mountains behind gorge ── */}
          <polygon points="0,380 60,310 130,348 200,280 280,322 360,262 440,302 520,252 600,292 680,242 760,285 800,268 800,380"
            fill="#1a2a3a" opacity="0.7" />
          <polygon points="0,380 40,332 110,360 180,302 260,338 340,276 420,318 500,272 580,308 660,260 740,298 800,280 800,380"
            fill="#101820" opacity="0.85" />

          {/* ── Left rocky bank ── */}
          <polygon points={`0,${gorgeTop} ${leftPost+18},${gorgeTop-20} ${leftPost+10},${gorgeTop+8} ${leftPost},500 0,500`}
            fill="url(#brBank)" />
          {[[18,gorgeTop+5,22,14],[58,gorgeTop+3,18,11],[92,gorgeTop+8,15,10]].map(([x,y,rx,ry],i) => (
            <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#2a2418" opacity="0.65" />
          ))}
          {/* Worn dirt path approach */}
          <path d={`M 0,${plankY} Q 60,${plankY-4} ${leftPost},${plankY}`}
            stroke="#3a2e18" strokeWidth="30" fill="none" opacity="0.9" />
          <path d={`M 0,${plankY} Q 60,${plankY-4} ${leftPost},${plankY}`}
            stroke="#4a3a22" strokeWidth="12" fill="none" opacity="0.4" />

          {/* ── Right rocky bank ── */}
          <polygon points={`${rightPost},500 ${rightPost},${gorgeTop+8} ${rightPost-10},${gorgeTop-20} 800,${gorgeTop} 800,500`}
            fill="url(#brBank)" />
          {[[720,gorgeTop+5,20,13],[756,gorgeTop+3,16,11],[784,gorgeTop+9,14,9]].map(([x,y,rx,ry],i) => (
            <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#2a2418" opacity="0.65" />
          ))}
          <path d={`M ${rightPost},${plankY} Q 740,${plankY-4} 800,${plankY}`}
            stroke="#3a2e18" strokeWidth="30" fill="none" opacity="0.9" />

          {/* ── Gorge cavity ── */}
          <rect x={leftPost} y={gorgeTop} width={bridgeSpan} height={500-gorgeTop} fill="#0e0c08" />
          {/* Jagged gorge walls */}
          <polygon points={`${leftPost},${gorgeTop} ${leftPost+22},${gorgeTop+28} ${leftPost+12},${gorgeTop+60} ${leftPost+20},${gorgeTop+110} ${leftPost},500`}
            fill="#1a1810" />
          <polygon points={`${rightPost},${gorgeTop} ${rightPost-22},${gorgeTop+28} ${rightPost-12},${gorgeTop+60} ${rightPost-20},${gorgeTop+110} ${rightPost},500`}
            fill="#1a1810" />

          {/* ── River water ── */}
          <rect x={leftPost+25} y={gorgeTop+55} width={bridgeSpan-50} height={500-gorgeTop-55}
            fill="url(#brRiver)" />
          {/* River current lines */}
          {[gorgeTop+72, gorgeTop+98, gorgeTop+126, gorgeTop+156].map((y,i) => (
            <line key={i} x1={leftPost+35} y1={y} x2={rightPost-35} y2={y}
              stroke="#3a8ab4" strokeWidth="1.5" opacity="0.16">
              <animate attributeName="x1"
                values={`${leftPost+35};${leftPost+90};${leftPost+35}`}
                dur={`${3+i*0.65}s`} repeatCount="indefinite" />
              <animate attributeName="x2"
                values={`${rightPost-35};${rightPost-90};${rightPost-35}`}
                dur={`${3+i*0.65}s`} repeatCount="indefinite" />
            </line>
          ))}
          {/* Water sheen */}
          <rect x={leftPost+25} y={gorgeTop+55} width={bridgeSpan-50} height="28"
            fill="#3a8ab4" opacity="0.12" />
          {/* Ripples */}
          {[220,360,480,600].map((x,i) => (
            <ellipse key={i} cx={x} cy={gorgeTop+82+i*14} rx="5" ry="3" fill="#5ab0d4" opacity="0">
              <animate attributeName="rx" values="5;24;5" dur={`${2+i*0.55}s`} begin={`${i*0.7}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.18;0" dur={`${2+i*0.55}s`} begin={`${i*0.7}s`} repeatCount="indefinite" />
            </ellipse>
          ))}

          {/* ── Bridge left post ── */}
          <rect x={leftPost-8} y={postTopY} width={17} height={plankY-postTopY+14}
            rx="3" fill="#7a5028" stroke="#5a3818" strokeWidth="1.5" />
          <rect x={leftPost-8} y={postTopY} width={7} height={plankY-postTopY+14}
            fill="#9a6838" opacity="0.28" rx="3" />
          <rect x={leftPost-12} y={postTopY-8} width={24} height={11} rx="3" fill="#8a5e28" />

          {/* ── Bridge right post ── */}
          <rect x={rightPost-9} y={postTopY} width={17} height={plankY-postTopY+14}
            rx="3" fill="#7a5028" stroke="#5a3818" strokeWidth="1.5" />
          <rect x={rightPost+2} y={postTopY} width={7} height={plankY-postTopY+14}
            fill="#9a6838" opacity="0.28" rx="3" />
          <rect x={rightPost-12} y={postTopY-8} width={24} height={11} rx="3" fill="#8a5e28" />

          {/* ── Handrail ropes ── */}
          <path d={`M ${leftPost+1},${postTopY+5} Q 400,${handMidY} ${rightPost+1},${postTopY+5}`}
            stroke="#a08858" strokeWidth="3.5" fill="none" opacity="0.95" />
          <path d={`M ${leftPost+1},${postTopY+14} Q 400,${handMidY+10} ${rightPost+1},${postTopY+14}`}
            stroke="#8B7345" strokeWidth="2.2" fill="none" opacity="0.72" />
          {isSuccess && (
            <path d={`M ${leftPost+1},${postTopY+5} Q 400,${handMidY} ${rightPost+1},${postTopY+5}`}
              stroke="#86efac" strokeWidth="2" fill="none" opacity="0.3">
              <animate attributeName="opacity" values="0.12;0.5;0.12" dur="1.6s" repeatCount="indefinite" />
            </path>
          )}

          {/* ── Vertical suspender ropes ── */}
          {Array.from({length: 14}, (_,i) => {
            const t = (i+1)/15;
            const x = leftPost + t * bridgeSpan;
            const y0 = postTopY+5, ymid = handMidY, y1 = postTopY+5;
            const ropeY = (1-t)*(1-t)*y0 + 2*t*(1-t)*ymid + t*t*y1;
            return (
              <line key={i} x1={x} y1={ropeY} x2={x} y2={plankY-6}
                stroke="#8B7345" strokeWidth="1.8" opacity={isFail ? "0.25" : "0.65"} />
            );
          })}

          {/* ── Planks ── */}
          {Array.from({length: plankCount}, (_,i) => {
            const x = leftPost + (i + 0.5) * (bridgeSpan / plankCount);
            const plankW = (bridgeSpan / plankCount) - 5;
            const broken = isFail && i >= 8 && i <= 13;
            return (
              <g key={i}>
                <rect x={x - plankW/2} y={plankY - 8} width={plankW} height={10}
                  rx="1.5"
                  fill={broken ? "#3a2010" : isSuccess ? "#a07e38" : "#8B6a30"}
                  opacity={broken ? "0.3" : "0.95"} />
                <line x1={x - plankW/2 + 3} y1={plankY-7} x2={x - plankW/2 + 3} y2={plankY+1}
                  stroke="#6a4a18" strokeWidth="0.9" opacity="0.4" />
              </g>
            );
          })}

          {/* ── Hero's rope on success (hero pulls himself across) ── */}
          {isSuccess && (
            <path d={`M ${leftPost+2},${postTopY+5} Q ${leftPost+bridgeSpan*0.3},${postTopY+sagBase*0.6} ${leftPost+bridgeSpan*0.58},${plankY-50}`}
              stroke="#c8a060" strokeWidth="3" fill="none" opacity="0.55">
              <animate attributeName="opacity" values="0.35;0.7;0.35" dur="2s" repeatCount="indefinite" />
            </path>
          )}

          {/* ── Planks falling on fail ── */}
          {isFail && [0,1,2].map(i => (
            <rect key={i} x={290+i*55} y={plankY-6} width={28} height={8} rx="1"
              fill="#5c3818" opacity="0">
              <animate attributeName="y" values={`${plankY-6};${plankY+90}`}
                dur="0.75s" begin={`${i*0.18}s`} fill="freeze" />
              <animate attributeName="opacity" values="0.9;0" dur="0.75s" begin={`${i*0.18}s`} fill="freeze" />
            </rect>
          ))}

          {/* ── Success sparkles on crossing ── */}
          {isSuccess && [0,1,2,3].map(i => (
            <circle key={i}
              cx={leftPost + (i+1) * bridgeSpan/5} cy={plankY-22}
              r="3" fill="#86efac" opacity="0">
              <animate attributeName="cy"
                values={`${plankY-22};${plankY-60};${plankY-80}`}
                dur={`${0.55+i*0.14}s`} begin={`${i*0.22}s`} fill="freeze" />
              <animate attributeName="opacity"
                values="0;0.9;0" dur={`${0.55+i*0.14}s`} begin={`${i*0.22}s`} fill="freeze" />
            </circle>
          ))}
        </svg>

        {/* Obstacle label */}
        <div className="absolute z-20" style={{ left: "50%", bottom: "92px", transform: "translateX(-50%)" }}>
          <div className={`px-3 py-1 rounded-lg text-xs font-mono border whitespace-nowrap ${
            isSuccess ? "text-green-400 border-green-500/40 bg-green-500/10"
            : isFail ? "text-red-400 border-red-500/40 bg-red-500/10"
            : "text-violet-400 border-violet-500/40 bg-violet-500/10"
          }`}>
            {isSuccess ? obsLabel.success : isFail ? obsLabel.fail : obsLabel.idle}
          </div>
        </div>

        {/* Condition panel */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
          <div className="px-2.5 py-1.5 rounded-lg text-xs font-mono border text-violet-400 border-violet-500/30 bg-violet-500/10">
            {sceneConfig?.varDisplay || "rope=True · stamina=80"}
          </div>
          <div className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all duration-300 ${
            isSuccess ? "text-green-400 border-green-500/30 bg-green-500/10"
            : isFail ? "text-red-400 border-red-500/30 bg-red-500/10"
            : "text-gray-500 border-[#30363d]/40"
          }`}>
            {sceneConfig?.conditionLabel || "if rope and stamina >= 50:"} {isSuccess ? "✓" : isFail ? "✗" : "?"}
          </div>
          {isSuccess && (
            <div className="px-2.5 py-1 rounded text-xs font-mono text-green-300 border border-green-500/20 bg-green-500/5">
              {sceneConfig?.successAction || "→ hero crosses safely!"}
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

      {/* Context-aware obstacle visual */}
      <div className="absolute z-[9]" style={{ left: "48%", bottom: "64px", transform: "translateX(-50%)" }}>
        {renderObstacleVisual()}

        <div className={`absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg text-xs font-mono border whitespace-nowrap transition-all duration-400 ${
          isSuccess ? "text-green-400 border-green-500/40 bg-green-500/10"
          : isFail ? "text-red-400 border-red-500/40 bg-red-500/10"
          : "text-violet-400 border-violet-500/40 bg-violet-500/10"
        }`}>
          {isSuccess ? obsLabel.success : isFail ? obsLabel.fail : obsLabel.idle}
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
