import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowDown, ArrowUpRight, Github, Linkedin } from 'lucide-react';
import PortraitLens from '../components/PortraitLens';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.hero-enter', { y: 18, opacity: 0 }, {
        y: 0, opacity: 1, duration: .75, stagger: .08, ease: 'power3.out', clearProps: 'all',
      });
      gsap.fromTo('.hero-portrait', { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 1, delay: .15, ease: 'power3.out', clearProps: 'all',
      });
    }, sectionRef);
    return () => media.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="portfolio-hero">
      <div className="hero-inner">
        <div className="hero-heading">
          <div className="hero-enter hero-intro"><span className="eyebrow">AI DATA SCIENTIST</span><span className="hero-location">Based in Germany</span></div>
          <h1 className="hero-enter hero-name"><span>Dr.</span> Arjun <br />Sarkar<span className="name-period">.</span></h1>
          <p className="hero-enter hero-statement">Research-led thinking. <br /><span>Real-world intelligence.</span></p>
        </div>
        <div className="hero-portrait"><PortraitLens /></div>
        <div className="hero-details">
          <p className="hero-enter hero-description">I work at the intersection of deep learning, computer vision, and language models — turning complex data into useful AI.</p>
          <div className="hero-enter hero-actions">
            <a href="#experience" className="primary-action">Explore my work <ArrowUpRight size={18} /></a>
            <a href="mailto:arjun.sarkar786@gmail.com" className="secondary-action">Let’s connect <ArrowUpRight size={17} /></a>
          </div>
          <div className="hero-enter hero-socials">
            <a href="https://www.linkedin.com/in/arjun-sarkar-9a051777/" target="_blank" rel="noopener noreferrer"><Linkedin size={15} /> LinkedIn</a>
            <a href="https://github.com/as4401s" target="_blank" rel="noopener noreferrer"><Github size={15} /> GitHub</a>
            <a href="https://orcid.org/0000-0001-8835-8020" target="_blank" rel="noopener noreferrer">ORCID <ArrowUpRight size={14} /></a>
          </div>
        </div>
      </div>
      <div className="hero-bottom"><a href="#experience"><ArrowDown size={15} /> Discover more</a><span>DEEP LEARNING <i /> COMPUTER VISION <i /> LLMs & AGENTS</span><span className="hero-index">RESEARCH & APPLIED AI</span></div>
    </section>
  );
}
