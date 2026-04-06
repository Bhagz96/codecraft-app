/**
 * HERO PERSISTENCE
 * ================
 * Stores and retrieves the player's hero data.
 * When a user is logged in, data is namespaced by userId in localStorage
 * and synced to Supabase for cross-device persistence.
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
  created: false,
};

export function getHero() {
  try {
    const data = localStorage.getItem(getStorageKey());
    if (data) return { ...DEFAULT_HERO, ...JSON.parse(data) };
  } catch {
    // ignore parse errors
  }
  return { ...DEFAULT_HERO };
}

export function saveHero(hero) {
  localStorage.setItem(getStorageKey(), JSON.stringify(hero));
  // Sync to cloud if user is logged in (fire and forget)
  if (_currentUserId) {
    supabase.from("heroes").upsert({
      user_id: _currentUserId,
      name: hero.name,
      color: hero.color,
      level: hero.level,
      xp: hero.xp,
      health: hero.health,
      max_health: hero.maxHealth,
      attack: hero.attack,
      defense: hero.defense,
      gold: hero.gold,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" }).catch(() => {});
  }
}

export function createHero(name, color = "#00d4ff") {
  const hero = { ...DEFAULT_HERO, name: name || "Hero", color, created: true };
  saveHero(hero);
  return hero;
}

export function updateHero(updates) {
  const hero = getHero();
  const updated = { ...hero, ...updates };
  saveHero(updated);
  return updated;
}

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

export function hasHero() {
  return getHero().created === true;
}

export function resetHero() {
  localStorage.removeItem(getStorageKey());
}

/**
 * Load hero data from Supabase into localStorage.
 * Called by AuthContext when a user logs in.
 */
export async function loadHeroFromCloud(userId) {
  const { data } = await supabase
    .from("heroes")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (data) {
    const hero = {
      name: data.name,
      color: data.color,
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
  }
}
