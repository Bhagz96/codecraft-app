import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAudio } from '../../hooks/useAudio';

// Audio mocks are provided globally by src/__tests__/setup.js.
// Grab references so we can inspect calls.
let mockAudio;
let mockCtx;

beforeEach(() => {
  // Fresh mock instances each test (setup.js already cleared localStorage)
  mockAudio = new Audio();
  vi.clearAllMocks();
  mockAudio.paused = true;
  mockAudio.volume = 1;
  mockCtx = new AudioContext();
});

describe('useAudio', () => {
  it('returns all expected audio control functions', () => {
    const { result } = renderHook(() => useAudio());
    expect(typeof result.current.playCorrect).toBe('function');
    expect(typeof result.current.playIncorrect).toBe('function');
    expect(typeof result.current.playVictory).toBe('function');
    expect(typeof result.current.startMusic).toBe('function');
    expect(typeof result.current.stopMusic).toBe('function');
    expect(typeof result.current.isMuted).toBe('boolean');
    expect(typeof result.current.toggleMute).toBe('function');
  });

  it('starts unmuted by default', () => {
    const { result } = renderHook(() => useAudio());
    expect(result.current.isMuted).toBe(false);
  });

  it('reads muted=true from localStorage on init', () => {
    localStorage.setItem('kidcode_muted', 'true');
    const { result } = renderHook(() => useAudio());
    expect(result.current.isMuted).toBe(true);
  });

  it('toggleMute flips isMuted and persists to localStorage', () => {
    const { result } = renderHook(() => useAudio());

    act(() => result.current.toggleMute());
    expect(result.current.isMuted).toBe(true);
    expect(localStorage.getItem('kidcode_muted')).toBe('true');

    act(() => result.current.toggleMute());
    expect(result.current.isMuted).toBe(false);
    expect(localStorage.getItem('kidcode_muted')).toBe('false');
  });

  it('startMusic calls audio.play() when unmuted', () => {
    const { result } = renderHook(() => useAudio());
    act(() => result.current.startMusic('adventure'));
    expect(mockAudio.play).toHaveBeenCalled();
  });

  it('startMusic sets lower volume for mystery (lesson) mode', () => {
    const { result } = renderHook(() => useAudio());
    act(() => result.current.startMusic('mystery'));
    expect(mockAudio.volume).toBeLessThan(0.5);
  });

  it('startMusic sets higher volume for adventure (home) mode', () => {
    const { result } = renderHook(() => useAudio());
    act(() => result.current.startMusic('adventure'));
    expect(mockAudio.volume).toBeGreaterThanOrEqual(0.5);
  });

  it('startMusic does not call play() when muted', () => {
    localStorage.setItem('kidcode_muted', 'true');
    const { result } = renderHook(() => useAudio());
    act(() => result.current.startMusic('adventure'));
    expect(mockAudio.play).not.toHaveBeenCalled();
  });

  it('stopMusic pauses the audio element', () => {
    mockAudio.paused = false;
    const { result } = renderHook(() => useAudio());
    act(() => result.current.stopMusic());
    expect(mockAudio.pause).toHaveBeenCalled();
  });

  it('toggleMute pauses audio when muting', () => {
    mockAudio.paused = false;
    const { result } = renderHook(() => useAudio());
    act(() => result.current.toggleMute());
    expect(mockAudio.pause).toHaveBeenCalled();
  });

  it('toggleMute resumes audio when unmuting', () => {
    localStorage.setItem('kidcode_muted', 'true');
    const { result } = renderHook(() => useAudio());
    act(() => result.current.toggleMute());
    expect(mockAudio.play).toHaveBeenCalled();
  });

  it('playCorrect creates oscillators (SFX)', () => {
    const { result } = renderHook(() => useAudio());
    act(() => result.current.playCorrect());
    expect(mockCtx.createOscillator).toHaveBeenCalled();
  });

  it('playIncorrect creates oscillators (SFX)', () => {
    const { result } = renderHook(() => useAudio());
    act(() => result.current.playIncorrect());
    expect(mockCtx.createOscillator).toHaveBeenCalled();
  });

  it('playVictory creates oscillators (SFX)', () => {
    const { result } = renderHook(() => useAudio());
    act(() => result.current.playVictory());
    expect(mockCtx.createOscillator).toHaveBeenCalled();
  });

  it('no SFX oscillators when muted', () => {
    localStorage.setItem('kidcode_muted', 'true');
    const { result } = renderHook(() => useAudio());
    act(() => result.current.playCorrect());
    act(() => result.current.playIncorrect());
    act(() => result.current.playVictory());
    expect(mockCtx.createOscillator).not.toHaveBeenCalled();
  });

  it('playCorrect plays more notes than playIncorrect', () => {
    const { result } = renderHook(() => useAudio());

    act(() => result.current.playCorrect());
    const correctCalls = mockCtx.createOscillator.mock.calls.length;

    vi.clearAllMocks();

    act(() => result.current.playIncorrect());
    const incorrectCalls = mockCtx.createOscillator.mock.calls.length;

    expect(correctCalls).toBeGreaterThan(incorrectCalls);
  });
});
