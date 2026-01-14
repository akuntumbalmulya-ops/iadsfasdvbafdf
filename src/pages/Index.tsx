import { useState, useEffect } from 'react';
import WelcomePage from '@/components/WelcomePage';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SocialSection from '@/components/SocialSection';
import MusicPlayer from '@/components/MusicPlayer';
import AmbientOverlay from '@/components/AmbientOverlay';
import CharacterOverlay from '@/components/CharacterOverlay';

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
import cyberpunkBg from '@/assets/cyberpunk-bg.jpeg';

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
          {/* 
           * ============================================
           * BACKGROUND IMAGE CONTAINER
           * ============================================
           * Edit cyberpunk-bg.jpeg to change the background
           * Blur amount: backdrop-blur-[3px] (adjust for more/less blur)
           * 
           * NOTE: Background is darkened slightly for better embed visibility
           */}
          <div 
            className="fixed inset-0 z-0"
            style={{
              backgroundImage: `url(${cyberpunkBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Dark overlay for better embed visibility + subtle blur */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px]" />
          </div>

          {/* Character Overlay with idle animation */}
          <CharacterOverlay />

          {/* Ambient Overlay */}
          <AmbientOverlay />

          {/* Content sections */}
          <div className="relative z-10">
            <HeroSection />
            <AboutSection />
            <SocialSection />
            <MusicPlayer shouldPlay={showContent} />

            {/* Footer */}
            <footer className="relative py-8 text-center border-t border-border/20" style={{ backgroundColor: 'hsla(0, 0%, 4%, 0.5)', backdropFilter: 'blur(4px)' }}>
              <p className="font-mono text-xs text-muted-foreground">
                © 2026 gloistch. All rights reserved.
              </p>
              <p className="font-mono text-xs text-muted-foreground/50 mt-2">
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
