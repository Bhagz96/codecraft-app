import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  createMAB,
  updateMAB,
  getArmStats,
  MODALITIES,
  REWARD_TYPES,
  SUPPORT_STRATEGIES,
  SUPPORT_DESCRIPTIONS,
} from "../mab/engine";
import { getAllSessions, clearSessions } from "../mab/sessionTracker";
import { resetProgress } from "../data/progress";
import { resetHero } from "../data/hero";
import { supabase, supabaseAdmin } from "../lib/supabase";

const CONCEPTS = ["variables", "loops", "conditions"];

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

// ─── USERS TAB ───────────────────────────────────────────────────────────────

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  async function deleteUser(u) {
    const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || u.nus_id || "this user";
    if (!window.confirm(`Delete ALL data for ${name}? This removes their sessions, progress, hero, and profile. Cannot be undone.`)) return;
    const client = supabaseAdmin || supabase;
    setDeletingUser(u.id);
    try {
      await client.from("sessions").delete().eq("user_id", u.id);
      await client.from("user_progress").delete().eq("user_id", u.id);
      await client.from("heroes").delete().eq("user_id", u.id);
      await client.from("profiles").delete().eq("id", u.id);
      setUsers((prev) => prev.filter((p) => p.id !== u.id));
      setExpandedUser(null);
    } catch {}
    setDeletingUser(null);
  }

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    // Prefer the service-role client (bypasses RLS) — fall back to anon client
    const client = supabaseAdmin || supabase;
    if (!client) {
      setError("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data: profiles, error: pErr } = await client
        .from("profiles")
        .select("id, nus_id, first_name, last_name, skill_level, role");
      if (pErr) throw pErr;

      const { data: heroes } = await client
        .from("heroes")
        .select("user_id, name, level, xp, color");

      const { data: progress } = await client
        .from("user_progress")
        .select("user_id, concept_id, level");

      const heroMap = {};
      (heroes || []).forEach((h) => { heroMap[h.user_id] = h; });

      const progressMap = {};
      (progress || []).forEach((p) => {
        if (!progressMap[p.user_id]) progressMap[p.user_id] = {};
        // group by concept: store highest completed level
        const cur = progressMap[p.user_id][p.concept_id] || 0;
        if (p.level > cur) progressMap[p.user_id][p.concept_id] = p.level;
      });

      setUsers((profiles || []).map((p) => ({
        ...p,
        hero: heroMap[p.id] || null,
        progress: progressMap[p.id] || {},
      })));
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  if (loading) return (
    <div className="text-center py-16 text-cyan-400 font-mono animate-pulse text-sm">
      Loading users...
    </div>
  );

  if (error) return (
    <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm font-mono">
      <p className="font-semibold mb-1">Error loading users</p>
      <p className="text-red-400/70 text-xs">{error}</p>
      <p className="text-red-500/60 text-xs mt-2">
        Make sure RLS admin policies are configured in Supabase and the service role key is set.
      </p>
    </div>
  );

  if (users.length === 0) return (
    <div className="text-center py-16 text-gray-600 font-mono text-sm">
      // no registered users yet
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-500 text-xs font-mono">
          {users.length} registered user{users.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={fetchUsers}
          className="text-xs font-mono text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
        >
          ↺ Refresh
        </button>
      </div>

      {users.map((u) => {
        const isExpanded = expandedUser === u.id;
        const totalLevels = CONCEPTS.reduce((sum, c) => sum + (u.progress[c] || 0), 0);
        const displayName = [u.first_name, u.last_name].filter(Boolean).join(" ") || "—";

        return (
          <div key={u.id} className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
            <button
              onClick={() => setExpandedUser(isExpanded ? null : u.id)}
              className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-[#1c2333] transition-colors cursor-pointer"
            >
              {/* Avatar initial */}
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-[#30363d] flex items-center justify-center text-sm font-bold text-cyan-400 font-mono shrink-0">
                {(u.first_name?.[0] || u.nus_id?.[0] || "?").toUpperCase()}
              </div>

              {/* Name + NUS ID */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-100 font-semibold text-sm">{displayName}</span>
                  <span className="text-gray-500 font-mono text-xs">{u.nus_id || "—"}</span>
                  {u.role === "admin" && (
                    <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded">
                      admin
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-gray-600 text-xs font-mono capitalize">
                    {u.skill_level || "no level set"}
                  </span>
                  {u.hero && (
                    <span className="text-gray-600 text-xs">
                      Hero:{" "}
                      <span style={{ color: u.hero.color || "#00d4ff" }}>{u.hero.name}</span>{" "}
                      Lv{u.hero.level}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress summary (desktop) */}
              <div className="hidden sm:flex gap-3 items-center shrink-0">
                {CONCEPTS.map((c) => {
                  const lvl = u.progress[c] || 0;
                  return (
                    <div key={c} className="text-center">
                      <div className={`text-xs font-bold font-mono ${lvl >= 5 ? "text-green-400" : lvl > 0 ? "text-cyan-400" : "text-gray-700"}`}>
                        {lvl}/5
                      </div>
                      <div className="text-[10px] text-gray-600 capitalize">{c.slice(0, 4)}</div>
                    </div>
                  );
                })}
                <div className="text-center ml-2">
                  <div className="text-xs font-bold font-mono text-violet-400">{totalLevels}</div>
                  <div className="text-[10px] text-gray-600">total</div>
                </div>
              </div>

              <span className="text-gray-600 text-xs ml-2">{isExpanded ? "▲" : "▼"}</span>
            </button>

            {isExpanded && (
              <div className="border-t border-[#30363d] px-5 py-4 bg-[#0d1117]/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Progress breakdown */}
                  <div>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-3">Concept Progress</p>
                    <div className="space-y-3">
                      {CONCEPTS.map((c) => {
                        const lvl = u.progress[c] || 0;
                        return (
                          <div key={c}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-300 capitalize">{c}</span>
                              <span className="text-gray-500 font-mono">{lvl}/5 levels</span>
                            </div>
                            <div className="bg-[#161b22] rounded-full h-2 border border-[#30363d] overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 transition-all"
                                style={{ width: `${(lvl / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Hero stats */}
                  <div>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-3">Hero Stats</p>
                    {u.hero ? (
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        {[
                          ["Name",  u.hero.name,   "text-gray-100"],
                          ["Level", u.hero.level,  "text-violet-400"],
                          ["XP",    u.hero.xp,     "text-purple-400"],
                          ["HP",    u.hero.health, "text-green-400"],
                          ["ATK",   u.hero.attack, "text-red-400"],
                          ["Gold",  u.hero.gold,   "text-yellow-400"],
                        ].map(([label, val, color]) => (
                          <div key={label} className="flex justify-between bg-[#161b22] rounded px-2 py-1.5 border border-[#30363d]">
                            <span className="text-gray-600">{label}</span>
                            <span className={color}>{val}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-700 text-xs font-mono">// no hero created yet</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#21262d] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-600">
                    <span>Skill: <span className="text-gray-400 capitalize">{u.skill_level || "not set"}</span></span>
                    <span>ID: <span className="text-gray-700">{u.id.slice(0, 8)}…</span></span>
                  </div>
                  {u.role !== "admin" && (
                    <button
                      disabled={deletingUser === u.id}
                      onClick={() => deleteUser(u)}
                      className="text-xs font-mono px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/15 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {deletingUser === u.id ? "Deleting…" : "Delete user data"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── MAB TAB ─────────────────────────────────────────────────────────────────

function MABTab() {
  const [supportStats, setSupportStats] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);

  const loadLocalData = () => {
    const savedSupportMAB = localStorage.getItem("kidcode_supportMAB");
    const supportMAB = savedSupportMAB
      ? JSON.parse(savedSupportMAB)
      : createMAB(SUPPORT_STRATEGIES, 0.3);
    setSupportStats(getArmStats(supportMAB));
  };

  const loadDbData = async () => {
    const client = supabaseAdmin || supabase;
    if (!client) { setDbLoading(false); return; }
    setDbLoading(true);
    try {
      const [{ data: sess }, { data: prof }] = await Promise.all([
        client.from("sessions").select(
          "user_id, concept_id, level, modality, support_strategy, completed, " +
          "correct_count, total_steps, first_try_count, total_hints, reward_score, time_spent, timestamp"
        ).limit(500),
        client.from("profiles").select("id, skill_level"),
      ]);
      setSessions(sess || []);
      setProfiles(prof || []);
    } catch {}
    setDbLoading(false);
  };

  useEffect(() => { loadLocalData(); loadDbData(); }, []);

  const simulateData = () => {
    const supportMAB = createMAB(SUPPORT_STRATEGIES, 0.3);
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
        modality: mod, rewardType: rew, supportStrategy: support,
        completed: rewardScore > 0,
        timeSpent: Math.floor(Math.random() * 120) + 30,
        score: Math.floor(Math.random() * 500),
        correctCount, totalSteps, firstTryCount, rewardScore,
        timestamp: new Date(Date.now() - (50 - i) * 3600000).toISOString(),
      });
    }
    localStorage.setItem("kidcode_supportMAB", JSON.stringify(supportMAB));
    localStorage.setItem("kidcode_sessions", JSON.stringify(fakeSessions));
    loadLocalData();
  };

  const resetData = () => {
    localStorage.removeItem("kidcode_supportMAB");
    localStorage.removeItem("kidcode_modalityMAB");
    localStorage.removeItem("kidcode_rewardMAB");
    clearSessions();
    resetProgress();
    resetHero();
    loadLocalData();
  };

  const getBestArm = (stats) =>
    stats.length === 0 ? null : stats.reduce((b, c) => c.averageReward > b.averageReward ? c : b);

  const bestSupport = getBestArm(supportStats);

  // ── Compute stats from Supabase sessions ──────────────────────────────────
  const skillMap = {};
  profiles.forEach((p) => { skillMap[p.id] = p.skill_level; });

  // Strategy stats from real sessions
  const strategyDbStats = SUPPORT_STRATEGIES.map((s) => {
    const rows = sessions.filter((r) => r.support_strategy === s);
    const avg = rows.length === 0 ? 0
      : rows.reduce((sum, r) => sum + (r.reward_score ?? 0), 0) / rows.length;
    const correctPct = rows.length === 0 ? 0
      : Math.round(rows.reduce((sum, r) => sum + (r.total_steps > 0 ? r.correct_count / r.total_steps : 0), 0) / rows.length * 100);
    return { arm: s, count: rows.length, avgReward: avg, correctPct };
  }).sort((a, b) => b.avgReward - a.avgReward);

  // Modality stats from real sessions
  const modalityDbStats = MODALITIES.map((m) => {
    const rows = sessions.filter((r) => r.modality === m);
    const correctPct = rows.length === 0 ? 0
      : Math.round(rows.reduce((sum, r) => sum + (r.total_steps > 0 ? r.correct_count / r.total_steps : 0), 0) / rows.length * 100);
    return { key: m, count: rows.length, correctPct };
  });

  // Skill-level breakdown
  const SKILL_LEVELS = ["beginner", "intermediate", "expert"];
  const skillStats = SKILL_LEVELS.map((level) => {
    const userIds = profiles.filter((p) => p.skill_level === level).map((p) => p.id);
    const rows = sessions.filter((r) => userIds.includes(r.user_id));
    const avgCorrect = rows.length === 0 ? null
      : Math.round(rows.reduce((sum, r) => sum + (r.total_steps > 0 ? r.correct_count / r.total_steps : 0), 0) / rows.length * 100);
    const avgHints = rows.length === 0 ? null
      : (rows.reduce((sum, r) => sum + (r.total_hints ?? 0), 0) / rows.length).toFixed(1);
    const avgTime = rows.length === 0 ? null
      : Math.round(rows.reduce((sum, r) => sum + (r.time_spent ?? 0), 0) / rows.length);
    const completionRate = rows.length === 0 ? null
      : Math.round(rows.filter((r) => r.completed).length / rows.length * 100);
    return { level, userCount: userIds.length, sessionCount: rows.length, avgCorrect, avgHints, avgTime, completionRate };
  });

  const skillColors = {
    beginner: "text-green-400", intermediate: "text-yellow-400", expert: "text-orange-400",
  };

  return (
    <div className="space-y-6">
      {/* Design note */}
      <div className="bg-[#161b22] border border-violet-500/30 rounded-xl px-5 py-4 text-xs font-mono space-y-1">
        <p className="text-violet-400 font-semibold uppercase tracking-wider text-[10px] mb-2">How the algorithm works</p>
        <p className="text-gray-300">
          <span className="text-cyan-400">Support strategy</span> — selected by the <span className="text-cyan-400">ε-greedy MAB</span> (ε = 0.3).
          The bandit learns which scaffolding method (e.g. "Try First → Hint", "Worked Example") produces the highest correctness score and exploits it over time.
        </p>
        <p className="text-gray-300">
          <span className="text-violet-400">Teaching modality</span> — assigned <span className="text-violet-400">randomly</span> each session (Code Simulation, Drag &amp; Drop, Speed Coding).
          Modality is <em>not</em> controlled by the MAB; it is rotated uniformly so each format gets equal exposure.
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <button onClick={() => loadDbData()} className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-medium px-4 py-2 rounded-lg hover:bg-cyan-500/20 transition-colors text-sm cursor-pointer">
          ↺ Refresh from Supabase
        </button>
        <button onClick={simulateData} className="bg-violet-500/10 border border-violet-500/30 text-violet-400 font-medium px-4 py-2 rounded-lg hover:bg-violet-500/20 transition-colors text-sm cursor-pointer">
          Simulate 50 Sessions (local)
        </button>
        <button onClick={resetData} className="bg-red-500/10 border border-red-500/30 text-red-400 font-medium px-4 py-2 rounded-lg hover:bg-red-500/20 transition-colors text-sm cursor-pointer">
          Reset Local Data
        </button>
      </div>

      {dbLoading && (
        <p className="text-cyan-400 font-mono text-sm animate-pulse">Loading live data from Supabase…</p>
      )}

      {/* ── Performance by Skill Level (Supabase) ── */}
      {!dbLoading && (
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-100 mb-1">
            Performance by Skill Level
            <span className="ml-2 text-[10px] font-mono text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider align-middle">live · supabase</span>
          </h2>
          <p className="text-xs text-gray-500 mb-5">How beginners, intermediates, and experts compare across all sessions.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {skillStats.map(({ level, userCount, sessionCount, avgCorrect, avgHints, avgTime, completionRate }) => (
              <div key={level} className="bg-[#0d1117] rounded-xl p-4 border border-[#30363d]">
                <p className={`font-semibold capitalize text-sm mb-3 ${skillColors[level]}`}>{level}</p>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between"><span className="text-gray-500">Users</span><span className="text-gray-300">{userCount}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Sessions</span><span className="text-gray-300">{sessionCount}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Avg correct</span><span className={avgCorrect == null ? "text-gray-600" : avgCorrect >= 70 ? "text-green-400" : avgCorrect >= 40 ? "text-yellow-400" : "text-red-400"}>{avgCorrect == null ? "—" : `${avgCorrect}%`}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Completion</span><span className="text-gray-300">{completionRate == null ? "—" : `${completionRate}%`}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Avg hints</span><span className="text-gray-300">{avgHints ?? "—"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Avg time</span><span className="text-gray-300">{avgTime == null ? "—" : `${avgTime}s`}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Strategy effectiveness (Supabase) ── */}
      {!dbLoading && sessions.length > 0 && (
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-100 mb-1">
            Strategy Effectiveness
            <span className="ml-2 text-[10px] font-mono text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider align-middle">live · supabase</span>
          </h2>
          <p className="text-xs text-gray-500 mb-5">Avg correctness rate per instructional strategy across all real sessions.</p>
          <div className="space-y-3">
            {strategyDbStats.map(({ arm, count, avgReward, correctPct }) => {
              const maxReward = Math.max(...strategyDbStats.map((s) => s.avgReward), 0.01);
              return (
                <div key={arm}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className={`text-xs font-mono font-medium ${strategyTextColors[arm] || "text-gray-400"}`}>
                      {strategyShortLabels[arm] || arm}
                    </span>
                    <span className="text-gray-500 text-xs">{count} sessions · {correctPct}% correct · {(avgReward * 100).toFixed(0)}% reward</span>
                  </div>
                  <div className="bg-[#0d1117] rounded-full h-2.5 overflow-hidden border border-[#30363d]">
                    <div
                      className={`h-full bg-gradient-to-r ${strategyBarColors[arm] || "from-gray-500 to-gray-600"} rounded-full transition-all duration-500`}
                      style={{ width: count === 0 ? "0%" : `${(avgReward / maxReward) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Modality effectiveness (Supabase) ── */}
      {!dbLoading && sessions.length > 0 && (
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-100 mb-1">
            Modality Effectiveness
            <span className="ml-2 text-[10px] font-mono text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider align-middle">live · supabase</span>
          </h2>
          <p className="text-xs text-gray-500 mb-4">Which teaching format produces the highest correctness rate.</p>
          <div className="grid grid-cols-3 gap-4">
            {modalityDbStats.map(({ key, count, correctPct }) => (
              <div key={key} className="bg-[#0d1117] rounded-xl p-4 border border-[#30363d] text-center">
                <p className="text-gray-300 font-mono text-xs mb-2">
                  {{ codeSimulation: ">_ Code", dragDrop: "{ } Drag", speedCoding: "⚡ Speed" }[key]}
                </p>
                <p className={`text-2xl font-bold font-mono ${correctPct >= 70 ? "text-green-400" : correctPct >= 40 ? "text-yellow-400" : "text-red-400"}`}>
                  {count === 0 ? "—" : `${correctPct}%`}
                </p>
                <p className="text-gray-600 text-[10px] mt-1">{count} sessions</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MAB Algorithm State (local) ── */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-100">
              MAB Algorithm State
              <span className="ml-2 text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider align-middle">local browser</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">ε-greedy bandit state for this browser session. Reflects the algorithm&apos;s current arm preferences.</p>
          </div>
        </div>
        {bestSupport && bestSupport.count > 0 && (
          <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3 mb-5">
            <p className="text-green-400 font-medium text-sm">
              Current leader: <strong>{strategyShortLabels[bestSupport.arm]}</strong>
              {" — "}avg learning score <strong>{(bestSupport.averageReward * 100).toFixed(0)}%</strong>
              <span className="text-green-500/60 text-xs ml-2">({bestSupport.count} pulls)</span>
            </p>
          </div>
        )}
        {supportStats.length === 0 || supportStats.every((s) => s.count === 0) ? (
          <p className="text-gray-600 text-sm font-mono">// no local MAB data — play some levels or simulate</p>
        ) : (
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
        )}
      </div>
    </div>
  );
}

// ─── SESSIONS TAB ────────────────────────────────────────────────────────────

function SessionsTab() {
  const [sessions, setSessions] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  async function deleteSession(sessionId) {
    const client = supabaseAdmin || supabase;
    setDeletingId(sessionId);
    try {
      await client.from("sessions").delete().eq("id", sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch {}
    setDeletingId(null);
  }

  useEffect(() => { fetchSessions(); }, []);

  async function fetchSessions() {
    const client = supabaseAdmin || supabase;
    if (!client) {
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [{ data, error: err }, { data: profiles }] = await Promise.all([
        client
          .from("sessions")
          .select(
            "id, session_id, user_id, concept_id, level, modality, support_strategy, " +
            "completed, time_spent, score, correct_count, total_steps, first_try_count, " +
            "total_attempts, total_hints, scaffold_used, reward_score, step_details, timestamp"
          )
          .order("timestamp", { ascending: false })
          .limit(200),
        client.from("profiles").select("id, first_name, last_name, nus_id, skill_level"),
      ]);
      if (err) throw err;
      const map = {};
      (profiles || []).forEach((p) => { map[p.id] = p; });
      setUserMap(map);
      setSessions(data || []);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  if (loading) return (
    <div className="text-center py-16 text-cyan-400 font-mono animate-pulse text-sm">Loading sessions...</div>
  );

  if (error) return (
    <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm font-mono">
      <p className="font-semibold mb-1">Error loading sessions</p>
      <p className="text-red-400/70 text-xs">{error}</p>
    </div>
  );

  if (sessions.length === 0) return (
    <div className="text-center py-16 text-gray-600 font-mono text-sm">// no sessions recorded yet</div>
  );

  const strategyColor = {
    worked_example_first:  "text-amber-400",
    hint_first:            "text-yellow-400",
    try_first_then_hint:   "text-cyan-400",
    step_by_step_scaffold: "text-violet-400",
    explain_after_error:   "text-emerald-400",
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-500 text-xs font-mono">{sessions.length} sessions (most recent first)</p>
        <button onClick={fetchSessions} className="text-xs font-mono text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">↺ Refresh</button>
      </div>

      {sessions.map((s) => {
        const isOpen = expanded === s.id;
        const pct = s.total_steps > 0 ? Math.round((s.correct_count / s.total_steps) * 100) : 0;
        const date = new Date(s.timestamp).toLocaleString();
        const profile = userMap[s.user_id];
        const userName = profile
          ? [profile.first_name, profile.last_name].filter(Boolean).join(" ") || profile.nus_id || "—"
          : s.user_id?.slice(0, 8) + "…";
        const skillBadgeColor = {
          beginner: "text-green-400 bg-green-500/10 border-green-500/20",
          intermediate: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
          expert: "text-orange-400 bg-orange-500/10 border-orange-500/20",
        }[profile?.skill_level] || "text-gray-500 bg-gray-500/10 border-gray-500/20";

        return (
          <div key={s.id} className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
            {/* Row header */}
            <button
              onClick={() => setExpanded(isOpen ? null : s.id)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#1c2330] transition-colors cursor-pointer"
            >
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${s.completed ? "text-green-400 border-green-500/30 bg-green-500/10" : "text-gray-500 border-gray-600/30"}`}>
                {s.completed ? "✓" : "⏸"}
              </span>
              <span className="text-gray-300 text-xs font-mono flex-1 truncate">
                {s.concept_id} L{s.level} — {s.modality}
              </span>
              <span className={`text-xs font-mono ${strategyColor[s.support_strategy] || "text-gray-400"}`}>
                {s.support_strategy?.replace(/_/g, " ")}
              </span>
              <span className="text-gray-400 text-xs font-mono w-16 text-right">{pct}% correct</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border hidden sm:inline ${skillBadgeColor}`}>
                {profile?.skill_level || "?"}
              </span>
              <span className="text-gray-400 text-xs font-mono hidden md:block max-w-[120px] truncate">{userName}</span>
              <span className="text-gray-600 text-xs font-mono hidden lg:block w-36 text-right">{date}</span>
              <span className="text-gray-600 text-xs ml-1">{isOpen ? "▲" : "▼"}</span>
            </button>

            {/* Expanded detail */}
            {isOpen && (
              <div className="px-4 pb-4 border-t border-[#30363d] pt-3 space-y-3">
                {/* Aggregate metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  {[
                    ["User",           s.user_id?.slice(0, 8) + "…"],
                    ["Time",           s.time_spent + "s"],
                    ["Score",          s.reward_score?.toFixed(2)],
                    ["First-try",      `${s.first_try_count}/${s.total_steps}`],
                    ["Attempts",       s.total_attempts],
                    ["Hints",          s.total_hints],
                    ["Scaffold",       s.scaffold_used ? "yes" : "no"],
                    ["Reward type",    s.modality],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-[#0d1117] rounded-lg p-2">
                      <p className="text-gray-600 text-[10px] uppercase tracking-wider">{k}</p>
                      <p className="text-gray-300 mt-0.5 truncate">{v ?? "—"}</p>
                    </div>
                  ))}
                </div>

                {/* Step-level breakdown */}
                {s.step_details && s.step_details.length > 0 && (
                  <div>
                    <p className="text-gray-500 text-[10px] font-mono uppercase tracking-wider mb-2">Per-step detail</p>
                    <div className="space-y-1">
                      {s.step_details.map((step, i) => (
                        <div key={i} className="flex items-center gap-3 text-xs font-mono bg-[#0d1117] rounded-lg px-3 py-1.5">
                          <span className="text-gray-600 w-6">#{step.stepIndex + 1}</span>
                          <span className={step.correct ? "text-green-400" : "text-red-400"}>
                            {step.correct ? "✓ correct" : "✗ wrong"}
                          </span>
                          <span className="text-gray-500">{step.firstTry ? "first try" : `${step.attempts} attempts`}</span>
                          <span className="text-gray-500">{step.hintCount > 0 ? `${step.hintCount} hint${step.hintCount > 1 ? "s" : ""}` : "no hints"}</span>
                          <span className="ml-auto text-cyan-400">{step.rewardScore?.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Delete */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => deleteSession(s.id)}
                    disabled={deletingId === s.id}
                    className="text-xs font-mono px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/15 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {deletingId === s.id ? "Deleting…" : "Delete this session"}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────

function AdminDashboard() {
  const [tab, setTab] = useState("users");
  const { signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-100 font-mono">/admin</h1>
            <p className="text-gray-500 text-sm">CodeCraft Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="bg-[#161b22] border border-[#30363d] text-gray-300 font-medium px-4 py-2 rounded-lg hover:border-[#484f58] transition-colors text-sm">
              ← Back
            </Link>
            <button
              onClick={handleSignOut}
              className="bg-[#161b22] border border-[#30363d] text-gray-400 font-medium px-4 py-2 rounded-lg hover:border-red-500/40 hover:text-red-400 transition-colors text-sm cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-[#0d1117] rounded-xl p-1 mb-6 border border-[#30363d] w-fit gap-1">
          {[
            { id: "users",    label: "👥 Users" },
            { id: "sessions", label: "📋 Sessions" },
            { id: "mab",      label: "📊 MAB Analytics" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2 rounded-lg text-sm font-mono font-semibold transition-all duration-200 cursor-pointer ${
                tab === t.id
                  ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "users"    && <UsersTab />}
        {tab === "sessions" && <SessionsTab />}
        {tab === "mab"      && <MABTab />}
      </div>
    </div>
  );
}

export default AdminDashboard;
