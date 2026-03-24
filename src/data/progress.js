/**
 * PROGRESS TRACKING MODULE
 * ========================
 * Tracks which levels the user has completed for each concept.
 * Levels unlock sequentially — you must complete Level 1 before Level 2 opens.
 *
 * Stored in localStorage as a simple object:
 *   { "variables": 2, "loops": 1, "conditions": 0 }
 *   (means: completed up to level 2 in variables, level 1 in loops, nothing in conditions)
 */

const STORAGE_KEY = "kidcode_progress";

/**
 * Get all progress data.
 * @returns {object} — e.g. { variables: 2, loops: 0, conditions: 1 }
 */
export function getAllProgress() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

/**
 * Get the highest completed level for a concept.
 * @param {string} conceptId — e.g. "variables"
 * @returns {number} — highest completed level (0 means none completed)
 */
export function getProgress(conceptId) {
  const progress = getAllProgress();
  return progress[conceptId] || 0;
}

/**
 * Check if a specific level is unlocked (playable).
 * Level 1 is always unlocked. Level N requires level N-1 to be completed.
 *
 * @param {string} conceptId — e.g. "loops"
 * @param {number} level     — the level to check (1-based)
 * @returns {boolean}
 */
export function isLevelUnlocked(conceptId, level) {
  if (level <= 1) return true; // Level 1 is always available
  const highestCompleted = getProgress(conceptId);
  return level <= highestCompleted + 1;
}

/**
 * Mark a level as completed. Only updates if it's higher than the current progress.
 *
 * @param {string} conceptId — e.g. "conditions"
 * @param {number} level     — the level just completed (1-based)
 */
export function completeLevel(conceptId, level) {
  const progress = getAllProgress();
  const current = progress[conceptId] || 0;

  // Only update if this is a new high
  if (level > current) {
    progress[conceptId] = level;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
}

/**
 * Reset all progress (used for demos/testing).
 */
export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
}
