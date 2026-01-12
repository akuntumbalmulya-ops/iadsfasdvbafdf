import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="glass-card flex items-center gap-2 p-2 sm:p-3">
        {/* Audio element - replace src with your music file */}
        <audio 
          ref={audioRef} 
          src="/assets/music/background.mp3" 
          loop 
          preload="auto"
        />

        {/* Play/Pause button */}
        <button
          onClick={togglePlay}
          className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-primary/20 hover:bg-primary/40 transition-colors"
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />
          )}
        </button>

        {/* Volume control */}
        <button
          onClick={toggleMute}
          className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-primary/20 hover:bg-primary/40 transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>

        {/* Volume slider - hidden on mobile */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="hidden sm:block w-16 h-1 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
          aria-label="Volume"
        />

        {/* Status indicator */}
        <div className="hidden sm:flex items-center gap-1 ml-2">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-terminal-green animate-pulse' : 'bg-muted-foreground'}`} />
          <span className="text-xs text-muted-foreground font-mono">
            {isPlaying ? 'PLAYING' : 'PAUSED'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
