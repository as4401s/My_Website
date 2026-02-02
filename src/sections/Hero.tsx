import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Linkedin, Github, BookOpen, ExternalLink, Send } from 'lucide-react';

const socialLinks = [
  { icon: Linkedin, href: 'https://www.linkedin.com/in/arjun-sarkar-9a051777/', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com/as4401s', label: 'GitHub' },
  { icon: BookOpen, href: 'https://arjun-sarkar786.medium.com/', label: 'Medium' },
  { icon: ExternalLink, href: 'https://orcid.org/0000-0001-8835-8020', label: 'ORCID' },
];

export default function Hero() {
  const typingRef = useRef<HTMLSpanElement>(null);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Location badge animation
      gsap.fromTo(
        '.hero-badge',
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'expo.out', delay: 0.4 }
      );

      // Hi, I'm text
      gsap.fromTo(
        '.hero-greeting',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', delay: 0.5 }
      );

      // Name gradient reveal
      gsap.fromTo(
        '.hero-name',
        { opacity: 0, clipPath: 'circle(0% at 50% 50%)' },
        { opacity: 1, clipPath: 'circle(100% at 50% 50%)', duration: 1, ease: 'expo.out', delay: 0.9 }
      );

      // Description
      gsap.fromTo(
        '.hero-description',
        { opacity: 0, filter: 'blur(10px)' },
        { opacity: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power2.out', delay: 2 }
      );

      // Social icons
      gsap.fromTo(
        '.social-icon',
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)', stagger: 0.08, delay: 2.2 }
      );

      // Profile image
      gsap.fromTo(
        '.profile-image-container',
        { opacity: 0, clipPath: 'circle(0% at 50% 50%)' },
        { opacity: 1, clipPath: 'circle(100% at 50% 50%)', duration: 1, ease: 'expo.out', delay: 0.8 }
      );

      // Profile glow
      gsap.fromTo(
        '.profile-glow',
        { opacity: 0 },
        { opacity: 0.75, duration: 0.6, ease: 'power2.out', delay: 1.6 }
      );
    });

    return () => ctx.revert();
  }, []);

  // Typing effect
  useEffect(() => {
    const text = 'AI Data Scientist';
    const element = typingRef.current;
    if (!element) return;

    let index = 0;
    element.textContent = '';

    const type = () => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(type, 100);
      } else {
        setIsTypingComplete(true);
      }
    };

    const timeout = setTimeout(type, 1400);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center pt-20 pb-12 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text Content */}
          <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
            {/* Location Badge */}
            <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-brand-accent text-sm font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Based in Germany 🇩🇪
            </div>

            {/* Headline */}
            <h1 className="space-y-2">
              <span className="hero-greeting block text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-gray-300">
                Hi, I'm
              </span>
              <span className="hero-name block text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-gradient">
                Arjun Sarkar.
              </span>
            </h1>

            {/* Typing Effect */}
            <p className="text-xl sm:text-2xl lg:text-3xl text-gray-400 font-light">
              <span ref={typingRef} className="text-brand-accent" />
              {!isTypingComplete && <span className="animate-blink text-brand-accent">|</span>}
            </p>

            {/* Description */}
            <p className="hero-description text-gray-400 leading-relaxed max-w-lg mx-auto lg:mx-0 text-base sm:text-lg">
              Specializing in <span className="text-white font-medium">Deep Learning</span>,{' '}
              <span className="text-white font-medium">Computer Vision</span>,{' '}
              <span className="text-white font-medium">LLM</span>, and{' '}
              <span className="text-white font-medium">AI Agents</span>. Turning complex data
              into actionable insights using the power of AI.
            </p>

            {/* Social Links */}
            <div className="flex gap-4 justify-center lg:justify-start pt-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon group p-3 rounded-full glass-card transition-all duration-250 hover:scale-110 hover:bg-brand-accent/15 hover:border-brand-accent/50"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-brand-accent transition-colors" />
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <a
                href="#experience"
                className="px-6 py-3 rounded-full bg-brand-accent text-white font-medium transition-all duration-300 hover:bg-brand-accent/90 hover:scale-105 hover:shadow-lg hover:shadow-brand-accent/25 text-center"
              >
                View My Work
              </a>
              <a
                href="mailto:arjun.sarkar786@gmail.com"
                className="px-6 py-3 rounded-full glass-card text-white font-medium transition-all duration-300 hover:bg-white/5 hover:border-brand-accent/30 flex items-center justify-center gap-2 group"
              >
                <Send className="w-4 h-4 text-gray-400 group-hover:text-brand-accent transition-colors" />
                <span>Contact Me</span>
              </a>
            </div>
          </div>

          {/* Profile Image */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              {/* Glow Effect */}
              <div className="profile-glow absolute inset-0 bg-gradient-to-tr from-brand-accent to-brand-purple rounded-full opacity-0 blur-3xl animate-pulse-glow" />
              
              {/* Image Container */}
              <div className="profile-image-container relative w-full h-full">
                <img
                  src="/1.webp"
                  alt="Arjun Sarkar"
                  className="w-full h-full object-cover rounded-full border-4 border-white/10 shadow-2xl transition-all duration-400 hover:scale-103 hover:border-white/20"
                />
                
                {/* Orbiting Elements */}
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-brand-accent/20 rounded-full flex items-center justify-center animate-float">
                  <span className="text-lg">🤖</span>
                </div>
                <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-brand-purple/20 rounded-full flex items-center justify-center animate-float animation-delay-2000">
                  <span className="text-lg">🧠</span>
                </div>
                <div className="absolute top-1/2 -right-6 w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center animate-float animation-delay-4000">
                  <span className="text-lg">📊</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-gray-500">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-brand-accent rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
