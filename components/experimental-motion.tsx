"use client";

export function ExperimentalMotion() {
  return (
    <>
      {/* Animated film grain texture */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Ambient background light layers */}
      <div data-motion-ambient className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        {/* Cursor-tracking orb */}
        <div
          data-motion-cursor
          className="hidden h-64 w-64 rounded-full bg-accent/12 blur-[80px] md:block"
          style={{ position: "absolute" }}
        />
        {/* Drifting glow nodes */}
        <div data-motion-pulse className="absolute left-[8%]  top-[15%]  h-[420px] w-[420px] rounded-full bg-accent/8  blur-[110px]" />
        <div data-motion-pulse className="absolute right-[5%] bottom-[12%] h-[380px] w-[380px] rounded-full bg-white/6  blur-[90px]" />
        <div data-motion-pulse className="absolute left-[45%] top-[55%]   h-[280px] w-[280px] rounded-full bg-accent/6  blur-[100px]" />
        <div data-motion-pulse className="absolute right-[30%] top-[8%]   h-[220px] w-[220px] rounded-full bg-white/4  blur-[80px]" />
      </div>
    </>
  );
}

