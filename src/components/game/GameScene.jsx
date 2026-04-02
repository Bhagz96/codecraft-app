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

  // ── WEATHER CHECK — redesigned scene ─────────────────────────────
  if (gameAction === "heroCheckWeather") {
    const skyBg = isFail
      ? "linear-gradient(180deg, #120404 0%, #2d0808 50%, #1a0505 100%)"
      : isSuccess
        ? "linear-gradient(180deg, #0a1628 0%, #1e3a5c 38%, #c97335 72%, #7c3010 100%)"
        : "linear-gradient(180deg, #0c1a32 0%, #1a3050 38%, #d4803a 72%, #8a3d10 100%)";

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: skyBg, transition: "background 0.8s ease" }}>

        {/* ── BLAZING SUN ── */}
        <svg className="absolute z-10" style={{ top: "5%", left: "56%" }} width="92" height="92" viewBox="0 0 92 92">
          {/* Outer corona */}
          <circle cx="46" cy="46" r="40" fill="#fb923c" opacity="0.07">
            <animate attributeName="r" values="36;44;36" dur="3.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="46" cy="46" r="28" fill="#fbbf24" opacity="0.14">
            <animate attributeName="r" values="26;32;26" dur="2.2s" repeatCount="indefinite" />
          </circle>
          {/* Main disc */}
          <circle cx="46" cy="46" r="18" fill="#fbbf24" />
          <circle cx="46" cy="46" r="12" fill="#fde68a" />
          {/* Inner highlight */}
          <circle cx="41" cy="41" r="5" fill="white" opacity="0.3" />
          {/* 12 rays — alternating thick/thin */}
          {Array.from({ length: 12 }, (_, i) => i * 30).map((a, i) => (
            <line key={i}
              x1={46 + Math.cos(a * Math.PI / 180) * 21}
              y1={46 + Math.sin(a * Math.PI / 180) * 21}
              x2={46 + Math.cos(a * Math.PI / 180) * (i % 2 === 0 ? 33 : 28)}
              y2={46 + Math.sin(a * Math.PI / 180) * (i % 2 === 0 ? 33 : 28)}
              stroke="#fbbf24" strokeWidth={i % 2 === 0 ? "2.5" : "1.5"} strokeLinecap="round" opacity="0.8"
            />
          ))}
        </svg>

        {/* ── HEAT SHIMMER ── */}
        {!isFail && (
          <svg className="absolute z-[6]" style={{ bottom: "34%", left: "8%", width: "84%", height: "10%" }} viewBox="0 0 600 44" preserveAspectRatio="none">
            {[8, 20, 32].map((y, i) => (
              <path key={i} d={`M 0,${y} Q 150,${y - 7} 300,${y} Q 450,${y + 7} 600,${y}`}
                stroke="#fbbf2430" strokeWidth="1.5" fill="none">
                <animate attributeName="d"
                  values={`M 0,${y} Q 150,${y-7} 300,${y} Q 450,${y+7} 600,${y};M 0,${y} Q 150,${y+5} 300,${y} Q 450,${y-5} 600,${y};M 0,${y} Q 150,${y-7} 300,${y} Q 450,${y+7} 600,${y}`}
                  dur={`${1.6 + i * 0.45}s`} repeatCount="indefinite" />
              </path>
            ))}
          </svg>
        )}

        {/* ── DISTANT MOUNTAIN RANGE ── */}
        <svg className="absolute z-[4]" style={{ bottom: "30%", left: 0, width: "100%" }} viewBox="0 0 800 90" preserveAspectRatio="none">
          <polygon points="0,90 90,22 190,65 310,8 440,52 560,16 680,42 770,18 800,30 800,90" fill="#1a2d45" opacity="0.45" />
          <polygon points="0,90 60,48 140,78 250,28 370,62 480,32 600,58 700,28 800,46 800,90" fill="#111e2e" opacity="0.6" />
        </svg>

        {/* ── GROUND STRIP ── */}
        <div className="absolute z-[5]" style={{ bottom: 0, left: 0, right: 0, height: "65px" }}>
          <svg width="100%" height="65" viewBox="0 0 800 65" preserveAspectRatio="none">
            <rect x="0" y="0" width="800" height="65" fill="#5c3d1e" />
            {/* Sandy dirt path fork */}
            <path d="M 260,65 Q 380,20 450,0" stroke="#9b7045" strokeWidth="100" fill="none" opacity="0.45" />
            <path d="M 540,65 Q 420,20 450,0" stroke="#9b7045" strokeWidth="80" fill="none" opacity="0.3" />
            {/* Path fork centerlines */}
            <path d="M 320,65 Q 400,28 450,4" stroke="#c4964a" strokeWidth="2" fill="none" strokeDasharray="8,6" opacity="0.4" />
            <path d="M 480,65 Q 460,30 450,4" stroke="#c4964a" strokeWidth="2" fill="none" strokeDasharray="8,6" opacity="0.35" />
            {/* Grass left */}
            <rect x="0" y="0" width="90" height="65" fill="#2d6a1e" />
            {/* Grass right */}
            <rect x="710" y="0" width="90" height="65" fill="#2d6a1e" />
            {/* Top-edge horizon shadow */}
            <rect x="0" y="0" width="800" height="5" fill="#0d0807" opacity="0.6" />
            {/* Pebbles scattered on path */}
            {[[150,30],[230,42],[360,28],[500,35],[610,25],[680,40]].map(([x,y],i) => (
              <ellipse key={i} cx={x} cy={y} rx="5" ry="3" fill="#3a2510" opacity="0.55" />
            ))}
          </svg>
        </div>

        {/* ── GRASS BLADES left edge ── */}
        <svg className="absolute z-[8]" style={{ bottom: "63px", left: "0", width: "11%" }} viewBox="0 0 80 48" preserveAspectRatio="none">
          {[6,14,22,30,38,48,58,68].map((x, i) => (
            <g key={i}>
              <path d={`M${x},46 C${x-3},${32-i%3*6} ${x-6},${18-i%2*7} ${x-4},${8-i%3*4}`}
                stroke="#22c55e" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.9">
                <animate attributeName="d"
                  values={`M${x},46 C${x-3},${32-i%3*6} ${x-6},${18-i%2*7} ${x-4},${8-i%3*4};M${x},46 C${x},${32-i%3*6} ${x-3},${18-i%2*7} ${x-1},${8-i%3*4};M${x},46 C${x-3},${32-i%3*6} ${x-6},${18-i%2*7} ${x-4},${8-i%3*4}`}
                  dur={`${1.3+i*0.18}s`} repeatCount="indefinite" />
              </path>
              <path d={`M${x+4},46 C${x+5},${35-i%2*6} ${x+3},${20-i%3*5} ${x+5},${11-i%2*4}`}
                stroke="#16a34a" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
            </g>
          ))}
        </svg>

        {/* ── GRASS BLADES right edge ── */}
        <svg className="absolute z-[8]" style={{ bottom: "63px", right: "0", width: "11%" }} viewBox="0 0 80 48" preserveAspectRatio="none">
          {[6,14,22,30,38,48,58,68].map((x, i) => (
            <g key={i}>
              <path d={`M${x},46 C${x+3},${32-i%3*6} ${x+6},${18-i%2*7} ${x+4},${8-i%3*4}`}
                stroke="#22c55e" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.9" />
              <path d={`M${x-3},46 C${x-2},${35-i%2*6} ${x+1},${20-i%3*5} ${x-1},${11-i%2*4}`}
                stroke="#16a34a" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
            </g>
          ))}
        </svg>

        {/* ── SHADE TREE — if True branch (rest here) ── */}
        <div className="absolute z-[9]" style={{ left: "40%", bottom: "60px", transform: "translateX(-50%)" }}>
          <svg width="136" height="185" viewBox="0 0 136 185" overflow="visible">
            {/* Ground shadow — expands when hero arrives */}
            <ellipse cx="68" cy="178" rx={isSuccess ? "62" : "46"} ry="10" fill="#00000055" style={{ transition: "rx 0.8s" }}>
              {isSuccess && <animate attributeName="rx" values="58;68;58" dur="3.2s" repeatCount="indefinite" />}
            </ellipse>
            {/* Dappled sunlight spots in shade */}
            {isSuccess && [[-22,163],[-10,170],[3,165],[16,172],[28,166]].map(([dx,dy],i) => (
              <ellipse key={i} cx={68+dx} cy={dy} rx="4" ry="2" fill="#fde68a" opacity="0.22">
                <animate attributeName="opacity" values="0.08;0.32;0.08" dur={`${0.9+i*0.4}s`} repeatCount="indefinite" />
              </ellipse>
            ))}
            {/* Trunk */}
            <rect x="59" y="112" width="18" height="66" rx="5" fill="#7c4a1e" />
            <rect x="63" y="112" width="6" height="66" rx="3" fill="#9b6432" opacity="0.45" />
            {/* Visible roots */}
            <path d="M59,172 Q46,180 34,176" stroke="#7c4a1e" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M77,172 Q90,180 102,176" stroke="#7c4a1e" strokeWidth="5" fill="none" strokeLinecap="round" />
            {/* Canopy — 5 layers, darkest at back */}
            <ellipse cx="68" cy="96" rx="52" ry="38" fill="#14532d" />
            <ellipse cx="66" cy="80" rx="44" ry="32" fill="#166534" />
            <ellipse cx="70" cy="64" rx="36" ry="28" fill="#15803d">
              {isSuccess && <animate attributeName="rx" values="36;38;36" dur="2.8s" repeatCount="indefinite" />}
            </ellipse>
            <ellipse cx="66" cy="50" rx="27" ry="22" fill="#16a34a" />
            <ellipse cx="64" cy="36" rx="18" ry="16" fill="#22c55e" opacity="0.85" />
            {/* Highlight on canopy top */}
            <ellipse cx="58" cy="30" rx="10" ry="8" fill="#4ade80" opacity="0.28" />
            {/* Animated leaves rustling on success */}
            {isSuccess && [[-14,86],[10,90],[-22,70],[22,74],[-6,54],[16,58],[-12,42],[8,38]].map(([dx,dy],i) => (
              <ellipse key={i} cx={68+dx} cy={dy} rx="5" ry="4" fill="#4ade80" opacity="0.22">
                <animate attributeName="cy" values={`${dy};${dy-5};${dy}`} dur={`${1.0+i*0.22}s`} repeatCount="indefinite" />
              </ellipse>
            ))}
          </svg>
          <div className={`text-center text-xs font-bold font-mono mt-0.5 px-3 py-1 rounded-full border transition-all duration-500 ${
            isSuccess
              ? "text-green-300 bg-green-500/20 border-green-400/50 shadow-md shadow-green-500/20"
              : "text-gray-500 bg-transparent border-gray-600/20"
          }`}>
            {isSuccess ? "✓ resting in shade" : "🌳 rest in shade"}
          </div>
        </div>

        {/* ── MOUNTAIN — if False branch (keep climbing) ── */}
        <div className="absolute z-[7]" style={{ right: "4%", bottom: "60px" }}>
          <svg width="120" height="152" viewBox="0 0 120 152" overflow="visible">
            {/* Back peak (silhouette) */}
            <polygon points="82,10 44,140 120,140" fill="#2d3748" opacity="0.5" />
            {/* Main peak */}
            <polygon points="60,14 10,140 110,140" fill="#374151" />
            {/* Rock face shading */}
            <polygon points="60,14 10,140 60,140" fill="#1f2937" opacity="0.35" />
            {/* Snow cap */}
            <polygon points="60,14 46,50 74,50" fill="white" opacity="0.7" />
            <polygon points="60,14 52,32 68,32" fill="white" opacity="0.9" />
            {/* Rock texture lines */}
            <path d="M32,95 L50,72" stroke="#4b5563" strokeWidth="1.5" fill="none" opacity="0.5" />
            <path d="M62,88 L76,68" stroke="#4b5563" strokeWidth="1.5" fill="none" opacity="0.5" />
            <path d="M38,118 L55,100" stroke="#4b5563" strokeWidth="1" fill="none" opacity="0.4" />
            {/* Boulder detail */}
            <ellipse cx="24" cy="125" rx="8" ry="5" fill="#4b5563" opacity="0.6" />
            <ellipse cx="88" cy="118" rx="6" ry="4" fill="#4b5563" opacity="0.5" />
            {/* Winding trail */}
            <path d="M 60,140 Q 52,118 56,96 Q 60,74 54,54 Q 57,36 60,14"
              stroke="#d4a85a" strokeWidth="2.5" fill="none" strokeDasharray="5,5" opacity="0.55" />
            {/* Distance marker */}
            <text x="80" y="80" fill="#9ca3af" fontSize="7" fontFamily="monospace" opacity="0.65">2 km</text>
            <text x="80" y="89" fill="#9ca3af" fontSize="7" fontFamily="monospace" opacity="0.65">ahead</text>
          </svg>
          <div className={`text-center text-xs font-mono mt-0.5 px-3 py-1 rounded-full border transition-all duration-500 ${
            isFail
              ? "text-orange-400 bg-orange-500/10 border-orange-500/30"
              : isSuccess
                ? "text-gray-600 bg-transparent border-transparent opacity-40"
                : "text-gray-400 bg-transparent border-gray-600/20"
          }`}>
            ⛰ keep climbing
          </div>
        </div>

        {/* ── THERMOMETER — near sun ── */}
        <div className="absolute z-20" style={{ left: "57%", top: "20%" }}>
          <svg width="28" height="86" viewBox="0 0 28 86">
            <circle cx="14" cy="74" r="9" fill="#ef4444" />
            <circle cx="14" cy="74" r="5.5" fill="#fca5a5" opacity="0.8" />
            <rect x="10" y="8" width="8" height="66" rx="4" fill="#374151" />
            <rect x="11" y="8" width="6" height="66" rx="3" fill="#1f2937" />
            <rect x="12" y="20" width="4" height="54" rx="2" fill="#ef4444">
              <animate attributeName="y" values="20;16;20" dur="2.8s" repeatCount="indefinite" />
            </rect>
            {[18, 28, 38, 48, 58, 68].map((y, i) => (
              <line key={i} x1="19" y1={y} x2="24" y2={y} stroke="#6b7280" strokeWidth="1" />
            ))}
            <text x="14" y="5" textAnchor="middle" fill="#fca5a5" fontSize="6" fontFamily="monospace" fontWeight="bold">35°</text>
          </svg>
        </div>

        {/* ── CODE CONDITION PANEL ── */}
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
              {sceneConfig?.successAction || "→ Rest in shade!"}
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

  // ── FORK PATH: Cave Dungeon Two Tunnels ──────────────────────────────
  if (gameAction === "heroForkPath") {
    const pathALabel = sceneConfig?.pathALabel || "A: 7";
    const pathBLabel = sceneConfig?.pathBLabel || "B: 3";

    // Cave geometry — spread wide so hero (CSS 45% ≈ SVG x=366) sits in gap
    // aCX=195 (cave A center), bCX=570 (cave B center)
    // gap from x=313 to x=452 — hero idles at x≈366, enters B at x≈549 on success
    const aCX = 195, bCX = 570, arcY = 335, iR = 78, oR = 118, floorY = 440;

    return (
      <div className="w-full h-full relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full z-[4]" viewBox="0 0 800 500" preserveAspectRatio="xMidYMax slice">
          <defs>
            {/* Mountain cliff face — dark rocky grey-brown */}
            <linearGradient id="dungWall" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1c1a16" />
              <stop offset="45%" stopColor="#252018" />
              <stop offset="100%" stopColor="#0e0c08" />
            </linearGradient>
            {/* Dirt/gravel path floor */}
            <linearGradient id="dungFloor" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2a2010" />
              <stop offset="100%" stopColor="#1a1408" />
            </linearGradient>
            {/* Cave A interior — deep red/orange danger glow */}
            <radialGradient id="dungTunnelA" cx="50%" cy="55%" r="55%">
              <stop offset="0%" stopColor="#7f1d1d" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#450a0a" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1a0000" stopOpacity="1" />
            </radialGradient>
            {/* Cave B interior — blue-white safe exit glow */}
            <radialGradient id="dungTunnelB" cx="50%" cy="55%" r="55%">
              <stop offset="0%" stopColor={isSuccess ? "#bfdbfe" : "#1e3a5f"} stopOpacity="0.9" />
              <stop offset="50%" stopColor={isSuccess ? "#1d4ed8" : "#0f2040"} stopOpacity="0.85" />
              <stop offset="100%" stopColor="#050814" stopOpacity="1" />
            </radialGradient>
            {/* Torch glow — orange */}
            <radialGradient id="torchGlowOrange" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </radialGradient>
            {/* Torch glow — blue */}
            <radialGradient id="torchGlowBlue" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity={isSuccess ? "0.75" : "0.35"} />
              <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
            </radialGradient>
            {/* Vignette */}
            <radialGradient id="dungVignette" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="black" stopOpacity="0" />
              <stop offset="100%" stopColor="black" stopOpacity="0.8" />
            </radialGradient>
            {/* Mist */}
            <linearGradient id="dungMist" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8ab4d4" stopOpacity="0" />
              <stop offset="100%" stopColor="#8ab4d4" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* ══ ROCKY CLIFF FACE — mountain rock texture ══ */}
          <rect x="0" y="0" width="800" height="500" fill="url(#dungWall)" />
          {/* Large irregular rock face shapes — give depth to cliff */}
          {[[0,0,200,180],[180,0,160,140],[320,0,220,160],[500,0,180,150],[650,0,170,180],
            [0,150,180,200],[150,170,200,180],[600,140,200,210],[0,340,160,160],[640,330,160,170]].map(([x,y,w,h],i) => (
            <ellipse key={i} cx={x+w/2} cy={y+h/2} rx={w/2} ry={h/2}
              fill={["#201c14","#1a1810","#282218","#1e1a12","#242018"][i%5]} opacity="0.5" />
          ))}
          {/* Rock crack lines — natural cliff fissures */}
          {[
            `M 80,0 L 95,60 L 88,120 L 102,200 L 90,280`,
            `M 350,0 L 362,80 L 355,150 L 370,230`,
            `M 620,0 L 608,70 L 618,160 L 605,240 L 615,320`,
            `M 160,0 L 170,45 L 158,90`,
            `M 480,0 L 492,55 L 484,110 L 496,180`,
            `M 730,0 L 718,65 L 728,130`,
          ].map((d,i) => (
            <path key={i} d={d} stroke="#0a0806" strokeWidth={i<3?2.5:1.8} fill="none" opacity="0.6" />
          ))}
          {/* Moss patches — dark green, natural mountain feel */}
          {[[40,80,22,10],[290,55,18,8],[520,40,24,10],[680,90,20,9],[120,200,16,7],[740,180,18,8]].map(([x,y,rx,ry],i) => (
            <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#2d4a1a" opacity="0.45" />
          ))}
          {/* Water seep stains on cliff face */}
          {[[55,0,8,200],[342,0,6,180],[615,0,7,220]].map(([x,y,w,h],i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx="4"
              fill="#1a2a35" opacity="0.2" />
          ))}

          {/* ══ STALACTITES from cliff ceiling ══ */}
          {[[55,0,16,50],[130,0,10,38],[210,0,18,58],[310,0,12,44],[390,0,9,32],
            [445,0,14,48],[540,0,20,65],[625,0,11,40],[708,0,16,54],[772,0,9,34]].map(([x,y,w,h],i) => (
            <g key={i}>
              {/* Main stalactite body */}
              <polygon points={`${x},${y} ${x+w},${y} ${x+w*0.5},${y+h}`}
                fill={["#1e1a12","#2a2016","#161210"][i%3]} />
              {/* Highlight edge */}
              <line x1={x} y1={y} x2={x+w*0.5} y2={y+h}
                stroke="#3a3020" strokeWidth="1" opacity="0.4" />
              {/* Water drip */}
              <circle cx={x+w/2} cy={y+h+2} r="1.8" fill="#5a9ab8" opacity="0.5">
                <animate attributeName="cy" values={`${y+h+2};${y+h+20};${y+h+2}`}
                  dur={`${2.6+i*0.45}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5"
                  dur={`${2.6+i*0.45}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}

          {/* ══ DIRT / GRAVEL PATH — mountain trail leading to caves ══ */}
          <rect x="0" y={floorY} width="800" height="60" fill="url(#dungFloor)" />
          {/* Gravel stones scattered on path */}
          {[[30,455,8,4],[80,462,6,3],[140,448,9,4],[200,458,7,3],[280,451,8,4],
            [340,463,6,3],[420,456,9,4],[490,450,7,3],[560,460,8,4],[630,453,6,3],
            [700,459,8,4],[755,447,7,3]].map(([x,y,rx,ry],i) => (
            <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry}
              fill={["#3a3020","#2a2418","#4a3a28"][i%3]} opacity="0.6" />
          ))}
          {/* Worn trail center track */}
          <path d={`M 0,${floorY+15} Q 400,${floorY+10} 800,${floorY+15}`}
            stroke="#3a2e18" strokeWidth="14" fill="none" opacity="0.4" />

          {/* ══ CAVE A INTERIOR — red danger glow ══ */}
          <path d={`M ${aCX-iR},${floorY} L ${aCX-iR},${arcY} A ${iR},${iR} 0 0 1 ${aCX+iR},${arcY} L ${aCX+iR},${floorY} Z`}
            fill="url(#dungTunnelA)" />
          {/* Red ambient pulse */}
          <path d={`M ${aCX-iR},${floorY} L ${aCX-iR},${arcY} A ${iR},${iR} 0 0 1 ${aCX+iR},${arcY} L ${aCX+iR},${floorY} Z`}
            fill="#ef4444" opacity="0.07">
            <animate attributeName="opacity" values="0.03;0.14;0.03" dur="2s" repeatCount="indefinite" />
          </path>
          {/* Glowing eyes in cave A darkness */}
          <g opacity={isSuccess ? "0.15" : "0.9"} style={{ transition: "opacity 0.9s" }}>
            <ellipse cx={aCX-14} cy={arcY+50} rx="5" ry="3.5" fill="#dc2626" opacity="0.9">
              <animate attributeName="opacity" values="0.9;0.15;0.9" dur="2.3s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx={aCX-2} cy={arcY+50} rx="5" ry="3.5" fill="#dc2626" opacity="0.9">
              <animate attributeName="opacity" values="0.9;0.15;0.9" dur="2.3s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx={aCX+18} cy={arcY+70} rx="4" ry="2.5" fill="#dc2626" opacity="0.65">
              <animate attributeName="opacity" values="0.65;0.08;0.65" dur="3.2s" begin="0.6s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx={aCX+28} cy={arcY+70} rx="4" ry="2.5" fill="#dc2626" opacity="0.65">
              <animate attributeName="opacity" values="0.65;0.08;0.65" dur="3.2s" begin="0.6s" repeatCount="indefinite" />
            </ellipse>
          </g>
          {/* Fire licking out of cave A mouth */}
          {!isSuccess && (
            <g>
              <path d={`M ${aCX-28},${floorY} Q ${aCX-16},${floorY-28} ${aCX-5},${floorY-14} Q ${aCX+6},${floorY-32} ${aCX+18},${floorY-12} Q ${aCX+26},${floorY-26} ${aCX+30},${floorY}`}
                fill="#ef4444" opacity="0.5">
                <animate attributeName="opacity" values="0.3;0.6;0.3" dur="0.65s" repeatCount="indefinite" />
              </path>
              <path d={`M ${aCX-18},${floorY} Q ${aCX-6},${floorY-22} ${aCX+4},${floorY-10} Q ${aCX+14},${floorY-28} ${aCX+22},${floorY}`}
                fill="#f97316" opacity="0.4">
                <animate attributeName="opacity" values="0.25;0.55;0.25" dur="0.82s" begin="0.1s" repeatCount="indefinite" />
              </path>
            </g>
          )}

          {/* ══ CAVE A MOUTH — natural rocky opening ══ */}
          {/* Outer rock face forming the cave mouth (natural jagged shape) */}
          <path d={`
            M ${aCX-oR-10},${floorY}
            L ${aCX-oR-14},${arcY+55}
            L ${aCX-oR-6},${arcY+28}
            L ${aCX-oR+4},${arcY+10}
            L ${aCX-oR+2},${arcY}
            Q ${aCX-iR*0.5},${arcY-oR+iR-10} ${aCX},${arcY-oR-8}
            Q ${aCX+iR*0.5},${arcY-oR+iR-10} ${aCX+oR-2},${arcY}
            L ${aCX+oR-4},${arcY+10}
            L ${aCX+oR+6},${arcY+28}
            L ${aCX+oR+14},${arcY+55}
            L ${aCX+oR+10},${floorY}
            L ${aCX+iR+6},${floorY}
            L ${aCX+iR},${arcY}
            A ${iR},${iR} 0 0 0 ${aCX-iR},${arcY}
            L ${aCX-iR-6},${floorY}
            Z
          `} fill="#2a2016" />
          {/* Rock texture on cave A surround */}
          {[
            [aCX-oR-8, arcY+20, 18, 35],
            [aCX-oR+5, arcY-15, 22, 28],
            [aCX+oR-10, arcY-15, 20, 28],
            [aCX+oR-4, arcY+25, 16, 32],
          ].map(([rx,ry,rw,rh],i) => (
            <ellipse key={i} cx={rx+rw/2} cy={ry+rh/2} rx={rw/2} ry={rh/2}
              fill={["#322a1c","#3a3020","#282010"][i%3]} opacity="0.6" />
          ))}
          {/* Crack on cave A left wall */}
          <path d={`M ${aCX-oR+8},${arcY+5} L ${aCX-oR+16},${arcY+35} L ${aCX-oR+10},${arcY+70}`}
            stroke="#0a0806" strokeWidth="2" fill="none" opacity="0.65" />
          {/* Small stalactites inside cave A mouth */}
          {[[aCX-50,arcY,10,22],[aCX-20,arcY-8,8,18],[aCX+15,arcY-5,9,20],[aCX+42,arcY,10,18]].map(([x,y,w,h],i) => (
            <polygon key={i} points={`${x},${y} ${x+w},${y} ${x+w/2},${y+h}`}
              fill="#1a1610" opacity="0.8" />
          ))}
          {/* Warning symbol scratched into rock above cave A */}
          <g transform={`translate(${aCX},${arcY-oR-24})`}
            opacity={isSuccess ? "0.2" : "0.85"} style={{ transition: "opacity 0.8s" }}>
            <ellipse cx="0" cy="2" rx="17" ry="15" fill="#1e1208" stroke="#5a2a10" strokeWidth="1.5" />
            <text x="0" y="8" textAnchor="middle" fill="#dc2626" fontSize="16"
              fontFamily="monospace" fontWeight="bold">☠</text>
          </g>

          {/* ══ CAVE B INTERIOR — blue-white safe glow ══ */}
          <path d={`M ${bCX-iR},${floorY} L ${bCX-iR},${arcY} A ${iR},${iR} 0 0 1 ${bCX+iR},${arcY} L ${bCX+iR},${floorY} Z`}
            fill="url(#dungTunnelB)" />
          {/* Safe light at back of cave B */}
          <ellipse cx={bCX} cy={arcY+18} rx={iR*0.5} ry="20"
            fill={isSuccess ? "#bfdbfe" : "#1e40af"} opacity={isSuccess ? "0.5" : "0.15"}
            style={{ transition: "all 0.9s" }}>
            {isSuccess && <animate attributeName="opacity" values="0.38;0.65;0.38" dur="1.5s" repeatCount="indefinite" />}
          </ellipse>
          {/* Success flash in B */}
          {isSuccess && (
            <path d={`M ${bCX-iR},${floorY} L ${bCX-iR},${arcY} A ${iR},${iR} 0 0 1 ${bCX+iR},${arcY} L ${bCX+iR},${floorY} Z`}
              fill="#93c5fd" opacity="0.2">
              <animate attributeName="opacity" values="0.1;0.35;0.1" dur="1.1s" repeatCount="indefinite" />
            </path>
          )}

          {/* ══ CAVE B MOUTH — natural rocky opening ══ */}
          <path d={`
            M ${bCX-oR-10},${floorY}
            L ${bCX-oR-14},${arcY+55}
            L ${bCX-oR-6},${arcY+28}
            L ${bCX-oR+4},${arcY+10}
            L ${bCX-oR+2},${arcY}
            Q ${bCX-iR*0.5},${arcY-oR+iR-10} ${bCX},${arcY-oR-8}
            Q ${bCX+iR*0.5},${arcY-oR+iR-10} ${bCX+oR-2},${arcY}
            L ${bCX+oR-4},${arcY+10}
            L ${bCX+oR+6},${arcY+28}
            L ${bCX+oR+14},${arcY+55}
            L ${bCX+oR+10},${floorY}
            L ${bCX+iR+6},${floorY}
            L ${bCX+iR},${arcY}
            A ${iR},${iR} 0 0 0 ${bCX-iR},${arcY}
            L ${bCX-iR-6},${floorY}
            Z
          `} fill="#2a2016" />
          {/* Rock texture on cave B surround */}
          {[
            [bCX-oR-8, arcY+20, 18, 35],
            [bCX-oR+5, arcY-15, 22, 28],
            [bCX+oR-10, arcY-15, 20, 28],
            [bCX+oR-4, arcY+25, 16, 32],
          ].map(([rx,ry,rw,rh],i) => (
            <ellipse key={i} cx={rx+rw/2} cy={ry+rh/2} rx={rw/2} ry={rh/2}
              fill={["#322a1c","#3a3020","#282010"][i%3]} opacity="0.6" />
          ))}
          {/* Success glow rim on cave B opening */}
          {isSuccess && (
            <path d={`
              M ${bCX-oR-10},${floorY} L ${bCX-oR-14},${arcY+55} L ${bCX-oR-6},${arcY+28}
              L ${bCX-oR+4},${arcY+10} L ${bCX-oR+2},${arcY}
              Q ${bCX},${arcY-oR-8} ${bCX+oR-2},${arcY}
              L ${bCX+oR+6},${arcY+28} L ${bCX+oR+14},${arcY+55} L ${bCX+oR+10},${floorY}
            `} fill="none" stroke="#60a5fa" strokeWidth="2.5" opacity="0.6">
              <animate attributeName="opacity" values="0.35;0.75;0.35" dur="1.3s" repeatCount="indefinite" />
            </path>
          )}
          {/* Crack on cave B right wall */}
          <path d={`M ${bCX+oR-8},${arcY+8} L ${bCX+oR-16},${arcY+40} L ${bCX+oR-8},${arcY+75}`}
            stroke="#0a0806" strokeWidth="1.8" fill="none" opacity="0.6" />
          {/* Small stalactites inside cave B mouth */}
          {[[bCX-50,arcY,10,18],[bCX-22,arcY-6,8,16],[bCX+12,arcY-4,9,20],[bCX+40,arcY,10,16]].map(([x,y,w,h],i) => (
            <polygon key={i} points={`${x},${y} ${x+w},${y} ${x+w/2},${y+h}`}
              fill="#1a1610" opacity="0.8" />
          ))}

          {/* ══ ROCK SIGNS — chiseled markers on boulders beside each cave ══ */}
          {/* Boulder A — danger */}
          <ellipse cx={aCX-oR-36} cy={floorY+22} rx="34" ry="24" fill="#1e1a12" stroke="#2e2818" strokeWidth="1.5" />
          <ellipse cx={aCX-oR-36} cy={floorY+22} rx="28" ry="18" fill="#1a1610" opacity="0.6" />
          <text x={aCX-oR-36} y={floorY+16} textAnchor="middle" fill="#dc2626"
            fontSize="10" fontFamily="monospace" fontWeight="bold">⚠ {pathALabel}</text>
          <text x={aCX-oR-36} y={floorY+30} textAnchor="middle" fill="#9ca3af"
            fontSize="7" fontFamily="monospace" opacity="0.8">DANGER</text>

          {/* Boulder B — safe */}
          <ellipse cx={bCX+oR+36} cy={floorY+22} rx="34" ry="24"
            fill={isSuccess ? "#0f1e30" : "#1e1a12"} stroke={isSuccess ? "#1e3a5f" : "#2e2818"} strokeWidth="1.5"
            style={{ transition: "all 0.7s" }} />
          <ellipse cx={bCX+oR+36} cy={floorY+22} rx="28" ry="18" fill="#1a1610" opacity="0.6" />
          <text x={bCX+oR+36} y={floorY+16} textAnchor="middle"
            fill={isSuccess ? "#60a5fa" : "#d1d5db"}
            fontSize="10" fontFamily="monospace" fontWeight="bold">✓ {pathBLabel}</text>
          <text x={bCX+oR+36} y={floorY+30} textAnchor="middle"
            fill={isSuccess ? "#60a5fa" : "#9ca3af"}
            fontSize="7" fontFamily="monospace" opacity="0.8">SAFE</text>

          {/* ══ THREE TORCHES — mounted on rock wall ══ */}
          {[[aCX-oR-8, arcY+100, "orange"], [(aCX+bCX)/2, arcY+85, "orange"], [bCX+oR+8, arcY+100, "blue"]].map(([tx,ty,color],i) => (
            <g key={i}>
              <circle cx={tx} cy={ty-28} r="28" fill={color === "blue" ? "url(#torchGlowBlue)" : "url(#torchGlowOrange)"} />
              {/* Torch bracket on rock */}
              <rect x={tx-2} y={ty-6} width="4" height="10" rx="1" fill="#4a3a20" />
              {/* Torch handle */}
              <rect x={tx-2.5} y={ty-20} width="5" height="15" rx="1.5" fill="#6b4a20" stroke="#4a3015" strokeWidth="0.8" />
              {/* Torch cup */}
              <rect x={tx-4} y={ty-26} width="8" height="7" rx="1.5" fill="#8a5a28" />
              {/* Flame outer */}
              <path d={`M ${tx},${ty-33} Q ${tx-5},${ty-42} ${tx-2},${ty-48} Q ${tx+1},${ty-41} ${tx+5},${ty-46} Q ${tx+7},${ty-38} ${tx},${ty-33}`}
                fill={color === "blue" ? "#93c5fd" : "#f97316"} opacity="0.9">
                <animate attributeName="opacity" values="0.8;1;0.65;0.95;0.8"
                  dur={`${0.5+i*0.15}s`} repeatCount="indefinite" />
              </path>
              {/* Flame inner */}
              <path d={`M ${tx},${ty-33} Q ${tx+4},${ty-44} ${tx+1},${ty-50} Q ${tx-2},${ty-43} ${tx-4},${ty-47} Q ${tx-5},${ty-40} ${tx},${ty-33}`}
                fill={color === "blue" ? "#bfdbfe" : "#fbbf24"} opacity="0.7">
                <animate attributeName="opacity" values="0.55;0.85;0.45;0.75;0.55"
                  dur={`${0.4+i*0.12}s`} begin="0.08s" repeatCount="indefinite" />
              </path>
            </g>
          ))}

          {/* ══ SCATTERED ROCKS on path between caves ══ */}
          {[[330,445,12,8],[365,452,9,6],[410,448,14,9],[440,456,10,6]].map(([x,y,rx,ry],i) => (
            <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry}
              fill={["#2a2418","#322a1c","#242018"][i%3]} opacity="0.7" />
          ))}

          {/* ══ FLOOR MIST ══ */}
          <rect x="0" y={415} width="800" height="85" fill="url(#dungMist)" opacity="0.65" />
          {[100,260,400,540,680].map((mx,i) => (
            <ellipse key={i} cx={mx} cy={450} rx="50" ry="10" fill="#8ab4d4" opacity="0">
              <animate attributeName="cx" values={`${mx};${mx+30};${mx}`}
                dur={`${5.5+i*1.1}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.09;0.06;0.11;0"
                dur={`${5.5+i*1.1}s`} repeatCount="indefinite" />
            </ellipse>
          ))}

          {/* ══ VIGNETTE ══ */}
          <rect x="0" y="0" width="800" height="500" fill="url(#dungVignette)" />
        </svg>

        {/* Condition panel */}
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
