/**
 * SESSION TRACKER — Version 3 (Learning-Focused)
 * ================================================
 * Manages user sessions and logs interactions for the MAB engine.
 *
 * For the MVP, we use localStorage (no login required).
 * When Supabase is connected, sessions will also be logged to the database.
 *
 * Each session records:
 *   - sessionId:         unique ID for this visit
 *   - userId:            anonymous user identifier
 *   - conceptId:         which concept (variables/loops/conditions)
 *   - level:             difficulty level (1-5)
 *   - modality:          teaching mode (codeSimulation/dragDrop/speedCoding)
 *   - rewardType:        reward given (badge/coins/mysteryBox)
 *   - supportStrategy:   instructional support strategy (MAB primary arm)
 *   - completed:         did they finish?
 *   - timeSpent:         seconds spent
 *   - score:             points earned
 *   - streak:            consecutive correct
 *   - correctCount:      total correct answers
 *   - totalSteps:        total questions in lesson
 *   - firstTryCount:     how many correct on first try
 *   - totalAttempts:     total attempts across all steps
 *   - totalHints:        total hints used across all steps
 *   - scaffoldUsed:      whether scaffolding was activated
 *   - rewardScore:       MAB reward (learning-focused, 0-1)
 *   - stepDetails:       per-question metrics array
 *   - timestamp:         when this session happened
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
 * @param {string} conceptId        – which concept
 * @param {number} level            – difficulty level
 * @param {string} modality         – teaching mode
 * @param {string} rewardType       – reward type
 * @param {string} supportStrategy  – instructional support strategy
 * @returns {object}                – the session object
 */
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

/**
 * End a session. Call this when the user finishes or leaves a lesson.
 *
 * @param {object}  session   – the session object from startSession()
 * @param {boolean} completed – did they finish?
 * @param {number}  score     – points earned (optional)
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
