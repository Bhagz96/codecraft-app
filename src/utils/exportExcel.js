/**
 * EXCEL EXPORT UTILITY
 * ====================
 * Fetches all data from Supabase and generates a formatted .xlsx workbook
 * with four sheets: Users, Sessions, MAB Summary, and Analysis.
 *
 * The Analysis sheet is the core deliverable — it pre-aggregates outcomes
 * by (Support Strategy × Skill Level) and (Modality × Skill Level) so
 * instructors can immediately see which variation works best for which
 * learner group without needing to pivot the data themselves.
 */

import * as XLSX from "xlsx";
import { SUPPORT_STRATEGIES, MODALITIES } from "../mab/engine";

// ── Human-readable labels ──────────────────────────────────────────────────

const STRATEGY_LABELS = {
  worked_example_first:  "Example First",
  hint_first:            "Hint First",
  try_first_then_hint:   "Try → Hint",
  step_by_step_scaffold: "Step-by-Step Scaffold",
  explain_after_error:   "Explain After Error",
};

const MODALITY_LABELS = {
  codeSimulation: "Code Simulation",
  dragDrop:       "Drag & Drop",
  speedCoding:    "Speed Coding",
};

const CONCEPTS = ["variables", "loops", "conditions"];
const SKILL_LEVELS = ["beginner", "intermediate", "expert"];

// ── Pure data-building functions (exported for testing) ───────────────────

/**
 * Sheet 1 — one row per registered user with hero stats and progress snapshot.
 */
export function buildUsersSheet(profiles, heroMap, progressMap) {
  return profiles.map((p) => {
    const h    = heroMap[p.id];
    const prog = progressMap[p.id] || {};
    const vars = prog.variables   || 0;
    const loop = prog.loops       || 0;
    const cond = prog.conditions  || 0;
    return {
      "NUS ID":               p.nus_id      || "",
      "First Name":           p.first_name  || "",
      "Last Name":            p.last_name   || "",
      "Skill Level":          p.skill_level || "",
      "Hero Name":            h?.name       || "",
      "Hero Level":           h?.level      ?? "",
      "Hero XP":              h?.xp         ?? "",
      "Hero HP":              h?.health     ?? "",
      "Hero ATK":             h?.attack     ?? "",
      "Hero Gold":            h?.gold       ?? "",
      "Variables (/ 5)":      vars,
      "Loops (/ 5)":          loop,
      "Conditions (/ 5)":     cond,
      "Total Levels Completed": vars + loop + cond,
    };
  });
}

/**
 * Sheet 2 — one row per session, all raw metrics with user info joined in.
 */
export function buildSessionsSheet(sessions, profileMap) {
  return sessions.map((s) => {
    const p = profileMap[s.user_id];
    const correctPct = s.total_steps > 0
      ? Math.round((s.correct_count / s.total_steps) * 100)
      : 0;
    return {
      "Session ID":       s.session_id || s.id || "",
      "NUS ID":           p?.nus_id    || "",
      "Name":             p ? [p.first_name, p.last_name].filter(Boolean).join(" ") : "",
      "Skill Level":      p?.skill_level || "",
      "Concept":          s.concept_id   || "",
      "Level":            s.level,
      "Modality":         MODALITY_LABELS[s.modality]          || s.modality          || "",
      "Support Strategy": STRATEGY_LABELS[s.support_strategy]  || s.support_strategy  || "",
      "Completed":        s.completed ? "Yes" : "No",
      "Correct %":        correctPct,
      "First-Try Count":  s.first_try_count  ?? "",
      "Total Steps":      s.total_steps      ?? "",
      "Total Hints":      s.total_hints      ?? "",
      "Attempts":         s.total_attempts   ?? "",
      "Scaffold Used":    s.scaffold_used ? "Yes" : "No",
      "Reward Score":     s.reward_score != null ? +s.reward_score.toFixed(3) : "",
      "Time (seconds)":   s.time_spent       ?? "",
      "Date":             s.timestamp ? new Date(s.timestamp).toLocaleString() : "",
    };
  });
}

/**
 * Sheet 3 — Instruction Mode Comparison.
 *
 * Replaces the old MAB Summary sheet. Each user has a single fixed
 * instruction mode assigned at sign-up (no dynamic MAB selection).
 *
 * Three sections:
 *   A) Lesson performance per mode × concept
 *   B) Chapter review scores per mode × concept
 *   C) Modality performance (still randomly assigned per session)
 */
