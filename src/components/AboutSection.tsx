import { useEffect, useRef, useState } from 'react';
/**
 * ============================================
 * IMAGE EDITING GUIDE FOR ABOUT SECTION
 * ============================================
 * 
 * PROFILE PHOTO:
 * - File: src/assets/profile-photo.png
 * - Location: Top-right corner of the About Me embed
 * - Size: 80px-112px (responsive)
 * 
 * To change profile photo: Replace profile-photo.png file
 * or update the import below.
 */
import profilePhoto from '@/assets/profile-photo.png';

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center py-12 sm:py-20 px-4 bg-gradient-dark"
    >
      {/* Background glow */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[300px] sm:h-[400px] bg-primary/30 rounded-full blur-[120px]" />
      </div>

      <div 
        className={`relative z-10 max-w-2xl mx-auto w-full transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
        }`}
      >
        <div className="glass-card-gradient neon-border-yellow p-6 sm:p-8 md:p-12 float rounded-3xl">
          {/* Header with photo */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-glow-red order-2 sm:order-1">
              About Me
            </h2>
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-3 border-primary/50 shadow-lg shadow-primary/30 flex-shrink-0 order-1 sm:order-2 mb-4 sm:mb-0">
              <img 
                src={profilePhoto} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-6" />
          
          <p className="text-base sm:text-lg md:text-xl text-foreground/90 leading-relaxed mb-4 sm:mb-6">
            A digital stranger navigating code, games, and chaos.
          </p>
          
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 sm:mb-8">
            Just someone trying to become a better version of myself than yesterday. I spend most of my time enjoying games, movies, and music things that help me relax, escape, and stay inspired. I like exploring stories, worlds, and ideas, and I'm always learning at my own pace. Oh, and yeah, I'm into girls with a goth look.
          </p>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
            <div className="p-2 sm:p-3">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-accent text-glow-yellow">∞</div>
              <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mt-1">Hours Coded</div>
            </div>
            <div className="p-2 sm:p-3">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-accent text-glow-yellow">404</div>
              <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mt-1">Sleep Not Found</div>
            </div>
            <div className="p-2 sm:p-3">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-accent text-glow-yellow">1</div>
              <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mt-1">Territory</div>
            </div>
          </div>

          {/* Terminal-style footer */}
          <div className="mt-6 sm:mt-8 p-2 sm:p-3 bg-background/50 rounded border border-border/50">
            <p className="font-mono text-[10px] sm:text-xs text-muted-foreground">
              <span className="text-terminal-green">gloistch@territory</span>
              <span className="text-foreground">:</span>
              <span className="text-primary">~</span>
              <span className="text-foreground">$ whoami</span>
              <span className="terminal-cursor" />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
