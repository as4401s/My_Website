import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, GraduationCap, Building2, Rocket, X, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    id: 1,
    title: 'AI Data Scientist',
    company: 'HKCM',
    date: 'Nov 2025 - Present',
    description: 'Applying advanced AI methodologies to solve complex data challenges in finance.',
    icon: Rocket,
    current: true,
    details: null, // No details for current role as requested
  },
  {
    id: 2,
    title: 'Ph.D. Researcher',
    company: 'Leibniz-HKI & Uni Jena',
    date: '2021 - 2025',
    description: 'Topic: Artificial Intelligence driven Bioimage analysis in Infection Research.',
    achievement: 'Deep learning pipelines for rapid antibiotic susceptibility testing.',
    icon: GraduationCap,
    current: false,
    details: [
      'Engineered AI-driven bioimage analysis pipelines, applying CNNs to classify infection images and Transformers to analyze time-series microscopy videos.',
      'Built and optimized a deep learning pipeline for rapid antibiotic susceptibility testing (AST) from microfluidics data, reducing diagnostic turnaround to under 2 hours.',
      'Deployed models for use on standard PCs through quantization and developed a user-friendly GUI with Python\'s CustomTkinter to improve accessibility for researchers.',
      'Implemented hyphal image segmentation using U-Net based architectures and Cellpose, augmenting training data with synthetic images generated via GANs.',
      'Applied object detection models, including Mask R-CNN, for the precise identification and enumeration of fungal microcolonies.',
      'Collaborated with microbiologists and clinicians to validate model performance and ensure clinical relevance on diverse microscopy datasets.',
      'Mentored MSc students on deep learning workflows.',
    ],
  },
  {
    id: 3,
    title: 'Intern / Master Thesis',
    company: 'Cognex Corporation',
    date: '2020 - 2021',
    description: 'Benchmarking VisionPro Deep Learning vs TensorFlow for medical imaging.',
    icon: Building2,
    current: false,
    details: [
      'Benchmarked Cognex VisionPro Deep Learning software against open-source CNN models on public datasets: Diabetic Retinopathy Detection and Intracranial Hemorrhage Detection.',
      'Evaluated COVID-19 detection using X-ray and CT images, comparing proprietary vs open-source approaches.',
      'Implemented TensorFlow 2.0 models in Python and deployed TensorFlow-Lite models on Raspberry Pi for edge learning applications.',
      'Developed Cognex Deep Learning software plugins using C# for custom integrations.',
      'Collaborated with Digital Pathology and Radiology departments at University hospitals for research publications.',
      'Participated in Project DRACULA: Image formation and Cognex Vidi Suite HIL inspection of real blood samples.',
    ],
  },
  {
    id: 4,
    title: 'Early Career',
    company: 'India',
    date: '2014 - 2018',
    description: 'Medical imaging systems and healthcare technology.',
    icon: Briefcase,
    current: false,
    details: [
      'Product Specialist at KARL STORZ: Demonstrated and installed 3D, HD, and SD Laparoscopic and Endoscopy Imaging Solutions across Eastern India. Trained doctors and hospital staff on KARL STORZ imaging systems.',
      'Senior Engineer at Healthware Pvt Ltd: Demonstrated and installed Olympus medical equipment including HD/3D Imaging Systems, Energy Systems (Ultrasonic and RF), Dornier Medtech Lithotripters, Lisa Laser Systems, and BK Medical Ultrasound systems. Coordinated with Olympus R&D for product feedback.',
      'Service Engineer at South India Surgical Co.: Provided technical support and maintenance for surgical equipment.',
    ],
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const [selectedExp, setSelectedExp] = useState<typeof experiences[0] | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section title animation
      const titleTrigger = ScrollTrigger.create({
        trigger: '.experience-title',
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            '.experience-title',
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }
          );
        },
        once: true,
      });
      triggersRef.current.push(titleTrigger);

      // Timeline line draw animation
      const lineTrigger = ScrollTrigger.create({
        trigger: '.timeline-line',
        start: 'top 70%',
        onEnter: () => {
          gsap.fromTo(
            '.timeline-line',
            { scaleY: 0 },
            { scaleY: 1, duration: 1.5, ease: 'power2.out', transformOrigin: 'top' }
          );
        },
        once: true,
      });
      triggersRef.current.push(lineTrigger);

      // Experience items animation
      experiences.forEach((_, index) => {
        const trigger = ScrollTrigger.create({
          trigger: `.experience-item-${index}`,
          start: 'top 80%',
          onEnter: () => {
            // Node pop
            gsap.fromTo(
              `.experience-node-${index}`,
              { scale: 0 },
              { scale: 1, duration: 0.4, ease: 'back.out(1.7)', delay: index * 0.1 }
            );

            // Card slide in
            gsap.fromTo(
              `.experience-card-${index}`,
              { opacity: 0, y: 50 },
              { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', delay: index * 0.1 + 0.1 }
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

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="py-24 relative"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2 className="experience-title text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-16 text-center opacity-0">
          Professional <span className="text-gradient">Journey</span>
        </h2>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line - Hidden on mobile */}
          <div className="timeline-line hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-accent via-brand-purple to-brand-accent/30 transform -translate-x-1/2 origin-top" />

          {/* Experience Items */}
          <div className="space-y-12 md:space-y-16">
            {experiences.map((exp, index) => {
              const Icon = exp.icon;
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={exp.id}
                  className={`experience-item-${index} relative`}
                >
                  {/* Desktop Layout */}
                  <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:gap-8 items-center">
                    {/* Left Content */}
                    <div className={`${isLeft ? 'text-right' : 'order-3 text-left'}`}>
                      <div className={`experience-card-${index} opacity-0`}>
                        <div 
                          className={`glass-card p-6 rounded-xl transition-all duration-300 hover:border-brand-accent/50 hover:bg-brand-accent/5 cursor-pointer group ${
                            exp.details ? 'hover:shadow-lg hover:shadow-brand-accent/10' : ''
                          }`}
                          onClick={() => exp.details && setSelectedExp(exp)}
                        >
                          <h3 className="text-xl font-bold text-white group-hover:text-brand-accent transition-colors">
                            {exp.title}
                          </h3>
                          <p className="text-brand-accent text-sm mt-1">{exp.company}</p>
                          <p className="text-gray-500 text-xs mt-1 font-mono">{exp.date}</p>
                          
                          {exp.details && (
                            <div className="mt-3 flex items-center gap-1 text-brand-accent text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                              <span>View details</span>
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Center Node */}
                    <div className="relative flex justify-center order-2">
                      <div
                        className={`experience-node-${index} w-12 h-12 rounded-full flex items-center justify-center border-4 border-[#050505] transition-all duration-300 ${
                          exp.current
                            ? 'bg-brand-accent shadow-lg shadow-brand-accent/50'
                            : 'bg-gray-700'
                        }`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Right Content */}
                    <div className={`${isLeft ? 'order-3' : 'text-right'}`}>
                      <div className={`experience-card-${index} opacity-0`}>
                        <div className="glass-card p-6 rounded-xl">
                          <p className="text-gray-400 text-sm leading-relaxed">
                            {exp.description}
                          </p>
                          {exp.achievement && (
                            <p className="mt-3 text-xs text-brand-accent/80">
                              <span className="font-semibold">Key Achievement:</span> {exp.achievement}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden flex gap-4">
                    {/* Timeline Node */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`experience-node-${index} w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#050505] flex-shrink-0 ${
                          exp.current
                            ? 'bg-brand-accent shadow-lg shadow-brand-accent/50'
                            : 'bg-gray-700'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      {index < experiences.length - 1 && (
                        <div className="w-0.5 flex-1 bg-gradient-to-b from-brand-accent/50 to-brand-accent/10 mt-2" />
                      )}
                    </div>

                    {/* Content Card */}
                    <div className={`experience-card-${index} flex-1 opacity-0 pb-8`}>
                      <div 
                        className={`glass-card p-5 rounded-xl ${
                          exp.details ? 'cursor-pointer hover:border-brand-accent/50 hover:bg-brand-accent/5 transition-all' : ''
                        }`}
                        onClick={() => exp.details && setSelectedExp(exp)}
                      >
                        <h3 className="text-lg font-bold text-white">{exp.title}</h3>
                        <p className="text-brand-accent text-sm">{exp.company}</p>
                        <p className="text-gray-500 text-xs mt-1 font-mono">{exp.date}</p>
                        <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                          {exp.description}
                        </p>
                        {exp.achievement && (
                          <p className="mt-2 text-xs text-brand-accent/80">
                            <span className="font-semibold">Key Achievement:</span> {exp.achievement}
                          </p>
                        )}
                        {exp.details && (
                          <div className="mt-3 flex items-center gap-1 text-brand-accent text-sm">
                            <span>Tap for details</span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedExp && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedExp(null)}
        >
          <div 
            className="glass-card max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-2xl p-6 md:p-8 animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-display font-bold text-white">{selectedExp.title}</h3>
                <p className="text-brand-accent mt-1">{selectedExp.company}</p>
                <p className="text-gray-500 text-sm font-mono">{selectedExp.date}</p>
              </div>
              <button
                onClick={() => setSelectedExp(null)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4">
              <p className="text-gray-300">{selectedExp.description}</p>
              
              {selectedExp.achievement && (
                <div className="p-4 rounded-lg bg-brand-accent/10 border border-brand-accent/30">
                  <p className="text-sm text-brand-accent">
                    <span className="font-semibold">Key Achievement:</span> {selectedExp.achievement}
                  </p>
                </div>
              )}

              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Highlights</h4>
                <ul className="space-y-3">
                  {selectedExp.details?.map((detail, idx) => (
                    <li key={idx} className="flex gap-3 text-gray-400 text-sm leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent flex-shrink-0 mt-2" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
