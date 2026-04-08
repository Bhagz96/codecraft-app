/**
 * PROGRESS TRACKING MODULE
 * ========================
 * Tracks which levels the user has completed for each concept.
 * When logged in, progress is namespaced by userId and synced to Supabase.
 * Guest sessions fall back to the shared "kidcode_progress" key.
 *
 * Stored as: { "variables": 2, "loops": 1, "conditions": 0 }
 */

import { supabase } from "../lib/supabase";

// Set by AuthContext when a user logs in/out
let _currentUserId = null;

export function setCurrentUser(userId) {
  _currentUserId = userId;
}

function getStorageKey() {
  return _currentUserId ? `kidcode_progress_${_currentUserId}` : "kidcode_progress";
}

/**
 * Get all progress data.
 * @returns {object} — e.g. { variables: 2, loops: 0, conditions: 1 }
 */
export function getAllProgress() {
  try {
    const data = localStorage.getItem(getStorageKey());
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

/**
 * Get the highest completed level for a concept.
 */
export function getProgress(conceptId) {
  return getAllProgress()[conceptId] || 0;
}

/**
 * Check if a specific level is unlocked (playable).
 * Level 1 is always unlocked. Level N requires level N-1 to be completed.
 */
export function isLevelUnlocked(conceptId, level) {
  if (level <= 1) return true;
  return level <= getProgress(conceptId) + 1;
}

/**
 * Mark a level as completed. Only updates if it's higher than current progress.
 */
export function completeLevel(conceptId, level) {
  const progress = getAllProgress();
  const current = progress[conceptId] || 0;

  if (level > current) {
    progress[conceptId] = level;
    localStorage.setItem(getStorageKey(), JSON.stringify(progress));

    // Fire-and-forget cloud sync when logged in
    if (_currentUserId && supabase) {
      supabase.from("user_progress").upsert({
        user_id: _currentUserId,
        concept_id: conceptId,
        highest_level: level,
      }, { onConflict: "user_id,concept_id" }).then(() => {}, () => {});
    }
  }
}

/**
 * Reset all progress (used for demos/testing).
 */
export function resetProgress() {
  localStorage.removeItem(getStorageKey());
  if (_currentUserId) localStorage.removeItem(`kidcode_reviews_${_currentUserId}`);
  else localStorage.removeItem("kidcode_reviews");
}

// ── Chapter Review Tracking (Beta) ────────────────────────────────────────
// Tracks which concepts the user has completed the end-of-concept review for.

function getReviewStorageKey() {
  return _currentUserId ? `kidcode_reviews_${_currentUserId}` : "kidcode_reviews";
}

function getAllReviews() {
  try {
    const data = localStorage.getItem(getReviewStorageKey());
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

/**
 * Returns true if the user has completed the chapter review for this concept.
 */
export function isReviewCompleted(conceptId) {
  return getAllReviews()[conceptId] === true;
}

/**
 * Mark a concept's chapter review as completed.
 * Syncs to Supabase user_progress using highest_level = 99 as a sentinel.
 */
export function completeReview(conceptId) {
  const reviews = getAllReviews();
  reviews[conceptId] = true;
  localStorage.setItem(getReviewStorageKey(), JSON.stringify(reviews));

  if (_currentUserId && supabase) {
    supabase.from("user_progress").upsert({
      user_id: _currentUserId,
      concept_id: `${conceptId}_review`,
      highest_level: 1,
    }, { onConflict: "user_id,concept_id" }).then(() => {}, () => {});
  }
}

/**
 * Load review completion state from Supabase into localStorage.
 * Called alongside loadProgressFromCloud on login.
 */
export async function loadReviewsFromCloud(userId) {
  if (!supabase) return;
  const { data } = await supabase
    .from("user_progress")
    .select("concept_id, highest_level")
    .eq("user_id", userId)
    .like("concept_id", "%_review");

  if (data && data.length > 0) {
    const reviews = {};
    data.forEach((row) => {
      const conceptId = row.concept_id.replace("_review", "");
      reviews[conceptId] = true;
    });
    localStorage.setItem(`kidcode_reviews_${userId}`, JSON.stringify(reviews));
  }
}

/**
 * Load progress from Supabase into localStorage.
 * Called by AuthContext when a user logs in.
 */
export async function loadProgressFromCloud(userId) {
  if (!supabase) return;
  const { data } = await supabase
    .from("user_progress")
    .select("concept_id, highest_level")
    .eq("user_id", userId);

  if (data && data.length > 0) {
    const progress = {};
    data.forEach((row) => {
      if (!progress[row.concept_id] || row.highest_level > progress[row.concept_id]) {
        progress[row.concept_id] = row.highest_level;
      }
    });
    localStorage.setItem(`kidcode_progress_${userId}`, JSON.stringify(progress));
  }
}
