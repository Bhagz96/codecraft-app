import { describe, it, expect, vi } from 'vitest';
import {
  createMAB,
  selectArm,
  updateMAB,
  getArmStats,
  calculateRewardScore,
  MODALITIES,
  REWARD_TYPES,
  SUPPORT_STRATEGIES,
} from '../../mab/engine';

describe('createMAB', () => {
  it('initialises counts and rewards to 0 for every arm', () => {
    const mab = createMAB(MODALITIES);
    for (const arm of MODALITIES) {
      expect(mab.counts[arm]).toBe(0);
      expect(mab.rewards[arm]).toBe(0);
    }
  });

  it('stores the arm list and epsilon', () => {
    const mab = createMAB(MODALITIES, 0.3);
    expect(mab.arms).toEqual(MODALITIES);
    expect(mab.epsilon).toBe(0.3);
  });

  it('defaults epsilon to 0.2', () => {
    const mab = createMAB(MODALITIES);
    expect(mab.epsilon).toBe(0.2);
  });

  it('works with reward type arms', () => {
    const mab = createMAB(REWARD_TYPES);
    expect(mab.arms).toEqual(REWARD_TYPES);
    for (const arm of REWARD_TYPES) {
      expect(mab.counts[arm]).toBe(0);
    }
  });

  it('works with a custom arm list', () => {
    const arms = ['a', 'b', 'c'];
    const mab = createMAB(arms);
    expect(mab.arms).toEqual(arms);
    expect(mab.counts['a']).toBe(0);
  });
});

describe('selectArm', () => {
  it('returns one of the known arms', () => {
    const mab = createMAB(MODALITIES);
    const chosen = selectArm(mab);
    expect(MODALITIES).toContain(chosen);
  });

  it('EXPLOIT — picks the arm with the highest average reward', () => {
    // Force exploitation by setting epsilon to 0
    const mab = createMAB(MODALITIES, 0);
    // Give dragDrop the best average
    mab.counts['codeSimulation'] = 2;
    mab.rewards['codeSimulation'] = 1;   // avg 0.5
    mab.counts['dragDrop'] = 2;
    mab.rewards['dragDrop'] = 2;         // avg 1.0  ← best
    mab.counts['speedCoding'] = 2;
    mab.rewards['speedCoding'] = 0;      // avg 0.0
    expect(selectArm(mab)).toBe('dragDrop');
  });

  it('EXPLORE — picks a random arm when Math.random() < epsilon', () => {
    // Force exploration
    vi.spyOn(Math, 'random').mockReturnValue(0.05); // below any epsilon > 0.05
    const mab = createMAB(MODALITIES, 0.3);
    const chosen = selectArm(mab);
    expect(MODALITIES).toContain(chosen);
    vi.restoreAllMocks();
  });

  it('WARM-UP — picks an untried arm when any arm has 0 pulls', () => {
    // Two arms tried, one untried → must pick the untried one
    const mab = createMAB(['x', 'y', 'z'], 0);
    mab.counts['x'] = 3;
    mab.rewards['x'] = 3;  // avg 1.0 — would win if exploit ran
    mab.counts['y'] = 1;
    mab.rewards['y'] = 0.5;
    // 'z' is untried — warm-up must return it regardless of epsilon
    expect(selectArm(mab)).toBe('z');
  });

  it('WARM-UP — all 5 support strategies are tried before any is repeated', () => {
    const mab = createMAB(SUPPORT_STRATEGIES, 0);
    const chosen = new Set();
    // First 5 calls must each return a different strategy
    for (let i = 0; i < SUPPORT_STRATEGIES.length; i++) {
      const arm = selectArm(mab);
      expect(SUPPORT_STRATEGIES).toContain(arm);
      expect(chosen.has(arm)).toBe(false); // no repeats yet
      chosen.add(arm);
      updateMAB(mab, arm, 0.8); // mark it as tried
    }
    expect(chosen.size).toBe(SUPPORT_STRATEGIES.length);
  });

  it('WARM-UP — switches to exploit once all arms have been tried', () => {
    const mab = createMAB(['a', 'b', 'c'], 0); // epsilon=0 forces pure exploit after warm-up
    // Pre-fill all arms so warm-up is complete
    mab.counts['a'] = 1; mab.rewards['a'] = 0.3;
    mab.counts['b'] = 1; mab.rewards['b'] = 0.9; // best
    mab.counts['c'] = 1; mab.rewards['c'] = 0.1;
    // All tried → epsilon-greedy should exploit 'b'
    expect(selectArm(mab)).toBe('b');
  });

  it('consistently exploits the best arm across many calls', () => {
    const mab = createMAB(MODALITIES, 0);
    mab.counts['speedCoding'] = 10;
    mab.rewards['speedCoding'] = 9;  // avg 0.9 — clear winner
    mab.counts['codeSimulation'] = 10;
    mab.rewards['codeSimulation'] = 3;
    mab.counts['dragDrop'] = 10;
    mab.rewards['dragDrop'] = 2;
    for (let i = 0; i < 20; i++) {
      expect(selectArm(mab)).toBe('speedCoding');
    }
  });
});

