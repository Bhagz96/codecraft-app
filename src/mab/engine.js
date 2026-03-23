/**
 * MAB ENGINE — Epsilon-Greedy Multi-Armed Bandit
 * ================================================
 *
 * WHAT IS THIS?
 * A Multi-Armed Bandit (MAB) is like a scientist running an experiment.
 * Imagine you have 3 slot machines ("arms") and you want to find out which
 * one pays out the most. You need to EXPLORE (try different machines) and
 * EXPLOIT (keep pulling the best one). The epsilon-greedy strategy does both.
 *
 * HOW IT WORKS:
 * - epsilon = the chance of exploring (trying a random arm)
 * - (1 - epsilon) = the chance of exploiting (picking the current best arm)
 * - Example: epsilon = 0.2 means 20% of the time we try something random,
 *   80% of the time we go with what's working best.
 *
 * IN THIS APP:
 * - "Arms" are teaching modalities: Story, Puzzle, Challenge
 * - We also have reward type arms: Badge, Coins, MysteryBox
 * - We track engagement metrics to decide which arm is "best"
 *
 * This file is intentionally isolated so it can be demonstrated
 * and explained independently for the academic presentation.
 */

// The three teaching modalities (our MAB arms for lesson delivery)
export const MODALITIES = ["story", "puzzle", "challenge"];

// The three reward types (our MAB arms for rewards)
export const REWARD_TYPES = ["badge", "coins", "mysteryBox"];

/**
 * Create a new MAB instance.
 *
 * @param {string[]} arms    – list of arm names (e.g., MODALITIES)
 * @param {number}   epsilon – exploration rate, between 0 and 1 (default 0.2 = 20%)
 * @returns {object}         – the MAB state object
 *
 * The returned object tracks:
 *   counts  – how many times each arm has been pulled
 *   rewards – total reward accumulated for each arm
 *   epsilon – the exploration rate
 */
export function createMAB(arms, epsilon = 0.2) {
  const counts = {};
  const rewards = {};

  // Initialise every arm with 0 pulls and 0 reward
  arms.forEach((arm) => {
    counts[arm] = 0;
    rewards[arm] = 0;
  });

  return { arms, counts, rewards, epsilon };
}

/**
 * Select an arm using the epsilon-greedy strategy.
 *
 * @param {object} mab – the MAB state object from createMAB()
 * @returns {string}   – the name of the chosen arm
 *
 * Logic:
 * 1. Roll a random number between 0 and 1
 * 2. If it's less than epsilon → EXPLORE: pick a random arm
 * 3. Otherwise → EXPLOIT: pick the arm with the highest average reward
 * 4. If there's a tie or no data yet, pick randomly among the tied arms
 */
export function selectArm(mab) {
  const { arms, counts, rewards, epsilon } = mab;

  // EXPLORE: with probability epsilon, pick a random arm
  if (Math.random() < epsilon) {
    const randomIndex = Math.floor(Math.random() * arms.length);
    return arms[randomIndex];
  }

  // EXPLOIT: pick the arm with the best average reward
  let bestArm = arms[0];
  let bestAverage = -Infinity;

  for (const arm of arms) {
    // If an arm has never been tried, give it a chance (average = 0)
    const average = counts[arm] === 0 ? 0 : rewards[arm] / counts[arm];

    if (average > bestAverage) {
      bestAverage = average;
      bestArm = arm;
    }
  }

  return bestArm;
}

/**
 * Update the MAB after observing a reward for a pulled arm.
 *
 * @param {object} mab    – the MAB state object
 * @param {string} arm    – which arm was pulled
 * @param {number} reward – the reward value (e.g., 0 or 1, or a score)
 * @returns {object}      – the updated MAB state (same object, mutated)
 *
 * This is called after a child completes (or abandons) a lesson.
 * A typical reward scheme:
 *   - Completed the lesson: reward = 1
 *   - Started next lesson:  reward = 0.5 bonus
 *   - Abandoned early:      reward = 0
 */
export function updateMAB(mab, arm, reward) {
  mab.counts[arm] += 1;
  mab.rewards[arm] += reward;
  return mab;
}

/**
 * Get statistics for each arm (useful for the admin dashboard).
 *
 * @param {object} mab – the MAB state object
 * @returns {object[]} – array of { arm, count, totalReward, averageReward }
 */
export function getArmStats(mab) {
  return mab.arms.map((arm) => ({
    arm,
    count: mab.counts[arm],
    totalReward: mab.rewards[arm],
    averageReward:
      mab.counts[arm] === 0
        ? 0
        : Math.round((mab.rewards[arm] / mab.counts[arm]) * 100) / 100,
  }));
}
