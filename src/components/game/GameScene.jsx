/**
 * GAME SCENE — Mountain Quest Edition
 * =====================================
 * The visual game panel that brings the hero's Mountain Quest adventure to life.
 * Scenes react to user's code answers — correct code advances the story.
 *
 * Props:
 *   sceneId   – which scene to show (matches lesson concept + level)
 *   result    – null (waiting), "correct", or "incorrect"
 *   hero      – hero data object from hero.js
 *   gameAction – what animation/reaction to trigger
 *   sceneConfig – extra config (items, stat changes, etc.)
 *
 * Scene mapping:
 *   "hero-spawn"        – Variables L1: Hero appears at mountain base camp
 *   "mountain-camp"     – Variables L2-L5: Base camp — store data, craft items
 *   "mountain-trail"    – Loops L1-L4: Climbing, collecting, training
 *   "mountain-battle"   – Loops L3,L5: Fighting creatures on the mountain
 *   "mountain-obstacle" – Conditions L1-L5: Obstacles, forks, weather, gates
 */

import { useState, useEffect } from "react";
import PixelHero from "./PixelHero";
import PixelEnemy from "./PixelEnemy";

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

  // Scene name for display
  const sceneLabels = {
    "hero-spawn": "base camp — hero arrives",
    "mountain-camp": "base camp — preparing",
    "mountain-trail": "mountain trail — climbing",
    "mountain-battle": "mountain trail — encounter",
    "mountain-obstacle": "mountain path — obstacle ahead",
  };

  const renderScene = () => {
    switch (sceneId) {
      case "hero-spawn":
        return <HeroSpawnScene {...sceneProps} />;
      case "mountain-camp":
        return <MountainCampScene {...sceneProps} />;
      case "mountain-trail":
        return <MountainTrailScene {...sceneProps} />;
      case "mountain-battle":
      case "combat-arena":
        return <MountainBattleScene {...sceneProps} />;
      case "mountain-obstacle":
      case "the-gate":
        return <MountainObstacleScene {...sceneProps} />;
      // Legacy fallbacks
      case "dungeon-room":
        return <MountainCampScene {...sceneProps} />;
      default:
        return <HeroSpawnScene {...sceneProps} />;
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
            <span className="text-xs text-green-400 font-mono">
              HP {hero?.health || 100}/{hero?.maxHealth || 100}
            </span>
            <span className="text-xs text-yellow-400 font-mono">
              {hero?.gold || 0}g
            </span>
          </div>
        )}
      </div>

      {/* Scene content */}
      <div className="relative w-full h-48 md:h-56 overflow-hidden">
        {renderScene()}
      </div>
    </div>
  );
}

// =============================================
// SHARED: Mountain Background with Sky & Peaks
// =============================================
function MountainBackground({ timeOfDay = "day" }) {
  const skyGradient = timeOfDay === "night"
    ? "linear-gradient(180deg, #0a0a2e 0%, #1a1040 40%, #1a3020 80%, #2d4020 100%)"
    : "linear-gradient(180deg, #0d1b3e 0%, #1a3050 30%, #1a4030 70%, #2d5530 100%)";

  return (
    <>
      {/* Sky */}
      <div className="absolute inset-0" style={{ background: skyGradient }} />

      {/* Stars (visible at night) */}
      {timeOfDay === "night" && [...Array(8)].map((_, i) => (
        <div key={i} className="absolute w-1 h-1 bg-white rounded-full opacity-50 animate-pulse"
             style={{ left: `${8 + i * 12}%`, top: `${4 + (i % 4) * 6}%`, animationDelay: `${i * 0.3}s` }} />
      ))}

      {/* Mountain range silhouette */}
      <svg className="absolute bottom-0 left-0 right-0" viewBox="0 0 400 80" preserveAspectRatio="none" style={{ height: "55%" }}>
        <polygon points="0,80 50,25 100,45 150,15 200,40 250,10 300,35 350,20 400,80" fill="#152010" opacity="0.7" />
        <polygon points="0,80 70,40 140,55 200,30 280,50 350,35 400,80" fill="#1a2810" opacity="0.5" />
      </svg>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-12"
           style={{ background: "linear-gradient(180deg, #2d4020 0%, #1a2810 100%)" }} />
    </>
  );
}

