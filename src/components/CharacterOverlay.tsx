import { useEffect, useState } from 'react';
import cyberpunkCharacters from '@/assets/cyberpunk-characters.png';

/**
 * Cyberpunk Character Overlay
 * Displays anime-style characters with subtle idle animations
 * Optimized for both desktop and mobile viewing
 */
const CharacterOverlay = () => {
  const [glitchActive, setGlitchActive] = useState(false);

  // Occasional glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.85) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 100 + Math.random() * 150);
      }
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div 
      className="fixed inset-0 z-5 pointer-events-none overflow-hidden"
      style={{ zIndex: 5 }}
    >
      {/* Desktop Character image with idle animation */}
      <div 
        className={`hidden sm:block absolute inset-0 transition-all duration-300 ${glitchActive ? 'character-glitch' : ''}`}
        style={{
          backgroundImage: `url(${cyberpunkCharacters})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
          opacity: 0.65,
          animation: 'characterFloat 6s ease-in-out infinite, neonPulseCharacter 4s ease-in-out infinite',
          mixBlendMode: 'screen',
        }}
      />

      {/* Mobile Character image - smaller and positioned to fit screen */}
      <div 
        className={`sm:hidden absolute inset-0 transition-all duration-300 ${glitchActive ? 'character-glitch' : ''}`}
        style={{
          backgroundImage: `url(${cyberpunkCharacters})`,
          backgroundSize: '150%',
          backgroundPosition: 'center 80%',
          backgroundRepeat: 'no-repeat',
          opacity: 0.5,
          animation: 'characterFloat 6s ease-in-out infinite, neonPulseCharacter 4s ease-in-out infinite',
          mixBlendMode: 'screen',
        }}
      />

      {/* Subtle scanline overlay for characters */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
          pointerEvents: 'none',
        }}
      />

      <style>{`
        @keyframes characterFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes neonPulseCharacter {
          0%, 100% { filter: brightness(1) contrast(1); }
          50% { filter: brightness(1.05) contrast(1.02); }
        }
        
        .character-glitch {
          animation: characterGlitch 0.15s ease-in-out !important;
        }
        
        @keyframes characterGlitch {
          0% { transform: translate(0); filter: hue-rotate(0deg); }
          25% { transform: translate(-2px, 1px); filter: hue-rotate(10deg); }
          50% { transform: translate(2px, -1px); filter: hue-rotate(-10deg); }
          75% { transform: translate(-1px, -1px); filter: hue-rotate(5deg); }
          100% { transform: translate(0); filter: hue-rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

export default CharacterOverlay;
