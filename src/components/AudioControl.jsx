import { useState, useRef, useEffect } from 'react';

function volumeIcon(isMuted, volume) {
  if (isMuted || volume === 0) return '🔇';
  if (volume < 0.33) return '🔈';
  if (volume < 0.67) return '🔉';
  return '🔊';
}

/**
 * AudioControl — volume icon button that opens a slider popover.
 *
 * Props are passed from the parent's useAudio() call so the parent's
 * isMuted state (used in useEffect deps for startMusic) stays in sync.
 */
export function AudioControl({ isMuted, toggleMute, musicVolume, setMusicVolume }) {
  const [showPanel, setShowPanel] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!showPanel) return;
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowPanel(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showPanel]);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setShowPanel((p) => !p)}
        title="Audio settings"
        className="w-8 h-8 rounded-full bg-[#161b22] border border-[#30363d] text-gray-400 hover:text-gray-200 hover:border-cyan-500/50 transition-all flex items-center justify-center text-sm cursor-pointer"
      >
        {volumeIcon(isMuted, musicVolume)}
      </button>

      {showPanel && (
        <div className="absolute right-0 top-9 bg-[#161b22] border border-[#30363d] rounded-lg p-3 z-50 shadow-2xl w-44">
          <p className="text-gray-600 uppercase tracking-wider text-[9px] mb-2 border-b border-[#30363d] pb-1">
            Sound
          </p>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm w-5 text-center">{volumeIcon(isMuted, musicVolume)}</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={musicVolume}
              onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
              disabled={isMuted}
              className="flex-1 accent-cyan-400 disabled:opacity-40 cursor-pointer"
              aria-label="Music volume"
            />
          </div>
          <button
            onClick={toggleMute}
            className="w-full text-xs font-mono text-gray-400 hover:text-gray-200 py-1 rounded hover:bg-[#21262d] transition-colors cursor-pointer"
          >
            {isMuted ? 'Unmute' : 'Mute'}
          </button>
        </div>
      )}
    </div>
  );
}
