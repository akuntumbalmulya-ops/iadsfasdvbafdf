import { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * ============================================
 * IMAGE EDITING GUIDE FOR HERO SECTION
 * ============================================
 * 
 * This section uses NO direct images.
 * Background comes from parent (Index.tsx - cyberpunk-bg.jpeg)
 * Only decorative blur effects are applied here.
 */

type AnimationPhase = 'identity' | 'loading' | 'warning';

const IDENTITY_TEXTS = [
  "strangers",
  "duelist", 
  "homeless",
  "loser",
  "gameholic",
];

const TITLE_TEXTS = [
  "gloistch",
  "ikbal",
];

const HeroSection = () => {
  const [phase, setPhase] = useState<AnimationPhase>('identity');
  const [identityIndex, setIdentityIndex] = useState(0);
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [titleText, setTitleText] = useState("");
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

  // Title animation (gloistch -> ikbal loop)
  useEffect(() => {
    const targetTitle = TITLE_TEXTS[titleIndex];
    let progress = 0;

    const interval = setInterval(() => {
      if (progress <= targetTitle.length) {
        setTitleText(scrambleText(targetTitle, progress));
        progress++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setTitleIndex(prev => (prev + 1) % TITLE_TEXTS.length);
        }, 1500);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [titleIndex, scrambleText]);

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
            setPhase('loading');
          }
        }, 400);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [phase, identityIndex, scrambleText]);

  // Loading phase - spinner before warning
  useEffect(() => {
    if (phase !== 'loading') return;

    const timer = setTimeout(() => {
      setPhase('warning');
    }, 1500);

    return () => clearTimeout(timer);
  }, [phase]);

  // Warning phase - show then loop back to identity
  useEffect(() => {
    if (phase !== 'warning') return;

    const timer = setTimeout(() => {
      setPhase('identity');
      setIdentityIndex(0);
      setDisplayText("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Grain overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* STANDBY indicator - top right */}
      <div className="absolute top-6 right-6 flex items-center gap-2 font-mono text-xs text-muted-foreground/60">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span>STANDBY</span>
      </div>

      <div className={`relative z-10 text-center w-full max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Main title with subtle glitch - Audiowide cyber font */}
        <h1 
          className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-bold mb-4 glitch-subtle tracking-wider uppercase"
          style={{ fontFamily: "'Audiowide', cursive" }}
          data-text={titleText}
        >
          {titleText}
        </h1>

        {/* Thin horizontal divider */}
        <div className="w-48 h-px mx-auto mb-6 opacity-20 bg-gradient-to-r from-transparent via-foreground to-transparent" />

        {/* Status bar - scanning animation - BIGGER & WHITE */}
        <div className="relative w-80 h-2 mx-auto mb-6 bg-muted/30 rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white to-transparent rounded-full"
            style={{
              animation: 'scanBar 2s ease-in-out infinite',
            }}
          />
        </div>

        {/* Terminal input */}
        <div className="font-mono text-sm text-muted-foreground/70 mb-8">
          <span className="text-primary/60">Searching fho david n lucy...</span>
          <span className="terminal-cursor" />
        </div>

        {/* Animated subtitle area - fixed height to prevent layout shift */}
        <div className="h-[200px] sm:h-[180px] md:h-[200px] flex items-start justify-center pt-4">
          {phase === 'identity' && (
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-mono text-foreground">
              {displayText}
              <span className="terminal-cursor" />
            </div>
          )}

          {phase === 'loading' && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-16 h-16 text-white animate-spin" />
              <p className="font-mono text-sm text-muted-foreground animate-pulse">
                SCANNING IDENTITY...
              </p>
            </div>
          )}

          {phase === 'warning' && (
            <div className="warning-embed-enhanced w-full max-w-md mx-auto fade-in-up rounded-2xl">
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
                <p className="text-xs mt-4 text-primary animate-pulse">
                  [ATTEMPTING RECOVERY...]
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add keyframe for scan bar animation */}
      <style>{`
        @keyframes scanBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
