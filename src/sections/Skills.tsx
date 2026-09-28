import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const education = [
  { degree: 'Ph.D. Applied Systems Biology', institution: 'Leibniz-HKI & Uni Jena', period: '2021–2025' },
  { degree: 'M.Sc. Biomedical Engineering', institution: 'FH Aachen University', period: '2018–2021' },
  { degree: 'B.Tech. Biomedical Engineering', institution: 'JIS College of Engineering', period: '2010–2014' },
];
const toolkit = [
  { label: 'Models & intelligence', skills: ['Deep Learning', 'LLMs', 'AI Agents', 'MCP'] },
  { label: 'Code & frameworks', skills: ['Python', 'PyTorch', 'TensorFlow', 'Keras', 'OpenCV'] },
  { label: 'From experiment to deployment', skills: ['Docker', 'AWS', 'Git', 'MLflow', 'Raspberry Pi'] },
];
const domains = ['Fine-tuning LLMs', 'Medical Image Analysis', 'Semantic Segmentation', 'Object Detection', 'Explainable AI', 'Financial Data Analysis', 'Trading Analysis', 'MLOps'];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
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
        <div className="section-heading"><div><p className="eyebrow">02 / EXPERTISE</p><h2>A research foundation.<br />An applied mindset.</h2></div><p>From biomedical engineering to deep learning, with the tools to take an idea into practice.</p></div>
        <div className="expertise-grid">
          <div className="expertise-column"><h3 className="expertise-label">Education</h3><div className="education-list">{education.map(item => <article className="education-item" key={item.degree}><span>{item.period}</span><h4>{item.degree}</h4><p>{item.institution}</p></article>)}</div></div>
          <div className="expertise-column"><h3 className="expertise-label">Working toolkit</h3><div className="toolkit-list">{toolkit.map(group => <div className="toolkit-group" key={group.label}><h4>{group.label}</h4><ul>{group.skills.map(skill => <li key={skill}>{skill}</li>)}</ul></div>)}</div></div>
        </div>
        <div className="expertise-domains"><h3 className="expertise-label">Areas of focus</h3><ul>{domains.map(domain => <li key={domain}>{domain}</li>)}</ul></div>
      </div>
    </section>
  );
}