// =====================
// SCENE 1: HERO SPAWN
// =====================
// Variables L1 — Hero arrives at the mountain base camp
function HeroSpawnScene({ phase, heroColor, heroName, hero, gameAction, sceneConfig }) {
  const successMsg = {
    heroNameSet: `${heroName} has arrived at Mountain Quest!`,
    heroStatsInit: `${heroName}'s stats are locked in!`,
    heroDataStore: `Game data saved to ${heroName}'s journal!`,
  }[gameAction] || "Variables set — adventure begins!";

  const failMsg = {
    heroNameSet: "Name not recognized — check your code",
    heroStatsInit: "Stats error — values don't match",
    heroDataStore: "Data error — try again",
  }[gameAction] || "Code error — try again";

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <MountainBackground timeOfDay="day" />

      {/* Base camp tent */}
      <div className="absolute right-12 bottom-14 z-10">
        <div className="text-3xl">⛺</div>
      </div>

      {/* Camp fire */}
      <div className="absolute right-24 bottom-12 z-10">
        <div className="text-xl animate-pulse">🔥</div>
      </div>

      {/* Signpost */}
      <div className="absolute left-8 bottom-12 z-10 flex flex-col items-center">
        <div className="bg-[#4a3520] px-2 py-0.5 rounded text-[10px] text-yellow-200 font-mono border border-[#6b5030]">
          SUMMIT →
        </div>
        <div className="w-1 h-4 bg-[#4a3520]" />
      </div>

      {/* Sparkles on success */}
      {phase === "success" && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute w-1.5 h-1.5 rounded-full animate-ping"
                 style={{ backgroundColor: heroColor, left: `${20 + Math.random() * 60}%`, top: `${20 + Math.random() * 50}%`, animationDelay: `${i * 0.15}s`, animationDuration: "1s" }} />
          ))}
        </div>
      )}

      {/* Stat change popup */}
      {phase === "success" && sceneConfig?.statChange && (
        <div className="absolute top-4 right-4 animate-bounce z-20">
          <span className="bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-mono px-2 py-1 rounded">
            {sceneConfig.statChange}
          </span>
        </div>
      )}

      {/* Hero */}
      <div className={`relative z-10 flex flex-col items-center transition-all duration-500 ${
        phase === "success" ? "scale-110" : phase === "fail" ? "opacity-60" : ""
      }`}>
        <PixelHero color={heroColor} size={80}
          animation={phase === "success" ? "victory" : phase === "fail" ? "hurt" : "idle"} />
        <div className="mt-2 px-3 py-1 rounded bg-[#161b22]/80 border border-[#30363d]">
          <span className="text-xs font-mono" style={{ color: heroColor }}>{heroName}</span>
        </div>
        {phase === "success" && hero && (
          <div className="mt-1 flex gap-2 text-xs font-mono animate-bounce">
            <span className="text-green-400">HP:{hero.health}</span>
            <span className="text-red-400">ATK:{hero.attack}</span>
            <span className="text-blue-400">DEF:{hero.defense}</span>
          </div>
        )}
      </div>

      {/* Status text */}
      <div className="absolute bottom-1 left-0 right-0 text-center z-20">
        {phase === "success" && (
          <span className="text-green-400 text-xs font-mono animate-pulse">✦ {successMsg} ✦</span>
        )}
        {phase === "fail" && (
          <span className="text-red-400 text-xs font-mono">✗ {failMsg}</span>
        )}
        {phase === "idle" && (
          <span className="text-gray-500 text-xs font-mono">Write code to set up your hero...</span>
        )}
      </div>
    </div>
  );
}

