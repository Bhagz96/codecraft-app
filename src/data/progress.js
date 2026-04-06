/**
 * PROGRESS TRACKING MODULE
 * ========================
 * Tracks which levels the user has completed for each concept.
 * When logged in, progress is namespaced by userId and synced to Supabase.
 *
 * Stored as: { "variables": 2, "loops": 1, "conditions": 0 }
 */

import { supabase } from "../lib/supabase";

// Imported and set by hero.js module state — read via same userId
// We rely on the same _currentUserId pattern via a shared getter
let _currentUserId = null;

// Called by AuthContext (same call sets hero.js and progress.js)
export function setCurrentUser(userId) {
  _currentUserId = userId;
}

function getStorageKey() {
  return _currentUserId ? `kidcode_progress_${_currentUserId}` : "kidcode_progress";
}

export function getAllProgress() {
  try {
    const data = localStorage.getItem(getStorageKey());
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function getProgress(conceptId) {
  return getAllProgress()[conceptId] || 0;
}

export function isLevelUnlocked(conceptId, level) {
  if (level <= 1) return true;
  return level <= getProgress(conceptId) + 1;
}

export function completeLevel(conceptId, level) {
  const progress = getAllProgress();
  const current = progress[conceptId] || 0;

  if (level > current) {
    progress[conceptId] = level;
    localStorage.setItem(getStorageKey(), JSON.stringify(progress));

    // Sync to cloud if user is logged in (fire and forget)
    if (_currentUserId) {
      supabase.from("user_progress").upsert({
        user_id: _currentUserId,
        concept_id: conceptId,
        highest_level: level,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,concept_id" }).catch(() => {});
    }
  }
}

export function resetProgress() {
  localStorage.removeItem(getStorageKey());
}

/**
 * Load progress from Supabase into localStorage.
 * Called by AuthContext when a user logs in.
 */
export async function loadProgressFromCloud(userId) {
  const { data } = await supabase
    .from("user_progress")
    .select("concept_id, highest_level")
    .eq("user_id", userId);

  if (data && data.length > 0) {
    const progress = {};
    data.forEach((row) => {
      progress[row.concept_id] = row.highest_level;
    });
    localStorage.setItem(`kidcode_progress_${userId}`, JSON.stringify(progress));
  }
}
