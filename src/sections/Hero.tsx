import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowDown, ArrowUpRight, Github, Linkedin, Pause, Play } from 'lucide-react';
import NeuralSculpture from '../components/NeuralSculpture';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.hero-enter', { y: 22, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.09, ease: 'power3.out', clearProps: 'all',
      });
      gsap.fromTo('.hero-art', { opacity: 0, scale: 0.96 }, {
        opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out', clearProps: 'all',
      });
    }, sectionRef);
    return () => media.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="portfolio-hero">
      <div className="hero-atmosphere" aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-copy">
          <div className="hero-enter hero-intro">
            <img src="/1.webp" alt="Portrait of Dr. Arjun Sarkar" width="48" height="48" fetchPriority="high" />
            <div><span className="eyebrow">AI DATA SCIENTIST</span><span className="hero-location">Based in Germany</span></div>
          </div>
          <h1 className="hero-enter hero-name"><span>Dr.</span> Arjun<br />Sarkar<span className="name-period">.</span></h1>
          <p className="hero-enter hero-statement">Research-led thinking.<br /><span>Real-world intelligence.</span></p>
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
        <div className="hero-art">
          <div className="art-coordinate art-coordinate-top" aria-hidden="true"><span>DEEP LEARNING, VISUALIZED</span><span>FORWARD PASS</span></div>
          <NeuralSculpture paused={paused} />
          <div className="art-caption"><span><i /> Input → Hidden layers → Output</span><button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Play 3D animation' : 'Pause 3D animation'} aria-pressed={paused}>{paused ? <Play size={14} /> : <Pause size={14} />}</button></div>
        </div>
      </div>
      <div className="hero-bottom"><a href="#experience"><ArrowDown size={15} /> Discover more</a><span>DEEP LEARNING <i /> COMPUTER VISION <i /> LLMs & AGENTS</span><span className="hero-index">RESEARCH & APPLIED AI</span><button className="hero-mobile-pause" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Play 3D animation' : 'Pause 3D animation'} aria-pressed={paused}>{paused ? <Play size={14}/> : <Pause size={14}/>}<span>{paused ? 'Play motion' : 'Pause motion'}</span></button></div>
    </section>
  );
}