// =============================
// SCENE 2: MOUNTAIN CAMP
// =============================
// Variables L2-L5 — Hero at base camp: storing data, learning skills, building inventory
function MountainCampScene({ phase, heroColor, heroName, hero, gameAction, sceneConfig }) {
  const [itemsCollected, setItemsCollected] = useState([]);

  useEffect(() => {
    if (phase === "success" && sceneConfig?.itemEmoji) {
      setItemsCollected(prev => [...prev, sceneConfig.itemEmoji]);
    }
  }, [phase]);

  const itemEmoji = sceneConfig?.itemEmoji || "📦";

  const successMsg = {
    heroCollectItem: `${heroName} found ${sceneConfig?.itemName || "an item"}!`,
    heroStoreData: `${heroName} wrote data in the camp journal!`,
    heroLearnSkill: `${heroName} learned a new skill!`,
    heroBuildInventory: `${heroName}'s pack is updated!`,
    heroDataStore: `Data recorded at base camp!`,
  }[gameAction] || "Code executed at base camp!";

  return (
    <div className="w-full h-full relative">
      <MountainBackground timeOfDay="day" />

      {/* Camp tent */}
      <div className="absolute right-6 bottom-14 z-10 text-3xl">⛺</div>

      {/* Campfire with glow */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-12 z-10">
        <div className="text-2xl animate-pulse">🔥</div>
        <div className="absolute -inset-3 bg-orange-500/10 rounded-full blur-md" />
      </div>

      {/* Supply crate / item being worked on */}
      <div className={`absolute left-10 bottom-14 z-10 transition-all duration-500 ${
        phase === "success" ? "scale-125" : ""
      }`}>
        <div className="text-2xl">{phase === "success" ? (sceneConfig?.itemEmoji || "✨") : itemEmoji}</div>
        {phase === "success" && sceneConfig?.statChange && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-yellow-400 text-xs font-mono animate-bounce">
            {sceneConfig.statChange}
          </div>
        )}
      </div>

      {/* Collected items shelf */}
      {itemsCollected.length > 0 && (
        <div className="absolute top-3 right-3 z-20 flex gap-1 bg-[#161b22]/60 rounded px-2 py-1 border border-[#30363d]/50">
          <span className="text-[10px] text-gray-500 font-mono mr-1">pack:</span>
          {itemsCollected.slice(-5).map((item, i) => (
            <span key={i} className="text-sm">{item}</span>
          ))}
        </div>
      )}

      {/* Trees around camp */}
      <div className="absolute left-2 bottom-12 z-10 text-xl opacity-60">🌲</div>
      <div className="absolute left-6 bottom-14 z-10 text-lg opacity-40">🌲</div>
      <div className="absolute right-2 bottom-12 z-10 text-xl opacity-60">🌲</div>
      <div className="absolute right-14 bottom-16 z-10 text-lg opacity-40">🌲</div>

      {/* Hero at camp */}
      <div className={`absolute left-1/2 -translate-x-1/2 bottom-6 z-10 transition-all duration-700 ${
        phase === "success" ? "translate-x-4" : phase === "fail" ? "-translate-x-4" : ""
      }`}>
        <PixelHero color={heroColor} size={68}
          animation={phase === "success" ? "victory" : phase === "fail" ? "hurt" : "idle"} />
      </div>

      {/* Status */}
      <div className="absolute bottom-1 left-0 right-0 text-center z-20">
        {phase === "success" && (
          <span className="text-green-400 text-xs font-mono animate-pulse">✦ {successMsg} ✦</span>
        )}
        {phase === "fail" && (
          <span className="text-red-400 text-xs font-mono">✗ Code error — camp data corrupted</span>
        )}
        {phase === "idle" && (
          <span className="text-gray-500 text-xs font-mono">Base camp — prepare for the climb...</span>
        )}
      </div>
    </div>
  );
}

