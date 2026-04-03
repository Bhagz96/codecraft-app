import { useRef, useCallback, useState, useEffect } from 'react';

// ── Note frequencies (Hz) ──────────────────────────────────────────
const F = {
  E3: 164.81, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
  G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, E5: 659.25, G5: 783.99,
};

// ── Music sequences [frequency, duration_seconds] — 0 freq = rest ──

// Adventure (home / hero creation) — upbeat C major, ~126 BPM
const ADVENTURE = [
  [F.C4, 0.18], [F.E4, 0.18], [F.G4, 0.18], [F.E4, 0.18],
  [F.G4, 0.14], [F.A4, 0.14], [F.G4, 0.48],
  [F.E4, 0.18], [F.G4, 0.18], [F.C5, 0.48],
  [F.B4, 0.18], [F.A4, 0.18], [F.G4, 0.18], [F.E4, 0.48],
  [0,    0.30],
  [F.F4, 0.18], [F.A4, 0.18], [F.C5, 0.48],
  [F.E4, 0.18], [F.G4, 0.18], [F.B4, 0.18], [F.G4, 0.18],
  [F.C5, 0.18], [F.B4, 0.18], [F.A4, 0.18], [F.G4, 0.48],
  [0,    0.30],
];

// Mystery (lessons) — atmospheric A natural minor, ~66 BPM
const MYSTERY = [
  [F.A3, 0.75], [0, 0.25], [F.C4, 0.75], [0, 0.25],
  [F.E4, 1.25], [0, 0.50],
  [F.C4, 0.75], [0, 0.25], [F.A3, 0.75], [0, 0.25],
  [F.G3, 0.75], [F.A3, 1.50], [0, 0.75],
  [F.E4, 0.75], [0, 0.25], [F.D4, 0.75], [0, 0.25],
  [F.C4, 1.25], [0, 0.50],
  [F.A3, 0.75], [F.G3, 0.75], [F.A3, 1.50],
  [0, 1.00],
];

// ── Helpers ────────────────────────────────────────────────────────

function createCtx() {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  return Ctor ? new Ctor() : null;
}

function scheduleNote(ctx, dest, freq, start, dur, wave = 'triangle', amp = 0.22) {
  if (freq <= 0) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(dest);
  osc.type = wave;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(amp, start + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.001, start + dur * 0.85);
  osc.start(start);
  osc.stop(start + dur);
}

// ── Hook ───────────────────────────────────────────────────────────

export function useAudio() {
  const ctxRef = useRef(null);
  const masterRef = useRef(null);
  const timerRef = useRef(null);
  const stoppedRef = useRef(true);

  const [isMuted, setIsMuted] = useState(
    () => localStorage.getItem('kidcode_muted') === 'true'
  );
  // Keep a ref so async music loop always sees latest value
  const mutedRef = useRef(isMuted);
  useEffect(() => { mutedRef.current = isMuted; }, [isMuted]);

  // Lazily create AudioContext (requires user gesture first)
  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = createCtx();
      if (ctxRef.current) {
        masterRef.current = ctxRef.current.createGain();
        masterRef.current.gain.value = 0.55;
        masterRef.current.connect(ctxRef.current.destination);
      }
    }
    if (ctxRef.current?.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const stopMusic = useCallback(() => {
    stoppedRef.current = true;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Recursive scheduler — re-queues the sequence until stopMusic() is called
  const scheduleLoop = useCallback((sequence) => {
    const ctx = getCtx();
    if (!ctx || stoppedRef.current || mutedRef.current) return;

    const dest = masterRef.current;
    let t = ctx.currentTime;
    for (const [freq, dur] of sequence) {
      scheduleNote(ctx, dest, freq, t, dur);
      t += dur;
    }

    const msUntilEnd = (t - ctx.currentTime) * 1000 - 80;
    timerRef.current = setTimeout(() => {
      if (!stoppedRef.current && !mutedRef.current) scheduleLoop(sequence);
    }, Math.max(msUntilEnd, 0));
  }, [getCtx]);

  const startMusic = useCallback((type) => {
    if (mutedRef.current) return;
    stoppedRef.current = false;
    const seq = type === 'adventure' ? ADVENTURE : MYSTERY;
    scheduleLoop(seq);
  }, [scheduleLoop]);

  // ── One-shot sound effects ─────────────────────────────────────

  const playCorrect = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const dest = masterRef.current;
    // Ascending chime: C5 → E5 → G5
    scheduleNote(ctx, dest, F.C5, t,        0.14, 'sine', 0.4);
    scheduleNote(ctx, dest, F.E5, t + 0.12, 0.14, 'sine', 0.4);
    scheduleNote(ctx, dest, F.G5, t + 0.24, 0.30, 'sine', 0.4);
  }, [getCtx]);

  const playIncorrect = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const dest = masterRef.current;
    // Descending buzz: G3 → E3
    scheduleNote(ctx, dest, F.G3, t,        0.18, 'sawtooth', 0.25);
    scheduleNote(ctx, dest, F.E3, t + 0.20, 0.32, 'sawtooth', 0.18);
  }, [getCtx]);

  const playVictory = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const dest = masterRef.current;
    // Ascending arpeggio fanfare
    [F.C4, F.E4, F.G4, F.C5, F.E5].forEach((freq, i) => {
      scheduleNote(ctx, dest, freq, t + i * 0.13, 0.22, 'triangle', 0.35);
    });
    // Sustained final chord
    [F.C5, F.E5, F.G5].forEach((freq) => {
      scheduleNote(ctx, dest, freq, t + 0.75, 0.90, 'sine', 0.22);
    });
  }, [getCtx]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem('kidcode_muted', String(next));
      mutedRef.current = next;
      if (next) stopMusic();
      return next;
    });
  }, [stopMusic]);

  // Cleanup on unmount
  useEffect(() => () => stopMusic(), [stopMusic]);

  return { playCorrect, playIncorrect, playVictory, startMusic, stopMusic, isMuted, toggleMute };
}
