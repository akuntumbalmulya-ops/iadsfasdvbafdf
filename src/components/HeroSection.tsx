import { useState, useEffect, useCallback } from 'react';

/**
 * ============================================
 * IMAGE EDITING GUIDE FOR HERO SECTION
 * ============================================
 * 
 * This section uses NO direct images.
 * Background comes from parent (Index.tsx - cyberpunk-bg.jpeg)
 * Only decorative blur effects are applied here.
 */

// Synced pairs: [title, search text]
const SEQUENCE = [
  { title: "Gloistch", search: "Searching fho david n lucy...", isRed: false },
  { title: "Ikbal", search: "I miss you...", isRed: true },
];

const HeroSection = () => {
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [titleText, setTitleText] = useState("");
  const [searchDisplayText, setSearchDisplayText] = useState("");
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

  // Synced animation: title and search text animate together
  useEffect(() => {
    const current = SEQUENCE[sequenceIndex];
    const titleTarget = current.title;
    const searchTarget = current.search;
    
    let titleProgress = 0;
    let searchProgress = 0;
    let titleDone = false;
    let searchDone = false;

    // Animate title
    const titleInterval = setInterval(() => {
      if (titleProgress <= titleTarget.length) {
        setTitleText(scrambleText(titleTarget, titleProgress));
        titleProgress++;
      } else {
        clearInterval(titleInterval);
        titleDone = true;
        checkDone();
      }
    }, 100);

    // Animate search text
    const searchInterval = setInterval(() => {
      if (searchProgress <= searchTarget.length) {
        setSearchDisplayText(scrambleText(searchTarget, searchProgress));
        searchProgress++;
      } else {
        clearInterval(searchInterval);
        searchDone = true;
        checkDone();
      }
    }, 60);

    // Wait for both to finish, then switch
    const checkDone = () => {
      if (titleDone && searchDone) {
        setTimeout(() => {
          setSequenceIndex(prev => (prev + 1) % SEQUENCE.length);
        }, 3000);
      }
    };

    return () => {
      clearInterval(titleInterval);
      clearInterval(searchInterval);
    };
  }, [sequenceIndex, scrambleText]);

  const currentSearch = SEQUENCE[sequenceIndex];

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
      {/* Main title embed - glass effect, rounded, static container */}
        <div className="glass-card-embed-transparent px-8 py-6 sm:px-12 sm:py-8 rounded-2xl inline-block" data-neon="purple">
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-wider text-white relative z-10"
            style={{ 
              fontFamily: "'Cyberpunk', 'Orbitron', sans-serif",
              textShadow: `
                0 0 5px hsl(270 100% 75%),
                0 0 15px hsl(270 100% 70%),
                0 0 30px hsl(270 90% 65%),
                0 0 50px hsl(270 85% 60% / 0.9),
                0 0 80px hsl(270 80% 55% / 0.7),
                0 0 120px hsl(270 75% 50% / 0.5),
                0 0 200px hsl(270 70% 50% / 0.3)
              `
            }}
            data-text={titleText}
          >
            {titleText}
          </h1>

          {/* Search text - inside same embed, no loader */}
          <div className="font-mono text-sm mt-4">
            <span 
              className={`${currentSearch.isRed ? 'text-red-500 font-bold' : 'text-white'}`}
              style={{
                textShadow: currentSearch.isRed 
                  ? `0 0 10px hsl(0 100% 60%), 0 0 20px hsl(0 100% 55%), 0 0 40px hsl(0 90% 50% / 0.8), 0 0 80px hsl(0 85% 50% / 0.5)`
                  : 'none'
              }}
            >
              {searchDisplayText}
            </span>
            <span className="terminal-cursor" />
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
