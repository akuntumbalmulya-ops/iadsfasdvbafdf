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
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number>(0);
  const isSourceConnectedRef = useRef(false);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Auto-play when shouldPlay changes
  useEffect(() => {
    if (shouldPlay && audioRef.current && !isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
          setAudioError(false);
          initAudioContext();
        }).catch((error) => {
          console.log('Autoplay prevented:', error);
          setAudioError(true);
        });
      }
    }
  }, [shouldPlay]);

  // Time update and duration
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const handleEnded = () => {
      // Loop handled by audio element, but reset state if needed
      setCurrentTime(0);
    };
    const handleError = () => {
      setAudioError(true);
      setIsPlaying(false);
    };
    const handleCanPlay = () => {
      setAudioError(false);
      updateDuration();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  // Initialize Audio Context for visualizer
  const initAudioContext = () => {
    if (!audioRef.current) return;
    
    // Prevent double connection
    if (isSourceConnectedRef.current) {
      // Just resume if already connected
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      visualize();
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const audioContext = new AudioContextClass();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;
      
      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;
      isSourceConnectedRef.current = true;
      
      visualize();
    } catch (e) {
      console.log('Audio context not available:', e);
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

  const togglePlay = async () => {
    if (!audioRef.current) return;
    
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Resume audio context if suspended (iOS/Safari requirement)
        if (audioContextRef.current?.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
          setAudioError(false);
          initAudioContext();
        }
      }
    } catch (error) {
      console.log('Play error:', error);
      setAudioError(true);
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
    if (audioRef.current && !isNaN(time) && isFinite(time)) {
      try {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
      } catch (error) {
        console.log('Seek error:', error);
      }
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      const newTime = Math.max(0, audioRef.current.currentTime - 10);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const skipForward = () => {
    if (audioRef.current && duration > 0) {
      const newTime = Math.min(duration, audioRef.current.currentTime + 10);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Circular visualizer component - pulses OUTSIDE the circle
  const CircularVisualizer = ({ buttonSize = 64 }: { buttonSize?: number }) => {
    const bars = 20;
    const visualizerSize = buttonSize + 60; // Larger than button to extend outside
    const centerOffset = (visualizerSize - buttonSize) / 2;
    const innerRadius = buttonSize / 2 + 4; // Start just outside the button
    
    return (
      <div 
        className="absolute pointer-events-none"
        style={{
          width: visualizerSize,
          height: visualizerSize,
          top: -centerOffset,
          left: -centerOffset,
        }}
      >
        <svg width={visualizerSize} height={visualizerSize} className="transform -rotate-90">
          {Array.from({ length: bars }).map((_, i) => {
            const angle = (i / bars) * Math.PI * 2;
            const dataIndex = Math.floor((i / bars) * audioData.length);
            const value = isPlaying ? audioData[dataIndex] || 0 : 0;
            const barHeight = 3 + value * 20; // Bars extend outward
            
            // Start from outside the button circle, extend further out
            const x1 = visualizerSize / 2 + Math.cos(angle) * innerRadius;
            const y1 = visualizerSize / 2 + Math.sin(angle) * innerRadius;
            const x2 = visualizerSize / 2 + Math.cos(angle) * (innerRadius + barHeight);
            const y2 = visualizerSize / 2 + Math.sin(angle) * (innerRadius + barHeight);
            
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="hsl(270, 80%, 60%)"
                strokeWidth="3"
                strokeLinecap="round"
                style={{
                  filter: 'drop-shadow(0 0 4px hsl(270, 80%, 60%)) drop-shadow(0 0 8px hsl(270, 80%, 50%))',
                  transition: 'all 0.05s ease-out',
                  opacity: 0.3 + value * 0.7
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

      {/* Minimized View - Circle with neon glow and circular visualizer OUTSIDE */}
      {isMinimized ? (
        <div className="relative" style={{ width: '64px', height: '64px' }}>
          {/* Visualizer extending outside the button */}
          <CircularVisualizer buttonSize={64} />
          
          {/* The actual button */}
          <button
            onClick={() => setIsMinimized(false)}
            className="neon-circle-purple bg-background/80 backdrop-blur-md hover:scale-110 transition-transform duration-200 relative flex items-center justify-center rounded-full"
            aria-label="Expand music player"
            style={{ width: '64px', height: '64px', zIndex: 5 }}
          >
            <Music className={`w-5 h-5 ${isPlaying ? 'text-accent animate-pulse' : 'text-muted-foreground'}`} />
          </button>
        </div>
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
