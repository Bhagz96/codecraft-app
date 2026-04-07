/**
 * HERO PERSISTENCE
 * ================
 * Stores and retrieves the player's hero data.
 * When a user is logged in, data is namespaced by userId in localStorage
 * and synced to Supabase for cross-device persistence.
 * Guest sessions fall back to the shared "kidcode_hero" key.
 */

import { supabase } from "../lib/supabase";

// Set by AuthContext when a user logs in/out
let _currentUserId = null;

export function setCurrentUser(userId) {
  _currentUserId = userId;
}

function getStorageKey() {
  return _currentUserId ? `kidcode_hero_${_currentUserId}` : "kidcode_hero";
}

const DEFAULT_HERO = {
  name: "",
  health: 100,
  maxHealth: 100,
  attack: 10,
  defense: 5,
  gold: 0,
  xp: 0,
  level: 1,
  color: "#00d4ff",
  avatarId: "m01",
  created: false,
};

/**
 * Get the current hero data. Returns default if none exists.
 */
export function getHero() {
  try {
    const data = localStorage.getItem(getStorageKey());
    if (data) return { ...DEFAULT_HERO, ...JSON.parse(data) };
  } catch {
    // ignore parse errors
  }
  return { ...DEFAULT_HERO };
}

/**
 * Save hero data to localStorage and sync to Supabase if logged in.
 */
