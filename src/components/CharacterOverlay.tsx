import { useEffect, useState } from 'react';
import cyberpunkCharacters from '@/assets/cyberpunk-characters.png';

/**
 * Cyberpunk Character Overlay
 * Displays anime-style characters as holograms with subtle idle animations
 * NO DARK OVERLAYS - pure hologram effect following background
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
      className="fixed inset-0 z-5 pointer-events-none"
      style={{ zIndex: 5 }}
    >
      {/* Desktop Character image - HOLOGRAM EFFECT */}
      <div 
        className={`hidden sm:block absolute inset-0 transition-all duration-300 ${glitchActive ? 'character-glitch' : ''}`}
        style={{
          backgroundImage: `url(${cyberpunkCharacters})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
          opacity: 0.9,
          animation: 'characterFloat 6s ease-in-out infinite, hologramPulse 4s ease-in-out infinite',
          mixBlendMode: 'screen',
          filter: 'drop-shadow(0 0 20px rgba(100, 200, 255, 0.4)) drop-shadow(0 0 40px rgba(150, 100, 255, 0.3))',
        }}
      />

      {/* Mobile Character image - BIGGER SIZE + HOLOGRAM */}
      <div 
        className={`sm:hidden absolute inset-0 transition-all duration-300 ${glitchActive ? 'character-glitch' : ''}`}
        style={{
          backgroundImage: `url(${cyberpunkCharacters})`,
          backgroundSize: '200%',
          backgroundPosition: 'center 85%',
          backgroundRepeat: 'no-repeat',
          opacity: 0.85,
          animation: 'characterFloat 6s ease-in-out infinite, hologramPulse 4s ease-in-out infinite',
          mixBlendMode: 'screen',
          filter: 'drop-shadow(0 0 15px rgba(100, 200, 255, 0.4)) drop-shadow(0 0 30px rgba(150, 100, 255, 0.3))',
        }}
      />

      <style>{`
        @keyframes characterFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes hologramPulse {
          0%, 100% { 
            filter: drop-shadow(0 0 20px rgba(100, 200, 255, 0.4)) drop-shadow(0 0 40px rgba(150, 100, 255, 0.3));
            opacity: 0.9;
          }
          50% { 
            filter: drop-shadow(0 0 30px rgba(100, 200, 255, 0.6)) drop-shadow(0 0 50px rgba(150, 100, 255, 0.4));
            opacity: 0.95;
          }
        }
        
        .character-glitch {
          animation: characterGlitch 0.15s ease-in-out !important;
        }
        
        @keyframes characterGlitch {
          0% { transform: translate(0); filter: hue-rotate(0deg) drop-shadow(0 0 20px rgba(100, 200, 255, 0.4)); }
          25% { transform: translate(-3px, 1px); filter: hue-rotate(10deg) drop-shadow(0 0 25px rgba(255, 100, 100, 0.5)); }
          50% { transform: translate(3px, -1px); filter: hue-rotate(-10deg) drop-shadow(0 0 25px rgba(100, 255, 100, 0.5)); }
          75% { transform: translate(-1px, -1px); filter: hue-rotate(5deg) drop-shadow(0 0 25px rgba(100, 100, 255, 0.5)); }
          100% { transform: translate(0); filter: hue-rotate(0deg) drop-shadow(0 0 20px rgba(100, 200, 255, 0.4)); }
        }
      `}</style>
    </div>
  );
};

export default CharacterOverlay;
