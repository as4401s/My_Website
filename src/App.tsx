import { useEffect, useState, Suspense, lazy } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import ScrollProgress from './components/ScrollProgress';

// Lazy load non-critical components to improve initial load time
const Experience = lazy(() => import('./sections/Experience'));
const Skills = lazy(() => import('./sections/Skills'));
const Publications = lazy(() => import('./sections/Publications'));
const Hobbies = lazy(() => import('./sections/Hobbies'));
const Lab = lazy(() => import('./sections/Lab'));
const Footer = lazy(() => import('./sections/Footer'));
const ParticleBackground = lazy(() => import('./components/ParticleBackground'));

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    // Detect mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Smooth scroll behavior
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        e.preventDefault();
        const id = anchor.getAttribute('href')?.slice(1);
        if (id) {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-brand-dark text-brand-text overflow-x-hidden">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Particle Background */}
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>

      {/* Animated Gradient Background - Performance friendly */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-mesh animate-gradient-shift opacity-40" />
        <div className="absolute inset-0 bg-grid opacity-[0.12]" />
        <div className="absolute inset-0 bg-grain opacity-[0.18]" />
        <div className={`absolute top-0 left-1/4 w-96 h-96 bg-brand-accent/20 rounded-full mix-blend-screen filter ${isMobile ? 'blur-[32px]' : 'blur-[64px]'} ${isMobile ? '' : 'animate-blob'}`} />
        <div className={`absolute top-10 right-1/4 w-96 h-96 bg-brand-purple/20 rounded-full mix-blend-screen filter ${isMobile ? 'blur-[32px]' : 'blur-[64px]'} ${isMobile ? '' : 'animate-blob animation-delay-2000'}`} />
        <div className={`absolute -bottom-32 left-1/3 w-96 h-96 bg-teal-900/20 rounded-full mix-blend-screen filter ${isMobile ? 'blur-[32px]' : 'blur-[64px]'} ${isMobile ? '' : 'animate-blob animation-delay-4000'}`} />
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="relative z-10">
        <Hero />
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div></div>}>
          <Experience />
          <Skills />
          <Publications />
          <Hobbies />
          <Lab />
        </Suspense>
      </main>

      {/* Footer */}
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;
