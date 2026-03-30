import { describe, it, expect } from 'vitest';
import {
  getUserId,
  startSession,
  endSession,
  saveSession,
  getAllSessions,
  clearSessions,
} from '../../mab/sessionTracker';

describe('getUserId', () => {
  it('creates a new user ID when none exists', () => {
    const id = getUserId();
    expect(id).toMatch(/^user_/);
  });

  it('persists the user ID to localStorage', () => {
    const id = getUserId();
    expect(localStorage.getItem('kidcode_userId')).toBe(id);
  });

  it('returns the same ID on subsequent calls', () => {
    const first = getUserId();
    const second = getUserId();
    expect(first).toBe(second);
  });

  it('returns the existing ID if one is already stored', () => {
    localStorage.setItem('kidcode_userId', 'user_existing123');
    expect(getUserId()).toBe('user_existing123');
  });
});

describe('startSession', () => {
  it('returns a session object with the correct shape', () => {
    const session = startSession('variables', 1, 'codeSimulation', 'badge');
    expect(session).toMatchObject({
      conceptId: 'variables',
      level: 1,
      modality: 'codeSimulation',
      rewardType: 'badge',
      completed: false,
      timeSpent: 0,
      score: 0,
      streak: 0,
    });
  });

  it('session has a sessionId beginning with "sess_"', () => {
    const session = startSession('loops', 2, 'dragDrop', 'coins');
    expect(session.sessionId).toMatch(/^sess_/);
  });

  it('session has a userId', () => {
    const session = startSession('conditions', 3, 'speedCoding', 'mysteryBox');
    expect(session.userId).toMatch(/^user_/);
  });

  it('session has a valid ISO timestamp', () => {
    const session = startSession('variables', 1, 'codeSimulation', 'badge');
    expect(() => new Date(session.timestamp)).not.toThrow();
    expect(new Date(session.timestamp).toISOString()).toBe(session.timestamp);
  });

  it('session has a startTime number (for elapsed calculation)', () => {
    const session = startSession('variables', 1, 'codeSimulation', 'badge');
    expect(typeof session.startTime).toBe('number');
  });

  it('generates unique sessionIds for each call', () => {
    const s1 = startSession('variables', 1, 'dragDrop', 'badge');
    const s2 = startSession('variables', 1, 'dragDrop', 'badge');
    expect(s1.sessionId).not.toBe(s2.sessionId);
  });
});

describe('endSession', () => {
  it('marks the session as completed when completed=true', () => {
    const session = startSession('variables', 1, 'codeSimulation', 'badge');
    const ended = endSession(session, true);
    expect(ended.completed).toBe(true);
  });

  it('marks the session as incomplete when completed=false', () => {
    const session = startSession('variables', 1, 'codeSimulation', 'badge');
    const ended = endSession(session, false);
    expect(ended.completed).toBe(false);
  });

  it('records score and streak', () => {
    const session = startSession('loops', 2, 'dragDrop', 'coins');
    const ended = endSession(session, true, 95, 4);
    expect(ended.score).toBe(95);
    expect(ended.streak).toBe(4);
  });

  it('defaults score and streak to 0', () => {
    const session = startSession('loops', 2, 'dragDrop', 'coins');
    const ended = endSession(session, true);
    expect(ended.score).toBe(0);
    expect(ended.streak).toBe(0);
  });

  it('sets timeSpent as a non-negative number', () => {
    const session = startSession('conditions', 1, 'speedCoding', 'badge');
    const ended = endSession(session, true);
    expect(ended.timeSpent).toBeGreaterThanOrEqual(0);
    expect(typeof ended.timeSpent).toBe('number');
  });

  it('mutates and returns the same session object', () => {
    const session = startSession('variables', 1, 'codeSimulation', 'badge');
    const ended = endSession(session, true);
    expect(ended).toBe(session);
  });
});

describe('saveSession', () => {
  it('stores the session in localStorage', () => {
    const session = startSession('variables', 1, 'codeSimulation', 'badge');
    endSession(session, true);
    saveSession(session);
    const all = getAllSessions();
    expect(all).toHaveLength(1);
  });

  it('strips startTime before saving', () => {
    const session = startSession('variables', 1, 'codeSimulation', 'badge');
    endSession(session, true);
    saveSession(session);
    const stored = getAllSessions()[0];
    expect(stored.startTime).toBeUndefined();
  });

  it('appends sessions (does not overwrite)', () => {
    const s1 = startSession('variables', 1, 'codeSimulation', 'badge');
    endSession(s1, true);
    saveSession(s1);

    const s2 = startSession('loops', 2, 'dragDrop', 'coins');
    endSession(s2, true);
    saveSession(s2);

    expect(getAllSessions()).toHaveLength(2);
  });

  it('saves conceptId and modality correctly', () => {
    const session = startSession('conditions', 3, 'speedCoding', 'mysteryBox');
    endSession(session, true, 80, 3);
    saveSession(session);
    const stored = getAllSessions()[0];
    expect(stored.conceptId).toBe('conditions');
    expect(stored.modality).toBe('speedCoding');
  });
});

describe('getAllSessions', () => {
  it('returns an empty array when no sessions are stored', () => {
    expect(getAllSessions()).toEqual([]);
  });

  it('returns all stored sessions', () => {
    const s = startSession('variables', 1, 'dragDrop', 'badge');
    endSession(s, true);
    saveSession(s);
    expect(getAllSessions()).toHaveLength(1);
  });

  it('returns empty array on invalid JSON in localStorage', () => {
    localStorage.setItem('kidcode_sessions', 'bad-json');
    expect(getAllSessions()).toEqual([]);
  });
});

describe('clearSessions', () => {
  it('removes all sessions from localStorage', () => {
    const s = startSession('variables', 1, 'codeSimulation', 'badge');
    endSession(s, true);
    saveSession(s);
    clearSessions();
    expect(getAllSessions()).toEqual([]);
  });

  it('clears the kidcode_sessions key', () => {
    clearSessions();
    expect(localStorage.getItem('kidcode_sessions')).toBeNull();
  });
});
