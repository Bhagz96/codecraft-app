import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

/**
 * REWARD PAGE
 * ===========
 * Shown after a child completes a lesson.
 * The reward type (badge/coins/mysteryBox) was chosen by the MAB engine.
 *
 * Each reward has its own animation and visual style to make it feel special.
 */

// Badge data — different badges for different achievements
const BADGES = [
  { emoji: "🌟", name: "Super Star", color: "from-yellow-300 to-orange-400" },
  { emoji: "🧠", name: "Brain Power", color: "from-purple-300 to-indigo-400" },
  { emoji: "🚀", name: "Rocket Coder", color: "from-blue-300 to-cyan-400" },
  { emoji: "🦄", name: "Code Unicorn", color: "from-pink-300 to-purple-400" },
];

// Mystery box possible rewards
const MYSTERY_ITEMS = [
  { emoji: "🎨", name: "Rainbow Paint" },
  { emoji: "🦖", name: "Dino Friend" },
  { emoji: "🍕", name: "Pizza Party" },
  { emoji: "🎸", name: "Rock Star Guitar" },
  { emoji: "🌈", name: "Rainbow Power" },
  { emoji: "🎪", name: "Circus Ticket" },
];

function RewardPage() {
  const location = useLocation();
  const { rewardType, lessonTitle, correctCount, totalSteps } =
    location.state || {};

  const [revealed, setRevealed] = useState(false);
  const [animating, setAnimating] = useState(true);

  // Random selection for this reward
  const [badge] = useState(() => BADGES[Math.floor(Math.random() * BADGES.length)]);
  const [coins] = useState(() => Math.floor(Math.random() * 30) + 20); // 20-50 coins
  const [mysteryItem] = useState(
    () => MYSTERY_ITEMS[Math.floor(Math.random() * MYSTERY_ITEMS.length)]
  );

  // Stop entrance animation after a moment
  useEffect(() => {
    const timer = setTimeout(() => setAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // If no state was passed (direct URL access), redirect home
  if (!rewardType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Complete a lesson to earn rewards!</p>
          <Link
            to="/"
            className="bg-purple-500 text-white font-bold px-6 py-3 rounded-full"
          >
            Go to Lessons
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Celebration header */}
      <div
        className={`text-center mb-8 transition-all duration-700 ${
          animating ? "scale-50 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-2">
          Amazing Job!
        </h1>
        <p className="text-xl text-gray-600">
          You finished <strong>{lessonTitle}</strong>!
        </p>
        <p className="text-lg text-gray-500 mt-1">
          {correctCount} out of {totalSteps} correct
        </p>
      </div>

      {/* Reward display — changes based on rewardType */}
      <div
        className={`transition-all duration-700 delay-300 ${
          animating ? "scale-50 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* BADGE REWARD */}
        {rewardType === "badge" && (
          <div className="text-center">
            <div
              className={`w-48 h-48 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center mx-auto mb-4 shadow-2xl`}
            >
              <span className="text-8xl">{badge.emoji}</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-1">
              New Badge Earned!
            </h2>
            <p className="text-xl text-gray-600 font-medium">{badge.name}</p>
          </div>
        )}

        {/* COINS REWARD */}
        {rewardType === "coins" && (
          <div className="text-center">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <span className="text-7xl">🪙</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-1">
              You earned coins!
            </h2>
            <p className="text-5xl font-extrabold text-yellow-600">+{coins}</p>
          </div>
        )}

        {/* MYSTERY BOX REWARD */}
        {rewardType === "mysteryBox" && (
          <div className="text-center">
            {!revealed ? (
              <>
                <button
                  onClick={() => setRevealed(true)}
                  className="w-48 h-48 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-2xl cursor-pointer hover:scale-110 transition-transform duration-200 animate-bounce"
                >
                  <span className="text-8xl">🎁</span>
                </button>
                <h2 className="text-3xl font-bold text-gray-800 mb-1">
                  Mystery Box!
                </h2>
                <p className="text-lg text-gray-500">Tap to reveal!</p>
              </>
            ) : (
              <>
                <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mx-auto mb-4 shadow-2xl">
                  <span className="text-8xl">{mysteryItem.emoji}</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-1">
                  You got:
                </h2>
                <p className="text-2xl font-bold text-purple-600">
                  {mysteryItem.name}!
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div
        className={`mt-10 flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-500 ${
          animating ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0"
        }`}
      >
        <Link
          to="/"
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg px-8 py-4 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-center"
        >
          More Lessons! 🚀
        </Link>
      </div>
    </div>
  );
}

export default RewardPage;