// =============================
// SCENE 3: MOUNTAIN TRAIL
// =============================
// Loops L1-L4 — Hero climbs mountain, collects items along the path
function MountainTrailScene({ phase, heroColor, heroName, hero, gameAction, sceneConfig }) {
  const [stepsClimbed, setStepsClimbed] = useState(0);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (phase === "success") {
      if (gameAction === "heroClimbSteps") {
        setStepsClimbed((prev) => prev + 1);
      } else if (gameAction === "heroCollectLoop") {
        setItems((prev) => [...prev, sceneConfig?.itemEmoji || "⭐"]);
      } else {
        setStepsClimbed((prev) => prev + 1);
      }
    }
  }, [phase, gameAction, sceneConfig]);

  const totalSteps = 5;
  const currentStep = Math.min(stepsClimbed, totalSteps);

  const successMsg = {
    heroClimbSteps: `${heroName} climbed higher! (${currentStep}/${totalSteps})`,
    heroCollectLoop: `${heroName} collected ${sceneConfig?.itemEmoji || "an item"}! (${items.length} total)`,
    heroTrainLoop: `${heroName} completed a training rep!`,
    heroStoreData: `${heroName}'s data saved on the trail!`,
  }[gameAction] || `Loop iteration complete!`;

  return (
    <div className="w-full h-full relative overflow-hidden">
      <MountainBackground timeOfDay="night" />

      {/* Winding trail path */}
      <svg className="absolute bottom-0 left-0 right-0 z-10" viewBox="0 0 400 120" preserveAspectRatio="none" style={{ height: "75%" }}>
        <path d="M 20,110 Q 80,95 100,80 T 160,60 T 220,40 T 280,25 T 340,10"
              stroke="#4a3820" strokeWidth="12" fill="none" opacity="0.4" strokeLinecap="round" />
        <path d="M 20,110 Q 80,95 100,80 T 160,60 T 220,40 T 280,25 T 340,10"
              stroke="#6b5030" strokeWidth="4" fill="none" opacity="0.3" strokeLinecap="round" strokeDasharray="8 4" />
      </svg>

      {/* Trail markers (rocks/plants) */}
      <div className="absolute bottom-16 left-12 z-10 text-sm opacity-50">🪨</div>
      <div className="absolute bottom-24 left-28 z-10 text-sm opacity-40">🌿</div>
      <div className="absolute bottom-32 right-28 z-10 text-sm opacity-40">🪨</div>
      <div className="absolute bottom-40 right-16 z-10 text-sm opacity-50">🌿</div>

      {/* Step progress indicators along the trail */}
      <div className="absolute bottom-6 left-4 z-20 flex items-end gap-1.5">
        {[...Array(totalSteps)].map((_, i) => (
          <div key={i}
            className={`transition-all duration-500 rounded ${
              i < currentStep
                ? "bg-green-500/70 border border-green-400/40 shadow-[0_0_6px_rgba(0,255,100,0.3)]"
                : "bg-[#1a2810]/60 border border-[#30363d]/30"
            }`}
            style={{ width: 16, height: 10 + i * 6 }}
          />
        ))}
        <span className="text-[10px] text-gray-500 font-mono ml-1">{currentStep}/{totalSteps}</span>
      </div>

      {/* Collected items display */}
      {items.length > 0 && (
        <div className="absolute top-3 right-3 z-20 flex gap-1 bg-[#161b22]/60 rounded px-2 py-1 border border-[#30363d]/50">
          {items.slice(-6).map((item, i) => (
            <span key={i} className="text-sm animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
              {item}
            </span>
          ))}
        </div>
      )}

      {/* Hero climbing the trail */}
      <div className={`absolute z-10 transition-all duration-700`}
           style={{ bottom: `${20 + currentStep * 18}px`, left: `${20 + currentStep * 16}%` }}>
        <PixelHero color={heroColor} size={60}
          animation={phase === "success" ? "walk" : phase === "fail" ? "hurt" : "idle"} />
      </div>

      {/* Summit flag at top */}
      <div className="absolute top-6 right-8 z-10 text-lg opacity-60">🚩</div>

      {/* Status */}
      <div className="absolute bottom-1 left-0 right-0 text-center z-20">
        {phase === "success" && (
          <span className="text-green-400 text-xs font-mono animate-pulse">✦ {successMsg} ✦</span>
        )}
        {phase === "fail" && (
          <span className="text-red-400 text-xs font-mono">✗ Loop error — {heroName} slipped!</span>
        )}
        {phase === "idle" && stepsClimbed === 0 && (
          <span className="text-gray-500 text-xs font-mono">Write loops to climb the mountain...</span>
        )}
      </div>
    </div>
  );
}

