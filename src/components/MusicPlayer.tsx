import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface MusicPlayerProps {
  shouldPlay?: boolean;
}

const MusicPlayer = ({ shouldPlay = false }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Auto-play when shouldPlay becomes true
  useEffect(() => {
    if (shouldPlay && audioRef.current && !isPlaying) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay blocked, user needs to interact
      });
    }
  }, [shouldPlay]);

  // Update current time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

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

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="glass-card-gradient flex flex-col gap-2 p-3 sm:p-4 rounded-2xl min-w-[200px] sm:min-w-[280px]">
        {/* Audio element */}
        <audio 
          ref={audioRef} 
          src="/assets/music/background.mp3" 
          loop 
          preload="auto"
        />

        {/* Track info */}
        <div className="text-center mb-1">
          <p className="text-xs sm:text-sm font-mono text-muted-foreground truncate">
            Now Playing
          </p>
          <p className="text-xs text-primary/70 font-mono">teeth_you_-_re6ce</p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] sm:text-xs font-mono text-muted-foreground w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
            aria-label="Seek"
          />
          <span className="text-[10px] sm:text-xs font-mono text-muted-foreground w-10">
            {formatTime(duration)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          {/* Skip backward */}
          <button
            onClick={skipBackward}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/20 hover:bg-primary/40 transition-colors"
            aria-label="Skip backward 10 seconds"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play/Pause button */}
          <button
            onClick={togglePlay}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-primary/30 hover:bg-primary/50 transition-colors"
            aria-label={isPlaying ? "Pause music" : "Play music"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" />
            )}
          </button>

          {/* Skip forward */}
          <button
            onClick={skipForward}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/20 hover:bg-primary/40 transition-colors"
            aria-label="Skip forward 10 seconds"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Volume control */}
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={toggleMute}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/20 hover:bg-primary/40 transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-1 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
            aria-label="Volume"
          />

          {/* Status indicator */}
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-terminal-green animate-pulse' : 'bg-muted-foreground'}`} />
            <span className="text-[10px] text-muted-foreground font-mono">
              {isPlaying ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
