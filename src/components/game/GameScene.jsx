/**
 * GAME SCENE
 * ==========
 * The visual game panel that shows the hero in different dungeon scenarios.
 * The scene reacts to whether the user's code answer was correct or incorrect.
 *
 * Props:
 *   sceneId   – which scene to show (matches lesson concept + level)
 *   result    – null (waiting), "correct", or "incorrect"
 *   hero      – hero data object from hero.js
 *
 * Scene mapping:
 *   "hero-spawn"     – Variables L1: Hero materializes, stats appear
 *   "dungeon-room"   – Variables L2-L5: Exploring a room, opening chests
 *   "combat-arena"   – Loops L1-L5: Fighting enemy waves
 *   "the-gate"       – Conditions L1-L5: Making decisions at a gate/door
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

  // Shared props passed to every scene
  const sceneProps = { phase, heroColor, heroName, hero, gameAction, sceneConfig };

  // Pick the right scene — extensible via sceneId in lesson data
  const renderScene = () => {
    switch (sceneId) {
      case "hero-spawn":
        return <HeroSpawnScene {...sceneProps} />;
      case "dungeon-room":
        return <DungeonRoomScene {...sceneProps} />;
      case "mountain-trail":
        return <MountainTrailScene {...sceneProps} />;
      case "combat-arena":
        return <CombatArenaScene {...sceneProps} />;
      case "the-gate":
        return <TheGateScene {...sceneProps} />;
      default:
        return <HeroSpawnScene {...sceneProps} />;
    }
  };

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden">
      {/* Scene header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#161b22] border-b border-[#30363d]">
        <span className="text-xs text-gray-500 font-mono">
          {sceneId.replace("-", " ")}
        </span>
        {hero?.name && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-mono">{heroName}</span>
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

// =====================
// SCENE 1: HERO SPAWN
// =====================
// Used for Variables L1 — Hero materializes with stats
// gameActions: "heroNameSet", "heroStatsInit", "heroDataStore"
function HeroSpawnScene({ phase, heroColor, heroName, hero, gameAction, sceneConfig }) {
  // Pick status message based on gameAction
  const successMsg = {
    heroNameSet: `✦ ${heroName} has entered the game! ✦`,
    heroStatsInit: `✦ ${heroName}'s stats are set! ✦`,
    heroDataStore: `✦ Data saved to ${heroName}'s profile! ✦`,
  }[gameAction] || "✦ Variables set successfully! ✦";

  const failMsg = {
    heroNameSet: `✗ Name not recognized — check your code`,
    heroStatsInit: `✗ Stats error — values don't match`,
    heroDataStore: `✗ Data corrupted — try again`,
  }[gameAction] || "✗ Code error — try again";

  return (
    <div className="w-full h-full relative flex items-center justify-center"
         style={{ background: "linear-gradient(180deg, #0d1117 0%, #1a1033 50%, #0d1117 100%)" }}>

      {/* Dungeon floor tiles */}
      <div className="absolute bottom-0 left-0 right-0 h-12 opacity-20"
           style={{ background: "repeating-linear-gradient(90deg, #2d1b69 0px, #2d1b69 24px, #1a1033 24px, #1a1033 48px)" }} />

      {/* Particles / sparkles */}
      {phase === "success" && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full animate-ping"
              style={{
                backgroundColor: heroColor,
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.15}s`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>
      )}

      {/* Stat change popup */}
      {phase === "success" && sceneConfig?.statChange && (
        <div className="absolute top-4 right-4 animate-bounce">
          <span className="bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-mono px-2 py-1 rounded">
            {sceneConfig.statChange}
          </span>
        </div>
      )}

      {/* Hero */}
      <div className={`flex flex-col items-center transition-all duration-500 ${
        phase === "success" ? "scale-110" : phase === "fail" ? "opacity-60" : ""
      }`}>
        <PixelHero
          color={heroColor}
          size={80}
          animation={phase === "success" ? "victory" : phase === "fail" ? "hurt" : "idle"}
        />

        {/* Hero name tag */}
        <div className="mt-2 px-3 py-1 rounded bg-[#161b22]/80 border border-[#30363d]">
          <span className="text-xs font-mono" style={{ color: heroColor }}>
            {heroName}
          </span>
        </div>

        {/* Stats popup on success */}
        {phase === "success" && hero && (
          <div className="mt-2 flex gap-2 text-xs font-mono animate-bounce">
            <span className="text-green-400">HP:{hero.health}</span>
            <span className="text-red-400">ATK:{hero.attack}</span>
            <span className="text-blue-400">DEF:{hero.defense}</span>
          </div>
        )}
      </div>

      {/* Status text */}
      <div className="absolute bottom-2 left-0 right-0 text-center">
        {phase === "success" && (
          <span className="text-green-400 text-xs font-mono animate-pulse">{successMsg}</span>
        )}
        {phase === "fail" && (
          <span className="text-red-400 text-xs font-mono">{failMsg}</span>
        )}
      </div>
    </div>
  );
}

// =====================
// SCENE 2: DUNGEON ROOM
// =====================
// Used for Variables L2-L5 — Exploring, opening chests, collecting items
// gameActions: "heroCollectItem", "heroStoreData", "heroLearnSkill", "heroBuildInventory"
function DungeonRoomScene({ phase, heroColor, heroName, hero, gameAction, sceneConfig }) {
  const itemEmoji = sceneConfig?.itemEmoji || (phase === "success" ? "📖" : "📦");
  const successEmoji = sceneConfig?.successEmoji || "📖";

  const successMsg = {
    heroCollectItem: `✦ ${heroName} found ${sceneConfig?.itemName || "an item"}! ✦`,
    heroStoreData: `✦ Data stored in ${heroName}'s chest! ✦`,
    heroLearnSkill: `✦ ${heroName} learned a new skill! ✦`,
    heroBuildInventory: `✦ Inventory updated! ✦`,
  }[gameAction] || "✦ Data stored in the chest! ✦";

  return (
    <div className="w-full h-full relative flex items-end justify-center pb-6"
         style={{ background: "linear-gradient(180deg, #0a0a1a 0%, #1a1033 40%, #2d1b4e 100%)" }}>

      {/* Wall texture */}
      <div className="absolute top-0 left-0 right-0 h-20 opacity-10"
           style={{ background: "repeating-linear-gradient(90deg, #4a3080 0px, #4a3080 32px, #3a2060 32px, #3a2060 64px)" }} />

      {/* Stone floor */}
      <div className="absolute bottom-0 left-0 right-0 h-16"
           style={{ background: "repeating-linear-gradient(90deg, #2a2040 0px, #2a2040 32px, #221838 32px, #221838 64px)" }} />

      {/* Torch left */}
      <div className="absolute left-8 top-8 text-2xl animate-pulse">🔥</div>
      {/* Torch right */}
      <div className="absolute right-8 top-8 text-2xl animate-pulse" style={{ animationDelay: "0.5s" }}>🔥</div>

      {/* Treasure chest / item */}
      <div className={`absolute right-16 bottom-6 transition-all duration-500 ${
        phase === "success" ? "scale-110" : ""
      }`}>
        <div className="text-3xl">
          {phase === "success" ? successEmoji : itemEmoji}
        </div>
        {phase === "success" && sceneConfig?.statChange && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-400 text-xs font-mono animate-bounce">
            {sceneConfig.statChange}
          </div>
        )}
        {phase === "success" && !sceneConfig?.statChange && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-400 text-xs font-mono animate-bounce">
            +gold!
          </div>
        )}
      </div>

      {/* Hero walking toward chest */}
      <div className={`transition-all duration-700 ${
        phase === "success" ? "translate-x-8" : phase === "fail" ? "-translate-x-4" : ""
      }`}>
        <PixelHero
          color={heroColor}
          size={72}
          animation={phase === "success" ? "walk" : phase === "fail" ? "hurt" : "idle"}
        />
      </div>

      {/* Status */}
      <div className="absolute bottom-1 left-0 right-0 text-center">
        {phase === "success" && (
          <span className="text-green-400 text-xs font-mono animate-pulse">{successMsg}</span>
        )}
        {phase === "fail" && (
          <span className="text-red-400 text-xs font-mono">
            ✗ The chest remains locked
          </span>
        )}
      </div>
    </div>
  );
}

