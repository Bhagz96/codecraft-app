/**
 * SUPABASE CLIENT
 * ===============
 * Connects to your Supabase database for logging session data.
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://app.supabase.com and create a free project
 * 2. Copy your project URL and anon key from Settings → API
 * 3. Create a .env file in the project root (copy from .env.example)
 * 4. Paste your URL and key into the .env file
 *
 * The app works WITHOUT Supabase (uses localStorage as fallback).
 * Supabase is only needed if you want persistent cloud storage.
 */

import { supabase } from "../lib/supabase";
export { supabase };

/**
 * Log a session to Supabase (if connected).
 * Falls back silently if Supabase isn't configured.
 *
 * To create the sessions table in Supabase, run this SQL:
 *
 * CREATE TABLE sessions (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   session_id TEXT NOT NULL,
 *   user_id TEXT NOT NULL,
 *   lesson_id TEXT NOT NULL,
 *   modality TEXT NOT NULL,
 *   reward_type TEXT NOT NULL,
 *   completed BOOLEAN DEFAULT FALSE,
 *   time_spent INTEGER DEFAULT 0,
 *   started_next BOOLEAN DEFAULT FALSE,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 */
export async function logSessionToSupabase(sessionData) {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.from("sessions").insert({
      session_id: sessionData.sessionId,
      user_id: sessionData.userId,
      concept_id: sessionData.conceptId,
      level: sessionData.level,
      modality: sessionData.modality,
      reward_type: sessionData.rewardType,
      support_strategy: sessionData.supportStrategy,
      completed: sessionData.completed,
      time_spent: sessionData.timeSpent,
      score: sessionData.score,
      streak: sessionData.streak,
      correct_count: sessionData.correctCount,
      total_steps: sessionData.totalSteps,
      first_try_count: sessionData.firstTryCount,
      total_attempts: sessionData.totalAttempts,
      total_hints: sessionData.totalHints,
      scaffold_used: sessionData.scaffoldUsed,
      reward_score: sessionData.rewardScore,
      timestamp: sessionData.timestamp,
    });

    if (error) {
      console.warn("Supabase log failed (non-critical):", error.message);
    }

    return data;
  } catch (err) {
    console.warn("Supabase connection failed (non-critical):", err.message);
    return null;
  }
}
