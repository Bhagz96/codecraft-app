/**
 * SUPABASE SESSION LOGGING + GLOBAL MAB SYNC
 * ===========================================
 * Re-exports the shared Supabase client and provides:
 *   - logSessionToSupabase   — persist full session (incl. step_details)
 *   - loadMABFromSupabase    — pull global MAB state for arm selection
 *   - incrementMABArm        — atomically update pulls+reward after each question
 *
 * All calls degrade silently if Supabase isn't configured.
 */

import { supabase } from "../lib/supabase";
import { SUPPORT_STRATEGIES } from "./engine";
export { supabase };

/**
 * Log a completed session to Supabase.
 * Includes step_details (per-question JSONB array) for fine-grained analysis.
 */
export async function logSessionToSupabase(sessionData) {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.from("sessions").insert({
      session_id:       sessionData.sessionId,
      user_id:          sessionData.userId,
      concept_id:       sessionData.conceptId,
      level:            sessionData.level,
      modality:         sessionData.modality,
      reward_type:      sessionData.rewardType,
      support_strategy: sessionData.supportStrategy,
      completed:        sessionData.completed,
      time_spent:       sessionData.timeSpent,
      score:            sessionData.score,
      streak:           sessionData.streak,
      correct_count:    sessionData.correctCount,
      total_steps:      sessionData.totalSteps,
      first_try_count:  sessionData.firstTryCount,
      total_attempts:   sessionData.totalAttempts,
      total_hints:      sessionData.totalHints,
      scaffold_used:    sessionData.scaffoldUsed,
      reward_score:     sessionData.rewardScore,
      step_details:     sessionData.stepDetails,
      timestamp:        sessionData.timestamp,
    });

    if (error) console.warn("Supabase log failed (non-critical):", error.message);
    return data ?? null;
  } catch (err) {
    console.warn("Supabase connection failed (non-critical):", err.message);
    return null;
  }
}

/**
 * Load the global shared MAB state from Supabase.
 * Returns a MAB object (compatible with engine.js) or null if unavailable.
 * LessonPage caches the result to localStorage so arm selection stays fast.
 */
export async function loadMABFromSupabase() {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("mab_state")
      .select("arm_name, pulls, total_reward");

    if (error || !data || data.length === 0) return null;

    const counts  = {};
    const rewards = {};
    data.forEach(({ arm_name, pulls, total_reward }) => {
      counts[arm_name]  = pulls;
      rewards[arm_name] = parseFloat(total_reward);
    });

    return { arms: SUPPORT_STRATEGIES, counts, rewards, epsilon: 0.3 };
  } catch (err) {
    console.warn("MAB load failed (non-critical):", err.message);
    return null;
  }
}

/**
 * Atomically increment pulls and total_reward for an arm in Supabase.
 * Requires the `increment_mab_arm` PostgreSQL function (see SQL schema).
 * Fire-and-forget — never throws.
 */
export async function incrementMABArm(arm, reward) {
  if (!supabase) return null;

  try {
    const { error } = await supabase.rpc("increment_mab_arm", {
      p_arm:    arm,
      p_reward: reward,
    });
    if (error) console.warn("MAB sync failed (non-critical):", error.message);
  } catch (err) {
    console.warn("MAB sync failed (non-critical):", err.message);
  }
}