describe('updateMAB', () => {
  it('increments count and adds reward for the given arm', () => {
    const mab = createMAB(MODALITIES);
    updateMAB(mab, 'codeSimulation', 0.8);
    expect(mab.counts['codeSimulation']).toBe(1);
    expect(mab.rewards['codeSimulation']).toBe(0.8);
  });

  it('accumulates multiple updates on the same arm', () => {
    const mab = createMAB(MODALITIES);
    updateMAB(mab, 'dragDrop', 0.5);
    updateMAB(mab, 'dragDrop', 1.0);
    expect(mab.counts['dragDrop']).toBe(2);
    expect(mab.rewards['dragDrop']).toBeCloseTo(1.5);
  });

  it('does not affect other arms', () => {
    const mab = createMAB(MODALITIES);
    updateMAB(mab, 'speedCoding', 1);
    expect(mab.counts['codeSimulation']).toBe(0);
    expect(mab.counts['dragDrop']).toBe(0);
  });

  it('returns the mutated mab object', () => {
    const mab = createMAB(MODALITIES);
    const result = updateMAB(mab, 'dragDrop', 1);
    expect(result).toBe(mab);
  });

  it('accepts 0 as a reward (abandoned lesson)', () => {
    const mab = createMAB(MODALITIES);
    updateMAB(mab, 'codeSimulation', 0);
    expect(mab.counts['codeSimulation']).toBe(1);
    expect(mab.rewards['codeSimulation']).toBe(0);
  });
});

describe('getArmStats', () => {
  it('returns one entry per arm', () => {
    const mab = createMAB(MODALITIES);
    const stats = getArmStats(mab);
    expect(stats).toHaveLength(MODALITIES.length);
  });

  it('each entry has arm, count, totalReward, averageReward fields', () => {
    const mab = createMAB(MODALITIES);
    const stats = getArmStats(mab);
    for (const s of stats) {
      expect(s).toHaveProperty('arm');
      expect(s).toHaveProperty('count');
      expect(s).toHaveProperty('totalReward');
      expect(s).toHaveProperty('averageReward');
    }
  });

  it('averageReward is 0 for untried arms', () => {
    const mab = createMAB(MODALITIES);
    const stats = getArmStats(mab);
    for (const s of stats) {
      expect(s.averageReward).toBe(0);
    }
  });

  it('calculates averageReward correctly after updates', () => {
    const mab = createMAB(MODALITIES);
    updateMAB(mab, 'codeSimulation', 0.6);
    updateMAB(mab, 'codeSimulation', 0.8);
    const stats = getArmStats(mab);
    const csStat = stats.find((s) => s.arm === 'codeSimulation');
    expect(csStat.count).toBe(2);
    expect(csStat.totalReward).toBeCloseTo(1.4);
    expect(csStat.averageReward).toBe(0.7); // rounded to 2dp
  });

  it('rounds averageReward to 2 decimal places', () => {
    const mab = createMAB(['a']);
    updateMAB(mab, 'a', 1);
    updateMAB(mab, 'a', 0);
    updateMAB(mab, 'a', 0);
    const stats = getArmStats(mab);
    // 1/3 = 0.333... → should round to 0.33
    expect(stats[0].averageReward).toBe(0.33);
  });
});

