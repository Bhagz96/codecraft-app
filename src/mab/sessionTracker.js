/**
 * SESSION TRACKER
 * ===============
 * Manages user sessions and logs interactions for the MAB engine.
 *
 * For the MVP, we use localStorage (no login required).
 * When Supabase is connected, sessions will also be logged to the database.
 *
 * Each session records:
 *   - sessionId:    unique ID for this visit
 *   - lessonId:     which lesson was played
 *   - modality:     which teaching mode was shown (story/puzzle/challenge)
 *   - rewardType:   which reward was given (badge/coins/mysteryBox)
 *   - completed:    did the child finish the lesson?
 *   - timeSpent:    how long they spent (in seconds)
 *   - startedNext:  did they go on to start another lesson?
 *   - timestamp:    when this session happened
 */

/**
 * Generate a simple unique ID for sessions.
 * (No external library needed — just uses random characters.)
 */
function generateSessionId() {
  return "sess_" + Math.random().toString(36).substring(2, 10) + Date.now();
}

/**
 * Get or create a user ID stored in localStorage.
 * This lets us track the same visitor across page reloads.
 */
export function getUserId() {
  let userId = localStorage.getItem("kidcode_userId");
  if (!userId) {
    userId = "user_" + Math.random().toString(36).substring(2, 10);
    localStorage.setItem("kidcode_userId", userId);
  }
  return userId;
}

/**
 * Start a new session. Call this when a child begins a lesson.
 *
 * @param {string} lessonId  – which lesson they're starting
 * @param {string} modality  – which teaching mode was assigned
 * @param {string} rewardType – which reward type was assigned
 * @returns {object}         – the session object (keep a reference to update it later)
 */
export function startSession(lessonId, modality, rewardType) {
  return {
    sessionId: generateSessionId(),
    userId: getUserId(),
    lessonId,
    modality,
    rewardType,
    completed: false,
    timeSpent: 0,
    startedNext: false,
    timestamp: new Date().toISOString(),
    startTime: Date.now(),
  };
}

/**
 * End a session. Call this when the child finishes or leaves a lesson.
 *
 * @param {object}  session   – the session object from startSession()
 * @param {boolean} completed – did they finish the lesson?
 * @returns {object}          – the finalised session
 */
export function endSession(session, completed) {
  session.completed = completed;
  session.timeSpent = Math.round((Date.now() - session.startTime) / 1000);
  return session;
}

/**
 * Save a completed session to localStorage.
 * All sessions are stored in a JSON array under "kidcode_sessions".
 */
export function saveSession(session) {
  const sessions = getAllSessions();
  // Remove internal startTime before saving (not needed in storage)
  const { startTime, ...sessionData } = session;
  sessions.push(sessionData);
  localStorage.setItem("kidcode_sessions", JSON.stringify(sessions));
  return sessionData;
}

/**
 * Get all saved sessions from localStorage.
 * @returns {object[]} – array of session objects
 */
export function getAllSessions() {
  try {
    const data = localStorage.getItem("kidcode_sessions");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Clear all session data (useful for demos/testing).
 */
export function clearSessions() {
  localStorage.removeItem("kidcode_sessions");
}
