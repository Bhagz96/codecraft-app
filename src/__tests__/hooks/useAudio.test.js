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

  it('registers a click listener for autoplay retry when play() is blocked by browser', async () => {
    mockAudio.play.mockRejectedValueOnce(new DOMException('play() failed', 'NotAllowedError'));
    const addEventSpy = vi.spyOn(document, 'addEventListener');

    const { result } = renderHook(() => useAudio());
    await act(async () => {
      result.current.startMusic('adventure');
      // Flush microtasks so the .catch() callback runs
      await Promise.resolve();
      await Promise.resolve();
    });

    const registered = addEventSpy.mock.calls.map(([event]) => event);
    expect(registered).toContain('click');
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

  // ── Volume control ────────────────────────────────────────────────

  it('returns musicVolume (number) and setMusicVolume (function)', () => {
    const { result } = renderHook(() => useAudio());
    expect(typeof result.current.musicVolume).toBe('number');
    expect(typeof result.current.setMusicVolume).toBe('function');
  });

  it('musicVolume defaults to 0.55 when localStorage is empty', () => {
    const { result } = renderHook(() => useAudio());
    expect(result.current.musicVolume).toBeCloseTo(0.55);
  });

  it('reads musicVolume from localStorage on init', () => {
    localStorage.setItem('kidcode_volume', '0.3');
    const { result } = renderHook(() => useAudio());
    expect(result.current.musicVolume).toBeCloseTo(0.3);
  });

  it('setMusicVolume persists value to localStorage', () => {
    const { result } = renderHook(() => useAudio());
    act(() => result.current.setMusicVolume(0.4));
    expect(localStorage.getItem('kidcode_volume')).toBe('0.4');
  });

  it('setMusicVolume updates musicVolume state', () => {
    const { result } = renderHook(() => useAudio());
    act(() => result.current.setMusicVolume(0.4));
    expect(result.current.musicVolume).toBeCloseTo(0.4);
  });

  it('setMusicVolume updates audio element volume when unmuted', () => {
    const { result } = renderHook(() => useAudio());
    act(() => result.current.startMusic('adventure'));
    act(() => result.current.setMusicVolume(0.3));
    expect(mockAudio.volume).toBeCloseTo(0.3);
  });

  it('setMusicVolume does not change audio volume when muted', () => {
    localStorage.setItem('kidcode_muted', 'true');
    const { result } = renderHook(() => useAudio());
    act(() => result.current.setMusicVolume(0.8));
    expect(mockAudio.play).not.toHaveBeenCalled();
  });

  it('setMusicVolume clamps value between 0 and 1', () => {
    const { result } = renderHook(() => useAudio());
    act(() => result.current.setMusicVolume(2.5));
    expect(result.current.musicVolume).toBe(1);
    act(() => result.current.setMusicVolume(-0.5));
    expect(result.current.musicVolume).toBe(0);
  });
});
