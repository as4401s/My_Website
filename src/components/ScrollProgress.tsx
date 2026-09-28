import { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
      frame = 0;
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(scroll);
    observer.observe(document.body);
    window.addEventListener('scroll', scroll, { passive: true });
    update();
    return () => { window.removeEventListener('scroll', scroll); observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);
  return <div ref={progressRef} className="reading-progress" aria-hidden="true" />;
}