// =============================
// SCENE 4: MOUNTAIN BATTLE
// =============================
// Loops L3 & L5 — Fighting mountain creatures
function MountainBattleScene({ phase, heroColor, heroName, hero, gameAction, sceneConfig }) {
  const [defeatedCount, setDefeatedCount] = useState(0);

  useEffect(() => {
    if (phase === "success") {
      setDefeatedCount((prev) => prev + 1);
    }
  }, [phase]);

  const enemies = ["slime", "bat", "slime"];

  return (
    <div className="w-full h-full relative flex items-end pb-6">
      <MountainBackground timeOfDay="night" />

      {/* Danger zone ground */}
      <div className="absolute bottom-0 left-0 right-0 h-10 z-10"
           style={{ background: "linear-gradient(180deg, #3a2020 0%, #2a1515 100%)" }} />

      {/* Rocky outcrops */}
      <div className="absolute left-2 bottom-10 z-10 text-lg opacity-40">🪨</div>
      <div className="absolute right-2 bottom-10 z-10 text-lg opacity-40">🪨</div>

      {/* Hero on left */}
      <div className={`relative z-10 ml-8 transition-all duration-300 ${
        phase === "success" ? "translate-x-6" : phase === "fail" ? "-translate-x-2" : ""
      }`}>
        <PixelHero color={heroColor} size={72}
          animation={phase === "success" ? "attack" : phase === "fail" ? "hurt" : "idle"} />
      </div>

      {/* VS / Hit indicator */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        {phase === "success" ? (
          <span className="text-green-400 text-lg font-bold font-mono animate-bounce">HIT!</span>
        ) : phase === "fail" ? (
          <span className="text-red-400 text-lg font-bold font-mono">MISS</span>
        ) : (
          <span className="text-gray-600 text-sm font-mono">VS</span>
        )}
      </div>

      {/* Enemies on right */}
      <div className="relative z-10 mr-8 flex gap-1 items-end">
        {enemies.map((type, i) => (
          <div key={i} className={`transition-all duration-300 ${
            phase === "success" && i <= defeatedCount - 1 ? "opacity-30 scale-75" : ""
          }`}>
            <PixelEnemy type={type} size={48}
              animation={phase === "success" && i === defeatedCount - 1 ? "defeated" : "idle"} />
          </div>
        ))}
      </div>

      {/* Combo counter */}
      {defeatedCount > 0 && (
        <div className="absolute top-2 right-3 z-20">
          <span className="text-orange-400 text-xs font-mono font-bold bg-[#161b22]/80 px-2 py-0.5 rounded border border-orange-500/20">
            x{defeatedCount} combo
          </span>
        </div>
      )}

      {/* Status */}
      <div className="absolute bottom-1 left-0 right-0 text-center z-20">
        {phase === "success" && (
          <span className="text-green-400 text-xs font-mono animate-pulse">
            ✦ {heroName}'s loop hits! Creature defeated! ✦
          </span>
        )}
        {phase === "fail" && (
          <span className="text-red-400 text-xs font-mono">
            ✗ Loop error — {heroName}'s attack missed!
          </span>
        )}
      </div>
    </div>
  );
}

// =============================
// SCENE 5: MOUNTAIN OBSTACLE
// =============================
// Conditions L1-L5 — Hero encounters obstacles: rocks, rivers, weather, forks, gates
function MountainObstacleScene({ phase, heroColor, heroName, hero, gameAction, sceneConfig }) {
  const [obstaclesCleared, setObstaclesCleared] = useState(0);

  useEffect(() => {
    if (phase === "success") {
      setObstaclesCleared(prev => prev + 1);
    }
  }, [phase]);

  // Different obstacle visuals based on gameAction
  const obstacleVisual = {
    heroCheckWeather: { emoji: "🌦️", label: "weather", idle: "☁️" },
    heroForkPath: { emoji: "🪧", label: "fork in road", idle: "🪧" },
    heroObstacle: { emoji: "🪨", label: "obstacle", idle: "🪨" },
    heroFinalGate: { emoji: "⛩️", label: "summit gate", idle: "⛩️" },
  }[gameAction] || { emoji: "🪨", label: "obstacle", idle: "🪨" };

  const successMsg = {
    heroCheckWeather: `${heroName} read the weather — safe to proceed!`,
    heroForkPath: `${heroName} chose the right path!`,
    heroObstacle: `${heroName} solved the obstacle!`,
    heroFinalGate: `${heroName} opened the gate!`,
  }[gameAction] || `${heroName}'s condition check passed!`;

  const failMsg = {
    heroCheckWeather: `Weather check failed — wrong condition`,
    heroForkPath: `Wrong path — check your logic`,
    heroObstacle: `Obstacle blocked — code error`,
    heroFinalGate: `Gate stays locked — condition is False`,
  }[gameAction] || `Condition is False — try again`;

  return (
    <div className="w-full h-full relative">
      <MountainBackground timeOfDay="day" />

      {/* Path forking visual */}
      <svg className="absolute bottom-0 left-0 right-0 z-10" viewBox="0 0 400 100" preserveAspectRatio="none" style={{ height: "40%" }}>
        {/* Main path */}
        <path d="M 0,80 Q 100,75 200,60" stroke="#6b5030" strokeWidth="8" fill="none" opacity="0.3" />
        {/* True path (top) */}
        <path d="M 200,60 Q 280,40 400,30" stroke={phase === "success" ? "#22c55e" : "#6b5030"} strokeWidth="6" fill="none"
              opacity={phase === "success" ? "0.5" : "0.2"} />
        {/* False path (bottom) */}
        <path d="M 200,60 Q 280,75 400,85" stroke={phase === "fail" ? "#ef4444" : "#6b5030"} strokeWidth="6" fill="none"
              opacity={phase === "fail" ? "0.5" : "0.2"} />
      </svg>

      {/* True/False path labels */}
      <div className="absolute top-3 right-4 z-20 flex flex-col gap-1 text-xs font-mono">
        <span className={`px-2 py-0.5 rounded border ${
          phase === "success" ? "text-green-400 border-green-500/30 bg-green-500/10" : "text-gray-600 border-gray-700/30"
        }`}>True →</span>
        <span className={`px-2 py-0.5 rounded border ${
          phase === "fail" ? "text-red-400 border-red-500/30 bg-red-500/10" : "text-gray-600 border-gray-700/30"
        }`}>False →</span>
      </div>

      {/* Obstacle at the fork */}
      <div className={`absolute left-1/2 -translate-x-1/2 bottom-20 z-10 transition-all duration-500 ${
        phase === "success" ? "scale-75 opacity-50" : phase === "fail" ? "scale-110" : ""
      }`}>
        <div className="text-3xl">{phase === "success" ? "✨" : obstacleVisual.idle}</div>
        <div className="text-center mt-0.5">
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
            phase === "success"
              ? "text-green-400 bg-green-500/10 border border-green-500/20"
              : phase === "fail"
                ? "text-red-400 bg-red-500/10 border border-red-500/20"
                : "text-gray-500 bg-[#161b22]/60 border border-[#30363d]/30"
          }`}>
            {phase === "success" ? "CLEARED" : phase === "fail" ? "BLOCKED" : `if ???`}
          </span>
        </div>
      </div>

      {/* Obstacles cleared counter */}
      {obstaclesCleared > 0 && (
        <div className="absolute top-3 left-3 z-20">
          <span className="text-emerald-400 text-xs font-mono bg-[#161b22]/60 px-2 py-0.5 rounded border border-emerald-500/20">
            {obstaclesCleared} cleared
          </span>
        </div>
      )}

      {/* Hero approaching obstacle */}
      <div className={`absolute left-10 bottom-8 z-10 transition-all duration-700 ${
        phase === "success" ? "translate-x-20" : phase === "fail" ? "-translate-x-3 opacity-80" : ""
      }`}>
        <PixelHero color={heroColor} size={68}
          animation={phase === "success" ? "walk" : phase === "fail" ? "hurt" : "idle"} />
      </div>

      {/* Small trees along the path */}
      <div className="absolute left-4 bottom-14 z-10 text-sm opacity-40">🌲</div>
      <div className="absolute right-4 bottom-14 z-10 text-sm opacity-40">🌲</div>

      {/* Status */}
      <div className="absolute bottom-1 left-0 right-0 text-center z-20">
        {phase === "success" && (
          <span className="text-green-400 text-xs font-mono animate-pulse">✦ {successMsg} ✦</span>
        )}
        {phase === "fail" && (
          <span className="text-red-400 text-xs font-mono">✗ {failMsg}</span>
        )}
        {phase === "idle" && (
          <span className="text-gray-500 text-xs font-mono">Write conditions to navigate the obstacle...</span>
        )}
      </div>
    </div>
  );
}

export default GameScene;
