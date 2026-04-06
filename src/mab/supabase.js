/**
 * SUPABASE SESSION LOGGING
 * ========================
 * Re-exports the shared Supabase client and provides the session
 * logging function used by sessionTracker.js.
 *
 * The app works fully without Supabase — all calls degrade silently.
 */

import { supabase } from "../lib/supabase";
export { supabase };

/**
 * Log a completed session to Supabase.
 * Falls back silently if Supabase isn't configured or the insert fails.
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
      timestamp:        sessionData.timestamp,
    });

    if (error) console.warn("Supabase log failed (non-critical):", error.message);
    return data;
  } catch (err) {
    console.warn("Supabase connection failed (non-critical):", err.message);
    return null;
  }
}
