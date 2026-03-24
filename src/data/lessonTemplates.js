/**
 * DYNAMIC LESSON TEMPLATE ENGINE
 * ===============================
 * Replaces placeholders in lesson step data with real hero data.
 *
 * Placeholders:
 *   {heroName}    → the hero's display name (e.g., "Jo")
 *   {heroHealth}  → hero's current HP (e.g., "100")
 *   {heroAttack}  → hero's attack stat
 *   {heroGold}    → hero's gold amount
 *   {heroLevel}   → hero's level number
 *   {heroColor}   → hero's color hex code
 *
 * Usage:
 *   const dynamicStep = injectHeroData(step, hero);
 *   // All strings in the step now contain the hero's real values
 */

/**
 * Replace all {placeholder} tokens in a string with hero values.
 */
function replaceTokens(text, heroMap) {
  if (typeof text !== "string") return text;
  let result = text;
  for (const [token, value] of Object.entries(heroMap)) {
    result = result.replaceAll(`{${token}}`, value);
  }
  return result;
}

/**
 * Deep-replace tokens in an object (handles strings, arrays, objects).
 */
function deepReplace(obj, heroMap) {
  if (typeof obj === "string") return replaceTokens(obj, heroMap);
  if (Array.isArray(obj)) return obj.map((item) => deepReplace(item, heroMap));
  if (obj !== null && typeof obj === "object") {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = deepReplace(value, heroMap);
    }
    return result;
  }
  return obj;
}

/**
 * Take a lesson step and inject the hero's real data into all strings.
 *
 * @param {object} step – raw step from lessons.js
 * @param {object} hero – hero data from hero.js
 * @returns {object}    – new step object with placeholders replaced
 */
export function injectHeroData(step, hero) {
  if (!hero || !hero.name) return step;

  const heroMap = {
    heroName: hero.name,
    heroHealth: String(hero.health || 100),
    heroMaxHealth: String(hero.maxHealth || 100),
    heroAttack: String(hero.attack || 10),
    heroDefense: String(hero.defense || 5),
    heroGold: String(hero.gold || 0),
    heroLevel: String(hero.level || 1),
    heroXP: String(hero.xp || 0),
    heroColor: hero.color || "#00d4ff",
  };

  return deepReplace(step, heroMap);
}

/**
 * Inject hero data into an entire level's steps.
 */
export function injectHeroIntoLevel(levelData, hero) {
  if (!levelData || !levelData.steps) return levelData;
  return {
    ...levelData,
    steps: levelData.steps.map((step) => injectHeroData(step, hero)),
  };
}
