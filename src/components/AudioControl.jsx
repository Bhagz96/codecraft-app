import { useState, useRef, useEffect } from 'react';

function IconVolume({ muted, volume }) {
  if (muted || volume === 0) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </svg>
    );
  }
  if (volume < 0.5) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

export function AudioControl({ isMuted, toggleMute, musicVolume, setMusicVolume, startMusic }) {
  const [showPanel, setShowPanel] = useState(false);
  const wrapperRef = useRef(null);

  // Close panel on outside click
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

  function handleButtonClick() {
    // First user gesture — try to start music
    if (startMusic) startMusic('adventure');
    setShowPanel((p) => !p);
  }

  return (
    <div className="relative" ref={wrapperRef}>
      {/* Main button */}
      <button
        onClick={handleButtonClick}
        title={isMuted ? 'Unmute music' : 'Audio settings'}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono font-medium transition-all duration-200 cursor-pointer shadow-sm ${
          isMuted
            ? 'bg-[#161b22] border-[#30363d] text-gray-600 hover:text-gray-400 hover:border-[#484f58]'
            : 'bg-[#161b22] border-cyan-500/40 text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_8px_rgba(0,212,255,0.2)]'
        }`}
      >
        <IconVolume muted={isMuted} volume={musicVolume} />
        <span>{isMuted ? 'muted' : 'music'}</span>
      </button>

      {/* Panel */}
      {showPanel && (
        <div className="absolute right-0 top-10 bg-[#161b22] border border-[#30363d] rounded-xl p-4 z-50 shadow-2xl w-48">
          <p className="text-gray-500 uppercase tracking-widest text-[9px] font-mono mb-3">Music Volume</p>

          {/* Volume slider */}
          <div className="flex items-center gap-2 mb-3">
            <IconVolume muted={isMuted} volume={musicVolume} />
            <input
              type="range"
              min="0" max="1" step="0.05"
              value={isMuted ? 0 : musicVolume}
              onChange={(e) => {
                setMusicVolume(parseFloat(e.target.value));
                if (startMusic) startMusic('adventure');
              }}
              disabled={isMuted}
              className="flex-1 accent-cyan-400 disabled:opacity-30 cursor-pointer h-1"
              aria-label="Music volume"
            />
            <span className="text-gray-500 text-[10px] font-mono w-7 text-right">
              {isMuted ? '—' : `${Math.round(musicVolume * 100)}%`}
            </span>
          </div>

          {/* Mute toggle */}
          <button
            onClick={toggleMute}
            className={`w-full text-xs font-mono py-1.5 rounded-lg border transition-colors cursor-pointer ${
              isMuted
                ? 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20'
                : 'border-[#30363d] text-gray-400 hover:text-gray-200 hover:bg-[#21262d]'
            }`}
          >
            {isMuted ? '▶ Unmute' : '⏸ Mute'}
          </button>
        </div>
      )}
    </div>
  );
}
