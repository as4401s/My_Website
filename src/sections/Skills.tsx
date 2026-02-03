import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Code, Brain, Database, Cloud, Microscope, Cpu, GitBranch, Container, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const education = [
  {
    degree: 'Ph.D. Applied Systems Biology',
    institution: 'Leibniz-HKI & Uni Jena',
    period: '2021-2025',
    highlight: true,
  },
  {
    degree: 'M.Sc. Biomedical Engineering',
    institution: 'FH Aachen University',
    period: '2018-2021',
    highlight: false,
  },
  {
    degree: 'B.Tech. Biomedical Engineering',
    institution: 'JIS College of Engineering',
    period: '2010-2014',
    highlight: false,
  },
];

const techStack = [
  { name: 'Deep Learning', icon: Brain, category: 'ai', color: 'text-purple-400', proficiency: 95 },
  { name: 'LLM', icon: Brain, category: 'ai', color: 'text-purple-400', proficiency: 90 },
  { name: 'AI Agents', icon: Cpu, category: 'ai', color: 'text-purple-400', proficiency: 85 },
  { name: 'Python', icon: Code, category: 'language', color: 'text-blue-400', proficiency: 98 },
  { name: 'TensorFlow', icon: Brain, category: 'framework', color: 'text-orange-400', proficiency: 90 },
  { name: 'PyTorch', icon: Brain, category: 'framework', color: 'text-red-400', proficiency: 95 },
  { name: 'Keras', icon: Brain, category: 'framework', color: 'text-red-400', proficiency: 92 },
  { name: 'OpenCV', icon: Microscope, category: 'vision', color: 'text-green-400', proficiency: 88 },
  { name: 'Docker', icon: Container, category: 'tool', color: 'text-blue-400', proficiency: 85 },
  { name: 'AWS', icon: Cloud, category: 'cloud', color: 'text-yellow-400', proficiency: 80 },
  { name: 'Git', icon: GitBranch, category: 'tool', color: 'text-orange-400', proficiency: 90 },
  { name: 'MLflow', icon: Database, category: 'tool', color: 'text-blue-400', proficiency: 82 },
  { name: 'MCP', icon: Cpu, category: 'tool', color: 'text-gray-400', proficiency: 75 },
  { name: 'Raspberry Pi', icon: Cpu, category: 'hardware', color: 'text-red-400', proficiency: 78 },
];

