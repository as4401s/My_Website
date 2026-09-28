import { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
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
const Blog = lazy(() => import('./sections/Blog'));
const Footer = lazy(() => import('./sections/Footer'));

// New Pages
const ChessGame = lazy(() => import('./pages/ChessGame'));
const TravelMap = lazy(() => import('./pages/TravelMap'));

gsap.registerPlugin(ScrollTrigger);

function Home() {
  return (
    <div className="portfolio-home">
      <Hero />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div></div>}>
        <Experience />
        <Skills />
        <Publications />
        <Lab />
        <Blog />
        <Hobbies />
      </Suspense>
    </div>
  );
}

function App() {
  const location = useLocation();

  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'Arjun Sarkar - AI Data Scientist',
      '/chess': 'Play Chess | Arjun Sarkar',
      '/travel': 'Explore the World | Arjun Sarkar',
    };
    document.title = titles[location.pathname] || 'Page not found | Arjun Sarkar';
    if (!location.hash) window.scrollTo(0, 0);
    else {
      const scrollToHash = () => {
        const target = document.getElementById(location.hash.slice(1));
        if (target) { target.scrollIntoView(); return true; }
        return false;
      };
      if (scrollToHash()) return;
      const observer = new MutationObserver(() => { if (scrollToHash()) observer.disconnect(); });
      observer.observe(document.body, { childList: true, subtree: true });
      return () => observer.disconnect();
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="relative min-h-screen bg-brand-dark text-brand-text overflow-x-hidden">
      {/* Scroll Progress Indicator ONLY on the main page */}
      {location.pathname === '/' && <ScrollProgress />}

      {/* Navigation Layer - Hidden on full-screen pages */}
      {location.pathname === '/' && <Navigation />}

      {/* Main Routing Layer */}
      <a href="#main-content" className="skip-link">Skip to content</a>
      <main id="main-content" tabIndex={-1} className="relative z-10">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div></div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chess" element={<ChessGame />} />
            <Route path="/travel" element={<TravelMap />} />
            <Route path="*" element={
              <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-6">
                <p className="font-mono text-brand-accent">404</p>
                <h1 className="text-4xl font-display font-bold">Page not found</h1>
                <p className="text-gray-400">This address doesn’t lead to a page. Explore the portfolio instead.</p>
                <Link to="/" className="rounded-xl bg-brand-accent px-6 py-3 text-brand-dark font-semibold">Back to portfolio</Link>
              </div>
            } />
          </Routes>
        </Suspense>
      </main>

      {/* Footer - Hidden on full-screen pages */}
      {location.pathname === '/' && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
    </div>
  );
}

export default App;
