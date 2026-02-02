import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, FileText, Microscope, Brain, BookOpen } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const publications = [
  {
    id: 1,
    title: 'Rapid detection of microbial antibiotic susceptibility via Deep Learning',
    journal: 'Sensors and Actuators B',
    year: '2025',
    doi: 'https://doi.org/10.1016/j.snb.2024.136866',
    description: 'Deep Learning supported analysis of angle resolved scattered-light images of picoliter droplet cultivations.',
    icon: Microscope,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 2,
    title: 'Neutrophil activation phenotypes in ex vivo human Candida blood infections',
    journal: 'Comp. & Struct. Biotech.',
    year: '2024',
    doi: 'https://doi.org/10.1016/j.csbj.2024.03.006',
    description: 'Deep learning-based characterization of immune response phenotypes.',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 3,
    title: 'Explainable AI and its applications in healthcare',
    journal: 'Springer',
    year: '2022',
    doi: 'https://doi.org/10.1007/978-3-031-12807-3_6',
    description: 'Chapter in "Explainable AI: Foundations, Methodologies and Applications".',
    icon: BookOpen,
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 4,
    title: 'Identification of COVID-19 from Chest X-rays',
    journal: 'SN Computer Science',
    year: '2021',
    doi: 'https://doi.org/10.1007/s42979-021-00496-w',
    description: 'Comparing Cognex VisionPro Deep Learning software with open source convolutional neural networks.',
    icon: FileText,
    color: 'from-green-500 to-emerald-500',
  },
];

export default function Publications() {
  const sectionRef = useRef<HTMLElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section title animation
      const titleTrigger = ScrollTrigger.create({
        trigger: '.publications-title',
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            '.publications-title',
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }
          );
        },
        once: true,
      });
      triggersRef.current.push(titleTrigger);

      // Publication cards animation
      publications.forEach((_, index) => {
        const trigger = ScrollTrigger.create({
          trigger: `.publication-card-${index}`,
          start: 'top 80%',
          onEnter: () => {
            gsap.fromTo(
              `.publication-card-${index}`,
              { opacity: 0, y: 80, rotateX: 15 },
              { 
                opacity: 1, 
                y: 0, 
                rotateX: 0,
                duration: 0.7, 
                ease: 'expo.out',
                delay: index * 0.13 
              }
            );
          },
          once: true,
        });
        triggersRef.current.push(trigger);
      });
    }, sectionRef);

    return () => {
      triggersRef.current.forEach(trigger => trigger.kill());
      triggersRef.current = [];
      ctx.revert();
    };
  }, []);

  // 3D tilt effect on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / centerY * -8;
    const rotateY = (x - centerX) / centerX * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
  };

  const handleMouseLeave = (index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;

    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    setHoveredCard(null);
  };

  return (
    <section
      id="publications"
      ref={sectionRef}
      className="py-24 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2 className="publications-title text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-12 text-center opacity-0">
          Selected <span className="text-gradient">Publications</span>
        </h2>

        {/* Publications Grid */}
        <div className="grid md:grid-cols-2 gap-6 perspective-1000">
          {publications.map((pub, index) => {
            const Icon = pub.icon;
            const isHovered = hoveredCard === index;

            return (
              <a
                key={pub.id}
                ref={(el) => { cardRefs.current[index] = el; }}
                href={pub.doi}
                target="_blank"
                rel="noopener noreferrer"
                className={`publication-card-${index} glass-card p-8 rounded-2xl group transition-all duration-300 preserve-3d opacity-0 ${
                  isHovered ? 'border-brand-accent/50 shadow-xl shadow-brand-accent/10' : ''
                }`}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => handleMouseLeave(index)}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${pub.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-brand-accent block">
                        {pub.year}
                      </span>
                      <span className="text-xs text-gray-500">
                        {pub.journal}
                      </span>
                    </div>
                  </div>
                  <ExternalLink 
                    className={`w-5 h-5 transition-all duration-200 ${
                      isHovered ? 'text-brand-accent translate-x-1 -translate-y-1' : 'text-gray-600'
                    }`} 
                  />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-100 mb-3 group-hover:text-brand-accent transition-colors duration-300 line-clamp-2">
                  {pub.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                  {pub.description}
                </p>

                {/* Shine Effect */}
                <div 
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                />
              </a>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <a
            href="https://scholar.google.com/citations?user=9Inbti0AAAAJ"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-accent transition-colors duration-300 group"
          >
            <span>View all publications on Google Scholar</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
