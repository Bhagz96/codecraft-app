import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Reset localStorage between every test so tests are isolated
beforeEach(() => {
  localStorage.clear();
});

// ── Global audio mocks ─────────────────────────────────────────────
// jsdom has no Web Audio API or HTMLMediaElement.play — mock them so
// any component that calls useAudio() doesn't throw.

const mockAudioElement = {
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  loop: false,
  volume: 1,
  paused: true,
};
vi.stubGlobal('Audio', vi.fn(function MockAudio() { return mockAudioElement; }));

const mockAudioContext = {
  createOscillator: vi.fn(() => ({
    connect: vi.fn(), start: vi.fn(), stop: vi.fn(),
    type: 'sine',
    frequency: { setValueAtTime: vi.fn() },
  })),
  createGain: vi.fn(() => ({
    connect: vi.fn(),
    gain: {
      value: 1,
      setValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
  })),
  currentTime: 0,
  destination: {},
  state: 'running',
  resume: vi.fn().mockResolvedValue(undefined),
  close: vi.fn().mockResolvedValue(undefined),
};
vi.stubGlobal('AudioContext', vi.fn(function MockAudioContext() { return mockAudioContext; }));
