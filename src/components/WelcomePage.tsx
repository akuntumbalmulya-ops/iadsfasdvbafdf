import { useState, useEffect, useCallback } from 'react';
import welcomeBg from '@/assets/welcome-bg.jpeg';

interface WelcomePageProps {
  onEnter: () => void;
}

const TEXTS = [
  { text: "Welcome to my territory", scary: false },
  { text: "Guess this might be the safest place for you", scary: false },
  { text: "I hope you enjoy", scary: true },
];

const WelcomePage = ({ onEnter }: WelcomePageProps) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isScrambling, setIsScrambling] = useState(false);
  const [speed, setSpeed] = useState(60);
  const [flickerOpacity, setFlickerOpacity] = useState(1);

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
            setSpeed((prev) => Math.max(prev * 0.9, 30)); // Speed up each loop
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

  // Flicker effect
  useEffect(() => {
    const flickerInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        setFlickerOpacity(0.3 + Math.random() * 0.7);
        setTimeout(() => setFlickerOpacity(1), 50 + Math.random() * 100);
      }
    }, 100);

    return () => clearInterval(flickerInterval);
  }, []);

  const handleClick = () => {
    onEnter();
  };

  const isScary = TEXTS[currentTextIndex]?.scary;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer overflow-hidden"
      onClick={handleClick}
      style={{ opacity: flickerOpacity }}
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
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* Scanlines */}
      <div className="scanline" />

      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        <div className="relative">
          <h1 
            className={`text-2xl sm:text-4xl md:text-5xl font-bold tracking-wider ${
              isScary 
                ? 'text-red-500 scary-text' 
                : `text-foreground ${isScrambling ? 'glitch-text' : ''}`
            }`}
            data-text={displayText}
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              textShadow: isScary 
                ? '0 0 20px hsl(0 70% 50%), 0 0 40px hsl(0 70% 40%), 0 0 60px hsl(0 50% 30%)'
                : isScrambling 
                  ? '0.05em 0 0 hsl(var(--cyber-red)), -0.025em -0.05em 0 hsl(var(--cyber-yellow))'
                  : 'none',
              animation: isScary ? 'scaryShake 0.1s ease-in-out infinite' : 'none'
            }}
          >
            {displayText}
            <span className="terminal-cursor" />
          </h1>
        </div>

        <p className="mt-8 text-sm text-muted-foreground animate-pulse" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
          [ click anywhere to enter ]
        </p>
      </div>
      
      <style>{`
        @keyframes scaryShake {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-3px, 2px); }
          40% { transform: translate(3px, -2px); }
          60% { transform: translate(-2px, -3px); }
          80% { transform: translate(2px, 3px); }
        }
        .scary-text {
          animation: scaryShake 0.1s ease-in-out infinite;
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
