/**
 * Ambient Cyberpunk Overlay
 * Adds subtle HUD elements, particles, and decorative details
 * Non-destructive layer that sits on top of existing content
 */

const AmbientOverlay = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {/* HUD Corner Elements */}
      <div className="absolute top-4 left-4 opacity-[0.06]">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M0 20 L0 0 L20 0" stroke="hsl(270 60% 60%)" strokeWidth="1" />
          <path d="M10 30 L10 10 L30 10" stroke="hsl(200 80% 60%)" strokeWidth="0.5" />
        </svg>
      </div>
      <div className="absolute top-4 right-4 opacity-[0.06]">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M80 20 L80 0 L60 0" stroke="hsl(270 60% 60%)" strokeWidth="1" />
          <path d="M70 30 L70 10 L50 10" stroke="hsl(200 80% 60%)" strokeWidth="0.5" />
        </svg>
      </div>
      <div className="absolute bottom-4 left-4 opacity-[0.06]">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M0 60 L0 80 L20 80" stroke="hsl(270 60% 60%)" strokeWidth="1" />
          <path d="M10 50 L10 70 L30 70" stroke="hsl(0 60% 50%)" strokeWidth="0.5" />
        </svg>
      </div>
      <div className="absolute bottom-4 right-4 opacity-[0.06]">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M80 60 L80 80 L60 80" stroke="hsl(270 60% 60%)" strokeWidth="1" />
          <path d="M70 50 L70 70 L50 70" stroke="hsl(0 60% 50%)" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Subtle HUD Lines */}
      <div className="absolute top-1/4 left-0 w-20 h-px bg-gradient-to-r from-transparent via-[hsl(270_60%_60%_/_0.08)] to-transparent" />
      <div className="absolute top-1/3 right-0 w-32 h-px bg-gradient-to-l from-transparent via-[hsl(200_80%_60%_/_0.06)] to-transparent" />
      <div className="absolute bottom-1/4 left-0 w-24 h-px bg-gradient-to-r from-transparent via-[hsl(0_60%_50%_/_0.05)] to-transparent" />
      <div className="absolute bottom-1/3 right-0 w-16 h-px bg-gradient-to-l from-transparent via-[hsl(270_60%_60%_/_0.07)] to-transparent" />

      {/* Small Decorative System Text */}
      <div className="absolute top-[15%] right-8 font-mono text-[8px] text-[hsl(270_60%_60%_/_0.08)] tracking-widest">
        SYS::ACTIVE
      </div>
      <div className="absolute top-[20%] left-8 font-mono text-[8px] text-[hsl(200_80%_60%_/_0.06)] tracking-widest">
        &lt;/node_01&gt;
      </div>
      <div className="absolute bottom-[18%] left-12 font-mono text-[8px] text-[hsl(0_60%_50%_/_0.06)] tracking-widest">
        ERR::NULL
      </div>
      <div className="absolute bottom-[22%] right-12 font-mono text-[8px] text-[hsl(270_60%_60%_/_0.07)] tracking-widest">
        //STANDBY
      </div>

      {/* Micro Particles - Static */}
      <div className="absolute top-[10%] left-[20%] w-1 h-1 rounded-full bg-[hsl(270_60%_60%_/_0.05)]" />
      <div className="absolute top-[25%] right-[15%] w-0.5 h-0.5 rounded-full bg-[hsl(200_80%_60%_/_0.04)]" />
      <div className="absolute top-[40%] left-[10%] w-0.5 h-0.5 rounded-full bg-[hsl(0_60%_50%_/_0.04)]" />
      <div className="absolute bottom-[30%] right-[25%] w-1 h-1 rounded-full bg-[hsl(270_60%_60%_/_0.05)]" />
      <div className="absolute bottom-[45%] left-[30%] w-0.5 h-0.5 rounded-full bg-[hsl(200_80%_60%_/_0.03)]" />
      <div className="absolute top-[60%] right-[40%] w-0.5 h-0.5 rounded-full bg-[hsl(0_60%_50%_/_0.04)]" />
      <div className="absolute bottom-[15%] left-[45%] w-1 h-1 rounded-full bg-[hsl(270_60%_60%_/_0.04)]" />
      <div className="absolute top-[80%] right-[60%] w-0.5 h-0.5 rounded-full bg-[hsl(200_80%_60%_/_0.03)]" />

      {/* Foreground Depth - Blurred Abstract Shapes */}
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-[hsl(270_50%_20%_/_0.03)] blur-3xl" />
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[hsl(0_50%_20%_/_0.02)] blur-3xl" />
      <div className="absolute top-1/2 -left-16 w-24 h-48 bg-[hsl(200_40%_15%_/_0.02)] blur-2xl transform -rotate-12" />

      {/* Circuit Pattern - Very Subtle */}
      <svg className="absolute bottom-[10%] left-[5%] opacity-[0.04]" width="60" height="60" viewBox="0 0 60 60" fill="none">
        <path d="M10 30 H30 V10" stroke="hsl(270 60% 60%)" strokeWidth="0.5" />
        <circle cx="30" cy="10" r="2" fill="hsl(270 60% 60%)" />
        <circle cx="10" cy="30" r="2" fill="hsl(270 60% 60%)" />
      </svg>
      <svg className="absolute top-[12%] right-[8%] opacity-[0.03]" width="50" height="50" viewBox="0 0 50 50" fill="none">
        <path d="M40 25 H25 V40" stroke="hsl(200 80% 60%)" strokeWidth="0.5" />
        <circle cx="25" cy="40" r="2" fill="hsl(200 80% 60%)" />
        <circle cx="40" cy="25" r="2" fill="hsl(200 80% 60%)" />
      </svg>

      {/* Scan Indicator */}
      <div className="absolute top-[5%] left-1/2 -translate-x-1/2 opacity-[0.05]">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 border border-[hsl(270_60%_60%)] rounded-full" />
          <div className="w-8 h-px bg-[hsl(270_60%_60%)]" />
          <div className="font-mono text-[6px] text-[hsl(270_60%_60%)]">SCAN</div>
          <div className="w-8 h-px bg-[hsl(270_60%_60%)]" />
          <div className="w-2 h-2 border border-[hsl(270_60%_60%)] rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default AmbientOverlay;