export function buildModeComparisonSheet(sessions, profiles) {
  const rows = [];

  // Build a userId → instruction_mode lookup
  const modeMap = {};
  profiles.forEach((p) => { if (p.instruction_mode) modeMap[p.id] = p.instruction_mode; });

  const lessonSessions = sessions.filter((s) => s.level > 0);
  const reviewSessions = sessions.filter((s) => s.level === 0 || s.support_strategy === "review");

  const avg = (arr, fn) => arr.length === 0 ? "" : +(arr.reduce((s, r) => s + fn(r), 0) / arr.length).toFixed(1);
  const pct = (arr, fn) => arr.length === 0 ? "" : Math.round(arr.reduce((s, r) => s + fn(r), 0) / arr.length * 100);

  // ── Section A: Lesson performance per mode × concept ──────────────────────
  rows.push({
    "Section": "── A: Lesson Performance by Instruction Mode ──",
    "Instruction Mode": "", "Concept": "", "Sessions": "",
    "Completion %": "", "Avg Correct %": "", "Avg Hints": "", "Avg Time (s)": "", "Avg Reward Score": "",
  });

  SUPPORT_STRATEGIES.forEach((mode) => {
    const modeUsers = profiles.filter((p) => p.instruction_mode === mode).map((p) => p.id);

    // Overall row for this mode
    const allRows = lessonSessions.filter((s) => modeUsers.includes(s.user_id));
    rows.push({
      "Section": "",
      "Instruction Mode": STRATEGY_LABELS[mode] || mode,
      "Concept": "All Concepts",
      "Sessions": allRows.length,
      "Completion %":    pct(allRows, (s) => s.completed ? 1 : 0),
      "Avg Correct %":   pct(allRows, (s) => s.total_steps > 0 ? s.correct_count / s.total_steps : 0),
      "Avg Hints":       avg(allRows, (s) => s.total_hints ?? 0),
      "Avg Time (s)":    avg(allRows, (s) => s.time_spent ?? 0),
      "Avg Reward Score": allRows.length === 0 ? "" : +(allRows.reduce((s, r) => s + (r.reward_score ?? 0), 0) / allRows.length).toFixed(3),
    });

    // Per-concept breakdown
    CONCEPTS.forEach((concept) => {
      const r = lessonSessions.filter((s) => modeUsers.includes(s.user_id) && s.concept_id === concept);
      if (r.length === 0) return;
      rows.push({
        "Section": "",
        "Instruction Mode": "",
        "Concept": concept.charAt(0).toUpperCase() + concept.slice(1),
        "Sessions": r.length,
        "Completion %":    pct(r, (s) => s.completed ? 1 : 0),
        "Avg Correct %":   pct(r, (s) => s.total_steps > 0 ? s.correct_count / s.total_steps : 0),
        "Avg Hints":       avg(r, (s) => s.total_hints ?? 0),
        "Avg Time (s)":    avg(r, (s) => s.time_spent ?? 0),
        "Avg Reward Score": +(r.reduce((s, rv) => s + (rv.reward_score ?? 0), 0) / r.length).toFixed(3),
      });
    });
  });

  rows.push({ "Section": "" }); // separator

  // ── Section B: Chapter review scores per mode × concept ───────────────────
  rows.push({
    "Section": "── B: Chapter Review Scores by Instruction Mode ──",
    "Instruction Mode": "", "Concept": "", "Sessions": "",
    "Completion %": "", "Avg Correct %": "", "Avg Hints": "", "Avg Time (s)": "", "Avg Reward Score": "",
  });

  SUPPORT_STRATEGIES.forEach((mode) => {
    const modeUsers = profiles.filter((p) => p.instruction_mode === mode).map((p) => p.id);

    const allReviews = reviewSessions.filter((s) => modeUsers.includes(s.user_id));
    rows.push({
      "Section": "",
      "Instruction Mode": STRATEGY_LABELS[mode] || mode,
      "Concept": "All Concepts",
      "Sessions": allReviews.length,
      "Completion %": "",
      "Avg Correct %": pct(allReviews, (s) => s.total_steps > 0 ? s.correct_count / s.total_steps : 0),
      "Avg Hints": "", "Avg Time (s)": "", "Avg Reward Score": "",
    });

    CONCEPTS.forEach((concept) => {
      const r = reviewSessions.filter((s) => modeUsers.includes(s.user_id) && s.concept_id === concept);
      if (r.length === 0) return;
      rows.push({
        "Section": "",
        "Instruction Mode": "",
        "Concept": concept.charAt(0).toUpperCase() + concept.slice(1),
        "Sessions": r.length,
        "Completion %": "",
        "Avg Correct %": pct(r, (s) => s.total_steps > 0 ? s.correct_count / s.total_steps : 0),
        "Avg Hints": "", "Avg Time (s)": "", "Avg Reward Score": "",
      });
    });
  });

  rows.push({ "Section": "" }); // separator

  // ── Section C: Modality performance (randomly assigned) ───────────────────
  rows.push({
    "Section": "── C: Teaching Format Performance (random assignment) ──",
    "Instruction Mode": "", "Concept": "", "Sessions": "",
    "Completion %": "", "Avg Correct %": "", "Avg Hints": "", "Avg Time (s)": "", "Avg Reward Score": "",
  });

  MODALITIES.forEach((modality) => {
    const r = lessonSessions.filter((s) => s.modality === modality);
    rows.push({
      "Section": "",
      "Instruction Mode": MODALITY_LABELS[modality] || modality,
      "Concept": "All Concepts",
      "Sessions": r.length,
      "Completion %":    pct(r, (s) => s.completed ? 1 : 0),
      "Avg Correct %":   pct(r, (s) => s.total_steps > 0 ? s.correct_count / s.total_steps : 0),
      "Avg Hints":       avg(r, (s) => s.total_hints ?? 0),
      "Avg Time (s)":    avg(r, (s) => s.time_spent ?? 0),
      "Avg Reward Score": "",
    });
  });

  return rows;
}

