/**
 * HERO PERSISTENCE
 * ================
 * Stores and retrieves the player's hero data across sessions.
 * The hero is created in Variables Level 1 and persists throughout
 * all lessons, growing as the player learns more concepts.
 *
 * Stored in localStorage as a JSON object.
 */

const STORAGE_KEY = "kidcode_hero";

const DEFAULT_HERO = {
  name: "",
  health: 100,
  maxHealth: 100,
  attack: 10,
  defense: 5,
  gold: 0,
  xp: 0,
  level: 1,
  color: "#00d4ff",      // Hero accent color (cyan default)
  created: false,
};

/**
 * Get the current hero data. Returns default if none exists.
 */
export function getHero() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return { ...DEFAULT_HERO, ...JSON.parse(data) };
    }
  } catch {
    // ignore parse errors
  }
  return { ...DEFAULT_HERO };
}

/**
 * Save hero data to localStorage.
 */
export function saveHero(hero) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(hero));
}

/**
 * Create a new hero with the given name.
 * Called during Variables Level 1.
 */
export function createHero(name, color = "#00d4ff") {
  const hero = {
    ...DEFAULT_HERO,
    name: name || "Hero",
    color,
    created: true,
  };
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
 * Called after completing a lesson level.
 */
export function awardXP(amount) {
  const hero = getHero();
  hero.xp += amount;
  hero.gold += Math.floor(amount / 2);

  // Level up every 100 XP
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
  const hero = getHero();
  return hero.created === true;
}

/**
 * Reset hero data (for demos/testing).
 */
export function resetHero() {
  localStorage.removeItem(STORAGE_KEY);
}
