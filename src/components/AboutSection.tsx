import { useEffect, useRef, useState } from 'react';

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
      className="relative min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-dark"
    >
      {/* Background glow */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/30 rounded-full blur-[120px]" />
      </div>

      <div 
        className={`relative z-10 max-w-2xl mx-auto transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
        }`}
      >
        <div className="glass-card p-8 sm:p-12 float">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-glow-red">
            About Me
          </h2>
          
          <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-6" />
          
          <p className="text-lg sm:text-xl text-foreground/90 leading-relaxed mb-6">
            A digital stranger navigating code, games, and chaos.
          </p>
          
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-8">
            Lost in the endless void of pixels and algorithms. I exist somewhere between 
            reality and the digital realm, crafting experiences that blur the line between 
            the two. Welcome to my corner of the internet.
          </p>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-bold text-accent text-glow-yellow">∞</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">Hours Coded</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-bold text-accent text-glow-yellow">404</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">Sleep Not Found</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-bold text-accent text-glow-yellow">1</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">Territory</div>
            </div>
          </div>

          {/* Terminal-style footer */}
          <div className="mt-8 p-3 bg-background/50 rounded border border-border/50">
            <p className="font-mono text-xs text-muted-foreground">
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
