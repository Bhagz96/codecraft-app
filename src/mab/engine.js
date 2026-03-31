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
 * - Example: epsilon = 0.3 means 30% of the time we try something random,
 *   70% of the time we go with what's working best.
 *
 * IN THIS APP (Version 3 — Instructional Support):
 * - PRIMARY MAB: "Support Strategies" — how we scaffold the learner
 *   Arms: worked_example_first, hint_first, try_first_then_hint,
 *          step_by_step_scaffold, explain_after_error
 * - SECONDARY MABs (kept for backward compatibility):
 *   - Teaching modalities: Code Simulation, Drag & Drop, Speed Coding
 *   - Reward types: Badge, XP Credits, Mystery Box
 *
 * The reward signal is learning-focused (first-try correctness, hint usage)
 * rather than purely engagement-based.
 *
 * This file is intentionally isolated so it can be demonstrated
 * and explained independently for the academic presentation.
 */

// The three teaching modalities (secondary MAB arms)
export const MODALITIES = ["codeSimulation", "dragDrop", "speedCoding"];

// The three reward types (secondary MAB arms)
export const REWARD_TYPES = ["badge", "coins", "mysteryBox"];

// ── PRIMARY MAB: Instructional Support Strategies ──────────────────────
// These control HOW the learner is supported during each question.
export const SUPPORT_STRATEGIES = [
  "worked_example_first",    // Show a worked example before the question
  "hint_first",              // Give a hint upfront before they attempt
  "try_first_then_hint",     // Let them try first, offer hint after wrong answer
  "step_by_step_scaffold",   // Break the problem into smaller guided steps
  "explain_after_error",     // After wrong answer, explain then let them retry
];

// Human-readable labels for support strategies
export const SUPPORT_LABELS = {
  worked_example_first:   "📖 Worked Example First",
  hint_first:             "💡 Hint First",
  try_first_then_hint:    "🎯 Try First → Hint",
  step_by_step_scaffold:  "🪜 Step-by-Step Scaffold",
  explain_after_error:    "🔄 Explain After Error",
};

// Short descriptions for each strategy (for admin dashboard)
export const SUPPORT_DESCRIPTIONS = {
  worked_example_first:   "Shows a solved example before the question so the learner can study the pattern first.",
  hint_first:             "Provides a contextual hint upfront to guide the learner's first attempt.",
  try_first_then_hint:    "Lets the learner attempt unaided first; offers a hint only after a wrong answer.",
  step_by_step_scaffold:  "Breaks the problem into smaller steps with guidance at each stage.",
  explain_after_error:    "After a wrong answer, explains the concept before allowing a retry.",
};

/**
 * Learning-focused reward scoring rubric.
 *
 * @param {object} metrics - Per-question performance metrics
 * @param {boolean} metrics.correct    - Did the learner get it right?
 * @param {boolean} metrics.firstTry   - Was it correct on the first attempt?
 * @param {number}  metrics.attempts   - Total attempts made
 * @param {number}  metrics.hintCount  - Number of hints used
 * @returns {number} reward score between 0.0 and 1.0
 */
export function calculateRewardScore({ correct, firstTry, attempts, hintCount }) {
  if (!correct) return 0.0;
  if (firstTry && hintCount === 0) return 1.0;
  if (hintCount === 1) return 0.7;
  if (hintCount >= 2 || attempts >= 3) return 0.4;
  if (attempts >= 2) return 0.2;
  return 0.7; // correct with some support
}

/**
 * Create a new MAB instance.
 *
 * @param {string[]} arms    – list of arm names
 * @param {number}   epsilon – exploration rate, between 0 and 1 (default 0.2 = 20%)
 * @returns {object}         – the MAB state object
 */
export function createMAB(arms, epsilon = 0.2) {
  const counts = {};
  const rewards = {};

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
 * @param {number} reward – the reward value (0 to 1)
 * @returns {object}      – the updated MAB state (same object, mutated)
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
