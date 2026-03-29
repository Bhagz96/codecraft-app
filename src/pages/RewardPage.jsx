import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

/**
 * REWARD PAGE — Version 2.1 (Per-Level Completion Content)
 * =========================================================
 * Shown after completing a level.
 * Now shows UNIQUE facts, tips, and next-level previews per level.
 * Reward type (badge/coins/mysteryBox) was chosen by the MAB engine.
 */

// Dev-themed badges
const BADGES = [
  { icon: "🐛", name: "Bug Squasher", desc: "Debugged like a pro" },
  { icon: "📦", name: "First Commit", desc: "Shipped your first code" },
  { icon: "🔥", name: "Stack Overflow Survivor", desc: "Got the hard one right" },
  { icon: "⚡", name: "10x Developer", desc: "Perfect execution" },
  { icon: "🛡️", name: "Code Reviewer", desc: "Sharp eye for detail" },
  { icon: "🧪", name: "Test Passer", desc: "All tests green" },
];

// Mystery box items (developer-themed)
const MYSTERY_ITEMS = [
  { icon: "🌙", name: "Dark Theme Unlock", rarity: "common" },
  { icon: "💻", name: "Custom Terminal Prompt", rarity: "common" },
  { icon: "🎨", name: "ASCII Art Pack", rarity: "uncommon" },
  { icon: "📋", name: "Code Snippet Collection", rarity: "uncommon" },
  { icon: "🦆", name: "Rubber Duck Debugger", rarity: "rare" },
  { icon: "☕", name: "Infinite Coffee", rarity: "legendary" },
];

const RARITY_COLORS = {
  common: "text-gray-400 border-gray-500/30",
  uncommon: "text-green-400 border-green-500/30",
  rare: "text-purple-400 border-purple-500/30",
  legendary: "text-orange-400 border-orange-500/30",
};

