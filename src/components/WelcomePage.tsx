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

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer overflow-hidden"
      onClick={handleClick}
      style={{ opacity: flickerOpacity }}
    >
      {/* Background Image - David & Lucy on the Moon - NO DARK OVERLAY */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${welcomeBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* Scanlines */}
      <div className="scanline" />

      {/* Main content - WHITE NEON EMBED like Hero Section */}
      <div className="relative z-10 text-center px-4">
        <div className="glass-card-gradient neon-border-white px-6 py-6 sm:px-10 sm:py-8 rounded-2xl inline-block">
          <h1 
            className={`text-xl sm:text-3xl md:text-4xl font-bold tracking-wider text-white ${isScrambling ? 'glitch-text' : ''}`}
            data-text={displayText}
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              textShadow: isScrambling 
                ? '0.05em 0 0 hsl(var(--cyber-red)), -0.025em -0.05em 0 hsl(180 100% 50%)'
                : '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.3)',
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

      {/* Only bottom right terminal decoration */}
      <div className="absolute bottom-4 right-4 text-xs text-muted-foreground font-mono opacity-50">
        &gt;_
      </div>
    </div>
  );
};

export default WelcomePage;
