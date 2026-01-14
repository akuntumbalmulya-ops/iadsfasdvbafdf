import { useState, useEffect, useCallback } from 'react';
import welcomeBg from '@/assets/welcome-bg.jpeg';

interface WelcomePageProps {
  onEnter: () => void;
}

const TEXTS = [
  { text: "Welcome to my territory" },
  { text: "Guess this might be the safest place for you" },
  { text: "I hope you enjoy" },
];

const WelcomePage = ({ onEnter }: WelcomePageProps) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isScrambling, setIsScrambling] = useState(false);
  const [speed, setSpeed] = useState(60);

  const scrambleChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~0123456789";

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
    const currentItem = TEXTS[currentTextIndex];
    const targetText = currentItem.text;
    let progress = 0;
    let scrambleInterval: NodeJS.Timeout;

    const typeText = () => {
      setIsScrambling(true);
      
      scrambleInterval = setInterval(() => {
        if (progress <= targetText.length) {
          setDisplayText(scrambleText(targetText, progress));
          progress++;
        } else {
          clearInterval(scrambleInterval);
          setIsScrambling(false);
          
          // Wait then move to next text
          setTimeout(() => {
            setCurrentTextIndex((prev) => (prev + 1) % TEXTS.length);
            setSpeed((prev) => Math.max(prev * 0.9, 30));
          }, 2000);
        }
      }, speed);
    };

    const startDelay = setTimeout(typeText, 500);

    return () => {
      clearTimeout(startDelay);
      clearInterval(scrambleInterval);
    };
  }, [currentTextIndex, speed, scrambleText]);


  const handleClick = () => {
    onEnter();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      {/* Background Image - David & Lucy on the Moon */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${welcomeBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Dark overlay for text visibility */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
        }}
      />
      
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* Scanlines */}
      <div className="scanline" />

      {/* Main content - Embed like search status with blue neon */}
      <div className="relative z-10 text-center px-4">
        <div 
          className="px-4 py-3 sm:px-6 sm:py-4 rounded-full inline-block"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            border: '2px solid hsl(200 100% 50%)',
            boxShadow: '0 0 10px hsl(200 100% 50% / 0.5), 0 0 20px hsl(200 100% 50% / 0.3), inset 0 0 10px hsl(200 100% 50% / 0.1)',
          }}
        >
          <h1 
            className={`text-sm sm:text-lg md:text-xl font-bold tracking-wider text-white ${isScrambling ? 'glitch-text-clean' : ''}`}
            data-text={displayText}
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              textShadow: isScrambling 
                ? '0.05em 0 0 hsl(200 100% 60%), -0.025em -0.05em 0 hsl(180 100% 50%)'
                : '0 0 8px rgba(100,180,255,0.5)',
            }}
          >
            {displayText}
            <span className="terminal-cursor" />
          </h1>
        </div>

        <p 
          className="mt-6 text-xs sm:text-sm font-black text-white welcome-glitch-text tracking-widest uppercase"
          style={{ 
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.5), 0 0 30px rgba(100,180,255,0.4)',
            animation: 'welcomeGlitchBold 2s ease-in-out infinite',
            letterSpacing: '0.15em',
          }}
        >
          [ CLICK ANYWHERE TO ENTER ]
        </p>
      </div>

      <style>{`
        @keyframes welcomeGlitchBold {
          0%, 85%, 100% { 
            opacity: 1;
            transform: translate(0) skew(0);
          }
          88% { 
            opacity: 0.9;
            transform: translate(-3px, 2px) skew(-1deg);
            text-shadow: 
              -3px 0 hsl(0 100% 60%), 
              3px 0 hsl(200 100% 60%),
              0 0 15px rgba(255,255,255,0.9);
          }
          91% { 
            opacity: 1;
            transform: translate(3px, -2px) skew(1deg);
            text-shadow: 
              3px 0 hsl(0 100% 60%), 
              -3px 0 hsl(200 100% 60%),
              0 0 20px rgba(255,255,255,0.9);
          }
          94% { 
            opacity: 0.85;
            transform: translate(-2px, -1px) skew(-0.5deg);
            text-shadow: 
              -2px 0 hsl(0 100% 60%), 
              2px 0 hsl(200 100% 60%),
              0 0 15px rgba(255,255,255,0.9);
          }
        }
        
        .glitch-text-clean {
          position: relative;
          display: inline-block;
          text-shadow: 
            0.05em 0 0 hsl(200 100% 60%),
            -0.025em -0.05em 0 hsl(180 100% 50%);
          animation: glitchClean 500ms infinite;
        }
        
        @keyframes glitchClean {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-1px, 1px); }
          40% { transform: translate(1px, -1px); }
          60% { transform: translate(-1px, -1px); }
          80% { transform: translate(1px, 1px); }
        }
      `}</style>

      {/* Only bottom right terminal decoration */}
      <div className="absolute bottom-4 right-4 text-xs text-muted-foreground font-mono opacity-50">
        &gt;_
      </div>
    </div>
  );
};

export default WelcomePage;