export function saveHero(hero) {
  localStorage.setItem(getStorageKey(), JSON.stringify(hero));
  // Fire-and-forget cloud sync when logged in
  if (_currentUserId && supabase) {
    supabase.from("heroes").upsert({
      user_id:    _currentUserId,
      name:       hero.name,
      color:      hero.color,
      avatar_id:  hero.avatarId,
      level:      hero.level,
      xp:         hero.xp,
      health:     hero.health,
      max_health: hero.maxHealth,
      attack:     hero.attack,
      defense:    hero.defense,
      gold:       hero.gold,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" }).then(() => {}, () => {});
  }
}

/**
 * Create a new hero with the given name, color, and avatar.
 */
export function createHero(name, color = "#00d4ff", avatarId = "m01") {
  const hero = { ...DEFAULT_HERO, name: name || "Hero", color, avatarId, created: true };
  saveHero(hero);
  return hero;
}

/**
 * Update specific hero stats (e.g., after completing a level).
 */
export function updateHero(updates) {
  const hero = getHero();
  const updated = { ...hero, ...updates };
  saveHero(updated);
  return updated;
}

/**
 * Award XP and possibly level up the hero.
 */
export function awardXP(amount) {
  const hero = getHero();
  hero.xp += amount;
  hero.gold += Math.floor(amount / 2);

  const newLevel = Math.floor(hero.xp / 100) + 1;
  if (newLevel > hero.level) {
    hero.level = newLevel;
    hero.maxHealth += 10;
    hero.health = hero.maxHealth;
    hero.attack += 3;
    hero.defense += 2;
  }

  saveHero(hero);
  return hero;
}

/**
 * Check if a hero has been created.
 */
export function hasHero() {
  return getHero().created === true;
}

/**
 * Reset hero data (for demos/testing).
 */
export function resetHero() {
  localStorage.removeItem(getStorageKey());
}

/**
 * Explicitly persist the current hero to Supabase (awaitable).
 * Saves to both the heroes table AND user_metadata in Supabase Auth.
 * user_metadata is the most reliable backup — it lives alongside auth
 * credentials so it's always available if login works.
 */
export async function persistHeroToCloud() {
  if (!_currentUserId || !supabase) return;
  const hero = getHero();
  if (!hero.created) return;

  const heroRow = {
    user_id:    _currentUserId,
    name:       hero.name,
    color:      hero.color,
    avatar_id:  hero.avatarId,
    level:      hero.level,
    xp:         hero.xp,
    health:     hero.health,
    max_health: hero.maxHealth,
    attack:     hero.attack,
    defense:    hero.defense,
    gold:       hero.gold,
    updated_at: new Date().toISOString(),
  };

  // Save to heroes table (best-effort)
  try {
    await supabase.from("heroes").upsert(heroRow, { onConflict: "user_id" });
  } catch {
    // Non-critical — hero is safe in localStorage and user_metadata
  }

  // Save to user_metadata as the most reliable cross-device backup.
  // This piggybacks on Supabase Auth which is always functional if the user
  // can log in. Supabase merges new keys into existing metadata.
  try {
    await supabase.auth.updateUser({
      data: {
        hero_name:       hero.name,
        hero_color:      hero.color,
        hero_avatar_id:  hero.avatarId,
        hero_level:      hero.level,
        hero_xp:         hero.xp,
        hero_health:     hero.health,
        hero_max_health: hero.maxHealth,
        hero_attack:     hero.attack,
        hero_defense:    hero.defense,
        hero_gold:       hero.gold,
      },
    });
  } catch {
    // Non-critical
  }
}

/**
 * Load hero data from Supabase into localStorage.
 * Called by AuthContext when a user logs in, with the user's auth metadata
 * passed as a reliable fallback if the heroes table is unavailable.
 *
 * Restore priority:
 *   1. heroes table  (full stats, most up-to-date)
 *   2. user_metadata (name/avatar persisted during creation — always works)
 *   3. localStorage  (same device only — also repairs the cloud if found)
 */
export async function loadHeroFromCloud(userId, userMetadata = {}) {
  if (!supabase) return;
  const { data } = await supabase
    .from("heroes")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (data) {
    // Priority 1: heroes table has a record — use it
    const hero = {
      name: data.name,
      color: data.color,
      avatarId: data.avatar_id || "m01",
      level: data.level,
      xp: data.xp,
      health: data.health,
      maxHealth: data.max_health,
      attack: data.attack,
      defense: data.defense,
      gold: data.gold,
      created: true,
    };
    localStorage.setItem(`kidcode_hero_${userId}`, JSON.stringify(hero));
    return;
  }

  // Priority 2: user_metadata fallback — set during hero creation via
  // persistHeroToCloud() and lives in Supabase Auth (always reliable)
  if (userMetadata?.hero_name) {
    const hero = {
      name:      userMetadata.hero_name,
      color:     userMetadata.hero_color     || "#00d4ff",
      avatarId:  userMetadata.hero_avatar_id || "m01",
      level:     userMetadata.hero_level     ?? 1,
      xp:        userMetadata.hero_xp        ?? 0,
      health:    userMetadata.hero_health    ?? 100,
      maxHealth: userMetadata.hero_max_health ?? 100,
      attack:    userMetadata.hero_attack    ?? 10,
      defense:   userMetadata.hero_defense   ?? 5,
      gold:      userMetadata.hero_gold      ?? 0,
      created: true,
    };
    localStorage.setItem(`kidcode_hero_${userId}`, JSON.stringify(hero));
    return;
  }

  // Priority 3: localStorage has hero but cloud doesn't — repair the sync
  try {
    const raw = localStorage.getItem(`kidcode_hero_${userId}`);
    if (raw) {
      const localHero = JSON.parse(raw);
      if (localHero?.created) {
        supabase.from("heroes").upsert({
          user_id:    userId,
          name:       localHero.name,
          color:      localHero.color,
          avatar_id:  localHero.avatarId || "m01",
          level:      localHero.level     ?? 1,
          xp:         localHero.xp        ?? 0,
          health:     localHero.health    ?? 100,
          max_health: localHero.maxHealth ?? 100,
          attack:     localHero.attack    ?? 10,
          defense:    localHero.defense   ?? 5,
          gold:       localHero.gold      ?? 0,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" }).then(() => {}, () => {});
      }
    }
  } catch {
    // ignore
  }
}
