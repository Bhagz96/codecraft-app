import { useState } from "react";
import { Link } from "react-router-dom";
import lessons from "../data/lessons";
import { getAllProgress, isLevelUnlocked, getProgress } from "../data/progress";
import { getHero, hasHero, createHero } from "../data/hero";
import PixelHero from "../components/game/PixelHero";

/**
 * HOME PAGE — Version 2 with Hero Creation
 * ==========================================
 * If no hero exists, shows a hero creation screen first.
 * Then shows concept cards with level progress indicators.
 */

// Available hero colors
const HERO_COLORS = [
  { name: "Cyan", value: "#00d4ff" },
  { name: "Green", value: "#00ff88" },
  { name: "Purple", value: "#a855f7" },
  { name: "Orange", value: "#ff6b35" },
  { name: "Pink", value: "#ec4899" },
  { name: "Gold", value: "#f59e0b" },
];

function HomePage() {
  const [heroExists, setHeroExists] = useState(hasHero());
  const [heroName, setHeroName] = useState("");
  const [selectedColor, setSelectedColor] = useState(HERO_COLORS[0].value);
  const hero = heroExists ? getHero() : null;
  const progress = getAllProgress();

  // Handle hero creation
  const handleCreateHero = () => {
    if (heroName.trim().length === 0) return;
    createHero(heroName.trim(), selectedColor);
    setHeroExists(true);
  };

  // ===========================
  // HERO CREATION SCREEN
  // ===========================
  if (!heroExists) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-orange-400 mb-2">
          CodeCraft
        </h1>
        <p className="text-gray-400 text-sm font-mono mb-10">
          Create your hero to begin
        </p>

        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 max-w-md w-full">
          {/* Hero preview */}
          <div className="flex justify-center mb-6">
            <div className="bg-[#0d1117] rounded-xl p-6 border border-[#30363d]">
              <PixelHero color={selectedColor} size={96} animation="idle" />
            </div>
          </div>

          {/* Name input */}
          <div className="mb-6">
            <label className="block text-xs text-gray-500 font-mono uppercase tracking-wider mb-2">
              Hero Name
            </label>
            <input
              type="text"
              value={heroName}
              onChange={(e) => setHeroName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateHero()}
              placeholder="Enter a name..."
              maxLength={20}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-3 text-gray-100 font-mono text-lg focus:outline-none focus:border-cyan-500/50 placeholder-gray-600 transition-colors"
              autoFocus
            />
          </div>

          {/* Color picker */}
          <div className="mb-8">
            <label className="block text-xs text-gray-500 font-mono uppercase tracking-wider mb-2">
              Hero Color
            </label>
            <div className="flex gap-3 flex-wrap">
              {HERO_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setSelectedColor(c.value)}
                  className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 ${
                    selectedColor === c.value
                      ? "border-white scale-110 shadow-lg"
                      : "border-[#30363d] hover:border-[#484f58]"
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Create button */}
          <button
            onClick={handleCreateHero}
            disabled={heroName.trim().length === 0}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
              heroName.trim().length > 0
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                : "bg-[#0d1117] border border-[#30363d] text-gray-600 cursor-not-allowed"
            }`}
          >
            {heroName.trim().length > 0
              ? `Create ${heroName.trim()}`
              : "Enter a name first..."}
          </button>
        </div>
      </div>
    );
  }

  // ===========================
  // MAIN HOME PAGE
  // ===========================
  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-orange-400 mb-2">
          CodeCraft
        </h1>
        <p className="text-gray-400 text-sm font-mono">
          Build games. Learn Python. Level up.
        </p>
      </header>

      {/* Hero Card */}
      {hero && (
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 mb-8 max-w-md w-full">
          <div className="flex items-center gap-4">
            <div className="bg-[#0d1117] rounded-lg p-2 border border-[#30363d]">
              <PixelHero color={hero.color} size={48} animation="idle" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-100" style={{ color: hero.color }}>
                {hero.name}
              </h2>
              <div className="flex gap-3 text-xs font-mono text-gray-500 mt-1">
                <span>Lvl {hero.level}</span>
                <span className="text-green-400">HP {hero.health}</span>
                <span className="text-red-400">ATK {hero.attack}</span>
                <span className="text-yellow-400">{hero.gold}g</span>
                <span className="text-purple-400">{hero.xp} XP</span>
              </div>
              {/* XP progress bar */}
              <div className="mt-2 bg-[#0d1117] rounded-full h-1.5 overflow-hidden border border-[#30363d]">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${(hero.xp % 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mb-12">
        {lessons.map((concept) => {
          const highestCompleted = getProgress(concept.id);
          const totalLevels = concept.levels.length;
          const progressPercent = (highestCompleted / totalLevels) * 100;

          return (
            <div
              key={concept.id}
              className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 hover:border-[#484f58] transition-all duration-200"
            >
              {/* Concept icon and title */}
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`font-mono font-bold text-xl px-3 py-1 rounded-lg bg-gradient-to-r ${concept.color} text-white`}
                >
                  {concept.icon}
                </span>
                <div>
                  <h2 className="text-xl font-bold text-gray-100">
                    {concept.title}
                  </h2>
                  <span className="text-xs text-gray-500 font-mono">
                    {concept.concept}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-4">{concept.description}</p>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>
                    {highestCompleted}/{totalLevels}
                  </span>
                </div>
                <div className="bg-[#0d1117] rounded-full h-2 overflow-hidden border border-[#30363d]">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${concept.color} transition-all duration-500`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Level buttons */}
              <div className="flex gap-2 flex-wrap">
                {concept.levels.map((levelData) => {
                  const lvl = levelData.level;
                  const isUnlocked = isLevelUnlocked(concept.id, lvl);
                  const isCompleted = lvl <= highestCompleted;

                  if (!isUnlocked) {
                    return (
                      <div
                        key={lvl}
                        className="w-10 h-10 rounded-lg bg-[#0d1117] border border-[#30363d] flex items-center justify-center text-gray-600 text-xs cursor-not-allowed"
                        title={`Level ${lvl} — Locked`}
                      >
                        🔒
                      </div>
                    );
                  }

                  if (isCompleted) {
                    return (
                      <Link
                        key={lvl}
                        to={`/lesson/${concept.id}/${lvl}`}
                        className={`w-10 h-10 rounded-lg bg-gradient-to-r ${concept.color} flex items-center justify-center text-white font-bold text-sm hover:scale-110 transition-transform`}
                        title={`Level ${lvl} — ${levelData.title} (Completed)`}
                      >
                        ✓
                      </Link>
                    );
                  }

                  return (
                    <Link
                      key={lvl}
                      to={`/lesson/${concept.id}/${lvl}`}
                      className="w-10 h-10 rounded-lg border-2 border-dashed border-gray-500 flex items-center justify-center font-bold text-sm text-gray-400 hover:scale-110 hover:bg-[#1c2333] transition-all"
                      title={`Level ${lvl} — ${levelData.title}`}
                    >
                      {lvl}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin link */}
      <Link
        to="/admin"
        className="text-sm text-gray-600 hover:text-gray-400 font-mono transition-colors"
      >
        /admin →
      </Link>
    </div>
  );
}

export default HomePage;