describe('calculateRewardScore', () => {
  it('returns 1.0 for first-try correct with no hints', () => {
    expect(calculateRewardScore({ correct: true, firstTry: true, attempts: 1, hintCount: 0 })).toBe(1.0);
  });

  it('returns 0.0 for an incorrect answer', () => {
    expect(calculateRewardScore({ correct: false, firstTry: false, attempts: 1, hintCount: 0 })).toBe(0.0);
  });

  it('returns 0.7 for correct after one hint', () => {
    expect(calculateRewardScore({ correct: true, firstTry: false, attempts: 2, hintCount: 1 })).toBe(0.7);
  });

  it('returns 0.4 for correct after two or more hints', () => {
    expect(calculateRewardScore({ correct: true, firstTry: false, attempts: 2, hintCount: 2 })).toBe(0.4);
    expect(calculateRewardScore({ correct: true, firstTry: false, attempts: 2, hintCount: 3 })).toBe(0.4);
  });

  it('returns 0.4 for correct after 3 or more attempts', () => {
    expect(calculateRewardScore({ correct: true, firstTry: false, attempts: 3, hintCount: 0 })).toBe(0.4);
  });

  it('returns 0.2 for correct after 2 attempts with no hints', () => {
    expect(calculateRewardScore({ correct: true, firstTry: false, attempts: 2, hintCount: 0 })).toBe(0.2);
  });

  it('returns 0.7 for correct with some support (fallback case)', () => {
    // correct=true, firstTry=false, attempts=1, hintCount=0 — hits the fallback
    expect(calculateRewardScore({ correct: true, firstTry: false, attempts: 1, hintCount: 0 })).toBe(0.7);
  });

  it('reward is always between 0.0 and 1.0', () => {
    const cases = [
      { correct: true,  firstTry: true,  attempts: 1, hintCount: 0 },
      { correct: true,  firstTry: false, attempts: 2, hintCount: 1 },
      { correct: true,  firstTry: false, attempts: 3, hintCount: 2 },
      { correct: false, firstTry: false, attempts: 5, hintCount: 4 },
    ];
    for (const c of cases) {
      const r = calculateRewardScore(c);
      expect(r).toBeGreaterThanOrEqual(0.0);
      expect(r).toBeLessThanOrEqual(1.0);
    }
  });
});

describe('SUPPORT_STRATEGIES constant', () => {
  it('contains exactly 5 entries', () => {
    expect(SUPPORT_STRATEGIES).toHaveLength(5);
  });

  it('contains all expected strategy names', () => {
    expect(SUPPORT_STRATEGIES).toContain('worked_example_first');
    expect(SUPPORT_STRATEGIES).toContain('hint_first');
    expect(SUPPORT_STRATEGIES).toContain('try_first_then_hint');
    expect(SUPPORT_STRATEGIES).toContain('step_by_step_scaffold');
    expect(SUPPORT_STRATEGIES).toContain('explain_after_error');
  });

  it('can be used as arms in createMAB', () => {
    const mab = createMAB(SUPPORT_STRATEGIES, 0.3);
    expect(mab.arms).toEqual(SUPPORT_STRATEGIES);
    for (const arm of SUPPORT_STRATEGIES) {
      expect(mab.counts[arm]).toBe(0);
      expect(mab.rewards[arm]).toBe(0);
    }
  });

  it('selectArm returns a valid strategy', () => {
    const mab = createMAB(SUPPORT_STRATEGIES, 0.3);
    const chosen = selectArm(mab);
    expect(SUPPORT_STRATEGIES).toContain(chosen);
  });

  it('updateMAB works with strategy arms', () => {
    const mab = createMAB(SUPPORT_STRATEGIES);
    updateMAB(mab, 'try_first_then_hint', 1.0);
    expect(mab.counts['try_first_then_hint']).toBe(1);
    expect(mab.rewards['try_first_then_hint']).toBe(1.0);
  });
});

describe('MODALITIES and REWARD_TYPES constants', () => {
  it('MODALITIES contains exactly 3 entries', () => {
    expect(MODALITIES).toHaveLength(3);
  });

  it('MODALITIES contains expected values', () => {
    expect(MODALITIES).toContain('codeSimulation');
    expect(MODALITIES).toContain('dragDrop');
    expect(MODALITIES).toContain('speedCoding');
  });

  it('REWARD_TYPES contains exactly 3 entries', () => {
    expect(REWARD_TYPES).toHaveLength(3);
  });

  it('REWARD_TYPES contains expected values', () => {
    expect(REWARD_TYPES).toContain('badge');
    expect(REWARD_TYPES).toContain('coins');
    expect(REWARD_TYPES).toContain('mysteryBox');
  });
});
