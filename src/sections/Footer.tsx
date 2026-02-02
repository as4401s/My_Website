import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin, Github, Mail, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  { icon: Linkedin, href: 'https://www.linkedin.com/in/arjun-sarkar-9a051777/', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com/as4401s', label: 'GitHub' },
  { icon: Mail, href: 'mailto:arjun.sarkar786@gmail.com', label: 'Email' },
];

export default function Footer() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '.footer-content',
        start: 'top 90%',
        onEnter: () => {
          // Border animation
          gsap.fromTo(
            '.footer-border',
            { scaleX: 0 },
            { scaleX: 1, duration: 0.8, ease: 'expo.out' }
          );

          // Social icons
          gsap.fromTo(
            '.footer-social',
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)', stagger: 0.1, delay: 0.2 }
          );

          // Copyright
          gsap.fromTo(
            '.footer-copyright',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.5 }
          );
        },
        once: true,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <footer className="py-12 relative">
      {/* Top Border */}
      <div className="footer-border absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent origin-center" />

      <div className="footer-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8">
          {/* Social Links */}
          <div className="flex items-center gap-6">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target={social.href.startsWith('mailto') ? undefined : '_blank'}
                rel={social.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                className="footer-social group p-3 rounded-full glass-card transition-all duration-250 hover:scale-120 hover:bg-brand-accent/15 hover:border-brand-accent/50 hover:-translate-y-1"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5 text-gray-400 group-hover:text-brand-accent transition-colors" />
              </a>
            ))}
          </div>

          {/* Quick Links */}
          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#about" className="text-gray-500 hover:text-brand-accent transition-colors duration-200">
              About
            </a>
            <a href="#experience" className="text-gray-500 hover:text-brand-accent transition-colors duration-200">
              Experience
            </a>
            <a href="#skills" className="text-gray-500 hover:text-brand-accent transition-colors duration-200">
              Skills
            </a>
            <a href="#publications" className="text-gray-500 hover:text-brand-accent transition-colors duration-200">
              Publications
            </a>
            <a href="#hobbies" className="text-gray-500 hover:text-brand-accent transition-colors duration-200">
              Hobbies
            </a>
          </nav>

          {/* Copyright */}
          <div className="footer-copyright text-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Arjun Sarkar. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs mt-2 flex items-center justify-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" /> in Germany
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
