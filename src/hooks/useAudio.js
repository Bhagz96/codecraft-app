import { useRef, useCallback, useState, useEffect } from 'react';

// ── Note frequencies (Hz) — used for SFX only ─────────────────────
const F = {
  E3: 164.81, G3: 196.00,
  C5: 523.25, E5: 659.25, G5: 783.99,
  C4: 261.63, E4: 329.63, G4: 392.00,
};

// ── Singleton HTML Audio element (persists across page navigation) ──
// Using a module-level object so music never restarts mid-song when
// the user moves between pages.
const theme = {
  audio: null,
  volume: 0.8, // last-set target volume
};

function getAudio() {
  if (!theme.audio && typeof window !== 'undefined') {
    theme.audio = new Audio('/audio/theme.mp3');
    theme.audio.loop = true;
    theme.audio.volume = theme.volume;
  }
  return theme.audio;
}

// ── Web Audio context — created lazily for SFX ────────────────────
function makeSfxCtx() {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  return Ctor ? new Ctor() : null;
}

function scheduleNote(ctx, dest, freq, start, dur, wave = 'triangle', amp = 0.3) {
  if (freq <= 0) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(dest);
  osc.type = wave;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(amp, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, start + dur * 0.85);
  osc.start(start);
  osc.stop(start + dur);
}

// ── Hook ───────────────────────────────────────────────────────────

export function useAudio() {
  const [isMuted, setIsMuted] = useState(
    () => localStorage.getItem('kidcode_muted') === 'true'
  );
  const mutedRef = useRef(isMuted);
  useEffect(() => { mutedRef.current = isMuted; }, [isMuted]);

  // SFX AudioContext (created on first user gesture)
  const ctxRef = useRef(null);
  const sfxDestRef = useRef(null);

  const getSfxCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = makeSfxCtx();
      if (ctxRef.current) {
        sfxDestRef.current = ctxRef.current.destination;
      }
    }
    if (ctxRef.current?.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  // ── Background music ───────────────────────────────────────────

  /**
   * startMusic('adventure') → full volume (home / reward screens)
   * startMusic('mystery')   → quiet volume (lesson screens)
   * Harmless to call when already playing — just adjusts volume.
   */
  const startMusic = useCallback((type) => {
    const vol = type === 'mystery' ? 0.28 : 0.8;
    theme.volume = vol;
    if (mutedRef.current) return;
    const audio = getAudio();
    if (!audio) return;
    audio.volume = vol;
    if (audio.paused) audio.play().catch(() => {});
  }, []);

  /**
   * stopMusic — pauses the track. Only called by toggleMute.
   * We intentionally do NOT stop on component unmount so music
   * continues seamlessly across page navigation.
   */
  const stopMusic = useCallback(() => {
    const audio = getAudio();
    if (audio && !audio.paused) audio.pause();
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem('kidcode_muted', String(next));
      mutedRef.current = next;
      const audio = getAudio();
      if (audio) {
        if (next) {
          audio.pause();
        } else {
          audio.volume = theme.volume;
          audio.play().catch(() => {});
        }
      }
      return next;
    });
  }, []);

  // ── Sound effects (Web Audio API oscillators) ──────────────────

  const playCorrect = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = getSfxCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const dest = sfxDestRef.current;
    scheduleNote(ctx, dest, F.C5, t,        0.12, 'sine', 0.4);
    scheduleNote(ctx, dest, F.E5, t + 0.10, 0.12, 'sine', 0.4);
    scheduleNote(ctx, dest, F.G5, t + 0.20, 0.28, 'sine', 0.4);
  }, [getSfxCtx]);

  const playIncorrect = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = getSfxCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const dest = sfxDestRef.current;
    scheduleNote(ctx, dest, F.G3, t,        0.18, 'sawtooth', 0.25);
    scheduleNote(ctx, dest, F.E3, t + 0.20, 0.30, 'sawtooth', 0.18);
  }, [getSfxCtx]);

  const playVictory = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = getSfxCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const dest = sfxDestRef.current;
    [F.C4, F.E4, F.G4, F.C5, F.E5].forEach((freq, i) => {
      scheduleNote(ctx, dest, freq, t + i * 0.13, 0.20, 'triangle', 0.3);
    });
    [F.C5, F.E5, F.G5].forEach((freq) => {
      scheduleNote(ctx, dest, freq, t + 0.75, 0.85, 'sine', 0.2);
    });
  }, [getSfxCtx]);

  // Close SFX context on unmount (not the audio element — that's shared)
  useEffect(() => () => {
    if (ctxRef.current) {
      ctxRef.current.close();
      ctxRef.current = null;
    }
  }, []);

  return { playCorrect, playIncorrect, playVictory, startMusic, stopMusic, isMuted, toggleMute };
}
