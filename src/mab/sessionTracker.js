/**
 * SESSION TRACKER — Version 3 (Learning-Focused)
 * ================================================
 * Manages user sessions and logs interactions for the MAB engine.
 * When a user is logged in, sessions are also synced to Supabase.
 *
 * Each session records:
 *   sessionId, userId, conceptId, level, modality, rewardType,
 *   supportStrategy, completed, timeSpent, score, streak,
 *   correctCount, totalSteps, firstTryCount, totalAttempts,
 *   totalHints, scaffoldUsed, rewardScore, stepDetails, timestamp
 */

import { logSessionToSupabase } from "./supabase";

// Set by AuthContext when a user logs in/out
let _currentUserId = null;

export function setCurrentUser(userId) {
  _currentUserId = userId;
}

function generateSessionId() {
  return "sess_" + Math.random().toString(36).substring(2, 10) + Date.now();
}

/**
 * Get the current user ID.
 * Returns the authenticated Supabase user ID when logged in,
 * otherwise falls back to an anonymous ID stored in localStorage.
 */
export function getUserId() {
  if (_currentUserId) return _currentUserId;
  let userId = localStorage.getItem("kidcode_userId");
  if (!userId) {
    userId = "user_" + Math.random().toString(36).substring(2, 10);
    localStorage.setItem("kidcode_userId", userId);
  }
  return userId;
}

export function startSession(conceptId, level, modality, rewardType, supportStrategy) {
  return {
    sessionId: generateSessionId(),
    userId: getUserId(),
    conceptId,
    level,
    modality,
    rewardType,
    supportStrategy: supportStrategy || "try_first_then_hint",
    completed: false,
    timeSpent: 0,
    score: 0,
    streak: 0,
    correctCount: 0,
    totalSteps: 0,
    firstTryCount: 0,
    totalAttempts: 0,
    totalHints: 0,
    scaffoldUsed: false,
    rewardScore: 0,
    stepDetails: [],
    timestamp: new Date().toISOString(),
    startTime: Date.now(),
  };
}

export function endSession(session, completed, score = 0, streak = 0) {
  session.completed = completed;
  session.timeSpent = Math.round((Date.now() - session.startTime) / 1000);
  session.score = score;
  session.streak = streak;
  return session;
}

/**
 * Save a completed session to localStorage and sync to Supabase when logged in.
 */
export function saveSession(session) {
  const sessions = getAllSessions();
  const { startTime, ...sessionData } = session;
  sessions.push(sessionData);
  localStorage.setItem("kidcode_sessions", JSON.stringify(sessions));

  // Fire-and-forget cloud sync when logged in
  if (_currentUserId) {
    logSessionToSupabase(sessionData).catch(() => {});
  }

  return sessionData;
}

export function getAllSessions() {
  try {
    const data = localStorage.getItem("kidcode_sessions");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function clearSessions() {
  localStorage.removeItem("kidcode_sessions");
}