const domains = [
  'Fine-tuning LLMs',
  'Financial Data Analysis',
  'Trading Analysis',
  'Medical Image Analysis',
  'Semantic Segmentation',
  'Object Detection',
  'Explainable AI',
  'MLOps',
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [showProficiency, setShowProficiency] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section title animation
      const titleTrigger = ScrollTrigger.create({
        trigger: '.skills-section-title',
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            '.skills-section-title',
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }
          );
        },
        once: true,
      });
      triggersRef.current.push(titleTrigger);

      // Education cards animation
      const eduTrigger = ScrollTrigger.create({
        trigger: '.education-container',
        start: 'top 75%',
        onEnter: () => {
          gsap.fromTo(
            '.education-card',
            { opacity: 0, y: 40, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'expo.out', stagger: 0.12 }
          );
        },
        once: true,
      });
      triggersRef.current.push(eduTrigger);

      // Skills animation
      const skillsTrigger = ScrollTrigger.create({
        trigger: '.tech-stack-container',
        start: 'top 75%',
        onEnter: () => {
          gsap.fromTo(
            '.skill-card',
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: 0.4, ease: 'expo.out', stagger: 0.05 }
          );

          gsap.fromTo(
            '.domain-tag',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'expo.out', stagger: 0.05, delay: 0.5 }
          );

          // Animate proficiency bars
          setTimeout(() => {
            setShowProficiency(true);
            gsap.fromTo(
              '.proficiency-bar',
              { width: '0%' },
              {
                width: function(_index, target) {
                  return target.getAttribute('data-proficiency') + '%';
                },
                duration: 1.2,
                ease: 'expo.out',
                stagger: 0.06
              }
            );
          }, 300);
        },
        once: true,
      });
      triggersRef.current.push(skillsTrigger);
    }, sectionRef);

    return () => {
      triggersRef.current.forEach(trigger => trigger.kill());
      triggersRef.current = [];
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-24 bg-black/30 relative"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title - Centered */}
        <h2 className="skills-section-title text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-16 text-center opacity-0">
          Education & <span className="text-gradient">Tech Stack</span>
        </h2>

        {/* Education - Centered Cards */}
        <div className="education-container mb-16">
          <div className="flex items-center justify-center gap-3 mb-8">
            <GraduationCap className="w-7 h-7 text-brand-accent" />
            <h3 className="text-2xl font-display font-bold text-white">Education</h3>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            {education.map((edu, index) => (
              <div
                key={index}
                className={`education-card glass-card p-5 rounded-xl transition-all duration-300 hover:scale-[1.02] group ${
                  edu.highlight ? 'border-l-4 border-l-brand-accent bg-brand-accent/5' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-brand-accent transition-colors">
                      {edu.degree}
                    </h4>
                    <p
                      className={`text-sm mt-0.5 ${
                        edu.highlight ? 'text-brand-accent' : 'text-gray-400'
                      }`}
                    >
                      {edu.institution}
                    </p>
                  </div>
                  <p className="text-gray-500 text-sm font-mono whitespace-nowrap">{edu.period}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-white/20" />
          <Code className="w-5 h-5 text-brand-accent" />
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-white/20" />
        </div>

        {/* Tech Stack - Centered */}
        <div className="tech-stack-container">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Cpu className="w-7 h-7 text-brand-accent" />
            <h3 className="text-2xl font-display font-bold text-white">Tech Stack</h3>
          </div>

          {/* Skills with Proficiency Bars */}
          <div className="max-w-4xl mx-auto space-y-3 mb-10">
            {techStack.map((skill, index) => {
              const Icon = skill.icon;
              const isAI = skill.category === 'ai';
              const isHovered = hoveredSkill === skill.name;

              return (
                <div
                  key={index}
                  className="skill-card glass-card rounded-lg p-4 transition-all duration-300 hover:scale-[1.02] hover:bg-white/5 cursor-default"
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                        isAI ? 'bg-brand-accent/20' : 'bg-white/5'
                      } ${isHovered ? 'scale-110 bg-brand-accent/30' : ''}`}>
                        <Icon className={`w-5 h-5 ${skill.color} transition-transform ${isHovered ? 'scale-110' : ''}`} />
                      </div>
                      <div>
                        <span className={`text-sm font-medium transition-colors ${
                          isAI ? 'text-white' : 'text-gray-300'
                        } ${isHovered ? 'text-brand-accent' : ''}`}>
                          {skill.name}
                        </span>
                        <div className="text-xs text-gray-500 capitalize">{skill.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className={`w-4 h-4 transition-colors ${isHovered ? 'text-green-400' : 'text-gray-500'}`} />
                      <span className={`text-sm font-mono font-bold transition-colors ${isHovered ? 'text-brand-accent' : 'text-gray-400'}`}>
                        {skill.proficiency}%
                      </span>
                    </div>
                  </div>

                  {/* Proficiency Bar */}
                  <div className="relative h-2 bg-black/40 rounded-full overflow-hidden">
                    <div
                      className={`proficiency-bar absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                        isAI
                          ? 'bg-gradient-to-r from-brand-accent via-blue-500 to-brand-purple'
                          : 'bg-gradient-to-r from-gray-600 to-gray-400'
                      } ${isHovered ? 'shadow-lg shadow-brand-accent/50' : ''}`}
                      data-proficiency={skill.proficiency}
                      style={{ width: showProficiency ? `${skill.proficiency}%` : '0%' }}
                    >
                      {/* Animated shimmer effect */}
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        style={{
                          animation: isHovered ? 'shimmer 1.5s infinite' : 'none',
                          backgroundSize: '200% 100%',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Domains - Centered */}
          <div className="text-center">
            <h4 className="text-lg font-display font-bold mb-4 text-gray-300">
              Domains
            </h4>
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
              {domains.map((domain, index) => (
                <span
                  key={index}
                  className="domain-tag px-3 py-1.5 rounded-full bg-white/5 text-gray-400 text-sm transition-all duration-200 hover:bg-brand-accent/10 hover:text-brand-accent cursor-default"
                >
                  {domain}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Wave SVG */}
      <svg
        className="absolute bottom-0 left-0 right-0 h-16 w-full opacity-20"
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
      >
        <path
          fill="none"
          stroke="url(#wave-gradient)"
          strokeWidth="2"
          d="M0,32 C360,64 720,0 1080,32 C1260,48 1380,16 1440,32"
          className="animate-draw-line"
        />
        <defs>
          <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
    </section>
  );
}