function RewardPage() {
  const location = useLocation();
  const {
    rewardType,
    conceptTitle,
    levelTitle,
    levelNum,
    correctCount,
    totalSteps,
    conceptId,
    xpEarned,
    completion,
  } = location.state || {};

  const [revealed, setRevealed] = useState(false);
  const [animating, setAnimating] = useState(true);

  // Random selections
  const [badge] = useState(
    () => BADGES[Math.floor(Math.random() * BADGES.length)]
  );
  const [xp] = useState(() => Math.floor(Math.random() * 30) + 20);
  const [mysteryItem] = useState(
    () => MYSTERY_ITEMS[Math.floor(Math.random() * MYSTERY_ITEMS.length)]
  );

  useEffect(() => {
    const timer = setTimeout(() => setAnimating(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // No state — redirect home
  if (!rewardType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4 font-mono">
            // complete a level to earn rewards
          </p>
          <Link
            to="/"
            className="text-cyan-400 hover:text-cyan-300 font-mono transition-colors"
          >
            cd /home →
          </Link>
        </div>
      </div>
    );
  }

  // Calculate next level
  const nextLevel = levelNum + 1;
  const concept = conceptId;

  // Score rating
  const scorePercent = totalSteps > 0 ? Math.round((correctCount / totalSteps) * 100) : 0;
  const rating = scorePercent === 100 ? "Perfect!" : scorePercent >= 66 ? "Great job!" : "Keep practicing!";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <div
        className={`text-center mb-6 transition-all duration-500 ${
          animating ? "scale-90 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 mb-2">
          Level Complete
        </h1>
        <p className="text-gray-400 font-mono text-sm">
          {conceptTitle} — Level {levelNum}: {levelTitle}
        </p>
        <p className="text-gray-500 text-sm mt-1">
          {correctCount}/{totalSteps} correct — {rating}
          {xpEarned > 0 && (
            <span className="text-purple-400 ml-2">+{xpEarned} XP</span>
          )}
        </p>
      </div>

      {/* Per-level completion message */}
      {completion && (
        <div
          className={`max-w-md w-full mb-6 transition-all duration-500 delay-100 ${
            animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
        >
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-3">
            {/* What you learned */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-400">✦</span>
                <span className="text-xs font-mono text-green-400 uppercase tracking-wider">What you built</span>
              </div>
              <p className="text-gray-300 text-sm">{completion.message}</p>
            </div>

            {/* Dev tip */}
            <div className="border-t border-[#30363d] pt-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-yellow-400">💡</span>
                <span className="text-xs font-mono text-yellow-400 uppercase tracking-wider">Dev tip</span>
              </div>
              <p className="text-gray-400 text-sm">{completion.tip}</p>
            </div>

            {/* What's next */}
            <div className="border-t border-[#30363d] pt-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-cyan-400">→</span>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Coming up</span>
              </div>
              <p className="text-gray-400 text-sm">{completion.nextPreview}</p>
            </div>
          </div>
        </div>
      )}

      {/* Reward display */}
      <div
        className={`transition-all duration-500 delay-200 ${
          animating ? "scale-90 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* BADGE REWARD */}
        {rewardType === "badge" && (
          <div className="text-center">
            <div className="w-28 h-28 rounded-2xl bg-[#161b22] border border-cyan-500/30 flex items-center justify-center mx-auto mb-3 glow-cyan">
              <span className="text-5xl">{badge.icon}</span>
            </div>
            <h2 className="text-lg font-bold text-gray-100 mb-1">
              Badge Earned
            </h2>
            <p className="text-cyan-400 font-mono font-semibold">
              {badge.name}
            </p>
            <p className="text-gray-500 text-sm mt-1">{badge.desc}</p>
          </div>
        )}

        {/* XP/CREDITS REWARD */}
        {rewardType === "coins" && (
          <div className="text-center">
            <div className="w-28 h-28 rounded-2xl bg-[#161b22] border border-green-500/30 flex items-center justify-center mx-auto mb-3 glow-green">
              <span className="text-4xl font-mono font-bold text-green-400">
                +{xp}
              </span>
            </div>
            <h2 className="text-lg font-bold text-gray-100 mb-1">
              XP Earned
            </h2>
            <p className="text-green-400 font-mono text-xl font-bold">
              {xp} credits
            </p>
          </div>
        )}

        {/* MYSTERY BOX REWARD */}
        {rewardType === "mysteryBox" && (
          <div className="text-center">
            {!revealed ? (
              <>
                <button
                  onClick={() => setRevealed(true)}
                  className="w-28 h-28 rounded-2xl bg-[#161b22] border border-purple-500/30 flex items-center justify-center mx-auto mb-3 cursor-pointer hover:scale-110 transition-transform glow-purple animate-pulse-neon"
                >
                  <span className="font-mono text-purple-400 text-sm">
                    <span className="text-3xl block mb-1">$</span>
                    sudo reveal
                  </span>
                </button>
                <h2 className="text-lg font-bold text-gray-100 mb-1">
                  Mystery Drop
                </h2>
                <p className="text-gray-500 text-sm font-mono">
                  Click to execute...
                </p>
              </>
            ) : (
              <>
                <div
                  className={`w-28 h-28 rounded-2xl bg-[#161b22] border ${RARITY_COLORS[mysteryItem.rarity]} flex items-center justify-center mx-auto mb-3`}
                >
                  <span className="text-5xl">{mysteryItem.icon}</span>
                </div>
                <h2 className="text-lg font-bold text-gray-100 mb-1">
                  {mysteryItem.name}
                </h2>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-mono uppercase ${RARITY_COLORS[mysteryItem.rarity]}`}
                >
                  {mysteryItem.rarity}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div
        className={`mt-8 flex flex-col sm:flex-row gap-3 transition-all duration-500 delay-300 ${
          animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        {/* Next level button (if exists) */}
        {nextLevel <= 5 && (
          <Link
            to={`/lesson/${concept}/${nextLevel}`}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-center"
          >
            Next Level →
          </Link>
        )}
        <Link
          to="/"
          className="bg-[#161b22] border border-[#30363d] text-gray-300 font-semibold px-6 py-3 rounded-xl hover:border-[#484f58] transition-all duration-200 text-center"
        >
          All Concepts
        </Link>
      </div>
    </div>
  );
}

export default RewardPage;
