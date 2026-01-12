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
  "C:\\gloistch> dir /s",
  "  Volume in drive C has no label.",
  "  Volume Serial Number is GL01-STCH",
  "",
  "  Directory of C:\\gloistch\\system",
  "",
  "01/12/2026  03:33 AM    <DIR>          .",
  "01/12/2026  03:33 AM    <DIR>          ..",
  "01/12/2026  03:33 AM             4,096 identity.dll",
  "01/12/2026  03:33 AM           128,512 mainframe.exe",
  "01/12/2026  03:33 AM            32,768 bypass.sys",
  "               3 File(s)        165,376 bytes",
  "",
  "C:\\gloistch> scanning network...",
  "C:\\gloistch> accessing mainframe...",
  "C:\\gloistch> ERROR: firewall detected",
  "C:\\gloistch> bypassing security protocols...",
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
    }, 200);

    return () => clearInterval(interval);
  }, [phase]);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-dark overflow-hidden px-4">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
      </div>

      <div className={`relative z-10 text-center w-full max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Main title */}
        <h1 
          className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-bold mb-6 sm:mb-8 glitch-text text-glow-red float"
          data-text="gloistch"
        >
          gloistch
        </h1>

        {/* Animated subtitle area - fixed height to prevent layout shift */}
        <div className="h-[280px] sm:h-[260px] md:h-[300px] flex items-start justify-center pt-4">
          {phase === 'identity' && (
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-mono text-foreground">
              {displayText}
              <span className="terminal-cursor" />
            </div>
          )}

          {phase === 'warning' && (
            <div className="warning-embed-enhanced w-full max-w-md mx-auto fade-in-up">
              {/* Warning Icon */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-primary animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L1 21h22L12 2zm0 3.17L20.53 19H3.47L12 5.17zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
                </svg>
                <span className="text-lg sm:text-xl font-bold text-primary text-glow-red animate-pulse">SYSTEM ERROR</span>
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-primary animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L1 21h22L12 2zm0 3.17L20.53 19H3.47L12 5.17zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
                </svg>
              </div>
              
              <div className="font-mono text-xs sm:text-sm space-y-2">
                <p className="font-bold text-primary text-glow-red animate-pulse text-base sm:text-lg">
                  ⚠ WARNING: SYSTEM IDENTITY NOT FOUND
                </p>
                <div className="h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent my-3" />
                <p className="text-muted-foreground">ERROR CODE: <span className="text-primary">0xGLO1STCH</span></p>
                <p className="text-muted-foreground">STATUS: <span className="text-destructive">ACCESS LIMITED</span></p>
                <div className="h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent my-3" />
                <p className="text-xs mt-4 text-accent text-glow-yellow animate-pulse">
                  [ATTEMPTING RECOVERY...]
                </p>
              </div>
            </div>
          )}

          {phase === 'hacker' && (
            <div className="cmd-embed w-full max-w-lg mx-auto text-left fade-in-up">
              {/* CMD Header */}
              <div className="bg-[#000080] px-2 sm:px-3 py-1 flex items-center justify-between">
                <span className="text-white text-xs sm:text-sm font-bold">Command Prompt</span>
                <div className="flex gap-1 sm:gap-2">
                  <button className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-400 text-black text-[8px] sm:text-xs flex items-center justify-center">_</button>
                  <button className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-400 text-black text-[8px] sm:text-xs flex items-center justify-center">□</button>
                  <button className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-400 text-black text-[8px] sm:text-xs flex items-center justify-center">×</button>
                </div>
              </div>
              {/* CMD Content */}
              <div className="bg-black p-2 sm:p-3 font-mono text-[10px] sm:text-xs space-y-0.5 max-h-[180px] sm:max-h-[200px] overflow-hidden">
                {hackerLines.map((line, index) => (
                  <p 
                    key={index} 
                    className="text-terminal-green whitespace-pre"
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
      </div>
    </section>
  );
};

export default HeroSection;
