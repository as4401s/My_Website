import { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;

      if (progressRef.current) {
        progressRef.current.style.width = `${progress}%`;
      }

      if (textRef.current) {
        textRef.current.textContent = `${Math.round(progress)}%`;
      }

      if (containerRef.current) {
        if (progress > 5 && containerRef.current.classList.contains('hidden')) {
          containerRef.current.classList.remove('hidden');
        } else if (progress <= 5 && !containerRef.current.classList.contains('hidden')) {
          containerRef.current.classList.add('hidden');
        }
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateProgress(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-50 pointer-events-none">
        <div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-brand-accent via-brand-purple to-brand-accent transition-none"
          style={{ width: '0%' }}
        >
          {/* Glow effect */}
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-brand-accent/60 to-transparent blur-sm" />
        </div>
      </div>

      {/* Percentage Indicator */}
      <div ref={containerRef} className="fixed top-4 right-4 z-50 pointer-events-none hidden transition-opacity duration-300">
        <div className="glass-card px-3 py-1.5 rounded-full flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
          <span ref={textRef} className="text-xs font-mono text-brand-accent font-bold">
            0%
          </span>
        </div>
      </div>
    </>
  );
}
