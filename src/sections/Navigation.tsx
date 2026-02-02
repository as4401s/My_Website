import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { Menu, X, FlaskConical } from 'lucide-react';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#skills', label: 'Skills' },
  { href: '#publications', label: 'Publications' },
  { href: '#hobbies', label: 'Hobbies' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(
      '.nav-logo',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', delay: 0.1 }
    );

    gsap.fromTo(
      '.nav-link',
      { opacity: 0, y: -15 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out', stagger: 0.08, delay: 0.2 }
    );

    gsap.fromTo(
      '.nav-lab',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)', delay: 0.6 }
    );
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a
            href="#about"
            className="nav-logo font-display font-bold text-xl tracking-tighter transition-transform duration-300 hover:scale-105"
          >
            AS<span className="text-brand-accent">.</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link relative text-sm font-medium text-gray-400 hover:text-brand-accent transition-colors duration-250 group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-brand-accent transition-all duration-250 group-hover:w-full group-hover:left-0" />
              </a>
            ))}
            
            {/* Lab Link - Special Button */}
            <a
              href="#lab"
              className="nav-lab ml-4 px-4 py-2 rounded-full bg-gradient-to-r from-brand-accent to-brand-purple text-white text-sm font-medium flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-brand-accent/25"
            >
              <FlaskConical className="w-4 h-4" />
              <span>AI Lab</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white transition-colors p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-[#050505]/98 backdrop-blur-xl border-b border-white/10 transition-all duration-300 ${
          isMobileMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="px-4 py-4 space-y-2">
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-white/5 hover:text-brand-accent transition-all duration-200"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {link.label}
            </a>
          ))}
          
          {/* Mobile Lab Link */}
          <a
            href="#lab"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-4 py-3 rounded-lg text-base font-medium bg-gradient-to-r from-brand-accent/20 to-brand-purple/20 text-brand-accent border border-brand-accent/30"
          >
            <span className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5" />
              AI Lab
            </span>
          </a>
        </div>
      </div>
    </nav>
  );
}
