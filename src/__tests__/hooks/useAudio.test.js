import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAudio } from '../../hooks/useAudio';

// ── Web Audio API mock ──────────────────────────────────────────────
const mockOscillator = {
  connect: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
  type: 'sine',
  frequency: { setValueAtTime: vi.fn() },
};

const mockGainNode = {
  connect: vi.fn(),
  gain: {
    value: 1,
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  },
};

const mockAudioContext = {
  createOscillator: vi.fn(() => ({ ...mockOscillator })),
  createGain: vi.fn(() => ({
    ...mockGainNode,
    gain: { ...mockGainNode.gain },
  })),
  currentTime: 0,
  destination: {},
  state: 'running',
  resume: vi.fn().mockResolvedValue(undefined),
};

// Must use `function` (not arrow) so it works as a constructor via `new`
vi.stubGlobal('AudioContext', vi.fn(function MockAudioContext() { return mockAudioContext; }));

describe('useAudio', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

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
    expect(result.current.isMuted).toBe(false);

    act(() => result.current.toggleMute());
    expect(result.current.isMuted).toBe(true);
    expect(localStorage.getItem('kidcode_muted')).toBe('true');

    act(() => result.current.toggleMute());
    expect(result.current.isMuted).toBe(false);
    expect(localStorage.getItem('kidcode_muted')).toBe('false');
  });

  it('playCorrect creates oscillators (sound plays when unmuted)', () => {
    const { result } = renderHook(() => useAudio());
    act(() => result.current.playCorrect());
    expect(mockAudioContext.createOscillator).toHaveBeenCalled();
  });

  it('playIncorrect creates oscillators (sound plays when unmuted)', () => {
    const { result } = renderHook(() => useAudio());
    act(() => result.current.playIncorrect());
    expect(mockAudioContext.createOscillator).toHaveBeenCalled();
  });

  it('playVictory creates oscillators (sound plays when unmuted)', () => {
    const { result } = renderHook(() => useAudio());
    act(() => result.current.playVictory());
    expect(mockAudioContext.createOscillator).toHaveBeenCalled();
  });

  it('no oscillators created when muted', () => {
    localStorage.setItem('kidcode_muted', 'true');
    const { result } = renderHook(() => useAudio());

    act(() => result.current.playCorrect());
    act(() => result.current.playIncorrect());
    act(() => result.current.playVictory());

    expect(mockAudioContext.createOscillator).not.toHaveBeenCalled();
  });

  it('playCorrect plays more notes than playIncorrect (ascending vs short buzz)', () => {
    const { result } = renderHook(() => useAudio());

    act(() => result.current.playCorrect());
    const correctCalls = mockAudioContext.createOscillator.mock.calls.length;

    vi.clearAllMocks();

    act(() => result.current.playIncorrect());
    const incorrectCalls = mockAudioContext.createOscillator.mock.calls.length;

    // correct = 3-note chime, incorrect = 2-note buzz
    expect(correctCalls).toBeGreaterThan(incorrectCalls);
  });

  it('stopMusic does not throw', () => {
    const { result } = renderHook(() => useAudio());
    expect(() => act(() => result.current.stopMusic())).not.toThrow();
  });

  it('startMusic does not throw', () => {
    const { result } = renderHook(() => useAudio());
    expect(() => act(() => result.current.startMusic('adventure'))).not.toThrow();
    expect(() => act(() => result.current.startMusic('mystery'))).not.toThrow();
  });
});
