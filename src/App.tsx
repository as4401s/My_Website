import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import Experience from './sections/Experience';
import Skills from './sections/Skills';
import Publications from './sections/Publications';
import Hobbies from './sections/Hobbies';
import Lab from './sections/Lab';
import Footer from './sections/Footer';
import ParticleBackground from './components/ParticleBackground';
import ScrollProgress from './components/ScrollProgress';

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
    <div className="relative min-h-screen bg-[#050505] text-[#e5e5e5] overflow-x-hidden">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Animated Gradient Background - Performance friendly */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-mesh animate-gradient-shift opacity-30" />
        <div className={`absolute top-0 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full mix-blend-screen filter ${isMobile ? 'blur-[40px]' : 'blur-[128px]'} ${isMobile ? '' : 'animate-blob'}`} />
        <div className={`absolute top-0 right-1/4 w-96 h-96 bg-purple-900/20 rounded-full mix-blend-screen filter ${isMobile ? 'blur-[40px]' : 'blur-[128px]'} ${isMobile ? '' : 'animate-blob animation-delay-2000'}`} />
        <div className={`absolute -bottom-32 left-1/3 w-96 h-96 bg-indigo-900/20 rounded-full mix-blend-screen filter ${isMobile ? 'blur-[40px]' : 'blur-[128px]'} ${isMobile ? '' : 'animate-blob animation-delay-4000'}`} />
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="relative z-10">
        <Hero />
        <Experience />
        <Skills />
        <Publications />
        <Hobbies />
        <Lab />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
