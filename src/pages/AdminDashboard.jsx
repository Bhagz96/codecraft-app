import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  createMAB,
  updateMAB,
  getArmStats,
  MODALITIES,
  REWARD_TYPES,
  SUPPORT_STRATEGIES,
  SUPPORT_DESCRIPTIONS,
} from "../mab/engine";
// MODALITIES and REWARD_TYPES are used for session distribution counts only
import { getAllSessions, clearSessions } from "../mab/sessionTracker";
import { resetProgress } from "../data/progress";
import { resetHero } from "../data/hero";

/**
 * ADMIN DASHBOARD — Version 4 (Single-MAB: Support Strategy only)
 * =================================================================
 * Primary panel: Support Strategy MAB performance (learning signal)
 * Context panel: Modality + Reward Type distribution (randomly assigned,
 *                shown as counts only — not optimised)
 */
function AdminDashboard() {
  const [supportStats, setSupportStats] = useState([]);
  const [sessions, setSessions] = useState([]);

  const loadData = () => {
    const savedSupportMAB = localStorage.getItem("kidcode_supportMAB");
    const supportMAB = savedSupportMAB
      ? JSON.parse(savedSupportMAB)
      : createMAB(SUPPORT_STRATEGIES, 0.3);
    setSupportStats(getArmStats(supportMAB));

    setSessions(getAllSessions());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Simulate 50 sessions with biased support strategy outcomes.
  // Modality and reward type are randomly distributed (not optimised).
  const simulateData = () => {
    const supportMAB = createMAB(SUPPORT_STRATEGIES, 0.3);

    // try_first_then_hint wins — students learn best when they attempt first then get a hint
    const supportRates = {
      try_first_then_hint:   0.85,
      explain_after_error:   0.75,
      worked_example_first:  0.70,
      hint_first:            0.60,
      step_by_step_scaffold: 0.55,
    };

    const concepts = ["variables", "loops", "conditions"];
    const fakeSessions = [];

    for (let i = 0; i < 50; i++) {
      const support = SUPPORT_STRATEGIES[Math.floor(Math.random() * SUPPORT_STRATEGIES.length)];
      // Modality and reward randomly assigned — no MAB, no bias
      const mod = MODALITIES[Math.floor(Math.random() * MODALITIES.length)];
      const rew = REWARD_TYPES[Math.floor(Math.random() * REWARD_TYPES.length)];

      const rewardScore = Math.random() < supportRates[support]
        ? parseFloat((0.6 + Math.random() * 0.4).toFixed(2))
        : parseFloat((Math.random() * 0.4).toFixed(2));

      const totalSteps = 3 + Math.floor(Math.random() * 3);
      const correctCount = Math.min(totalSteps, Math.round(rewardScore * totalSteps + Math.random()));
      const firstTryCount = Math.round(correctCount * (0.5 + Math.random() * 0.5));

      updateMAB(supportMAB, support, rewardScore);

      fakeSessions.push({
        sessionId: "sim_" + i,
        userId: "sim_user",
        conceptId: concepts[i % 3],
        level: (i % 5) + 1,
        modality: mod,
        rewardType: rew,
        supportStrategy: support,
        completed: rewardScore > 0,
        timeSpent: Math.floor(Math.random() * 120) + 30,
        score: Math.floor(Math.random() * 500),
        streak: Math.floor(Math.random() * 5),
        correctCount,
        totalSteps,
        firstTryCount,
        rewardScore,
        timestamp: new Date(Date.now() - (50 - i) * 3600000).toISOString(),
      });
    }

    localStorage.setItem("kidcode_supportMAB", JSON.stringify(supportMAB));
    localStorage.setItem("kidcode_sessions", JSON.stringify(fakeSessions));

    loadData();
  };

  const resetData = () => {
    localStorage.removeItem("kidcode_supportMAB");
    // Clear legacy MAB keys if present
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

  const bestSupport = getBestArm(supportStats);

  // Compute modality and reward distribution from session data (counts only)
  const modalityDistribution = MODALITIES.map((m) => ({
    key: m,
    label: { codeSimulation: ">_ Code Simulation", dragDrop: "{ } Drag & Drop", speedCoding: "⚡ Speed Coding" }[m],
    count: sessions.filter((s) => s.modality === m).length,
  }));
  const rewardDistribution = REWARD_TYPES.map((r) => ({
    key: r,
    label: { badge: "🛡️ Badge", coins: "⚡ XP Credits", mysteryBox: "$ Mystery Drop" }[r],
    count: sessions.filter((s) => s.rewardType === r).length,
  }));
  const strategyShortLabels = {
    worked_example_first:  "📖 Example First",
    hint_first:            "💡 Hint First",
    try_first_then_hint:   "🎯 Try → Hint",
    step_by_step_scaffold: "🪜 Scaffold",
    explain_after_error:   "🔄 Explain on Error",
  };
  const strategyTextColors = {
    worked_example_first:  "text-amber-400",
    hint_first:            "text-yellow-400",
    try_first_then_hint:   "text-cyan-400",
    step_by_step_scaffold: "text-violet-400",
    explain_after_error:   "text-emerald-400",
  };
  const strategyBarColors = {
    worked_example_first:  "from-amber-500 to-yellow-500",
    hint_first:            "from-yellow-500 to-lime-500",
    try_first_then_hint:   "from-cyan-500 to-teal-500",
    step_by_step_scaffold: "from-violet-500 to-purple-500",
    explain_after_error:   "from-emerald-500 to-green-500",
  };
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-100 font-mono">/admin</h1>
            <p className="text-gray-500 text-sm">
              MAB Analytics — Instructional Support Performance
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

        {/* PRIMARY CARD: Instructional Support Strategy — full width */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-100">
                Instructional Support Strategy
                <span className="ml-2 text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider align-middle">
                  primary mab
                </span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Which scaffolding method produces the highest first-try correctness?
                Score = 1.0 (first try, no hint) → 0.0 (incorrect / skipped).
              </p>
            </div>
          </div>

          {bestSupport && bestSupport.count > 0 && (
            <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3 mb-5">
              <p className="text-green-400 font-medium text-sm">
                Current leader:{" "}
                <strong>{strategyShortLabels[bestSupport.arm]}</strong>
                {" — "}avg learning score{" "}
                <strong>{(bestSupport.averageReward * 100).toFixed(0)}%</strong>
                <span className="text-green-500/60 text-xs ml-2">({bestSupport.count} questions)</span>
              </p>
            </div>
          )}

          <div className="space-y-4">
            {supportStats.map((stat) => {
              const maxCount = Math.max(...supportStats.map((s) => s.count), 1);
              const barWidth = stat.count === 0 ? 0 : (stat.count / maxCount) * 100;
              return (
                <div key={stat.arm}>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <div className="flex items-baseline gap-2 min-w-0 pr-4">
                      <span className={`font-mono text-xs font-medium shrink-0 ${strategyTextColors[stat.arm] || "text-gray-400"}`}>
                        {strategyShortLabels[stat.arm] || stat.arm}
                      </span>
                      <span className="text-gray-600 text-[10px] truncate hidden sm:inline">
                        {SUPPORT_DESCRIPTIONS[stat.arm]}
                      </span>
                    </div>
                    <span className="text-gray-500 text-xs shrink-0">
                      {stat.count} pulls · {(stat.averageReward * 100).toFixed(0)}% avg
                    </span>
                  </div>
                  <div className="bg-[#0d1117] rounded-full h-3 overflow-hidden border border-[#30363d]">
                    <div
                      className={`h-full bg-gradient-to-r ${strategyBarColors[stat.arm] || "from-gray-500 to-gray-600"} rounded-full transition-all duration-500`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SESSION CONTEXT: Modality + Reward distribution (random, not optimised) */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-100 mb-1">
            Session Distribution
            <span className="ml-2 text-[10px] font-mono text-gray-500 bg-gray-500/10 border border-gray-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider align-middle">
              context only
            </span>
          </h2>
          <p className="text-xs text-gray-500 mb-5">
            Modality and reward type are randomly assigned each session to avoid confounding the learning signal.
            Even distribution confirms randomisation is working as expected.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Modality counts */}
            <div>
              <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-3">Teaching Modality</p>
              <div className="space-y-2">
                {modalityDistribution.map(({ key, label, count }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-gray-300 font-mono text-xs">{label}</span>
                    <span className="text-gray-500 text-xs">
                      {count} session{count !== 1 ? "s" : ""}
                      {sessions.length > 0 && (
                        <span className="text-gray-600 ml-1">
                          ({Math.round((count / sessions.length) * 100)}%)
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Reward type counts */}
            <div>
              <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-3">Reward Type</p>
              <div className="space-y-2">
                {rewardDistribution.map(({ key, label, count }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-gray-300 text-xs">{label}</span>
                    <span className="text-gray-500 text-xs">
                      {count} session{count !== 1 ? "s" : ""}
                      {sessions.length > 0 && (
                        <span className="text-gray-600 ml-1">
                          ({Math.round((count / sessions.length) * 100)}%)
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* How MAB Works — updated for v3 */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-100 mb-3">
            How the Epsilon-Greedy MAB Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4">
              <h3 className="font-bold text-cyan-400 mb-1 font-mono text-xs">
                1. EXPLORE (30%)
              </h3>
              <p className="text-gray-400 text-xs">
                30% of the time, a random support strategy is assigned. This ensures
                all five strategies get tested and none is prematurely ruled out.
              </p>
            </div>
            <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-4">
              <h3 className="font-bold text-violet-400 mb-1 font-mono text-xs">
                2. EXPLOIT (70%)
              </h3>
              <p className="text-gray-400 text-xs">
                70% of the time, the strategy with the highest average learning
                score is assigned. Most learners get the best-performing scaffolding.
              </p>
            </div>
            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
              <h3 className="font-bold text-green-400 mb-1 font-mono text-xs">
                3. REWARD SIGNAL
              </h3>
              <p className="text-gray-400 text-xs">
                Score is based on first-try correctness and hint usage —
                1.0 = correct first try, no hint. Down to 0.0 = incorrect.
                Updated after <em>every question</em>, not just at lesson end.
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
                    <th className="pb-2 pr-4 text-gray-500 font-mono text-xs">Strategy</th>
                    <th className="pb-2 pr-4 text-gray-500 font-mono text-xs">Concept</th>
                    <th className="pb-2 pr-4 text-gray-500 font-mono text-xs">Lvl</th>
                    <th className="pb-2 pr-4 text-gray-500 font-mono text-xs">Score</th>
                    <th className="pb-2 pr-4 text-gray-500 font-mono text-xs">Correct</th>
                    <th className="pb-2 pr-4 text-gray-500 font-mono text-xs">1st Try</th>
                    <th className="pb-2 pr-4 text-gray-500 font-mono text-xs">Done</th>
                    <th className="pb-2 pr-4 text-gray-500 font-mono text-xs">Time</th>
                    <th className="pb-2 text-gray-500 font-mono text-xs">When</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions
                    .slice(-20)
                    .reverse()
                    .map((s, i) => (
                      <tr key={i} className="border-b border-[#21262d]">
                        <td className="py-2 pr-4">
                          <span className={`text-[10px] font-mono ${strategyTextColors[s.supportStrategy] || "text-gray-500"}`}>
                            {strategyShortLabels[s.supportStrategy] || s.supportStrategy || "—"}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-gray-300 font-mono text-xs">
                          {s.conceptId || s.lessonId}
                        </td>
                        <td className="py-2 pr-4 text-gray-400 text-xs">{s.level || "—"}</td>
                        <td className="py-2 pr-4 text-xs font-mono">
                          {s.rewardScore != null ? (
                            <span className={
                              s.rewardScore >= 0.7
                                ? "text-green-400"
                                : s.rewardScore >= 0.4
                                ? "text-yellow-400"
                                : "text-red-400"
                            }>
                              {(s.rewardScore * 100).toFixed(0)}%
                            </span>
                          ) : "—"}
                        </td>
                        <td className="py-2 pr-4 text-gray-400 text-xs font-mono">
                          {s.correctCount != null && s.totalSteps != null
                            ? `${s.correctCount}/${s.totalSteps}`
                            : "—"}
                        </td>
                        <td className="py-2 pr-4 text-gray-400 text-xs font-mono">
                          {s.firstTryCount != null ? s.firstTryCount : "—"}
                        </td>
                        <td className="py-2 pr-4">
                          {s.completed
                            ? <span className="text-green-400 text-xs">✓</span>
                            : <span className="text-red-400 text-xs">✗</span>}
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
