import { Link } from "react-router-dom";
import lessons from "../data/lessons";
import { getAllProgress, isLevelUnlocked, getProgress } from "../data/progress";

/**
 * HOME PAGE — Version 2 (Dark Dev Theme)
 * =======================================
 * Shows concept cards with level progress indicators.
 * Levels unlock sequentially — completed levels glow, locked ones are dimmed.
 */
function HomePage() {
  const progress = getAllProgress();

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-orange-400 mb-2">
          KidCode Quest
        </h1>
        <p className="text-gray-400 text-lg font-mono">
          Learn to code. Level by level.
        </p>
      </header>

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
                    // Locked
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
                    // Completed
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

                  // Current (unlocked but not completed)
                  return (
                    <Link
                      key={lvl}
                      to={`/lesson/${concept.id}/${lvl}`}
                      className={`w-10 h-10 rounded-lg border-2 border-dashed flex items-center justify-center font-bold text-sm hover:scale-110 transition-all ${
                        `border-current text-transparent bg-clip-text bg-gradient-to-r ${concept.color}`
                      } hover:bg-[#1c2333]`}
                      style={{ borderColor: "currentColor" }}
                      title={`Level ${lvl} — ${levelData.title}`}
                    >
                      <span className={`text-transparent bg-clip-text bg-gradient-to-r ${concept.color}`}>
                        {lvl}
                      </span>
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
