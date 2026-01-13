import { useEffect, useRef, useState } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
  id: number;
}

const CyberpunkCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [glitchActive, setGlitchActive] = useState(false);
  const idCounter = useRef(0);
  const lastMoveTime = useRef(Date.now());
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastPositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const deltaTime = now - lastMoveTime.current;
      
      // Calculate velocity
      const dx = e.clientX - lastPositionRef.current.x;
      const dy = e.clientY - lastPositionRef.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);
      
      velocityRef.current = { x: dx, y: dy };
      lastPositionRef.current = { x: e.clientX, y: e.clientY };
      lastMoveTime.current = now;

      setPosition({ x: e.clientX, y: e.clientY });

      // Add trail points when moving fast (speed boost effect)
      if (speed > 5 && deltaTime > 10) {
        idCounter.current++;
        setTrail(prev => [
          ...prev.slice(-12), // Keep last 12 trail points
          { x: e.clientX, y: e.clientY, timestamp: now, id: idCounter.current }
        ]);
      }
    };

    const handleMouseDown = () => {
      setIsClicking(true);
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 100);
    };

    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, textarea, select')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    // Clean up old trail points
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setTrail(prev => prev.filter(point => now - point.timestamp < 200));
    }, 50);

    // Random glitch effect when idle
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 50);
      }
    }, 500);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);

    // Hide default cursor
    document.body.style.cursor = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      clearInterval(cleanupInterval);
      clearInterval(glitchInterval);
      document.body.style.cursor = 'auto';
    };
  }, []);

  // Don't render on mobile/touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Trail effect - afterimage/motion blur */}
      {trail.map((point, index) => {
        const age = Date.now() - point.timestamp;
        const opacity = Math.max(0, 1 - age / 200) * 0.6;
        const scale = 0.3 + (index / trail.length) * 0.5;
        
        return (
          <div
            key={point.id}
            className="absolute rounded-full"
            style={{
              left: point.x,
              top: point.y,
              width: 8,
              height: 8,
              transform: `translate(-50%, -50%) scale(${scale})`,
              background: `radial-gradient(circle, hsl(180 100% 60% / ${opacity}) 0%, transparent 70%)`,
              boxShadow: `0 0 ${10 * opacity}px hsl(180 100% 60% / ${opacity * 0.8})`,
            }}
          />
        );
      })}

      {/* Main cursor - crosshair style */}
      <div
        className="absolute"
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%) ${glitchActive ? `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)` : ''}`,
          transition: glitchActive ? 'none' : 'transform 0.02s ease-out',
        }}
      >
        {/* Outer ring */}
        <div
          className={`absolute rounded-full border-2 transition-all duration-150 ${
            isHovering ? 'scale-150' : 'scale-100'
          }`}
          style={{
            width: isClicking ? 24 : 28,
            height: isClicking ? 24 : 28,
            borderColor: isClicking ? 'hsl(300, 100%, 60%)' : 'hsl(180, 100%, 50%)',
            boxShadow: isClicking 
              ? '0 0 15px hsl(300 100% 60%), 0 0 30px hsl(300 100% 60% / 0.5), inset 0 0 10px hsl(300 100% 60% / 0.3)'
              : '0 0 10px hsl(180 100% 60%), 0 0 20px hsl(180 100% 60% / 0.4)',
            transform: 'translate(-50%, -50%)',
            animation: isClicking ? 'cursorPulse 0.15s ease-out' : 'none',
          }}
        />

        {/* Inner dot - energy core */}
        <div
          className="absolute rounded-full"
          style={{
            width: isClicking ? 8 : 6,
            height: isClicking ? 8 : 6,
            background: isClicking 
              ? 'radial-gradient(circle, hsl(300, 100%, 70%) 0%, hsl(300, 100%, 50%) 100%)'
              : 'radial-gradient(circle, hsl(180, 100%, 70%) 0%, hsl(180, 100%, 50%) 100%)',
            boxShadow: isClicking
              ? '0 0 10px hsl(300 100% 60%), 0 0 20px hsl(300 100% 60% / 0.6)'
              : '0 0 8px hsl(180 100% 60%), 0 0 15px hsl(180 100% 60% / 0.5)',
            transform: 'translate(-50%, -50%)',
            animation: 'cursorCorePulse 1.5s ease-in-out infinite',
          }}
        />

        {/* Crosshair lines */}
        <div className="absolute" style={{ transform: 'translate(-50%, -50%)' }}>
          {/* Top line */}
          <div
            className="absolute"
            style={{
              width: 2,
              height: isHovering ? 12 : 8,
              background: 'linear-gradient(to top, hsl(180 100% 60%), transparent)',
              left: -1,
              top: isHovering ? -22 : -16,
              boxShadow: '0 0 4px hsl(180 100% 60%)',
            }}
          />
          {/* Bottom line */}
          <div
            className="absolute"
            style={{
              width: 2,
              height: isHovering ? 12 : 8,
              background: 'linear-gradient(to bottom, hsl(180 100% 60%), transparent)',
              left: -1,
              bottom: isHovering ? -22 : -16,
              boxShadow: '0 0 4px hsl(180 100% 60%)',
            }}
          />
          {/* Left line */}
          <div
            className="absolute"
            style={{
              width: isHovering ? 12 : 8,
              height: 2,
              background: 'linear-gradient(to left, hsl(180 100% 60%), transparent)',
              left: isHovering ? -22 : -16,
              top: -1,
              boxShadow: '0 0 4px hsl(180 100% 60%)',
            }}
          />
          {/* Right line */}
          <div
            className="absolute"
            style={{
              width: isHovering ? 12 : 8,
              height: 2,
              background: 'linear-gradient(to right, hsl(180 100% 60%), transparent)',
              right: isHovering ? -22 : -16,
              top: -1,
              boxShadow: '0 0 4px hsl(180 100% 60%)',
            }}
          />
        </div>

        {/* Glitch effect fragments */}
        {glitchActive && (
          <>
            <div
              className="absolute rounded-full"
              style={{
                width: 28,
                height: 28,
                border: '1px solid hsl(0 100% 60%)',
                transform: `translate(${-50 + Math.random() * 6 - 3}%, ${-50 + Math.random() * 6 - 3}%)`,
                opacity: 0.7,
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: 28,
                height: 28,
                border: '1px solid hsl(120 100% 60%)',
                transform: `translate(${-50 + Math.random() * 6 - 3}%, ${-50 + Math.random() * 6 - 3}%)`,
                opacity: 0.7,
              }}
            />
          </>
        )}
      </div>

      {/* Cursor animations */}
      <style>{`
        @keyframes cursorPulse {
          0% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.3); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
        
        @keyframes cursorCorePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default CyberpunkCursor;
