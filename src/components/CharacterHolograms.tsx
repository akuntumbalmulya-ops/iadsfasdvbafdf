import davidHologram from '@/assets/david-hologram.png';
import lucyHologram from '@/assets/lucy-hologram.png';

/**
 * Character Holograms Component
 * Displays David (left) and Lucy (right) as futuristic digital holograms
 * with floating animation, scanlines, glitch effects, and neon glow
 */
const CharacterHolograms = () => {
  return (
    <>
      {/* David - Left Side */}
      <div className="hologram-container hologram-left">
        <div className="hologram-wrapper">
          <img 
            src={davidHologram} 
            alt="David" 
            className="hologram-image"
          />
          {/* Hologram effects overlay */}
          <div className="hologram-scanlines" />
          <div className="hologram-noise" />
          <div className="hologram-glow" />
        </div>
      </div>

      {/* Lucy - Right Side */}
      <div className="hologram-container hologram-right">
        <div className="hologram-wrapper">
          <img 
            src={lucyHologram} 
            alt="Lucy" 
            className="hologram-image"
          />
          {/* Hologram effects overlay */}
          <div className="hologram-scanlines" />
          <div className="hologram-noise" />
          <div className="hologram-glow" />
        </div>
      </div>
    </>
  );
};

export default CharacterHolograms;
