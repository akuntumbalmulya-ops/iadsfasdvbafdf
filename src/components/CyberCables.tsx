/**
 * CyberCables Component
 * Decorative cables that run from the landing embed to the footer
 * 3 cables: Red, Blue, Green
 */

const CyberCables = () => {
  return (
    <div className="cyber-cables-container">
      {/* Red Cable */}
      <svg className="cyber-cable cable-red" viewBox="0 0 100 2000" preserveAspectRatio="none">
        <defs>
          <linearGradient id="redGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(0 100% 60%)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="hsl(0 100% 50%)" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(0 100% 60%)" stopOpacity="0.8" />
          </linearGradient>
          <filter id="redBlur">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path 
          d="M25 0 Q35 200, 20 400 Q5 600, 30 800 Q45 1000, 15 1200 Q0 1400, 25 1600 Q40 1800, 25 2000"
          fill="none"
          stroke="url(#redGlow)"
          strokeWidth="3"
          filter="url(#redBlur)"
          className="cable-path"
        />
        <path 
          d="M25 0 Q35 200, 20 400 Q5 600, 30 800 Q45 1000, 15 1200 Q0 1400, 25 1600 Q40 1800, 25 2000"
          fill="none"
          stroke="hsl(0 100% 70%)"
          strokeWidth="1.5"
          className="cable-core"
        />
      </svg>

      {/* Blue Cable */}
      <svg className="cyber-cable cable-blue" viewBox="0 0 100 2000" preserveAspectRatio="none">
        <defs>
          <linearGradient id="blueGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(200 100% 60%)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="hsl(200 100% 50%)" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(200 100% 60%)" stopOpacity="0.8" />
          </linearGradient>
          <filter id="blueBlur">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path 
          d="M50 0 Q40 200, 55 400 Q70 600, 45 800 Q30 1000, 60 1200 Q75 1400, 50 1600 Q35 1800, 50 2000"
          fill="none"
          stroke="url(#blueGlow)"
          strokeWidth="3"
          filter="url(#blueBlur)"
          className="cable-path"
        />
        <path 
          d="M50 0 Q40 200, 55 400 Q70 600, 45 800 Q30 1000, 60 1200 Q75 1400, 50 1600 Q35 1800, 50 2000"
          fill="none"
          stroke="hsl(200 100% 70%)"
          strokeWidth="1.5"
          className="cable-core"
        />
      </svg>

      {/* Green Cable */}
      <svg className="cyber-cable cable-green" viewBox="0 0 100 2000" preserveAspectRatio="none">
        <defs>
          <linearGradient id="greenGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(120 100% 50%)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="hsl(120 100% 40%)" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(120 100% 50%)" stopOpacity="0.8" />
          </linearGradient>
          <filter id="greenBlur">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path 
          d="M75 0 Q65 200, 80 400 Q95 600, 70 800 Q55 1000, 85 1200 Q100 1400, 75 1600 Q60 1800, 75 2000"
          fill="none"
          stroke="url(#greenGlow)"
          strokeWidth="3"
          filter="url(#greenBlur)"
          className="cable-path"
        />
        <path 
          d="M75 0 Q65 200, 80 400 Q95 600, 70 800 Q55 1000, 85 1200 Q100 1400, 75 1600 Q60 1800, 75 2000"
          fill="none"
          stroke="hsl(120 100% 60%)"
          strokeWidth="1.5"
          className="cable-core"
        />
      </svg>
    </div>
  );
};

export default CyberCables;
