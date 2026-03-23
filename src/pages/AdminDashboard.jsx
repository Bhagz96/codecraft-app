import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createMAB, updateMAB, getArmStats, MODALITIES, REWARD_TYPES } from "../mab/engine";
import { getAllSessions, clearSessions } from "../mab/sessionTracker";

/**
 * ADMIN DASHBOARD
 * ===============
 * Shows the MAB analytics — which teaching modality and reward type
 * is performing best. This is the key page for the academic presentation.
 *
 * Displays:
 * - Arm statistics (pulls, average reward) for both modality and reward MABs
 * - Simple bar chart visualisation
 * - Recent session log
 * - Button to simulate test data (for the demo)
 */
function AdminDashboard() {
  const [modalityStats, setModalityStats] = useState([]);
  const [rewardStats, setRewardStats] = useState([]);
  const [sessions, setSessions] = useState([]);

  // Load data from localStorage
  const loadData = () => {
    // Load modality MAB stats
    const savedModalityMAB = localStorage.getItem("kidcode_modalityMAB");
    const modalityMAB = savedModalityMAB
      ? JSON.parse(savedModalityMAB)
      : createMAB(MODALITIES, 0.3);
    setModalityStats(getArmStats(modalityMAB));

    // Load reward MAB stats
    const savedRewardMAB = localStorage.getItem("kidcode_rewardMAB");
    const rewardMAB = savedRewardMAB
      ? JSON.parse(savedRewardMAB)
      : createMAB(REWARD_TYPES, 0.3);
    setRewardStats(getArmStats(rewardMAB));

    // Load sessions
    setSessions(getAllSessions());
  };

  useEffect(() => {
    loadData();
  }, []);

  /**
   * Simulate test data — generates fake sessions so the MAB
   * has enough data to show a clear "winner" during the demo.
   *
   * Story mode is intentionally made to perform better so there's
   * a visible trend in the dashboard.
   */
  const simulateData = () => {
    const modalityMAB = createMAB(MODALITIES, 0.3);
    const rewardMAB = createMAB(REWARD_TYPES, 0.3);

    // Simulate 50 sessions with different success rates per arm
    // Story mode: 80% success (the "winner")
    // Puzzle mode: 60% success
    // Challenge mode: 50% success
    const modalityRates = { story: 0.8, puzzle: 0.6, challenge: 0.5 };
    const rewardRates = { badge: 0.7, coins: 0.75, mysteryBox: 0.65 };

    const fakeSessions = [];

    for (let i = 0; i < 50; i++) {
      // Pick random modality and reward for simulation
      const mod = MODALITIES[Math.floor(Math.random() * MODALITIES.length)];
      const rew = REWARD_TYPES[Math.floor(Math.random() * REWARD_TYPES.length)];

      const modReward = Math.random() < modalityRates[mod] ? 1 : 0;
      const rewReward = Math.random() < rewardRates[rew] ? 1 : 0;

      updateMAB(modalityMAB, mod, modReward);
      updateMAB(rewardMAB, rew, rewReward);

      fakeSessions.push({
        sessionId: "sim_" + i,
        userId: "sim_user",
        lessonId: ["sequences", "loops", "conditions"][i % 3],
        modality: mod,
        rewardType: rew,
        completed: modReward === 1,
        timeSpent: Math.floor(Math.random() * 120) + 30,
        startedNext: Math.random() > 0.5,
        timestamp: new Date(Date.now() - (50 - i) * 3600000).toISOString(),
      });
    }

    localStorage.setItem("kidcode_modalityMAB", JSON.stringify(modalityMAB));
    localStorage.setItem("kidcode_rewardMAB", JSON.stringify(rewardMAB));
    localStorage.setItem("kidcode_sessions", JSON.stringify(fakeSessions));

    loadData();
  };

  // Reset all data
  const resetData = () => {
    localStorage.removeItem("kidcode_modalityMAB");
    localStorage.removeItem("kidcode_rewardMAB");
    clearSessions();
    loadData();
  };

  // Find the best performing arm
  const getBestArm = (stats) => {
    if (stats.length === 0) return null;
    return stats.reduce((best, current) =>
      current.averageReward > best.averageReward ? current : best
    );
  };

  const bestModality = getBestArm(modalityStats);
  const bestReward = getBestArm(rewardStats);

  // Labels for display
  const modalityLabels = {
    story: "📖 Story Mode",
    puzzle: "🧩 Puzzle Mode",
    challenge: "⚡ Challenge Mode",
  };
  const rewardLabels = {
    badge: "🏅 Badge",
    coins: "🪙 Coins",
    mysteryBox: "🎁 Mystery Box",
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-gray-500">
              MAB Analytics — Multi-Armed Bandit Performance
            </p>
          </div>
          <Link
            to="/"
            className="bg-purple-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            ← Back to App
          </Link>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={simulateData}
            className="bg-blue-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Simulate 50 Sessions
          </button>
          <button
            onClick={resetData}
            className="bg-red-100 text-red-600 font-medium px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
          >
            Reset All Data
          </button>
        </div>

        {/* MAB Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Teaching Modality Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Teaching Modality
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Which presentation style keeps kids most engaged?
            </p>

            {bestModality && bestModality.count > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-green-800 font-medium text-sm">
                  🏆 Current leader:{" "}
                  <strong>{modalityLabels[bestModality.arm]}</strong> (
                  {(bestModality.averageReward * 100).toFixed(0)}% avg reward)
                </p>
              </div>
            )}

            {/* Bar chart */}
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
                      <span className="font-medium">
                        {modalityLabels[stat.arm]}
                      </span>
                      <span className="text-gray-500">
                        {stat.count} pulls · avg{" "}
                        {(stat.averageReward * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reward Type Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Reward Type
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Which reward motivates kids to continue learning?
            </p>

            {bestReward && bestReward.count > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-green-800 font-medium text-sm">
                  🏆 Current leader:{" "}
                  <strong>{rewardLabels[bestReward.arm]}</strong> (
                  {(bestReward.averageReward * 100).toFixed(0)}% avg reward)
                </p>
              </div>
            )}

            {/* Bar chart */}
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
                      <span className="font-medium">
                        {rewardLabels[stat.arm]}
                      </span>
                      <span className="text-gray-500">
                        {stat.count} pulls · avg{" "}
                        {(stat.averageReward * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* How MAB Works — explanation section */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            How the Epsilon-Greedy MAB Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="font-bold text-blue-800 mb-1">
                1. Explore (30%)
              </h3>
              <p className="text-blue-700">
                30% of the time, the algorithm picks a RANDOM arm. This ensures
                we keep testing all options and don't miss a potentially better
                one.
              </p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <h3 className="font-bold text-purple-800 mb-1">
                2. Exploit (70%)
              </h3>
              <p className="text-purple-700">
                70% of the time, it picks the arm with the HIGHEST average
                reward so far. This means most kids get the best-performing
                experience.
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <h3 className="font-bold text-green-800 mb-1">
                3. Learn & Adapt
              </h3>
              <p className="text-green-700">
                After each session, the reward is recorded and averages are
                updated. Over time, the best arm naturally gets selected more
                often.
              </p>
            </div>
          </div>
        </div>

        {/* Session Log */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Session Log ({sessions.length} sessions)
          </h2>

          {sessions.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No sessions yet. Play a lesson or simulate data to see results!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-left">
                    <th className="pb-2 pr-4">Lesson</th>
                    <th className="pb-2 pr-4">Modality</th>
                    <th className="pb-2 pr-4">Reward</th>
                    <th className="pb-2 pr-4">Completed</th>
                    <th className="pb-2 pr-4">Time (s)</th>
                    <th className="pb-2">When</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions
                    .slice(-20)
                    .reverse()
                    .map((s, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="py-2 pr-4 font-medium">{s.lessonId}</td>
                        <td className="py-2 pr-4">
                          {modalityLabels[s.modality] || s.modality}
                        </td>
                        <td className="py-2 pr-4">
                          {rewardLabels[s.rewardType] || s.rewardType}
                        </td>
                        <td className="py-2 pr-4">
                          {s.completed ? (
                            <span className="text-green-600 font-medium">
                              Yes ✓
                            </span>
                          ) : (
                            <span className="text-red-400">No</span>
                          )}
                        </td>
                        <td className="py-2 pr-4">{s.timeSpent}s</td>
                        <td className="py-2 text-gray-400">
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