/**
 * Sheet 4 — the key analysis sheet.
 * Pre-aggregates outcomes for every (variation × skill level) pair so
 * instructors can immediately answer "which strategy works best for Beginners?".
 *
 * Rows are grouped: Support Strategy × Skill Level first, then Modality × Skill Level.
 * Combinations with zero sessions are omitted.
 */
export function buildAnalysisSheet(sessions, profiles) {
  const rows = [];

  const usersByLevel = {};
  SKILL_LEVELS.forEach((lvl) => {
    usersByLevel[lvl] = profiles.filter((p) => p.skill_level === lvl).map((p) => p.id);
  });

  const aggregate = (subset) => {
    if (subset.length === 0) return null;
    return {
      sessions:       subset.length,
      completionRate: Math.round(subset.filter((s) => s.completed).length / subset.length * 100),
      correctPct:     Math.round(subset.reduce((sum, s) => sum + (s.total_steps > 0 ? s.correct_count / s.total_steps : 0), 0) / subset.length * 100),
      avgHints:       +(subset.reduce((sum, s) => sum + (s.total_hints ?? 0), 0) / subset.length).toFixed(1),
      avgTime:        Math.round(subset.reduce((sum, s) => sum + (s.time_spent ?? 0), 0) / subset.length),
      avgReward:      +(subset.reduce((sum, s) => sum + (s.reward_score ?? 0), 0) / subset.length).toFixed(3),
    };
  };

  const makeRow = (group, level, stats, includeReward) => ({
    "Group":        group,
    "Skill Level":  level.charAt(0).toUpperCase() + level.slice(1),
    "Sessions":     stats.sessions,
    "Completion %": stats.completionRate,
    "Avg Correct %": stats.correctPct,
    "Avg Hints":    stats.avgHints,
    "Avg Time (s)": stats.avgTime,
    "Avg Reward":   includeReward ? stats.avgReward : "—",
  });

  // ── Support Strategy × Skill Level ──
  rows.push({ "Group": "── Support Strategy × Skill Level ──", "Skill Level": "", "Sessions": "", "Completion %": "", "Avg Correct %": "", "Avg Hints": "", "Avg Time (s)": "", "Avg Reward": "" });

  SUPPORT_STRATEGIES.forEach((strategy) => {
    SKILL_LEVELS.forEach((level) => {
      const subset = sessions.filter(
        (s) => s.support_strategy === strategy && usersByLevel[level].includes(s.user_id)
      );
      const stats = aggregate(subset);
      if (!stats) return;
      rows.push(makeRow(STRATEGY_LABELS[strategy] || strategy, level, stats, true));
    });
  });

  rows.push({}); // separator

  // ── Modality × Skill Level ──
  rows.push({ "Group": "── Modality × Skill Level ──", "Skill Level": "", "Sessions": "", "Completion %": "", "Avg Correct %": "", "Avg Hints": "", "Avg Time (s)": "", "Avg Reward": "" });

  MODALITIES.forEach((modality) => {
    SKILL_LEVELS.forEach((level) => {
      const subset = sessions.filter(
        (s) => s.modality === modality && usersByLevel[level].includes(s.user_id)
      );
      const stats = aggregate(subset);
      if (!stats) return;
      rows.push(makeRow(MODALITY_LABELS[modality] || modality, level, stats, false));
    });
  });

  return rows;
}

