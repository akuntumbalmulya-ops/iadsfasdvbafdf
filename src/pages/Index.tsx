import { useState, useEffect } from 'react';
import WelcomePage from '@/components/WelcomePage';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SocialSection from '@/components/SocialSection';
import MusicPlayer from '@/components/MusicPlayer';

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
    <div className="relative bg-background min-h-screen">
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

      {/* Main Content */}
      {hasEntered && (
        <div className={`transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          <HeroSection />
          <AboutSection />
          <SocialSection />
          <MusicPlayer />

          {/* Footer */}
          <footer className="relative py-8 text-center bg-gradient-dark border-t border-border/20">
            <p className="font-mono text-xs text-muted-foreground">
              © 2026 gloistch. All rights reserved.
            </p>
            <p className="font-mono text-xs text-muted-foreground/50 mt-2">
              &lt;/end_transmission&gt;
            </p>
          </footer>
        </div>
      )}
    </div>
  );
};

export default Index;
