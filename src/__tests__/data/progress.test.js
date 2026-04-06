import { describe, it, expect, afterEach } from 'vitest';
import {
  getAllProgress,
  getProgress,
  isLevelUnlocked,
  completeLevel,
  resetProgress,
  setCurrentUser,
  loadProgressFromCloud,
} from '../../data/progress';

describe('getAllProgress', () => {
  it('returns an empty object when nothing is stored', () => {
    expect(getAllProgress()).toEqual({});
  });

  it('returns stored progress', () => {
    localStorage.setItem('kidcode_progress', JSON.stringify({ variables: 2 }));
    expect(getAllProgress()).toEqual({ variables: 2 });
  });

  it('returns empty object on invalid JSON', () => {
    localStorage.setItem('kidcode_progress', 'bad-json');
    expect(getAllProgress()).toEqual({});
  });
});

describe('getProgress', () => {
  it('returns 0 for a concept with no progress', () => {
    expect(getProgress('variables')).toBe(0);
  });

  it('returns the stored level for a concept', () => {
    localStorage.setItem('kidcode_progress', JSON.stringify({ loops: 3 }));
    expect(getProgress('loops')).toBe(3);
  });

  it('returns 0 for an unknown concept even when other concepts have progress', () => {
    localStorage.setItem('kidcode_progress', JSON.stringify({ variables: 2 }));
    expect(getProgress('conditions')).toBe(0);
  });
});

describe('isLevelUnlocked', () => {
  it('Level 1 is always unlocked regardless of progress', () => {
    expect(isLevelUnlocked('variables', 1)).toBe(true);
  });

  it('Level 2 is locked when no progress exists', () => {
    expect(isLevelUnlocked('variables', 2)).toBe(false);
  });

  it('Level 2 is unlocked after completing Level 1', () => {
    completeLevel('variables', 1);
    expect(isLevelUnlocked('variables', 2)).toBe(true);
  });

  it('Level 3 is locked after completing only Level 1', () => {
    completeLevel('variables', 1);
    expect(isLevelUnlocked('variables', 3)).toBe(false);
  });

  it('Level 3 is unlocked after completing Level 2', () => {
    completeLevel('variables', 2);
    expect(isLevelUnlocked('variables', 3)).toBe(true);
  });

  it('does not bleed between concepts', () => {
    completeLevel('loops', 3);
    expect(isLevelUnlocked('variables', 2)).toBe(false);
  });

  it('Level N is unlocked when N <= highestCompleted + 1', () => {
    completeLevel('conditions', 4);
    expect(isLevelUnlocked('conditions', 5)).toBe(true);
    expect(isLevelUnlocked('conditions', 6)).toBe(false);
  });
});

describe('completeLevel', () => {
  it('stores the completed level', () => {
    completeLevel('variables', 1);
    expect(getProgress('variables')).toBe(1);
  });

  it('updates to a higher level', () => {
    completeLevel('variables', 1);
    completeLevel('variables', 2);
    expect(getProgress('variables')).toBe(2);
  });

  it('does NOT downgrade progress when a lower level is completed again', () => {
    completeLevel('variables', 3);
    completeLevel('variables', 1);
    expect(getProgress('variables')).toBe(3);
  });

  it('handles multiple concepts independently', () => {
    completeLevel('variables', 2);
    completeLevel('loops', 1);
    completeLevel('conditions', 3);
    expect(getProgress('variables')).toBe(2);
    expect(getProgress('loops')).toBe(1);
    expect(getProgress('conditions')).toBe(3);
  });

  it('persists across separate getAllProgress calls', () => {
    completeLevel('loops', 4);
    expect(getAllProgress().loops).toBe(4);
  });
});

describe('resetProgress', () => {
  it('clears all progress from localStorage', () => {
    completeLevel('variables', 3);
    resetProgress();
    expect(getAllProgress()).toEqual({});
  });

  it('causes getProgress to return 0 for any concept', () => {
    completeLevel('loops', 2);
    resetProgress();
    expect(getProgress('loops')).toBe(0);
  });

  it('causes Level 2 to be locked again', () => {
    completeLevel('variables', 1);
    resetProgress();
    expect(isLevelUnlocked('variables', 2)).toBe(false);
  });
});

describe('setCurrentUser — per-user storage namespacing', () => {
  afterEach(() => {
    setCurrentUser(null);
  });

  it('setCurrentUser is exported as a function', () => {
    expect(typeof setCurrentUser).toBe('function');
  });

  it('loadProgressFromCloud is exported as a function', () => {
    expect(typeof loadProgressFromCloud).toBe('function');
  });

  it('when userId is set, completeLevel saves to namespaced key', () => {
    setCurrentUser('user_abc');
    completeLevel('variables', 2);
    const raw = localStorage.getItem('kidcode_progress_user_abc');
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw).variables).toBe(2);
  });

  it('when userId is null, falls back to default key', () => {
    setCurrentUser(null);
    completeLevel('loops', 1);
    const raw = localStorage.getItem('kidcode_progress');
    expect(raw).not.toBeNull();
  });

  it('two users have separate progress', () => {
    setCurrentUser('user_1');
    completeLevel('variables', 3);

    setCurrentUser('user_2');
    completeLevel('variables', 1);

    setCurrentUser('user_1');
    expect(getProgress('variables')).toBe(3);

    setCurrentUser('user_2');
    expect(getProgress('variables')).toBe(1);
  });
});
