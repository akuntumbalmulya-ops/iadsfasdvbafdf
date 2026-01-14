import { useState, useEffect } from 'react';
import WelcomePage from '@/components/WelcomePage';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SocialSection from '@/components/SocialSection';
import MusicPlayer from '@/components/MusicPlayer';
import AmbientOverlay from '@/components/AmbientOverlay';
import CharacterHolograms from '@/components/CharacterHolograms';

/**
 * ============================================
 * IMAGE EDITING GUIDE FOR MAIN PAGE
 * ============================================
 * 
 * BACKGROUND IMAGE (Cyberpunk):
 * - File: src/assets/cyberpunk-bg.jpeg
 * - Used as main background after welcome page
 * - Applied with blur effect in the content area below
 * 
 * To change background: Replace the cyberpunk-bg.jpeg file
 * or update the import and backgroundImage style below.
 */
import cyberpunkBg from '@/assets/cyberpunk-city-bg.jpeg';

const Index = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Lock scroll when on welcome page
    if (!hasEntered) {
      document.body.classList.add('scroll-locked');
    } else {
      document.body.classList.remove('scroll-locked');
    }

    return () => {
      document.body.classList.remove('scroll-locked');
    };
  }, [hasEntered]);

  const handleEnter = () => {
    setHasEntered(true);
    // Small delay for smooth transition
    setTimeout(() => setShowContent(true), 100);
  };

  return (
    <div className="relative min-h-screen">
      {/* Global noise overlay */}
      <div className="noise-overlay" />
      
      {/* Scanline effect */}
      <div className="scanline" />

      {/* Welcome Page Gate */}
      {!hasEntered && (
        <div className="transition-opacity duration-1000">
          <WelcomePage onEnter={handleEnter} />
        </div>
      )}

      {/* Main Content with Cyberpunk Background */}
      {hasEntered && (
        <div className={`relative transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          {/* Animated Background with parallax effect */}
          <div 
            className="fixed inset-0 z-0 bg-parallax"
            style={{
              backgroundImage: `url(${cyberpunkBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed',
            }}
          >
            {/* Moving scanlines */}
            <div className="absolute inset-0 scanline-animated" />
            
            {/* Dynamic noise texture */}
            <div className="absolute inset-0 noise-animated" />
          </div>


          {/* Light overlay for subtle depth - no heavy darkening */}
          <div className="fixed inset-0 z-[1] bg-black/15 pointer-events-none" />

          {/* Character Holograms */}
          <CharacterHolograms />

          {/* Ambient Overlay */}
          <AmbientOverlay />

          {/* Content sections */}
          <div className="relative z-10">
            <HeroSection />
            <AboutSection />
            <SocialSection />
            <MusicPlayer shouldPlay={showContent} />

            {/* Footer - Clean with glow effects */}
            <footer className="relative py-8 text-center border-t border-[hsl(200_80%_60%_/_0.3)] backdrop-blur-sm">
              <p className="font-mono text-xs text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                © 2026 gloistch. All rights reserved.
              </p>
              <p className="font-mono text-xs text-white/80 mt-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                &lt;/end_transmission&gt;
              </p>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