// =====================
// SCENE 2.5: MOUNTAIN TRAIL
// =====================
// Used for Loops — Hero climbs mountain, collects items along the path
// gameActions: "heroClimbSteps", "heroCollectLoop", "heroTrainLoop"
function MountainTrailScene({ phase, heroColor, heroName, hero, gameAction, sceneConfig }) {
  const [stepsClimbed, setStepsClimbed] = useState(0);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (phase === "success") {
      if (gameAction === "heroClimbSteps") {
        setStepsClimbed((prev) => prev + 1);
      } else if (gameAction === "heroCollectLoop") {
        setItems((prev) => [...prev, sceneConfig?.itemEmoji || "⭐"]);
      }
    }
  }, [phase, gameAction, sceneConfig]);

  // Mountain steps visual
  const totalSteps = 5;
  const currentStep = Math.min(stepsClimbed, totalSteps);

  const successMsg = {
    heroClimbSteps: `✦ ${heroName} climbed a step! (${currentStep}/${totalSteps}) ✦`,
    heroCollectLoop: `✦ ${heroName} collected ${sceneConfig?.itemEmoji || "an item"}! (${items.length} total) ✦`,
    heroTrainLoop: `✦ ${heroName} completed a training rep! ✦`,
  }[gameAction] || `✦ Loop iteration complete! ✦`;

  return (
    <div className="w-full h-full relative overflow-hidden"
         style={{ background: "linear-gradient(180deg, #1a0a2e 0%, #0d1b3e 40%, #1a3020 70%, #2d4020 100%)" }}>

      {/* Stars */}
      {[...Array(6)].map((_, i) => (
        <div key={i} className="absolute w-1 h-1 bg-white rounded-full opacity-40"
             style={{ left: `${10 + i * 16}%`, top: `${5 + (i % 3) * 8}%` }} />
      ))}

      {/* Mountain silhouette */}
      <svg className="absolute bottom-0 left-0 right-0" viewBox="0 0 400 100" preserveAspectRatio="none" style={{ height: "70%" }}>
        <polygon points="0,100 80,30 160,60 200,15 240,55 320,25 400,100" fill="#1a2810" opacity="0.6" />
        <polygon points="0,100 100,45 180,70 250,35 350,50 400,100" fill="#253518" opacity="0.5" />
      </svg>

      {/* Mountain steps */}
      <div className="absolute bottom-8 left-8 flex items-end gap-1">
        {[...Array(totalSteps)].map((_, i) => (
          <div
            key={i}
            className={`transition-all duration-500 rounded-sm ${
              i < currentStep
                ? "bg-green-500/60 border border-green-400/30"
                : "bg-[#1a2810] border border-[#30363d]/30"
            }`}
            style={{ width: 20, height: 12 + i * 8, marginBottom: 0 }}
          />
        ))}
      </div>

      {/* Collected items */}
      {items.length > 0 && (
        <div className="absolute top-3 right-3 flex gap-1">
          {items.map((item, i) => (
            <span key={i} className="text-sm animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
              {item}
            </span>
          ))}
        </div>
      )}

      {/* Hero on the mountain */}
      <div className={`absolute transition-all duration-700`}
           style={{ bottom: `${24 + currentStep * 16}px`, left: `${30 + currentStep * 14}px` }}>
        <PixelHero
          color={heroColor}
          size={64}
          animation={phase === "success" ? "walk" : phase === "fail" ? "hurt" : "idle"}
        />
      </div>

      {/* Trail markers */}
      <div className="absolute bottom-3 left-0 right-0 text-center">
        {phase === "success" && (
          <span className="text-green-400 text-xs font-mono animate-pulse">{successMsg}</span>
        )}
        {phase === "fail" && (
          <span className="text-red-400 text-xs font-mono">✗ Loop error — iteration failed</span>
        )}
        {phase === "idle" && stepsClimbed === 0 && (
          <span className="text-gray-600 text-xs font-mono">Write loops to climb the mountain...</span>
        )}
      </div>
    </div>
  );
}

