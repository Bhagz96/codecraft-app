import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import lessons from "../data/lessons";
import { getAllProgress, isLevelUnlocked, getProgress } from "../data/progress";
import { getHero, hasHero, createHero } from "../data/hero";
import { getAvatar } from "../data/avatars";
import GameHero from "../components/game/GameHero";
import AvatarFace from "../components/game/AvatarFace";
import AvatarPicker from "../components/AvatarPicker";
import { useAudio } from "../hooks/useAudio";

/**
 * HOME PAGE — with Story Landing + Hero Creation
 * ================================================
 * New users see an immersive story intro, then create a hero.
 * Returning users go straight to the concept picker.
 */

// Available outfit/armor colors
const HERO_COLORS = [
  { name: "Cyan",   value: "#00d4ff" },
  { name: "Green",  value: "#00ff88" },
  { name: "Purple", value: "#a855f7" },
  { name: "Orange", value: "#ff6b35" },
  { name: "Pink",   value: "#ec4899" },
  { name: "Gold",   value: "#f59e0b" },
];

// ===========================
// MOUNTAIN SCENE SVG COMPONENT
// ===========================
function MountainScene() {
  return (
    <svg viewBox="0 0 800 300" className="w-full max-w-2xl" style={{ filter: "drop-shadow(0 0 30px rgba(0,212,255,0.15))" }}>
      {/* Sky gradient */}
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0a0e1a" />
          <stop offset="100%" stopColor="#1a1e3a" />
        </linearGradient>
        <linearGradient id="mtnGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4a5568" />
          <stop offset="100%" stopColor="#2d3748" />
        </linearGradient>
        <linearGradient id="mtnGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#1f2937" />
        </linearGradient>
        <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#00d4ff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="300" fill="url(#skyGrad)" />

      {/* Stars */}
      {[
        [120, 30], [250, 50], [380, 20], [500, 45], [650, 35], [720, 60],
        [80, 65], [190, 80], [450, 70], [580, 25], [340, 55], [690, 75],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.5 : 1} fill="white"
          opacity={0.4 + (i % 3) * 0.2}>
          <animate attributeName="opacity" values={`${0.3 + (i % 3) * 0.2};${0.7 + (i % 2) * 0.2};${0.3 + (i % 3) * 0.2}`}
            dur={`${2 + i % 3}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Back mountains */}
      <polygon points="0,300 100,120 200,180 300,100 400,160 500,90 600,150 700,110 800,140 800,300" fill="url(#mtnGrad2)" opacity="0.6" />

      {/* Front mountains */}
      <polygon points="0,300 150,140 300,200 400,130 550,180 700,120 800,170 800,300" fill="url(#mtnGrad1)" />

      {/* Snow caps */}
      <polygon points="400,130 385,155 415,155" fill="white" opacity="0.7" />
      <polygon points="700,120 685,145 715,145" fill="white" opacity="0.6" />
      <polygon points="300,100 288,120 312,120" fill="white" opacity="0.5" />

      {/* Glowing path up the mountain */}
      <path d="M 100,280 Q 200,250 250,220 T 400,170 T 550,140 T 700,120"
        stroke="url(#pathGrad)" strokeWidth="3" fill="none" strokeDasharray="8,6">
        <animate attributeName="stroke-dashoffset" from="0" to="-28" dur="2s" repeatCount="indefinite" />
      </path>

      {/* Summit glow */}
      <circle cx="700" cy="115" r="8" fill="#a855f7" opacity="0.4">
        <animate attributeName="r" values="6;10;6" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="700" cy="115" r="3" fill="#ffffff" opacity="0.8" />

      {/* Trees at base */}
      {[80, 130, 160, 620, 660, 750].map((x, i) => (
        <g key={i}>
          <polygon points={`${x},${270 - i * 2} ${x - 8},${290 - i * 2} ${x + 8},${290 - i * 2}`} fill="#1a4a2e" opacity="0.8" />
          <rect x={x - 1} y={290 - i * 2} width="2" height="8" fill="#3d2b1f" opacity="0.7" />
        </g>
      ))}
    </svg>
  );
}

// ===========================
// FEATURE CARD COMPONENT
// ===========================
function FeatureCard({ icon, title, description, delay }) {
  return (
    <div
      className="bg-[#161b22]/80 border border-[#30363d] rounded-xl p-5 animate-fade-in backdrop-blur-sm"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="text-white font-bold text-sm mb-1">{title}</h3>
      <p className="text-gray-400 text-xs leading-relaxed">{description}</p>
    </div>
  );
}

function HomePage() {
  const [heroExists, setHeroExists] = useState(hasHero());
  const [heroName, setHeroName] = useState("");
  const [selectedColor, setSelectedColor] = useState(HERO_COLORS[0].value);
  const [selectedAvatarId, setSelectedAvatarId] = useState("m01");
  const [showCreateHero, setShowCreateHero] = useState(false);
  const hero = heroExists ? getHero() : null;
  const progress = getAllProgress();

  // ── Audio ──────────────────────────────────────────────────────────
  const { startMusic, stopMusic, isMuted, toggleMute } = useAudio();

  useEffect(() => {
    startMusic('adventure');
    return () => stopMusic();
  }, [isMuted, startMusic, stopMusic]);

  const muteBtn = (
    <button
      onClick={toggleMute}
      title={isMuted ? "Unmute sound" : "Mute sound"}
      className="fixed top-3 right-3 z-50 w-9 h-9 rounded-full bg-[#161b22]/80 border border-[#30363d] text-gray-400 hover:text-gray-200 hover:border-cyan-500/50 transition-all flex items-center justify-center text-sm backdrop-blur-sm cursor-pointer"
    >
      {isMuted ? '🔇' : '🔊'}
    </button>
  );

  // Handle hero creation
  const handleCreateHero = () => {
    if (heroName.trim().length === 0) return;
    createHero(heroName.trim(), selectedColor, selectedAvatarId);
    setHeroExists(true);
  };

  // ===========================
  // STORY LANDING PAGE
  // ===========================
  if (!heroExists && !showCreateHero) {
    return (
      <>
      {muteBtn}
      <div className="min-h-screen flex flex-col items-center px-4 py-8 overflow-hidden">
        {/* Title */}
        <div className="text-center mb-6 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-orange-400 mb-3">
            CodeCraft
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-light max-w-lg mx-auto">
            Learn Python by building a game. Write code. Watch it come to life.
          </p>
        </div>

        {/* Mountain Scene */}
        <div className="w-full max-w-2xl mb-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <MountainScene />
        </div>

        {/* Story Narrative */}
        <div className="max-w-2xl w-full text-center mb-10 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <div className="bg-[#161b22]/60 border border-[#30363d] rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
              The Summit Awaits
            </h2>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base mb-4">
              A legendary mountain stands before you, its peak shrouded in code.
              To reach the summit, you must master the language of Python &mdash;
              writing real code that powers your journey. Set your hero&rsquo;s stats with
              <span className="text-cyan-400 font-mono font-semibold"> variables</span>,
              climb higher with
              <span className="text-green-400 font-mono font-semibold"> loops</span>,
              and navigate obstacles with
              <span className="text-orange-400 font-mono font-semibold"> conditions</span>.
            </p>
            <p className="text-gray-400 text-sm">
              Every line of code you write shapes the adventure. Are you ready to craft your story?
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl w-full mb-10">
          <FeatureCard
            icon="&#x1F4BB;"
            title="Write Real Code"
            description="Learn Python through hands-on challenges — not just reading. You type real code that actually runs."
            delay={600}
          />
          <FeatureCard
            icon="&#x1F3AE;"
            title="Build a Game"
            description="Your code controls the adventure. Watch your hero climb, dodge rocks, cross rivers, and collect treasures."
            delay={700}
          />
          <FeatureCard
            icon="&#x1F680;"
            title="Level Up"
            description="Start with the basics and progress through increasingly challenging levels as you master each concept."
            delay={800}
          />
        </div>

        {/* CTA Button */}
        <div className="animate-fade-in" style={{ animationDelay: "900ms" }}>
          <button
            onClick={() => setShowCreateHero(true)}
            className="group relative px-10 py-4 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-cyan-500 via-violet-500 to-orange-500 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            Begin Your Quest
            <span className="block text-xs font-normal text-white/70 mt-1">Create your Crafter and start coding</span>
          </button>
        </div>

        {/* Subtle footer */}
        <p className="text-gray-600 text-xs font-mono mt-12 animate-fade-in" style={{ animationDelay: "1000ms" }}>
          No account needed &middot; Your progress saves automatically
        </p>
      </div>
      </>
    );
  }

  // ===========================
  // HERO CREATION SCREEN
  // ===========================
  if (!heroExists && showCreateHero) {
    const previewAvatar = getAvatar(selectedAvatarId);

    return (
      <>
      {muteBtn}
      <div className="min-h-screen flex flex-col items-center px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => setShowCreateHero(false)}
          className="self-start mb-5 text-gray-500 hover:text-gray-300 text-sm font-mono transition-colors cursor-pointer"
        >
          &larr; Back
        </button>

        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-orange-400 mb-1">
          Create Your Crafter
        </h1>
        <p className="text-gray-400 text-sm font-mono mb-6">
          Pick a hero, choose your name and outfit colour
        </p>

        <div className="flex flex-col md:flex-row gap-6 max-w-3xl w-full">

          {/* ── Left: avatar picker ── */}
          <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-2xl p-5">
            <label className="block text-xs text-gray-500 font-mono uppercase tracking-wider mb-3">
              Choose Your Hero
            </label>
            <AvatarPicker
              selectedId={selectedAvatarId}
              onSelect={setSelectedAvatarId}
            />
          </div>

          {/* ── Right: name + colour + preview ── */}
          <div className="flex flex-col gap-4 w-full md:w-64">

            {/* Hero preview */}
            <div className="relative rounded-xl overflow-hidden border border-[#30363d]" style={{ height: 180 }}>
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(180deg, #1a3a5c 0%, #2d5a7b 50%, #3d6a5a 100%)" }} />
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 180" preserveAspectRatio="none">
                <polygon points="0,180 50,80 110,110 160,60 220,90 280,55 300,65 300,180" fill="#1f3f4f" opacity="0.7" />
                <polygon points="0,180 0,120 80,95 160,115 220,85 300,100 300,180" fill="#254535" />
              </svg>
              <div className="absolute bottom-0 left-0 right-0 h-12"
                style={{ background: "linear-gradient(180deg, #2d5530 0%, #152a18 100%)" }} />
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                <GameHero
                  color={selectedColor}
                  size={92}
                  animation="idle"
                  avatarId={selectedAvatarId}
                />
              </div>
              {/* Name badge */}
              {heroName.trim() && (
                <div className="absolute top-2 left-0 right-0 text-center">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-black/40"
                    style={{ color: selectedColor }}>
                    {heroName.trim()}
                  </span>
                </div>
              )}
            </div>

            {/* Name input */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
              <label className="block text-xs text-gray-500 font-mono uppercase tracking-wider mb-2">
                Crafter Name
              </label>
              <input
                type="text"
                value={heroName}
                onChange={(e) => setHeroName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateHero()}
                placeholder="Enter a name..."
                maxLength={20}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2.5 text-gray-100 font-mono text-base focus:outline-none focus:border-cyan-500/50 placeholder-gray-600 transition-colors"
                autoFocus
              />
            </div>

            {/* Outfit colour */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
              <label className="block text-xs text-gray-500 font-mono uppercase tracking-wider mb-2">
                Outfit Colour
              </label>
              <div className="flex gap-2 flex-wrap">
                {HERO_COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setSelectedColor(c.value)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all duration-150 cursor-pointer ${
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
                ? `Start as ${heroName.trim()}`
                : "Enter a name first..."}
            </button>
          </div>
        </div>
      </div>
      </>
    );
  }

  // ===========================
  // MAIN HOME PAGE
  // ===========================
  return (
    <>
    {muteBtn}
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
            <div className="rounded-xl overflow-hidden flex-shrink-0">
              <AvatarFace avatar={getAvatar(hero.avatarId)} size={64} />
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
    </>
  );
}

export default HomePage;
