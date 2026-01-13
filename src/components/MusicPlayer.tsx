import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, SkipBack, SkipForward, Music, Minimize2 } from 'lucide-react';
/**
 * ============================================
 * MUSIC/AUDIO EDITING GUIDE
 * ============================================
 * 
 * BACKGROUND MUSIC:
 * - File: public/assets/music/i-really-want-to-stay.mp3
 * - Currently: I Really Want To Stay At Your House - Cyberpunk
 * - Plays automatically after welcome page interaction
 * 
 * To change music: Replace i-really-want-to-stay.mp3 file in public/assets/music/
 * or update the src path in the audio element below.
 */

interface MusicPlayerProps {
  shouldPlay?: boolean;
}

const MusicPlayer = ({ shouldPlay = false }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [audioData, setAudioData] = useState<number[]>(new Array(32).fill(0));
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (shouldPlay && audioRef.current && !isPlaying) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        initAudioContext();
      }).catch(() => {});
    }
  }, [shouldPlay]);

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

  // Initialize Audio Context for visualizer
  const initAudioContext = () => {
    if (!audioRef.current || audioContextRef.current) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      
      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;
      
      visualize();
    } catch (e) {
      console.log('Audio context not available');
    }
  };

  // Audio visualizer animation
  const visualize = () => {
    if (!analyserRef.current) return;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const animate = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      const normalized = Array.from(dataArray).map(val => val / 255);
      setAudioData(normalized);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        if (!audioContextRef.current) {
          initAudioContext();
        }
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

  // Circular visualizer component
  const CircularVisualizer = ({ size = 40, className = "" }: { size?: number; className?: string }) => {
    const bars = 16;
    const radius = size / 2 - 4;
    
    return (
      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${className}`}>
        <svg width={size} height={size} className="transform -rotate-90">
          {Array.from({ length: bars }).map((_, i) => {
            const angle = (i / bars) * Math.PI * 2;
            const dataIndex = Math.floor((i / bars) * audioData.length);
            const value = isPlaying ? audioData[dataIndex] || 0 : 0;
            const barHeight = 4 + value * 12;
            const x1 = size / 2 + Math.cos(angle) * (radius - 2);
            const y1 = size / 2 + Math.sin(angle) * (radius - 2);
            const x2 = size / 2 + Math.cos(angle) * (radius - 2 - barHeight);
            const y2 = size / 2 + Math.sin(angle) * (radius - 2 - barHeight);
            
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="hsl(270, 80%, 60%)"
                strokeWidth="2"
                strokeLinecap="round"
                style={{
                  filter: 'drop-shadow(0 0 3px hsl(270, 80%, 60%))',
                  transition: 'all 0.05s ease-out'
                }}
              />
            );
          })}
        </svg>
      </div>
    );
  };

  // Bar visualizer for full player
  const BarVisualizer = () => {
    const bars = 24;
    
    return (
      <div className="flex items-end justify-center gap-[2px] h-8 mb-2">
        {Array.from({ length: bars }).map((_, i) => {
          const dataIndex = Math.floor((i / bars) * audioData.length);
          const value = isPlaying ? audioData[dataIndex] || 0 : 0;
          const height = 4 + value * 24;
          
          return (
            <div
              key={i}
              className="w-[3px] rounded-t-sm"
              style={{
                height: `${height}px`,
                background: 'linear-gradient(to top, hsl(270, 80%, 60%), hsl(270, 80%, 75%))',
                boxShadow: '0 0 4px hsl(270, 80%, 60%)',
                transition: 'height 0.05s ease-out'
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <audio 
        ref={audioRef} 
        src="/assets/music/i-really-want-to-stay.mp3" 
        loop 
        preload="auto"
        crossOrigin="anonymous"
      />

      {/* Minimized View - Circle with neon glow and circular visualizer */}
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="neon-circle-purple p-3 bg-background/80 backdrop-blur-md hover:scale-110 transition-transform duration-200 relative"
          aria-label="Expand music player"
          style={{ width: '56px', height: '56px' }}
        >
          <CircularVisualizer size={56} />
          <Music className={`w-5 h-5 relative z-10 ${isPlaying ? 'text-accent animate-pulse' : 'text-muted-foreground'}`} />
        </button>
      ) : (
        /* Full Player View */
        <div className="glass-card-gradient flex flex-col gap-2 p-3 sm:p-4 rounded-2xl min-w-[200px] sm:min-w-[280px] neon-border-purple">
          {/* Minimize button */}
          <button
            onClick={() => setIsMinimized(true)}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-primary/20 hover:bg-primary/40 transition-colors"
            aria-label="Minimize player"
          >
            <Minimize2 className="w-3 h-3" />
          </button>

          {/* Bar Visualizer */}
          <BarVisualizer />

          {/* Track info */}
          <div className="text-center mb-1 pr-6">
            <p className="text-xs sm:text-sm font-mono text-muted-foreground truncate">
              Now Playing
            </p>
            <p className="text-xs text-primary/70 font-mono">I Really Want To Stay At Your House</p>
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
            <button
              onClick={skipBackward}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/20 hover:bg-primary/40 transition-colors"
              aria-label="Skip backward 10 seconds"
            >
              <SkipBack className="w-4 h-4" />
            </button>

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

            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-terminal-green animate-pulse' : 'bg-muted-foreground'}`} />
              <span className="text-[10px] text-muted-foreground font-mono">
                {isPlaying ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