// =====================
// SCENE 3: COMBAT ARENA
// =====================
// Used for Loops — Fighting waves of enemies
// gameActions: "heroFightWave", "heroRepeatAttack"
function CombatArenaScene({ phase, heroColor, heroName, hero, gameAction, sceneConfig }) {
  const [defeatedCount, setDefeatedCount] = useState(0);

  useEffect(() => {
    if (phase === "success") {
      setDefeatedCount((prev) => prev + 1);
    }
  }, [phase]);

  const enemies = ["slime", "bat", "slime"];

  return (
    <div className="w-full h-full relative flex items-end pb-6"
         style={{ background: "linear-gradient(180deg, #0a0a1a 0%, #1a0a0a 50%, #2d1b1b 100%)" }}>

      {/* Arena floor */}
      <div className="absolute bottom-0 left-0 right-0 h-14"
           style={{ background: "repeating-linear-gradient(90deg, #3a2020 0px, #3a2020 32px, #2a1515 32px, #2a1515 64px)" }} />

      {/* Arena pillars */}
      <div className="absolute left-4 bottom-14 w-4 h-24 bg-gradient-to-b from-[#4a3030] to-[#2a1515] rounded-t opacity-40" />
      <div className="absolute right-4 bottom-14 w-4 h-24 bg-gradient-to-b from-[#4a3030] to-[#2a1515] rounded-t opacity-40" />

      {/* Hero on left */}
      <div className={`ml-8 transition-all duration-300 ${
        phase === "success" ? "translate-x-6" : phase === "fail" ? "-translate-x-2" : ""
      }`}>
        <PixelHero
          color={heroColor}
          size={72}
          animation={phase === "success" ? "attack" : phase === "fail" ? "hurt" : "idle"}
        />
      </div>

      {/* VS indicator */}
      <div className="flex-1 flex items-center justify-center">
        {phase === "success" ? (
          <span className="text-green-400 text-lg font-bold font-mono animate-bounce">HIT!</span>
        ) : phase === "fail" ? (
          <span className="text-red-400 text-lg font-bold font-mono">MISS</span>
        ) : (
          <span className="text-gray-600 text-sm font-mono">VS</span>
        )}
      </div>

      {/* Enemies on right */}
      <div className="mr-8 flex gap-1 items-end">
        {enemies.map((type, i) => (
          <div key={i} className={`transition-all duration-300 ${
            phase === "success" && i === 0 ? "opacity-30 scale-75" : ""
          }`}>
            <PixelEnemy
              type={type}
              size={48}
              animation={phase === "success" && i === 0 ? "defeated" : phase === "fail" ? "idle" : "idle"}
            />
          </div>
        ))}
      </div>

      {/* Combo counter */}
      {defeatedCount > 0 && (
        <div className="absolute top-2 right-3">
          <span className="text-orange-400 text-xs font-mono font-bold">
            x{defeatedCount} combo
          </span>
        </div>
      )}

      {/* Status */}
      <div className="absolute bottom-1 left-0 right-0 text-center">
        {phase === "success" && (
          <span className="text-green-400 text-xs font-mono animate-pulse">
            ✦ {heroName}'s loop hits! Enemy defeated! ✦
          </span>
        )}
        {phase === "fail" && (
          <span className="text-red-400 text-xs font-mono">
            ✗ Loop error — the attack missed
          </span>
        )}
      </div>
    </div>
  );
}

