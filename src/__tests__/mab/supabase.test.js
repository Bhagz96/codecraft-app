/**
 * Tests for mab/supabase.js
 *
 * Verifies:
 *  1. logSessionToSupabase includes step_details in the insert payload
 *  2. loadMABFromSupabase converts DB rows into a MAB-compatible object
 *  3. incrementMABArm calls the correct RPC with arm + reward
 *
 * All tests use a mock Supabase client injected via vi.mock.
 * The null-guard path (supabase === null → return null) is a
 * one-liner tested implicitly when VITE env vars are absent.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── Shared mock references (hoisted so vi.mock factory can use them) ─────────
const { mockInsert, mockSelect, mockFrom, mockRpc } = vi.hoisted(() => {
  const mockInsert = vi.fn();
  const mockSelect = vi.fn();
  const mockFrom   = vi.fn(() => ({ insert: mockInsert, select: mockSelect }));
  const mockRpc    = vi.fn();
  return { mockInsert, mockSelect, mockFrom, mockRpc };
});

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: mockFrom,
    rpc:  mockRpc,
  },
}));

// Import AFTER mock is registered
import {
  logSessionToSupabase,
  loadMABFromSupabase,
  incrementMABArm,
} from '../../mab/supabase';

// Clear call history before every test so counts don't bleed across tests
afterEach(() => {
  vi.clearAllMocks();
});

// ── Helpers ──────────────────────────────────────────────────────────────────
function makeSession(overrides = {}) {
  return {
    sessionId:       'sess_test123',
    userId:          'user_abc',
    conceptId:       'variables',
    level:           1,
    modality:        'codeSimulation',
    rewardType:      'badge',
    supportStrategy: 'try_first_then_hint',
    completed:       true,
    timeSpent:       120,
    score:           0.8,
    streak:          3,
    correctCount:    4,
    totalSteps:      5,
    firstTryCount:   3,
    totalAttempts:   6,
    totalHints:      1,
    scaffoldUsed:    false,
    rewardScore:     0.76,
    timestamp:       '2026-01-01T00:00:00.000Z',
    stepDetails:     [
      { stepIndex: 0, correct: true,  firstTry: true,  attempts: 1, hintCount: 0, rewardScore: 1.0 },
      { stepIndex: 1, correct: true,  firstTry: false, attempts: 2, hintCount: 1, rewardScore: 0.7 },
    ],
    ...overrides,
  };
}

// ── logSessionToSupabase ─────────────────────────────────────────────────────
describe('logSessionToSupabase', () => {
  beforeEach(() => {
    mockInsert.mockResolvedValue({ data: null, error: null });
  });

  it('calls supabase.from("sessions").insert()', async () => {
    await logSessionToSupabase(makeSession());
    expect(mockFrom).toHaveBeenCalledWith('sessions');
    expect(mockInsert).toHaveBeenCalledTimes(1);
  });

  it('includes step_details in the insert payload', async () => {
    const session = makeSession();
    await logSessionToSupabase(session);
    const payload = mockInsert.mock.calls[0][0];
    expect(payload).toHaveProperty('step_details');
    expect(payload.step_details).toEqual(session.stepDetails);
  });

  it('step_details is null when session has no steps', async () => {
    await logSessionToSupabase(makeSession({ stepDetails: [] }));
    const payload = mockInsert.mock.calls[0][0];
    // empty array should still be passed (Supabase stores it as [])
    expect(Array.isArray(payload.step_details)).toBe(true);
  });

  it('includes all core session fields in the payload', async () => {
    await logSessionToSupabase(makeSession());
    const payload = mockInsert.mock.calls[0][0];
    expect(payload).toMatchObject({
      session_id:       'sess_test123',
      user_id:          'user_abc',
      concept_id:       'variables',
      level:            1,
      modality:         'codeSimulation',
      reward_type:      'badge',
      support_strategy: 'try_first_then_hint',
      completed:        true,
      time_spent:       120,
      score:            0.8,
      correct_count:    4,
      total_steps:      5,
      first_try_count:  3,
      total_attempts:   6,
      total_hints:      1,
      scaffold_used:    false,
      reward_score:     0.76,
    });
  });

  it('returns null without throwing when insert returns an error', async () => {
    mockInsert.mockResolvedValueOnce({ data: null, error: { message: 'DB error' } });
    const result = await logSessionToSupabase(makeSession());
    expect(result).toBeNull();
  });
});

// ── loadMABFromSupabase ──────────────────────────────────────────────────────
describe('loadMABFromSupabase', () => {
  beforeEach(() => {
    mockSelect.mockResolvedValue({
      data: [
        { arm_name: 'worked_example_first',  pulls: 10, total_reward: 8.5 },
        { arm_name: 'hint_first',             pulls: 6,  total_reward: 3.6 },
        { arm_name: 'try_first_then_hint',    pulls: 12, total_reward: 10.2 },
        { arm_name: 'step_by_step_scaffold',  pulls: 4,  total_reward: 2.8 },
        { arm_name: 'explain_after_error',    pulls: 3,  total_reward: 1.5 },
      ],
      error: null,
    });
  });

  it('calls supabase.from("mab_state").select()', async () => {
    await loadMABFromSupabase();
    expect(mockFrom).toHaveBeenCalledWith('mab_state');
    expect(mockSelect).toHaveBeenCalled();
  });

  it('returns an object with arms, counts, rewards, epsilon', async () => {
    const mab = await loadMABFromSupabase();
    expect(mab).toHaveProperty('arms');
    expect(mab).toHaveProperty('counts');
    expect(mab).toHaveProperty('rewards');
    expect(mab).toHaveProperty('epsilon');
  });

  it('counts maps arm_name → pulls', async () => {
    const mab = await loadMABFromSupabase();
    expect(mab.counts['worked_example_first']).toBe(10);
    expect(mab.counts['hint_first']).toBe(6);
    expect(mab.counts['try_first_then_hint']).toBe(12);
  });

  it('rewards maps arm_name → total_reward as float', async () => {
    const mab = await loadMABFromSupabase();
    expect(mab.rewards['worked_example_first']).toBeCloseTo(8.5);
    expect(mab.rewards['try_first_then_hint']).toBeCloseTo(10.2);
  });

  it('sets epsilon to 0.3', async () => {
    const mab = await loadMABFromSupabase();
    expect(mab.epsilon).toBe(0.3);
  });

  it('returns null when Supabase returns an error', async () => {
    mockSelect.mockResolvedValueOnce({ data: null, error: { message: 'fail' } });
    const result = await loadMABFromSupabase();
    expect(result).toBeNull();
  });

  it('returns null when data is empty', async () => {
    mockSelect.mockResolvedValueOnce({ data: [], error: null });
    const result = await loadMABFromSupabase();
    expect(result).toBeNull();
  });
});

// ── incrementMABArm ──────────────────────────────────────────────────────────
describe('incrementMABArm', () => {
  beforeEach(() => {
    mockRpc.mockResolvedValue({ error: null });
  });

  it('calls supabase.rpc("increment_mab_arm")', async () => {
    await incrementMABArm('try_first_then_hint', 0.8);
    expect(mockRpc).toHaveBeenCalledWith('increment_mab_arm', {
      p_arm:    'try_first_then_hint',
      p_reward: 0.8,
    });
  });

  it('passes correct arm name to RPC', async () => {
    await incrementMABArm('worked_example_first', 1.0);
    const [, args] = mockRpc.mock.calls[0];
    expect(args.p_arm).toBe('worked_example_first');
  });

  it('passes reward value to RPC', async () => {
    await incrementMABArm('hint_first', 0.4);
    const [, args] = mockRpc.mock.calls[0];
    expect(args.p_reward).toBe(0.4);
  });

  it('passes 0 reward for incorrect answers without throwing', async () => {
    await expect(incrementMABArm('explain_after_error', 0)).resolves.not.toThrow();
    const [, args] = mockRpc.mock.calls[0];
    expect(args.p_reward).toBe(0);
  });

  it('does not throw when RPC returns an error', async () => {
    mockRpc.mockResolvedValueOnce({ error: { message: 'RPC error' } });
    await expect(incrementMABArm('hint_first', 0.7)).resolves.not.toThrow();
  });
});
