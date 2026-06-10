import React, { useState, useEffect } from 'react';
import { audio } from '../utils/audioSynth';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, Settings, Radio } from 'lucide-react';

interface AudioPlayerHUDProps {
  currentPack: 'orchestral' | 'retro' | 'ambient';
  onPackChange: (pack: 'orchestral' | 'retro' | 'ambient') => void;
  defaultVolume: number;
}

export const AudioPlayerHUD: React.FC<AudioPlayerHUDProps> = ({
  currentPack,
  onPackChange,
  defaultVolume,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const [tracks, setTracks] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [volume, setVolume] = useState(defaultVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setTracks(audio.getTracks());
    audio.setSoundPack(currentPack);
    audio.setVolume(defaultVolume);

    // Subscribe to track progress changes
    audio.onProgress((pct) => {
      setTrackProgress(pct);
      setIsPlaying(audio.isPlayingMusic());
      setCurrentIdx(audio.getCurrentTrackIndex());
    });
  }, [currentPack, defaultVolume]);

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    audio.playClick('button');
    if (isPlaying) {
      audio.stopMusic();
      setIsPlaying(false);
    } else {
      audio.setSoundPack(currentPack);
      audio.playMusic();
      setIsPlaying(true);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    audio.playClick('nav');
    audio.nextTrack();
    setIsPlaying(true);
    setCurrentIdx(audio.getCurrentTrackIndex());
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    audio.playClick('nav');
    audio.prevTrack();
    setIsPlaying(true);
    setCurrentIdx(audio.getCurrentTrackIndex());
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    audio.setVolume(val);
    if (isMuted && val > 0) {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    audio.playClick('button');
    const muted = audio.toggleMute();
    setIsMuted(muted);
  };

  const handlePackSelect = (pack: 'orchestral' | 'retro' | 'ambient', e: React.MouseEvent) => {
    e.stopPropagation();
    audio.playClick('admin');
    onPackChange(pack);
    audio.setSoundPack(pack);
    if (isPlaying) {
      audio.playMusic(); // Restart with new sound pack
    }
  };

  const currentTrack = tracks[currentIdx] || { title: "Unloaded Symphonies", artist: "Virtual Synth Core" };

  return (
    <div 
      className="fixed bottom-6 left-6 z-50 bg-black/60 backdrop-blur-2xl p-4 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] max-w-sm w-80 md:w-88 border border-white/10"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Waveform Visualizer Overlay (Decorative dynamic lines) */}
      <div className="flex items-center gap-1.5 h-6 absolute right-4 top-4">
        {isPlaying ? (
          [1, 2, 3, 4, 5].map((idx) => (
            <span
              key={idx}
              className="w-1 bg-orange-500 rounded-full"
              style={{
                height: `${20 + Math.random() * 80}%`,
                animation: `float ${0.6 + idx * 0.15}s ease-in-out infinite alternate`,
              }}
            />
          ))
        ) : (
          [1, 2, 3, 4, 5].map((idx) => (
            <span key={idx} className="w-1 h-1.5 bg-neutral-600 rounded-full" />
          ))
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Animated Spin Record Disc */}
        <div 
          onClick={handlePlayPause}
          className={`h-11 w-11 rounded-full cursor-pointer bg-gradient-to-tr from-neutral-900 to-neutral-700 flex items-center justify-center border border-white/10 shadow-lg ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`}
        >
          <Music className={`h-5 w-5 ${isPlaying ? 'text-orange-500' : 'text-neutral-400'}`} />
        </div>

        <div className="flex-1 min-w-0 pr-10">
          <h4 className="text-xs font-mono font-semibold tracking-wide text-white truncate">{currentTrack.title}</h4>
          <p className="text-[10px] uppercase tracking-wider text-neutral-400 truncate">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Progress slider bar */}
      <div className="mt-3">
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-100 ease-out"
            style={{ width: `${trackProgress}%` }}
          />
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between mt-3.5">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={handlePrev}
            className="p-1 px-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Previous track"
          >
            <SkipBack className="h-4 w-4" />
          </button>

          <button 
            type="button"
            onClick={handlePlayPause}
            className="p-2 bg-orange-500 hover:bg-orange-400 text-white rounded-full transition-transform transform active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(249,115,22,0.4)]"
            title={isPlaying ? "Pause music" : "Play music"}
          >
            {isPlaying ? <Pause className="h-4.5 w-4.5 fill-current" /> : <Play className="h-4.5 w-4.5 fill-current ml-0.5" />}
          </button>

          <button 
            type="button"
            onClick={handleNext}
            className="p-1 px-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Next track"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Volume button details */}
          <button 
            type="button"
            onClick={handleMuteToggle}
            className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          
          <input 
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 md:w-20 accent-orange-500 cursor-pointer h-1"
          />

          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); audio.playClick('button'); setShowSettings(!showSettings); }}
            className={`p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer ${showSettings ? 'bg-white/10 text-white' : ''}`}
            title="Customize Soundpack/Sync options"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Settings expansion */}
      {showSettings && (
        <div className="mt-3.5 pt-3 border-t border-white/5 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono tracking-wide">
            <span>SOUND FX PACK</span>
            <span className="text-orange-500 uppercase font-semibold">{currentPack}</span>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {['orchestral', 'retro', 'ambient'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={(e) => handlePackSelect(p as any, e)}
                className={`py-1 text-[11px] rounded font-medium border uppercase transition-all cursor-pointer ${
                  currentPack === p
                    ? 'bg-orange-500/20 border-orange-500/50 text-orange-400 shadow'
                    : 'bg-neutral-800/40 border-transparent text-neutral-400 hover:bg-neutral-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          
          <div className="text-[10px] text-center text-neutral-500 font-mono mt-1">
            🎛️ Synthesis bypasses standard browser cors
          </div>
        </div>
      )}
    </div>
  );
};
