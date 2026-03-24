import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  createMAB,
  updateMAB,
  getArmStats,
  MODALITIES,
  REWARD_TYPES,
} from "../mab/engine";
import { getAllSessions, clearSessions } from "../mab/sessionTracker";
import { resetProgress } from "../data/progress";
import { resetHero } from "../data/hero";

/**
 * ADMIN DASHBOARD — Version 2 (Dark Dev Theme)
 * =============================================
 * Shows MAB analytics with dark theme styling.
 * Updated arm labels for new modality names.
 */
function AdminDashboard() {
  const [modalityStats, setModalityStats] = useState([]);
  const [rewardStats, setRewardStats] = useState([]);
  const [sessions, setSessions] = useState([]);

  const loadData = () => {
    const savedModalityMAB = localStorage.getItem("kidcode_modalityMAB");
    const modalityMAB = savedModalityMAB
      ? JSON.parse(savedModalityMAB)
      : createMAB(MODALITIES, 0.3);
    setModalityStats(getArmStats(modalityMAB));

    const savedRewardMAB = localStorage.getItem("kidcode_rewardMAB");
    const rewardMAB = savedRewardMAB
      ? JSON.parse(savedRewardMAB)
      : createMAB(REWARD_TYPES, 0.3);
    setRewardStats(getArmStats(rewardMAB));

    setSessions(getAllSessions());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Simulate 50 sessions with biased results
  const simulateData = () => {
    const modalityMAB = createMAB(MODALITIES, 0.3);
    const rewardMAB = createMAB(REWARD_TYPES, 0.3);

    // Code Simulation wins in this simulation
    const modalityRates = {
      codeSimulation: 0.8,
      dragDrop: 0.65,
      speedCoding: 0.5,
    };
    const rewardRates = { badge: 0.7, coins: 0.75, mysteryBox: 0.65 };

    const concepts = ["variables", "loops", "conditions"];
    const fakeSessions = [];

    for (let i = 0; i < 50; i++) {
      const mod = MODALITIES[Math.floor(Math.random() * MODALITIES.length)];
      const rew = REWARD_TYPES[Math.floor(Math.random() * REWARD_TYPES.length)];

      const modReward = Math.random() < modalityRates[mod] ? 1 : 0;
      const rewReward = Math.random() < rewardRates[rew] ? 1 : 0;

      updateMAB(modalityMAB, mod, modReward);
      updateMAB(rewardMAB, rew, rewReward);

      fakeSessions.push({
        sessionId: "sim_" + i,
        userId: "sim_user",
        conceptId: concepts[i % 3],
        level: (i % 5) + 1,
        modality: mod,
        rewardType: rew,
        completed: modReward === 1,
        timeSpent: Math.floor(Math.random() * 120) + 30,
        score: Math.floor(Math.random() * 500),
        streak: Math.floor(Math.random() * 5),
        timestamp: new Date(Date.now() - (50 - i) * 3600000).toISOString(),
      });
    }

    localStorage.setItem("kidcode_modalityMAB", JSON.stringify(modalityMAB));
    localStorage.setItem("kidcode_rewardMAB", JSON.stringify(rewardMAB));
    localStorage.setItem("kidcode_sessions", JSON.stringify(fakeSessions));

    loadData();
  };

  // Reset everything
  const resetData = () => {
    localStorage.removeItem("kidcode_modalityMAB");
    localStorage.removeItem("kidcode_rewardMAB");
    clearSessions();
    resetProgress();
    resetHero();
    loadData();
  };

  const getBestArm = (stats) => {
    if (stats.length === 0) return null;
    return stats.reduce((best, current) =>
      current.averageReward > best.averageReward ? current : best
    );
  };

  const bestModality = getBestArm(modalityStats);
  const bestReward = getBestArm(rewardStats);

  // Updated labels for V2 modalities
  const modalityLabels = {
    codeSimulation: ">_ Code Simulation",
    dragDrop: "{ } Drag & Drop",
    speedCoding: "⚡ Speed Coding",
  };
  const rewardLabels = {
    badge: "🛡️ Badge",
    coins: "⚡ XP Credits",
    mysteryBox: "$ Mystery Drop",
  };

  // Bar colours per modality
  const modalityColors = {
    codeSimulation: "from-cyan-500 to-blue-500",
    dragDrop: "from-violet-500 to-purple-500",
    speedCoding: "from-orange-500 to-red-500",
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-100 font-mono">
              /admin
            </h1>
            <p className="text-gray-500 text-sm">
              MAB Analytics — Multi-Armed Bandit Performance
            </p>
          </div>
          <Link
            to="/"
            className="bg-[#161b22] border border-[#30363d] text-gray-300 font-medium px-4 py-2 rounded-lg hover:border-[#484f58] transition-colors text-sm"
          >
            ← Back
          </Link>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={simulateData}
            className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-medium px-4 py-2 rounded-lg hover:bg-cyan-500/20 transition-colors text-sm"
          >
            Simulate 50 Sessions
          </button>
          <button
            onClick={resetData}
            className="bg-red-500/10 border border-red-500/30 text-red-400 font-medium px-4 py-2 rounded-lg hover:bg-red-500/20 transition-colors text-sm"
          >
            Reset All Data
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Teaching Modality Stats */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-100 mb-1">
              Teaching Modality
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Which game mode keeps users most engaged?
            </p>

            {bestModality && bestModality.count > 0 && (
              <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3 mb-4">
                <p className="text-green-400 font-medium text-sm">
                  Current leader:{" "}
                  <strong>{modalityLabels[bestModality.arm]}</strong> (
                  {(bestModality.averageReward * 100).toFixed(0)}% avg)
                </p>
              </div>
            )}

            <div className="space-y-3">
              {modalityStats.map((stat) => {
                const maxCount = Math.max(
                  ...modalityStats.map((s) => s.count),
                  1
                );
                const barWidth =
                  stat.count === 0 ? 0 : (stat.count / maxCount) * 100;

                return (
                  <div key={stat.arm}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-300 font-mono text-xs">
                        {modalityLabels[stat.arm]}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {stat.count} pulls · avg{" "}
                        {(stat.averageReward * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="bg-[#0d1117] rounded-full h-4 overflow-hidden border border-[#30363d]">
                      <div
                        className={`h-full bg-gradient-to-r ${modalityColors[stat.arm] || "from-gray-500 to-gray-600"} rounded-full transition-all duration-500`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reward Type Stats */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-100 mb-1">
              Reward Type
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Which reward motivates users to continue?
            </p>

            {bestReward && bestReward.count > 0 && (
              <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3 mb-4">
                <p className="text-green-400 font-medium text-sm">
                  Current leader:{" "}
                  <strong>{rewardLabels[bestReward.arm]}</strong> (
                  {(bestReward.averageReward * 100).toFixed(0)}% avg)
                </p>
              </div>
            )}

            <div className="space-y-3">
              {rewardStats.map((stat) => {
                const maxCount = Math.max(
                  ...rewardStats.map((s) => s.count),
                  1
                );
                const barWidth =
                  stat.count === 0 ? 0 : (stat.count / maxCount) * 100;

                return (
                  <div key={stat.arm}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-300 text-xs">
                        {rewardLabels[stat.arm]}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {stat.count} pulls · avg{" "}
                        {(stat.averageReward * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="bg-[#0d1117] rounded-full h-4 overflow-hidden border border-[#30363d]">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* How MAB Works */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-100 mb-3">
            How the Epsilon-Greedy MAB Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4">
              <h3 className="font-bold text-cyan-400 mb-1 font-mono text-xs">
                1. EXPLORE (30%)
              </h3>
              <p className="text-gray-400 text-xs">
                30% of the time, the algorithm picks a RANDOM arm. This ensures
                we keep testing all options and don't miss a potentially better
                one.
              </p>
            </div>
            <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-4">
              <h3 className="font-bold text-violet-400 mb-1 font-mono text-xs">
                2. EXPLOIT (70%)
              </h3>
              <p className="text-gray-400 text-xs">
                70% of the time, it picks the arm with the HIGHEST average
                reward so far. Most users get the best-performing experience.
              </p>
            </div>
            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
              <h3 className="font-bold text-green-400 mb-1 font-mono text-xs">
                3. LEARN & ADAPT
              </h3>
              <p className="text-gray-400 text-xs">
                After each session, the reward is recorded and averages are
                updated. Over time, the best arm naturally gets selected more.
              </p>
            </div>
          </div>
        </div>

        {/* Session Log */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-100 mb-4">
            Session Log{" "}
            <span className="text-gray-500 text-sm font-normal">
              ({sessions.length} sessions)
            </span>
          </h2>

          {sessions.length === 0 ? (
            <p className="text-gray-600 text-center py-8 font-mono text-sm">
              // no sessions yet — play a level or simulate data
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#30363d] text-left">
                    <th className="pb-2 pr-4 text-gray-500 font-mono text-xs">
                      Concept
                    </th>
                    <th className="pb-2 pr-4 text-gray-500 font-mono text-xs">
                      Lvl
                    </th>
                    <th className="pb-2 pr-4 text-gray-500 font-mono text-xs">
                      Modality
                    </th>
                    <th className="pb-2 pr-4 text-gray-500 font-mono text-xs">
                      Reward
                    </th>
                    <th className="pb-2 pr-4 text-gray-500 font-mono text-xs">
                      Done
                    </th>
                    <th className="pb-2 pr-4 text-gray-500 font-mono text-xs">
                      Time
                    </th>
                    <th className="pb-2 text-gray-500 font-mono text-xs">
                      When
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sessions
                    .slice(-20)
                    .reverse()
                    .map((s, i) => (
                      <tr key={i} className="border-b border-[#21262d]">
                        <td className="py-2 pr-4 text-gray-300 font-mono text-xs">
                          {s.conceptId || s.lessonId}
                        </td>
                        <td className="py-2 pr-4 text-gray-400 text-xs">
                          {s.level || "-"}
                        </td>
                        <td className="py-2 pr-4 text-gray-400 text-xs">
                          {modalityLabels[s.modality] || s.modality}
                        </td>
                        <td className="py-2 pr-4 text-gray-400 text-xs">
                          {rewardLabels[s.rewardType] || s.rewardType}
                        </td>
                        <td className="py-2 pr-4">
                          {s.completed ? (
                            <span className="text-green-400 text-xs">✓</span>
                          ) : (
                            <span className="text-red-400 text-xs">✗</span>
                          )}
                        </td>
                        <td className="py-2 pr-4 text-gray-500 text-xs font-mono">
                          {s.timeSpent}s
                        </td>
                        <td className="py-2 text-gray-600 text-xs">
                          {new Date(s.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
