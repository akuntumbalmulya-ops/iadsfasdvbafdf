import { useState, useEffect, useCallback } from 'react';
import davidLucyBg from '@/assets/david-lucy-bg.jpeg';

interface WelcomePageProps {
  onEnter: () => void;
}

const TEXTS = [
  { text: "welcome to my territory", scary: false },
  { text: "/gloistch/home", scary: false },
  { text: "r you?", scary: true },
];

const WelcomePage = ({ onEnter }: WelcomePageProps) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isScrambling, setIsScrambling] = useState(false);
  const [speed, setSpeed] = useState(100);
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
            setSpeed((prev) => Math.max(prev * 0.8, 30)); // Speed up each loop
          }, 1500);
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

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer overflow-hidden"
      onClick={handleClick}
      style={{ opacity: flickerOpacity }}
    >
      {/* Background Image - David & Lucy */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${davidLucyBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
      />
      
      {/* Dark overlay - slightly darker for better text visibility */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* Scanlines */}
      <div className="scanline" />

      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        <div className="relative">
          <h1 
            className={`text-2xl sm:text-4xl md:text-5xl font-bold tracking-wider ${
              TEXTS[currentTextIndex]?.scary 
                ? 'text-red-500 scary-text' 
                : 'text-foreground'
            } ${isScrambling ? 'glitch-text' : ''}`}
            data-text={displayText}
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              textShadow: TEXTS[currentTextIndex]?.scary 
                ? '0 0 20px hsl(0 70% 50%), 0 0 40px hsl(0 70% 40%), 0 0 60px hsl(0 50% 30%)'
                : isScrambling 
                  ? '0.05em 0 0 hsl(var(--cyber-red)), -0.025em -0.05em 0 hsl(var(--cyber-yellow))'
                  : 'none',
              animation: TEXTS[currentTextIndex]?.scary ? 'scaryShake 0.1s ease-in-out infinite' : 'none'
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
          20% { transform: translate(-2px, 1px); }
          40% { transform: translate(2px, -1px); }
          60% { transform: translate(-1px, -2px); }
          80% { transform: translate(1px, 2px); }
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