// ── Column widths ──────────────────────────────────────────────────────────

const COL_WIDTHS = {
  Users: [14, 14, 14, 14, 14, 10, 10, 10, 10, 10, 16, 14, 16, 20],
  Sessions: [20, 14, 18, 14, 12, 8, 18, 24, 10, 10, 14, 12, 12, 10, 14, 14, 14, 22],
  "Mode Comparison": [44, 24, 16, 10, 14, 14, 12, 14, 16],
  Analysis: [32, 14, 10, 14, 14, 12, 14, 12],
};

function applySheet(wb, rows, name) {
  if (rows.length === 0) return;
  const ws = XLSX.utils.json_to_sheet(rows);
  const widths = COL_WIDTHS[name];
  if (widths) ws["!cols"] = widths.map((wch) => ({ wch }));
  XLSX.utils.book_append_sheet(wb, ws, name);
}

// ── Main export function ───────────────────────────────────────────────────

/**
 * Fetches all data from Supabase, builds four sheets, and triggers a download.
 * @param {import('@supabase/supabase-js').SupabaseClient} client
 */
export async function exportToExcel(client) {
  // Fetch everything without row limits
  const [
    { data: profilesData },
    { data: heroesData },
    { data: progressData },
    { data: sessionsData },
  ] = await Promise.all([
    client.from("profiles").select("id, nus_id, first_name, last_name, skill_level, role, instruction_mode"),
    client.from("heroes").select("user_id, name, level, xp, health, attack, defense, gold"),
    client.from("user_progress").select("user_id, concept_id, highest_level"),
    client.from("sessions").select(
      "id, session_id, user_id, concept_id, level, modality, support_strategy, " +
      "completed, correct_count, total_steps, first_try_count, total_attempts, " +
      "total_hints, scaffold_used, reward_score, time_spent, timestamp"
    ).order("timestamp", { ascending: false }),
  ]);

  const profiles  = profilesData  || [];
  const heroes    = heroesData    || [];
  const progress  = progressData  || [];
  const sessions  = sessionsData  || [];

  // Build lookup maps
  const heroMap = {};
  heroes.forEach((h) => { heroMap[h.user_id] = h; });

  const progressMap = {};
  progress.forEach((p) => {
    if (!progressMap[p.user_id]) progressMap[p.user_id] = {};
    const cur = progressMap[p.user_id][p.concept_id] || 0;
    if (p.highest_level > cur) progressMap[p.user_id][p.concept_id] = p.highest_level;
  });

  const profileMap = {};
  profiles.forEach((p) => { profileMap[p.id] = p; });

  // Build sheets
  const wb = XLSX.utils.book_new();
  applySheet(wb, buildUsersSheet(profiles, heroMap, progressMap),         "Users");
  applySheet(wb, buildSessionsSheet(sessions, profileMap),                "Sessions");
  applySheet(wb, buildModeComparisonSheet(sessions, profiles),            "Mode Comparison");
  applySheet(wb, buildAnalysisSheet(sessions, profiles),                  "Analysis");

  // Trigger download
  const date = new Date().toISOString().split("T")[0];
  XLSX.writeFile(wb, `codecraft-data-${date}.xlsx`);
}
