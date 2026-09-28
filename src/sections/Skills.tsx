import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Braces, BrainCircuit, Cpu, Focus, Microscope, Network, Sparkles, TrendingUp } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const education = [
  { degree: 'Ph.D. Applied Systems Biology', institution: 'Leibniz-HKI & Uni Jena', period: '2021–2025' },
  { degree: 'M.Sc. Biomedical Engineering', institution: 'FH Aachen University', period: '2018–2021' },
  { degree: 'B.Tech. Biomedical Engineering', institution: 'JIS College of Engineering', period: '2010–2014' },
];
const toolkit = [
  { label: 'Deep learning', icon: BrainCircuit, skills: ['PyTorch', 'TensorFlow', 'Keras', 'CNNs', 'Transformers'] },
  { label: 'Computer vision', icon: Focus, skills: ['OpenCV', 'U-Net', 'Cellpose', 'Mask R-CNN', 'VisionPro Deep Learning'] },
  { label: 'Generative AI & agents', icon: Sparkles, skills: ['LLMs', 'Fine-tuning', 'AI agents', 'MCP', 'GANs'] },
  { label: 'Code & scientific computing', icon: Braces, skills: ['Python', 'NumPy', 'C#', 'CustomTkinter'] },
  { label: 'Deployment & MLOps', icon: Cpu, skills: ['Docker', 'AWS', 'Git', 'MLflow', 'TensorFlow Lite', 'Raspberry Pi', 'Model quantization'] },
];
const domains = [
  {
    id: 'biomedical', label: 'Biomedical AI', subtitle: 'From microscopy to medical imaging', icon: Microscope,
    title: 'Making complex images useful.',
    description: 'A biomedical engineering foundation applied to microscopy, infection research, and medical image analysis.',
    focus: ['Bioimage analysis & time-series microscopy', 'Antibiotic susceptibility testing', 'Digital pathology & radiology'],
    workflow: ['Imaging data', 'Learned features', 'Research insights'],
    link: '#publications', linkLabel: 'Explore the research',
  },
  {
    id: 'vision', label: 'Computer vision', subtitle: 'Recognition, detection & segmentation', icon: Focus,
    title: 'From pixels to measurable structure.',
    description: 'Image and video workflows that connect classification, object detection, and precise segmentation with careful model validation.',
    focus: ['Semantic & instance segmentation', 'Object detection & colony counting', 'Synthetic image augmentation with GANs'],
    workflow: ['Images & video', 'Detect & segment', 'Measure & validate'],
    link: '#experience', linkLabel: 'See the applied work',
  },
  {
    id: 'language', label: 'Language & intelligence', subtitle: 'Models, attention & agent workflows', icon: Network,
    title: 'Understanding the models behind AI.',
    description: 'An interest in the mechanisms of modern AI, from attention and Transformers to fine-tuning language models and working with agents.',
    focus: ['Transformer architectures & attention', 'LLM fine-tuning & AI agents', 'Explainable AI & model interpretability'],
    workflow: ['Context', 'Model & reasoning', 'Useful outputs'],
    link: '#blog', linkLabel: 'Read my technical writing',
  },
  {
    id: 'applied', label: 'Applied AI & systems', subtitle: 'Financial data, deployment & edge AI', icon: TrendingUp,
    title: 'Taking models beyond the experiment.',
    description: 'Connecting AI with practical constraints: financial data analysis, reproducible experiments, and efficient inference on everyday hardware.',
    focus: ['Financial data & trading analysis', 'Model benchmarking & experiment tracking', 'Edge inference & model quantization'],
    workflow: ['Experiment', 'Evaluate & optimize', 'Deploy'],
    link: '#experience', linkLabel: 'Explore my experience',
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeDomain, setActiveDomain] = useState(domains[0].id);
  const domain = domains.find(item => item.id === activeDomain) ?? domains[0];
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.expertise-column', { y: 24, opacity: 0 }, {
        y: 0, opacity: 1, duration: .7, stagger: .12, clearProps: 'all', ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      });
    }, sectionRef);
    return () => media.revert();
  }, []);
  return (
    <section id="skills" className="expertise-section" ref={sectionRef}>
      <div className="section-shell">
        <div className="section-heading"><div><p className="eyebrow">02 / EXPERTISE</p><h2>A research foundation.<br />An applied mindset.</h2></div><p>Deep learning, scientific computing, and the engineering to turn research into working systems.</p></div>
        <div className="expertise-grid">
          <div className="expertise-column education-column">
            <h3 className="expertise-label"><span>01</span> Research foundation</h3>
            <div className="education-list">{education.map(item => <article className="education-item" key={item.degree}><span>{item.period}</span><h4>{item.degree}</h4><p>{item.institution}</p></article>)}</div>
            <p className="education-note">At the intersection of biology,<br />engineering, and machine learning.</p>
          </div>
          <div className="expertise-column">
            <h3 className="expertise-label"><span>02</span> Technology & methods</h3>
            <div className="toolkit-list">{toolkit.map(({ label, icon: Icon, skills }) => (
              <div className="toolkit-group" key={label}>
                <div className="toolkit-icon"><Icon size={19} strokeWidth={1.5} aria-hidden="true" /></div>
                <div><h4>{label}</h4><ul>{skills.map(skill => <li key={skill}>{skill}</li>)}</ul></div>
              </div>
            ))}</div>
          </div>
        </div>
        <div className="expertise-domains">
          <div className="domain-heading"><h3 className="expertise-label"><span>03</span> Domains in practice</h3><p>Select a field to explore the focus.</p></div>
          <div className="domain-explorer">
            <div className="domain-options" role="group" aria-label="Explore expertise domains">
              {domains.map(({ id, label, subtitle, icon: Icon }) => (
                <button key={id} type="button" aria-pressed={activeDomain === id} aria-controls="expertise-domain-detail" onClick={() => setActiveDomain(id)}>
                  <Icon size={21} strokeWidth={1.5} aria-hidden="true" /><span><strong>{label}</strong><small>{subtitle}</small></span><ArrowRight size={16} aria-hidden="true" />
                </button>
              ))}
            </div>
            <div className="domain-detail" id="expertise-domain-detail" role="region" aria-label="Selected domain" aria-live="polite" aria-atomic="true">
              <div className="domain-content" key={domain.id}>
                <p className="domain-kicker">{domain.label}</p>
                <h4>{domain.title}</h4><p className="domain-description">{domain.description}</p>
                <ul className="domain-focus">{domain.focus.map(item => <li key={item}>{item}</li>)}</ul>
                <ol className="domain-workflow" aria-label="Illustrative workflow">{domain.workflow.map((step, index) => <li key={step}><span>0{index + 1}</span>{step}{index < 2 && <ArrowRight size={13} aria-hidden="true" />}</li>)}</ol>
                <a className="domain-link" href={domain.link}>{domain.linkLabel}<ArrowRight size={15} aria-hidden="true" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
