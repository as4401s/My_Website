import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-brand-accent via-brand-purple to-brand-accent transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        >
          {/* Glow effect */}
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-brand-accent/60 to-transparent blur-sm" />
        </div>
      </div>

      {/* Percentage Indicator (optional, shows on scroll) */}
      {progress > 5 && (
        <div className="fixed top-4 right-4 z-50 pointer-events-none">
          <div className="glass-card px-3 py-1.5 rounded-full flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            <span className="text-xs font-mono text-brand-accent font-bold">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      )}
    </>
  );
}
