import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Camera, Plane, Gamepad2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const hobbies = [
  {
    id: 1,
    title: 'Chess',
    icon: Gamepad2,
    emoji: '♟️',
    description: 'Strategizing on the 64 squares. It keeps the mind sharp for algorithmic challenges.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 2,
    title: 'Photography',
    icon: Camera,
    emoji: '📸',
    description: 'Capturing moments and perspectives. Finding patterns in the chaos of the real world.',
    link: 'https://ourtravelphotobook.netlify.app/#home',
    linkLabel: 'Explore my visual journey 🌍',
    color: 'from-rose-500 to-pink-500',
  },
  {
    id: 3,
    title: 'Travelling',
    icon: Plane,
    emoji: '✈️',
    description: 'Exploring new cultures and landscapes. Every journey brings a new dataset of experiences.',
    color: 'from-teal-500 to-cyan-500',
  },
];

export default function Hobbies() {
  const sectionRef = useRef<HTMLElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    if (window.innerWidth < 768) return;
    const ctx = gsap.context(() => {
      // Section title animation
      const titleTrigger = ScrollTrigger.create({
        trigger: '.hobbies-title',
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            '.hobbies-title',
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }
          );
        },
        once: true,
      });
      triggersRef.current.push(titleTrigger);

      // Hobby cards animation
      hobbies.forEach((_, index) => {
        const trigger = ScrollTrigger.create({
          trigger: `.hobby-card-${index}`,
          start: 'top 80%',
          onEnter: () => {
            gsap.fromTo(
              `.hobby-card-${index}`,
              { opacity: 0, scale: 0, rotation: index % 2 === 0 ? -180 : 180 },
              {
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 0.8,
                ease: 'expo.out',
                delay: index * 0.2
              }
            );
          },
          once: true,
        });
        triggersRef.current.push(trigger);
      });

      // Connecting lines animation
      const linesTrigger = ScrollTrigger.create({
        trigger: '.hobby-lines',
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            '.hobby-line',
            { strokeDashoffset: 200 },
            { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out', delay: 0.8 }
          );
        },
        once: true,
      });
      triggersRef.current.push(linesTrigger);
    }, sectionRef);

    return () => {
      triggersRef.current.forEach(trigger => trigger.kill());
      triggersRef.current = [];
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="hobbies"
      ref={sectionRef}
      className="py-24 bg-brand-gray/60 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2 className="hobbies-title text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-20 text-center md:opacity-0">
          Beyond the <span className="text-gradient">Code</span>
        </h2>

        {/* Hobbies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Lines SVG */}
          <svg
            className="hobby-lines absolute top-1/2 left-0 right-0 h-4 -translate-y-1/2 hidden md:block pointer-events-none z-0"
            style={{ width: '100%' }}
          >
            <line
              className="hobby-line"
              x1="16%"
              y1="50%"
              x2="50%"
              y2="50%"
              stroke="url(#hobby-gradient)"
              strokeWidth="2"
              strokeDasharray="200"
              strokeDashoffset="200"
            />
            <line
              className="hobby-line"
              x1="50%"
              y1="50%"
              x2="84%"
              y2="50%"
              stroke="url(#hobby-gradient)"
              strokeWidth="2"
              strokeDasharray="200"
              strokeDashoffset="200"
              style={{ animationDelay: '0.2s' }}
            />
            <defs>
              <linearGradient id="hobby-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
          </svg>

          {hobbies.map((hobby, index) => {
            return (
              <div
                key={hobby.id}
                className={`hobby-card-${index} relative z-10 md:opacity-0`}
              >
                <div className="glass-card p-8 rounded-2xl text-center transition-all duration-350 hover:scale-105 hover:border-brand-accent/50 hover:bg-brand-accent/5 hover:shadow-xl hover:shadow-brand-accent/10 group cursor-default">
                  {/* Icon Container */}
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${hobby.color} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <span className="text-4xl">{hobby.emoji}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-display font-bold mb-3 text-white group-hover:text-brand-accent transition-colors duration-300">
                    {hobby.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed mb-2">
                    {hobby.description}
                  </p>

                  {/* Optional External Link */}
                  {hobby.link && (
                    <a
                      href={hobby.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-semibold hover:bg-brand-accent/20 transition-all duration-300"
                    >
                      <span>{hobby.linkLabel}</span>
                    </a>
                  )}

                  {/* Decorative Element */}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-accent/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="hidden md:block absolute top-20 left-10 w-32 h-32 bg-brand-accent/5 rounded-full blur-3xl" />
      <div className="hidden md:block absolute bottom-20 right-10 w-40 h-40 bg-brand-purple/5 rounded-full blur-3xl" />
    </section>
  );
}
