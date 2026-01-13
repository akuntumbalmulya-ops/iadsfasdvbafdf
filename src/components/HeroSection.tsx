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

const SEARCH_TEXTS = [
  { text: "I miss you...", isRed: true, hasLoader: false },
  { text: "Searching fho david n lucy...", isRed: false, hasLoader: true },
];

const TITLE_TEXTS = [
  "Gloistch",
  "Ikbal",
];

const HeroSection = () => {
  const [searchIndex, setSearchIndex] = useState(0);
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [titleText, setTitleText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [searchDisplayText, setSearchDisplayText] = useState("");

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

  // Title animation (Gloistch -> Ikbal loop) - SLOW with hacker glitch
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
        }, 2500);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [titleIndex, scrambleText]);

  // Search text animation - alternates between "I miss you..." and "Searching..."
  useEffect(() => {
    const currentSearch = SEARCH_TEXTS[searchIndex];
    
    if (currentSearch.hasLoader) {
      // Show loader first, then text
      setShowLoader(true);
      setSearchDisplayText("");
      
      const loaderTimer = setTimeout(() => {
        setShowLoader(false);
        let progress = 0;
        const interval = setInterval(() => {
          if (progress <= currentSearch.text.length) {
            setSearchDisplayText(currentSearch.text.slice(0, progress));
            progress++;
          } else {
            clearInterval(interval);
            setTimeout(() => {
              setSearchIndex(prev => (prev + 1) % SEARCH_TEXTS.length);
            }, 3000);
          }
        }, 50);
      }, 1500);
      
      return () => clearTimeout(loaderTimer);
    } else {
      // "I miss you..." - hacker effect with red text
      setShowLoader(false);
      let progress = 0;
      
      const interval = setInterval(() => {
        if (progress <= currentSearch.text.length) {
          setSearchDisplayText(scrambleText(currentSearch.text, progress));
          progress++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setSearchIndex(prev => (prev + 1) % SEARCH_TEXTS.length);
          }, 2500);
        }
      }, 60);
      
      return () => clearInterval(interval);
    }
  }, [searchIndex, scrambleText]);

  const currentSearch = SEARCH_TEXTS[searchIndex];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Grain overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* STANDBY indicator - top LEFT, bold white */}
      <div className="absolute top-6 left-6 flex items-center gap-2 font-mono text-xs">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="font-bold text-white">STANDBY</span>
      </div>

      <div className={`relative z-10 text-center w-full max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Main title with subtle glitch - Helvetica font */}
        <h1 
          className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-bold mb-4 glitch-subtle tracking-wider"
          style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
          data-text={titleText}
        >
          {titleText}
        </h1>

        {/* Glitch Divider - Terminal/Signal style */}
        <div className="font-mono text-sm sm:text-base opacity-40 mb-4 text-gray-300 glitch-divider">
          ───── ░▒▓▒░ ─────
        </div>

        {/* Subtitle / System Text */}
        <div className="font-mono text-xs sm:text-sm text-gray-400 leading-relaxed mb-8 opacity-0 animate-subtitle-fade">
          <p className="mb-1">not a hero</p>
          <p>just trying to survive the system</p>
        </div>

        {/* Terminal input - with WHITE neon embed */}
        <div className="glass-card-gradient neon-border-white px-6 py-4 rounded-2xl inline-block mb-8">
          <div className="font-mono text-sm">
            {showLoader ? (
              <Loader2 className="w-5 h-5 text-white animate-spin inline-block" />
            ) : (
              <>
                <span className={`${currentSearch.isRed ? 'text-red-500 font-bold' : 'text-white'}`}>
                  {searchDisplayText}
                </span>
                <span className="terminal-cursor" />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add keyframe animations */}
      <style>{`
        @keyframes subtitleFade {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-subtitle-fade {
          animation: subtitleFade 0.8s ease-out 0.5s forwards;
        }
        
        .glitch-divider {
          animation: dividerGlitch 4s infinite;
        }
        
        @keyframes dividerGlitch {
          0%, 90%, 100% {
            transform: translateX(0);
            opacity: 0.4;
          }
          92% {
            transform: translateX(-2px);
            opacity: 0.3;
          }
          94% {
            transform: translateX(1px);
            opacity: 0.5;
          }
          96% {
            transform: translateX(-1px);
            opacity: 0.35;
          }
          98% {
            transform: translateX(2px);
            opacity: 0.45;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
