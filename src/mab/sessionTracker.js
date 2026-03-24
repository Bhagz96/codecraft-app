/**
 * SESSION TRACKER — Version 2
 * ============================
 * Manages user sessions and logs interactions for the MAB engine.
 *
 * For the MVP, we use localStorage (no login required).
 * When Supabase is connected, sessions will also be logged to the database.
 *
 * Each session records:
 *   - sessionId:    unique ID for this visit
 *   - userId:       anonymous user identifier
 *   - conceptId:    which concept was played (variables/loops/conditions)
 *   - level:        which difficulty level (1-5)
 *   - modality:     which teaching mode was shown (codeSimulation/dragDrop/speedCoding)
 *   - rewardType:   which reward was given (badge/coins/mysteryBox)
 *   - completed:    did the user finish the lesson?
 *   - timeSpent:    how long they spent (in seconds)
 *   - score:        points earned (for speed coding mode)
 *   - streak:       consecutive correct answers
 *   - timestamp:    when this session happened
 */

/**
 * Generate a simple unique ID for sessions.
 */
function generateSessionId() {
  return "sess_" + Math.random().toString(36).substring(2, 10) + Date.now();
}

/**
 * Get or create a user ID stored in localStorage.
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
 * Start a new session. Call this when a user begins a lesson.
 *
 * @param {string} conceptId  – which concept they're starting (e.g. "variables")
 * @param {number} level      – difficulty level (1-5)
 * @param {string} modality   – which teaching mode was assigned
 * @param {string} rewardType – which reward type was assigned
 * @returns {object}          – the session object
 */
export function startSession(conceptId, level, modality, rewardType) {
  return {
    sessionId: generateSessionId(),
    userId: getUserId(),
    conceptId,
    level,
    modality,
    rewardType,
    completed: false,
    timeSpent: 0,
    score: 0,
    streak: 0,
    timestamp: new Date().toISOString(),
    startTime: Date.now(),
  };
}

/**
 * End a session. Call this when the user finishes or leaves a lesson.
 *
 * @param {object}  session   – the session object from startSession()
 * @param {boolean} completed – did they finish the lesson?
 * @param {number}  score     – points earned (optional, for speed coding)
 * @param {number}  streak    – max streak (optional)
 * @returns {object}          – the finalised session
 */
export function endSession(session, completed, score = 0, streak = 0) {
  session.completed = completed;
  session.timeSpent = Math.round((Date.now() - session.startTime) / 1000);
  session.score = score;
  session.streak = streak;
  return session;
}

/**
 * Save a completed session to localStorage.
 */
export function saveSession(session) {
  const sessions = getAllSessions();
  const { startTime, ...sessionData } = session;
  sessions.push(sessionData);
  localStorage.setItem("kidcode_sessions", JSON.stringify(sessions));
  return sessionData;
}

/**
 * Get all saved sessions from localStorage.
 * @returns {object[]}
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
