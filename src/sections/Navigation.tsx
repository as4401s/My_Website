import { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#skills', label: 'Expertise' },
  { href: '#publications', label: 'Research' },
  { href: '#lab', label: 'AI Lab' },
  { href: '#blog', label: 'Writing' },
  { href: '#hobbies', label: 'Beyond work' },
];

export default function Navigation() {
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [active, setActive] = useState('#about');

  useEffect(() => {
    const update = () => {
      setIsScrolled(window.scrollY > 24);
      const current = [...navLinks].reverse().find(link => {
        const section = document.getElementById(link.href.slice(1));
        return section && section.getBoundingClientRect().top <= 180;
      });
      if (current) setActive(current.href);
    };
    let frame = 0;
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(() => { update(); frame = 0; });
    };
    update();
    window.addEventListener('scroll', scroll, { passive: true });
    return () => { window.removeEventListener('scroll', scroll); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [isMobileMenuOpen]);

  return (
    <nav aria-label="Main navigation" className={`site-nav ${isScrolled || isMobileMenuOpen ? 'is-scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#about" className="nav-wordmark" aria-label="Arjun Sarkar, home">as<span>.</span></a>
        <div className="desktop-links">{navLinks.map(link => <a key={link.href} href={link.href} aria-current={active === link.href ? 'location' : undefined}>{link.label}</a>)}</div>
        <a href="mailto:arjun.sarkar786@gmail.com" className="nav-contact">Get in touch <ArrowUpRight size={15} /></a>
        <button onClick={() => setIsMobileMenuOpen(value => !value)} className="mobile-menu-toggle" ref={menuButtonRef} aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={isMobileMenuOpen} aria-controls="mobile-navigation">{isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
      <div id="mobile-navigation" inert={!isMobileMenuOpen} className={`mobile-navigation ${isMobileMenuOpen ? 'is-open' : ''}`}>
        {navLinks.map(link => <a key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} aria-current={active === link.href ? 'location' : undefined}>{link.label}<ArrowUpRight size={16} /></a>)}
      </div>
    </nav>
  );
}
