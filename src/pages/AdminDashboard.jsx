import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase, supabaseAdmin } from "../lib/supabase";
import { exportToExcel } from "../utils/exportExcel";

const CONCEPTS = ["variables", "loops", "conditions"];

const MODE_LABELS = {
  worked_example_first:  "📖 Example First",
  try_first_then_hint:   "🎯 Try → Hint",
  step_by_step_scaffold: "🪜 Scaffold",
};
const MODE_COLORS = {
  worked_example_first:  "text-amber-400",
  try_first_then_hint:   "text-cyan-400",
  step_by_step_scaffold: "text-violet-400",
};
const MODE_BAR = {
  worked_example_first:  "from-amber-500 to-yellow-500",
  try_first_then_hint:   "from-cyan-500 to-teal-500",
  step_by_step_scaffold: "from-violet-500 to-purple-500",
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
    const client = supabaseAdmin || supabase;
    if (!client) { setError("Supabase not configured."); setLoading(false); return; }
    setLoading(true); setError(null);
    try {
      const { data: profiles, error: pErr } = await client
        .from("profiles")
        .select("id, nus_id, first_name, last_name, role, instruction_mode");
      if (pErr) throw pErr;

      const { data: heroRows } = await client
        .from("heroes")
        .select("user_id, name, level, xp, health, attack, defense, gold, color");

      const { data: progress } = await client
        .from("user_progress")
        .select("user_id, concept_id, highest_level");

      const heroMap = {};
      (heroRows || []).forEach((h) => { heroMap[h.user_id] = h; });

      // Fallback: pull hero stats from auth metadata if heroes table is empty
      if (supabaseAdmin) {
        try {
          const { data: { users: authUsers } } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
          (authUsers || []).forEach((au) => {
            if (!heroMap[au.id] && au.user_metadata?.hero_name) {
              const m = au.user_metadata;
              heroMap[au.id] = { user_id: au.id, name: m.hero_name, level: m.hero_level ?? 1,
                xp: m.hero_xp ?? 0, health: m.hero_health ?? 100, attack: m.hero_attack ?? 10,
                defense: m.hero_defense ?? 5, gold: m.hero_gold ?? 0, color: m.hero_color ?? "#00d4ff" };
            }
          });
        } catch {}
      }

      // Progress: highest level per concept + review completion
      const progressMap = {};
      (progress || []).forEach((p) => {
        if (!progressMap[p.user_id]) progressMap[p.user_id] = {};
        if (p.concept_id.endsWith("_review")) {
          progressMap[p.user_id][p.concept_id] = true;
        } else {
          const cur = progressMap[p.user_id][p.concept_id] || 0;
          if ((p.highest_level || 0) > cur) progressMap[p.user_id][p.concept_id] = p.highest_level;
        }
      });

      setUsers((profiles || []).map((p) => ({
        ...p,
        hero: heroMap[p.id] || null,
        progress: progressMap[p.id] || {},
      })));
    } catch (err) { setError(err.message); }
    setLoading(false);
  }

  if (loading) return <div className="text-center py-16 text-cyan-400 font-mono animate-pulse text-sm">Loading users...</div>;
  if (error) return <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm font-mono"><p className="font-semibold mb-1">Error loading users</p><p className="text-xs">{error}</p></div>;
  if (users.length === 0) return <div className="text-center py-16 text-gray-600 font-mono text-sm">// no registered users yet</div>;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-500 text-xs font-mono">{users.length} registered user{users.length !== 1 ? "s" : ""}</p>
        <button onClick={fetchUsers} className="text-xs font-mono text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">↺ Refresh</button>
      </div>

      {users.map((u) => {
        const isExpanded = expandedUser === u.id;
        const totalLevels = CONCEPTS.reduce((sum, c) => sum + (u.progress[c] || 0), 0);
        const displayName = [u.first_name, u.last_name].filter(Boolean).join(" ") || "—";
        const mode = u.instruction_mode;

        return (
          <div key={u.id} className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
            <button
              onClick={() => setExpandedUser(isExpanded ? null : u.id)}
              className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-[#1c2333] transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-[#30363d] flex items-center justify-center text-sm font-bold text-cyan-400 font-mono shrink-0">
                {(u.first_name?.[0] || u.nus_id?.[0] || "?").toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-100 font-semibold text-sm">{displayName}</span>
                  <span className="text-gray-500 font-mono text-xs">{u.nus_id || "—"}</span>
                  {u.role === "admin" && (
                    <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded">admin</span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  {mode ? (
                    <span className={`text-xs font-mono ${MODE_COLORS[mode] || "text-gray-400"}`}>
                      {MODE_LABELS[mode] || mode}
                    </span>
                  ) : (
                    <span className="text-gray-600 text-xs font-mono">no mode assigned</span>
                  )}
                  {u.hero && (
                    <span className="text-gray-600 text-xs">
                      Hero: <span style={{ color: u.hero.color || "#00d4ff" }}>{u.hero.name}</span> Lv{u.hero.level}
                    </span>
                  )}
                </div>
              </div>
              <div className="hidden sm:flex gap-3 items-center shrink-0">
                {CONCEPTS.map((c) => {
                  const lvl = u.progress[c] || 0;
                  const reviewed = u.progress[`${c}_review`] || false;
                  return (
                    <div key={c} className="text-center">
                      <div className={`text-xs font-bold font-mono ${lvl >= 5 ? "text-green-400" : lvl > 0 ? "text-cyan-400" : "text-gray-700"}`}>
                        {lvl}/5
                      </div>
                      <div className="text-[10px] text-gray-600 capitalize">{c.slice(0, 4)}</div>
                      {reviewed && <div className="text-[9px] text-violet-400">✓rev</div>}
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
                  <div>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-3">Concept Progress</p>
                    <div className="space-y-3">
                      {CONCEPTS.map((c) => {
                        const lvl = u.progress[c] || 0;
                        const reviewed = u.progress[`${c}_review`] || false;
                        return (
                          <div key={c}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-300 capitalize">{c}</span>
                              <span className="text-gray-500 font-mono">
                                {lvl}/5 levels {reviewed && <span className="text-violet-400">· reviewed ✓</span>}
                              </span>
                            </div>
                            <div className="bg-[#161b22] rounded-full h-2 border border-[#30363d] overflow-hidden">
                              <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 transition-all" style={{ width: `${(lvl / 5) * 100}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-3">Hero Stats</p>
                    {u.hero ? (
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        {[["Name", u.hero.name, "text-gray-100"], ["Level", u.hero.level, "text-violet-400"],
                          ["XP", u.hero.xp, "text-purple-400"], ["HP", u.hero.health, "text-green-400"],
                          ["ATK", u.hero.attack, "text-red-400"], ["Gold", u.hero.gold, "text-yellow-400"],
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
                    <span>Mode: <span className={MODE_COLORS[mode] || "text-gray-400"}>{MODE_LABELS[mode] || "not assigned"}</span></span>
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

// ─── SESSIONS TAB ────────────────────────────────────────────────────────────

function SessionsTab() {
  const [sessions, setSessions] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("all"); // all | lessons | reviews
  const [deletingId, setDeletingId] = useState(null);
  const [fixing, setFixing] = useState(false);
  const [fixResult, setFixResult] = useState(null);

  useEffect(() => { fetchSessions(); }, []);

  async function fetchSessions() {
    const client = supabaseAdmin || supabase;
    if (!client) { setError("Supabase not configured."); setLoading(false); return; }
    setLoading(true); setError(null);
    try {
      const [{ data, error: err }, { data: profiles }] = await Promise.all([
        client.from("sessions").select(
          "id, session_id, user_id, concept_id, level, modality, support_strategy, " +
          "completed, time_spent, correct_count, total_steps, first_try_count, " +
          "total_attempts, total_hints, scaffold_used, reward_score, step_details, timestamp"
        ).order("timestamp", { ascending: false }).limit(300),
        client.from("profiles").select("id, first_name, last_name, nus_id, instruction_mode"),
      ]);
      if (err) throw err;
      const map = {};
      (profiles || []).forEach((p) => { map[p.id] = p; });
      setUserMap(map);
      setSessions(data || []);
    } catch (err) { setError(err.message); }
    setLoading(false);
  }

  async function deleteSession(sessionId) {
    const client = supabaseAdmin || supabase;
    setDeletingId(sessionId);
    try {
      await client.from("sessions").delete().eq("id", sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch {}
    setDeletingId(null);
  }

  async function fixReviewScores() {
    if (!window.confirm(
      "This will correct all review sessions where correct_count > total_steps (the double-count bug).\n\n" +
      "Affected rows will be set to correct_count = 5, first_try_count = 5, reward_score = 1.0.\n\n" +
      "This cannot be undone. Proceed?"
    )) return;
    const client = supabaseAdmin || supabase;
    setFixing(true);
    setFixResult(null);
    try {
      const { error, count } = await client
        .from("sessions")
        .update({ correct_count: 5, first_try_count: 5, reward_score: 1.0 })
        .eq("support_strategy", "review")
        .gt("correct_count", 5)
        .select("id", { count: "exact", head: true });
      if (error) throw error;
      setFixResult({ ok: true, count: count ?? "?" });
      fetchSessions(); // reload to reflect changes
    } catch (err) {
      setFixResult({ ok: false, message: err.message });
    }
    setFixing(false);
  }

  if (loading) return <div className="text-center py-16 text-cyan-400 font-mono animate-pulse text-sm">Loading sessions...</div>;
  if (error) return <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm font-mono"><p className="font-semibold mb-1">Error</p><p className="text-xs">{error}</p></div>;

  const isReview = (s) => s.level === 0 || s.support_strategy === "review";
  const filtered = filter === "reviews" ? sessions.filter(isReview)
    : filter === "lessons" ? sessions.filter((s) => !isReview(s))
    : sessions;

  const reviewCount = sessions.filter(isReview).length;
  const lessonCount = sessions.length - reviewCount;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
        <div className="flex gap-1 bg-[#0d1117] border border-[#30363d] rounded-xl p-1">
          {[["all", `All (${sessions.length})`], ["lessons", `Lessons (${lessonCount})`], ["reviews", `Reviews (${reviewCount})`]].map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${filter === key ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white" : "text-gray-500 hover:text-gray-300"}`}
            >{label}</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fixReviewScores}
            disabled={fixing}
            className="text-xs font-mono px-3 py-1.5 rounded-lg border border-amber-500/30 text-amber-400 bg-amber-500/5 hover:bg-amber-500/15 transition-colors cursor-pointer disabled:opacity-50"
          >
            {fixing ? "Fixing…" : "🔧 Fix Review Scores"}
          </button>
          <button onClick={fetchSessions} className="text-xs font-mono text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">↺ Refresh</button>
        </div>
      </div>

      {fixResult && (
        <div className={`text-xs font-mono px-4 py-2.5 rounded-lg border ${fixResult.ok ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
          {fixResult.ok
            ? `✓ Done — corrected review sessions with inflated scores. Data reloaded.`
            : `✗ Fix failed: ${fixResult.message}`}
        </div>
      )}

      {filtered.length === 0 && <div className="text-center py-16 text-gray-600 font-mono text-sm">// no sessions recorded yet</div>}

      {filtered.map((s) => {
        const isOpen = expanded === s.id;
        const pct = s.total_steps > 0 ? Math.min(100, Math.round((s.correct_count / s.total_steps) * 100)) : 0;
        const date = new Date(s.timestamp).toLocaleString();
        const profile = userMap[s.user_id];
        const userName = profile
          ? [profile.first_name, profile.last_name].filter(Boolean).join(" ") || profile.nus_id || "—"
          : s.user_id?.slice(0, 8) + "…";
        const mode = profile?.instruction_mode;
        const reviewSession = isReview(s);

        return (
          <div key={s.id} className={`border rounded-xl overflow-hidden ${reviewSession ? "bg-[#13111f] border-violet-500/20" : "bg-[#161b22] border-[#30363d]"}`}>
            <button
              onClick={() => setExpanded(isOpen ? null : s.id)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#1c2330] transition-colors cursor-pointer"
            >
              {reviewSession ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border text-violet-400 border-violet-500/30 bg-violet-500/10 shrink-0">review</span>
              ) : (
                <span className={`text-xs font-mono px-2 py-0.5 rounded-full border shrink-0 ${s.completed ? "text-green-400 border-green-500/30 bg-green-500/10" : "text-gray-500 border-gray-600/30"}`}>
                  {s.completed ? "✓" : "⏸"}
                </span>
              )}
              <span className="text-gray-300 text-xs font-mono flex-1 truncate">
                {s.concept_id} {reviewSession ? "— Chapter Review" : `L${s.level} — ${s.modality}`}
              </span>
              {mode && (
                <span className={`text-[10px] font-mono hidden sm:inline ${MODE_COLORS[mode] || "text-gray-400"}`}>
                  {MODE_LABELS[mode] || mode}
                </span>
              )}
              <span className="text-gray-400 text-xs font-mono w-16 text-right">{pct}% correct</span>
              <span className="text-gray-400 text-xs font-mono hidden md:block max-w-[120px] truncate">{userName}</span>
              <span className="text-gray-600 text-xs font-mono hidden lg:block w-36 text-right">{date}</span>
              <span className="text-gray-600 text-xs ml-1">{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen && (
              <div className="px-4 pb-4 border-t border-[#30363d] pt-3 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  {[
                    ["User",       userName],
                    ["Mode",       MODE_LABELS[mode] || mode || "—"],
                    ["Time",       s.time_spent != null ? s.time_spent + "s" : "—"],
                    ["Score",      s.reward_score?.toFixed(2) ?? "—"],
                    ["Correct",    `${s.correct_count ?? "—"}/${s.total_steps ?? "—"}`],
                    ["First-try",  `${s.first_try_count ?? "—"}/${s.total_steps ?? "—"}`],
                    ["Hints",      s.total_hints ?? "—"],
                    ["Scaffold",   s.scaffold_used ? "yes" : "no"],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-[#0d1117] rounded-lg p-2">
                      <p className="text-gray-600 text-[10px] uppercase tracking-wider">{k}</p>
                      <p className="text-gray-300 mt-0.5 truncate">{v}</p>
                    </div>
                  ))}
                </div>
                {s.step_details && s.step_details.length > 0 && (
                  <div>
                    <p className="text-gray-500 text-[10px] font-mono uppercase tracking-wider mb-2">Per-step detail</p>
                    <div className="space-y-1">
                      {s.step_details.map((step, i) => (
                        <div key={i} className="flex items-center gap-3 text-xs font-mono bg-[#0d1117] rounded-lg px-3 py-1.5">
                          <span className="text-gray-600 w-6">#{step.stepIndex + 1}</span>
                          <span className={step.correct ? "text-green-400" : "text-red-400"}>{step.correct ? "✓ correct" : "✗ wrong"}</span>
                          <span className="text-gray-500">{step.firstTry ? "first try" : `${step.attempts} attempts`}</span>
                          <span className="text-gray-500">{step.hintCount > 0 ? `${step.hintCount} hint${step.hintCount > 1 ? "s" : ""}` : "no hints"}</span>
                          <span className="ml-auto text-cyan-400">{step.rewardScore?.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="pt-2 flex justify-end">
                  <button onClick={() => deleteSession(s.id)} disabled={deletingId === s.id}
                    className="text-xs font-mono px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/15 transition-colors cursor-pointer disabled:opacity-50">
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

// ─── ANALYTICS TAB ───────────────────────────────────────────────────────────

function AnalyticsTab() {
  const [sessions, setSessions] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const client = supabaseAdmin || supabase;
    if (!client) { setLoading(false); return; }
    setLoading(true);
    try {
      const [{ data: sess }, { data: prof }] = await Promise.all([
        client.from("sessions").select(
          "user_id, concept_id, level, modality, support_strategy, completed, " +
          "correct_count, total_steps, first_try_count, total_hints, reward_score, time_spent, timestamp"
        ).limit(500),
        client.from("profiles").select("id, instruction_mode"),
      ]);
      setSessions(sess || []);
      setProfiles(prof || []);
    } catch {}
    setLoading(false);
  }

  const modeMap = {};
  profiles.forEach((p) => { if (p.instruction_mode) modeMap[p.id] = p.instruction_mode; });

  const MODES = ["worked_example_first", "try_first_then_hint", "step_by_step_scaffold"];

  // Lesson sessions only (level > 0)
  const lessonSessions = sessions.filter((s) => s.level > 0);
  // Review sessions (level === 0)
  const reviewSessions = sessions.filter((s) => s.level === 0 || s.support_strategy === "review");

  // Stats per instruction mode
  const modeStats = MODES.map((mode) => {
    const userIds = profiles.filter((p) => p.instruction_mode === mode).map((p) => p.id);
    const rows = lessonSessions.filter((s) => userIds.includes(s.user_id));
    const reviews = reviewSessions.filter((s) => userIds.includes(s.user_id));
    const avgCorrect = rows.length === 0 ? null
      : Math.round(rows.reduce((sum, r) => sum + (r.total_steps > 0 ? r.correct_count / r.total_steps : 0), 0) / rows.length * 100);
    const avgHints = rows.length === 0 ? null
      : (rows.reduce((sum, r) => sum + (r.total_hints ?? 0), 0) / rows.length).toFixed(1);
    const avgTime = rows.length === 0 ? null
      : Math.round(rows.reduce((sum, r) => sum + (r.time_spent ?? 0), 0) / rows.length);
    const completionRate = rows.length === 0 ? null
      : Math.round(rows.filter((r) => r.completed).length / rows.length * 100);
    const avgReviewScore = reviews.length === 0 ? null
      : Math.round(reviews.reduce((sum, r) => sum + (r.total_steps > 0 ? r.correct_count / r.total_steps : 0), 0) / reviews.length * 100);
    return { mode, userCount: userIds.length, sessionCount: rows.length, reviewCount: reviews.length,
      avgCorrect, avgHints, avgTime, completionRate, avgReviewScore };
  });

  // Per-concept review scores broken down by instruction mode
  const conceptReviewStats = CONCEPTS.map((concept) => {
    const modeScores = MODES.map((mode) => {
      const userIds = profiles.filter((p) => p.instruction_mode === mode).map((p) => p.id);
      const rows = reviewSessions.filter((s) => s.concept_id === concept && userIds.includes(s.user_id));
      const avg = rows.length === 0 ? null
        : Math.round(rows.reduce((sum, r) => sum + (r.total_steps > 0 ? r.correct_count / r.total_steps : 0), 0) / rows.length * 100);
      return { mode, avg, count: rows.length };
    });
    return { concept, modeScores };
  });

  // Modality breakdown
  const MODALITIES = ["codeSimulation", "dragDrop", "speedCoding"];
  const modalityStats = MODALITIES.map((m) => {
    const rows = lessonSessions.filter((s) => s.modality === m);
    const correctPct = rows.length === 0 ? null
      : Math.round(rows.reduce((sum, r) => sum + (r.total_steps > 0 ? r.correct_count / r.total_steps : 0), 0) / rows.length * 100);
    return { key: m, count: rows.length, correctPct };
  });

  // Concept completion counts
  const conceptStats = CONCEPTS.map((c) => {
    const completedUsers = new Set(lessonSessions.filter((s) => s.concept_id === c && s.level === 5 && s.completed).map((s) => s.user_id)).size;
    const reviewedUsers = new Set(reviewSessions.filter((s) => s.concept_id === c).map((s) => s.user_id)).size;
    return { concept: c, completedUsers, reviewedUsers };
  });

  if (loading) return <div className="text-center py-16 text-cyan-400 font-mono animate-pulse text-sm">Loading analytics...</div>;

  const totalSessions = lessonSessions.length;
  const totalReviews = reviewSessions.length;
  const totalUsers = profiles.length;

  return (
    <div className="space-y-6">
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        {[["Total Users", totalUsers, "text-cyan-400"], ["Lesson Sessions", totalSessions, "text-violet-400"], ["Chapter Reviews", totalReviews, "text-amber-400"]].map(([label, val, color]) => (
          <div key={label} className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold font-mono ${color}`}>{val}</p>
            <p className="text-gray-500 text-xs font-mono mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Instruction Mode Comparison — the core research table */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
        <h2 className="text-lg font-bold text-gray-100 mb-1">
          Instruction Mode Comparison
          <span className="ml-2 text-[10px] font-mono text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider align-middle">live · supabase</span>
        </h2>
        <p className="text-xs text-gray-500 mb-5">How each fixed instruction mode performs across all users. This is the core research metric.</p>
        <div className="space-y-5">
          {modeStats.map(({ mode, userCount, sessionCount, reviewCount, avgCorrect, avgHints, avgTime, completionRate, avgReviewScore }) => {
            const maxCorrect = Math.max(...modeStats.map((m) => m.avgCorrect ?? 0), 1);
            return (
              <div key={mode}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-semibold ${MODE_COLORS[mode] || "text-gray-400"}`}>{MODE_LABELS[mode] || mode}</span>
                  <span className="text-gray-600 text-xs font-mono">{userCount} users · {sessionCount} sessions</span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-[10px] font-mono text-gray-600 mb-1">
                    <span>Lesson correctness</span>
                    <span>{avgCorrect == null ? "—" : `${avgCorrect}%`}</span>
                  </div>
                  <div className="bg-[#0d1117] rounded-full h-3 overflow-hidden border border-[#30363d]">
                    <div className={`h-full bg-gradient-to-r ${MODE_BAR[mode]} rounded-full transition-all duration-500`}
                      style={{ width: avgCorrect == null ? "0%" : `${(avgCorrect / maxCorrect) * 100}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
                  {[
                    ["Avg correct", avgCorrect == null ? "—" : `${avgCorrect}%`, avgCorrect == null ? "text-gray-600" : avgCorrect >= 70 ? "text-green-400" : avgCorrect >= 40 ? "text-yellow-400" : "text-red-400"],
                    ["Completion", completionRate == null ? "—" : `${completionRate}%`, "text-gray-300"],
                    ["Avg hints", avgHints ?? "—", "text-gray-300"],
                    ["Avg time", avgTime == null ? "—" : `${avgTime}s`, "text-gray-300"],
                    ["Review score", avgReviewScore == null ? "—" : `${avgReviewScore}%`, avgReviewScore == null ? "text-gray-600" : avgReviewScore >= 70 ? "text-green-400" : avgReviewScore >= 40 ? "text-yellow-400" : "text-red-400"],
                  ].map(([label, val, color]) => (
                    <div key={label} className="bg-[#0d1117] rounded-lg px-3 py-2 border border-[#30363d]">
                      <p className="text-gray-600 text-[10px] uppercase tracking-wider">{label}</p>
                      <p className={`font-semibold mt-0.5 ${color}`}>{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chapter Review Scores — per concept × mode */}
      {totalReviews > 0 && (
        <div className="bg-[#161b22] border border-violet-500/20 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-100 mb-1">Chapter Review Scores by Concept &amp; Mode</h2>
          <p className="text-xs text-gray-500 mb-5">
            Post-concept assessment scores broken down by concept — the key metric for which instruction mode works best.
          </p>
          {/* Column headers */}
          <div className="grid grid-cols-4 gap-2 mb-2">
            <div /> {/* empty corner */}
            {MODES.map((mode) => (
              <div key={mode} className="text-center">
                <p className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${MODE_COLORS[mode]}`}>
                  {MODE_LABELS[mode]}
                </p>
              </div>
            ))}
          </div>
          {/* Rows: one per concept */}
          <div className="space-y-2">
            {conceptReviewStats.map(({ concept, modeScores }) => (
              <div key={concept} className="grid grid-cols-4 gap-2 items-center">
                {/* Concept label */}
                <div className="text-xs font-mono text-gray-400 capitalize font-semibold pl-1">{concept}</div>
                {/* Score per mode */}
                {modeScores.map(({ mode, avg, count }) => (
                  <div key={mode} className="bg-[#0d1117] rounded-xl p-3 border border-[#30363d] text-center">
                    <p className={`text-xl font-bold font-mono ${avg == null ? "text-gray-700" : avg >= 70 ? "text-green-400" : avg >= 40 ? "text-yellow-400" : "text-red-400"}`}>
                      {avg == null ? "—" : `${avg}%`}
                    </p>
                    <p className="text-gray-600 text-[10px] mt-0.5">{count} review{count !== 1 ? "s" : ""}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
          {/* Overall row */}
          <div className="grid grid-cols-4 gap-2 items-center mt-3 pt-3 border-t border-[#30363d]">
            <div className="text-[10px] font-mono text-gray-600 uppercase tracking-wider pl-1">Overall</div>
            {modeStats.map(({ mode, avgReviewScore, reviewCount }) => (
              <div key={mode} className="bg-[#0d1117] rounded-xl p-3 border border-[#30363d] text-center">
                <p className={`text-xl font-bold font-mono ${avgReviewScore == null ? "text-gray-700" : avgReviewScore >= 70 ? "text-green-400" : avgReviewScore >= 40 ? "text-yellow-400" : "text-red-400"}`}>
                  {avgReviewScore == null ? "—" : `${avgReviewScore}%`}
                </p>
                <p className="text-gray-600 text-[10px] mt-0.5">{reviewCount} total</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modality breakdown */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
        <h2 className="text-lg font-bold text-gray-100 mb-1">Teaching Format Performance</h2>
        <p className="text-xs text-gray-500 mb-4">Correctness rate per modality (randomly assigned — not controlled by instruction mode).</p>
        <div className="grid grid-cols-3 gap-4">
          {modalityStats.map(({ key, count, correctPct }) => (
            <div key={key} className="bg-[#0d1117] rounded-xl p-4 border border-[#30363d] text-center">
              <p className="text-gray-300 font-mono text-xs mb-2">{{ codeSimulation: ">_ Code", dragDrop: "{ } Drag", speedCoding: "⚡ Speed" }[key]}</p>
              <p className={`text-2xl font-bold font-mono ${correctPct == null ? "text-gray-700" : correctPct >= 70 ? "text-green-400" : correctPct >= 40 ? "text-yellow-400" : "text-red-400"}`}>
                {count === 0 ? "—" : `${correctPct}%`}
              </p>
              <p className="text-gray-600 text-[10px] mt-1">{count} sessions</p>
            </div>
          ))}
        </div>
      </div>

      {/* Concept progress */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
        <h2 className="text-lg font-bold text-gray-100 mb-1">Concept Completion</h2>
        <p className="text-xs text-gray-500 mb-4">How many users finished all 5 levels and completed the chapter review per concept.</p>
        <div className="grid grid-cols-3 gap-4">
          {conceptStats.map(({ concept, completedUsers, reviewedUsers }) => (
            <div key={concept} className="bg-[#0d1117] rounded-xl p-4 border border-[#30363d] text-center">
              <p className="text-gray-300 font-mono text-xs mb-3 capitalize">{concept}</p>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between"><span className="text-gray-500">Completed</span><span className="text-cyan-400">{completedUsers} users</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Reviewed</span><span className="text-violet-400">{reviewedUsers} users</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={fetchData} className="text-xs font-mono text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">↺ Refresh analytics</button>
      </div>
    </div>
  );
}

// ─── RAW DATA TAB ────────────────────────────────────────────────────────────

function RawDataTab() {
  const [sessions, setSessions] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const client = supabaseAdmin || supabase;
    if (!client) { setError("Supabase not configured."); setLoading(false); return; }
    setLoading(true); setError(null);
    try {
      const [{ data, error: err }, { data: profiles }] = await Promise.all([
        client.from("sessions").select(
          "id, user_id, concept_id, level, modality, support_strategy, " +
          "completed, time_spent, correct_count, total_steps, first_try_count, " +
          "total_attempts, total_hints, scaffold_used, reward_score, timestamp"
        ).order("timestamp", { ascending: false }),
        client.from("profiles").select("id, first_name, last_name, nus_id, instruction_mode"),
      ]);
      if (err) throw err;
      const map = {};
      (profiles || []).forEach((p) => { map[p.id] = p; });
      setUserMap(map);
      setSessions(data || []);
    } catch (err) { setError(err.message); }
    setLoading(false);
  }

  if (loading) return <div className="text-center py-16 text-cyan-400 font-mono animate-pulse text-sm">Loading raw data...</div>;
  if (error) return <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm font-mono">{error}</div>;

  const isReview = (s) => s.level === 0 || s.support_strategy === "review";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-xs font-mono">{sessions.length} total sessions (all time)</p>
        <button onClick={fetchData} className="text-xs font-mono text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">↺ Refresh</button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#30363d]">
        <table className="w-full text-xs font-mono border-collapse min-w-[1100px]">
          <thead>
            <tr className="bg-[#161b22] text-left">
              {[
                "Timestamp", "User", "NUS ID", "Mode",
                "Concept", "Level", "Modality",
                "Correct", "Total", "Score %",
                "Time (s)", "Hints", "First Try", "Scaffold", "Completed",
              ].map((h) => (
                <th key={h} className="px-3 py-2.5 text-gray-500 font-semibold uppercase tracking-wider text-[10px] whitespace-nowrap border-b border-[#30363d]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sessions.map((s, i) => {
              const p = userMap[s.user_id];
              const name = p ? [p.first_name, p.last_name].filter(Boolean).join(" ") || "—" : "—";
              const pct = s.total_steps > 0 ? Math.min(100, Math.round((s.correct_count / s.total_steps) * 100)) : 0;
              const review = isReview(s);
              return (
                <tr key={s.id} className={`border-b border-[#21262d] ${i % 2 === 0 ? "bg-[#0d1117]" : "bg-[#0f1419]"} hover:bg-[#1c2333] transition-colors`}>
                  <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{new Date(s.timestamp).toLocaleString()}</td>
                  <td className="px-3 py-2 text-gray-300 whitespace-nowrap">{name}</td>
                  <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{p?.nus_id || "—"}</td>
                  <td className={`px-3 py-2 whitespace-nowrap ${MODE_COLORS[p?.instruction_mode] || "text-gray-600"}`}>
                    {MODE_LABELS[p?.instruction_mode] || "—"}
                  </td>
                  <td className="px-3 py-2 text-gray-300 capitalize whitespace-nowrap">{s.concept_id}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {review
                      ? <span className="text-violet-400">review</span>
                      : <span className="text-gray-400">L{s.level}</span>
                    }
                  </td>
                  <td className="px-3 py-2 text-gray-400 whitespace-nowrap">
                    {{ codeSimulation: "Code Sim", dragDrop: "Drag & Drop", speedCoding: "Speed" }[s.modality] || s.modality || "—"}
                  </td>
                  <td className="px-3 py-2 text-center text-gray-300">{s.correct_count ?? "—"}</td>
                  <td className="px-3 py-2 text-center text-gray-500">{s.total_steps ?? "—"}</td>
                  <td className={`px-3 py-2 text-center font-semibold ${pct >= 70 ? "text-green-400" : pct >= 40 ? "text-yellow-400" : "text-red-400"}`}>
                    {s.total_steps > 0 ? `${pct}%` : "—"}
                  </td>
                  <td className="px-3 py-2 text-center text-gray-400">{s.time_spent ?? "—"}</td>
                  <td className="px-3 py-2 text-center text-gray-400">{s.total_hints ?? "—"}</td>
                  <td className="px-3 py-2 text-center text-gray-400">{s.first_try_count ?? "—"}</td>
                  <td className="px-3 py-2 text-center">{s.scaffold_used ? <span className="text-violet-400">yes</span> : <span className="text-gray-600">no</span>}</td>
                  <td className="px-3 py-2 text-center">{s.completed ? <span className="text-green-400">✓</span> : <span className="text-gray-600">—</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {sessions.length === 0 && (
          <div className="text-center py-16 text-gray-600 font-mono text-sm">// no sessions recorded yet</div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────

function AdminDashboard() {
  const [tab, setTab] = useState("users");
  const [exporting, setExporting] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-orange-400">
              CodeCraft Admin
            </h1>
            <p className="text-gray-500 text-sm font-mono">Instructor Dashboard — Beta</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={async () => {
                setExporting(true);
                try { await exportToExcel(supabaseAdmin || supabase); } finally { setExporting(false); }
              }}
              disabled={exporting}
              className="bg-[#161b22] border border-cyan-500/40 text-cyan-400 font-medium px-4 py-2 rounded-lg hover:border-cyan-400 hover:text-cyan-300 transition-colors text-sm cursor-pointer disabled:opacity-50"
            >
              {exporting ? "Exporting…" : "⬇ Export Excel"}
            </button>
            <Link to="/" className="bg-[#161b22] border border-[#30363d] text-gray-300 font-medium px-4 py-2 rounded-lg hover:border-[#484f58] transition-colors text-sm">
              ← Back
            </Link>
            <button onClick={handleSignOut}
              className="bg-[#161b22] border border-[#30363d] text-gray-400 font-medium px-4 py-2 rounded-lg hover:border-red-500/40 hover:text-red-400 transition-colors text-sm cursor-pointer">
              Sign Out
            </button>
          </div>
        </div>

        <div className="flex bg-[#0d1117] rounded-xl p-1 mb-6 border border-[#30363d] w-fit gap-1">
          {[
            { id: "users",     label: "👥 Users" },
            { id: "sessions",  label: "📋 Sessions" },
            { id: "analytics", label: "📊 Analytics" },
            { id: "rawdata",   label: "🗃 Raw Data" },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-2 rounded-lg text-sm font-mono font-semibold transition-all duration-200 cursor-pointer ${
                tab === t.id ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow" : "text-gray-500 hover:text-gray-300"
              }`}
            >{t.label}</button>
          ))}
        </div>

        {tab === "users"     && <UsersTab />}
        {tab === "sessions"  && <SessionsTab />}
        {tab === "analytics" && <AnalyticsTab />}
        {tab === "rawdata"   && <RawDataTab />}
      </div>
    </div>
  );
}

export default AdminDashboard;
