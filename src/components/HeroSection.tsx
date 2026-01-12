import { useState, useEffect, useCallback } from 'react';

type AnimationPhase = 'identity' | 'warning' | 'hacker';

const IDENTITY_TEXTS = [
  "strangers",
  "duelist", 
  "homeless",
  "loser",
  "gameholic",
];

const HACKER_LINES = [
  "> scanning network...",
  "> accessing mainframe...",
  "> ERROR: firewall detected",
  "> bypassing security protocols...",
  "> decrypting data streams...",
  "> connection established",
  "> loading identity matrix...",
  "> WARNING: anomaly detected",
  "> running diagnostics...",
  "> system override in progress...",
];

const HeroSection = () => {
  const [phase, setPhase] = useState<AnimationPhase>('identity');
  const [identityIndex, setIdentityIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [hackerLines, setHackerLines] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const scrambleChars = "!@#$%^&*()_+-=[]{}|;':\"<>?";

  const scrambleText = useCallback((text: string, progress: number) => {
    return text
      .split("")
      .map((char, i) => {
        if (i < progress) return char;
        if (char === " ") return " ";
        return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
      })
      .join("");
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Identity phase animation
  useEffect(() => {
    if (phase !== 'identity') return;

    const targetText = IDENTITY_TEXTS[identityIndex];
    let progress = 0;

    const interval = setInterval(() => {
      if (progress <= targetText.length) {
        setDisplayText(scrambleText(targetText, progress));
        progress++;
      } else {
        clearInterval(interval);
        
        setTimeout(() => {
          if (identityIndex < IDENTITY_TEXTS.length - 1) {
            setIdentityIndex(prev => prev + 1);
          } else {
            setPhase('warning');
          }
        }, 800);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [phase, identityIndex, scrambleText]);

  // Warning phase - show for a moment then transition
  useEffect(() => {
    if (phase !== 'warning') return;

    const timer = setTimeout(() => {
      setPhase('hacker');
      setHackerLines([]);
    }, 3000);

    return () => clearTimeout(timer);
  }, [phase]);

  // Hacker phase animation
  useEffect(() => {
    if (phase !== 'hacker') return;

    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex < HACKER_LINES.length) {
        setHackerLines(prev => [...prev, HACKER_LINES[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(interval);
        
        // Reset to identity phase after hacker sequence
        setTimeout(() => {
          setPhase('identity');
          setIdentityIndex(0);
          setHackerLines([]);
          setDisplayText("");
        }, 2000);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [phase]);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
      </div>

      <div className={`relative z-10 text-center px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Main title */}
        <h1 
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-8 glitch-text text-glow-red float"
          data-text="gloistch"
        >
          gloistch
        </h1>

        {/* Animated subtitle area */}
        <div className="min-h-[200px] flex items-center justify-center">
          {phase === 'identity' && (
            <div className="text-2xl sm:text-3xl md:text-4xl font-mono text-foreground">
              {displayText}
              <span className="terminal-cursor" />
            </div>
          )}

          {phase === 'warning' && (
            <div className="warning-embed max-w-md mx-auto fade-in-up">
              <div className="font-mono text-sm sm:text-base space-y-2 text-primary">
                <p className="font-bold animate-pulse">⚠ WARNING: SYSTEM IDENTITY NOT FOUND</p>
                <p className="text-muted-foreground">ERROR CODE: 0xGLO1STCH</p>
                <p className="text-muted-foreground">ACCESS LIMITED</p>
                <p className="text-xs mt-4 text-cyber-white-dim">
                  [ATTEMPTING RECOVERY...]
                </p>
              </div>
            </div>
          )}

          {phase === 'hacker' && (
            <div className="glass-card p-4 max-w-lg mx-auto text-left fade-in-up">
              <div className="font-mono text-xs sm:text-sm space-y-1">
                {hackerLines.map((line, index) => (
                  <p 
                    key={index} 
                    className="terminal-text text-glow-green"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {line}
                  </p>
                ))}
                {hackerLines.length < HACKER_LINES.length && (
                  <span className="terminal-cursor" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-foreground/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