// =====================
// SCENE 4: THE GATE
// =====================
// Used for Conditions — Making decisions at obstacles
// gameActions: "heroCheckWeather", "heroForkPath", "heroObstacle", "heroFinalGate"
function TheGateScene({ phase, heroColor, heroName, hero, gameAction, sceneConfig }) {
  return (
    <div className="w-full h-full relative flex items-end justify-center pb-6"
         style={{ background: "linear-gradient(180deg, #0a0a1a 0%, #0a1a2a 50%, #1a2a3a 100%)" }}>

      {/* Floor */}
      <div className="absolute bottom-0 left-0 right-0 h-14"
           style={{ background: "repeating-linear-gradient(90deg, #1a2a3a 0px, #1a2a3a 32px, #152535 32px, #152535 64px)" }} />

      {/* The Gate */}
      <div className="absolute right-12 bottom-14 flex flex-col items-center">
        {/* Gate frame */}
        <div className={`w-16 h-24 border-4 rounded-t-full transition-all duration-500 ${
          phase === "success"
            ? "border-green-400 bg-green-400/10 shadow-[0_0_20px_rgba(0,255,100,0.3)]"
            : phase === "fail"
              ? "border-red-500 bg-red-500/10 shadow-[0_0_20px_rgba(255,0,0,0.3)]"
              : "border-[#4a5568] bg-[#1a2a3a]/50"
        }`}>
          {/* Gate symbol */}
          <div className="w-full h-full flex items-center justify-center">
            {phase === "success" ? (
              <span className="text-green-400 text-xl">✓</span>
            ) : phase === "fail" ? (
              <span className="text-red-400 text-xl">✗</span>
            ) : (
              <span className="text-gray-500 text-xl">?</span>
            )}
          </div>
        </div>
        <span className="text-xs text-gray-600 font-mono mt-1">
          {phase === "success" ? "OPEN" : phase === "fail" ? "LOCKED" : "if ???"}
        </span>
      </div>

      {/* Condition symbols floating */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-4 text-xs font-mono text-gray-600">
        <span className={phase === "success" ? "text-green-400" : ""}>True</span>
        <span>|</span>
        <span className={phase === "fail" ? "text-red-400" : ""}>False</span>
      </div>

      {/* Hero approaching gate */}
      <div className={`absolute left-12 bottom-6 transition-all duration-700 ${
        phase === "success" ? "translate-x-16" : phase === "fail" ? "-translate-x-4 opacity-80" : ""
      }`}>
        <PixelHero
          color={heroColor}
          size={72}
          animation={phase === "success" ? "walk" : phase === "fail" ? "hurt" : "idle"}
        />
      </div>

      {/* Path dots */}
      <div className="absolute bottom-10 left-28 flex gap-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              phase === "success" ? "bg-green-400" : "bg-gray-600"
            }`}
            style={{ transitionDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>

      {/* Status */}
      <div className="absolute bottom-1 left-0 right-0 text-center">
        {phase === "success" && (
          <span className="text-green-400 text-xs font-mono animate-pulse">
            ✦ {heroName}'s condition is True — path cleared! ✦
          </span>
        )}
        {phase === "fail" && (
          <span className="text-red-400 text-xs font-mono">
            ✗ Condition is False — {heroName} can't pass
          </span>
        )}
      </div>
    </div>
  );
}

export default GameScene;
