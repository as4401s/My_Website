import { Plus, Minus, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import CareerVisual from '../components/CareerVisual';

const experiences = [
  {
    id: 1, title: 'AI Data Scientist', company: 'HKCM', date: 'Nov 2025 – Present',
    description: 'Applying advanced AI methodologies to solve complex data challenges in finance.',
    current: true, details: null,
  },
  {
    id: 2, title: 'Ph.D. Researcher', company: 'Leibniz-HKI & Uni Jena', date: '2021 – 2025',
    description: 'AI-driven bioimage analysis for infection research.', current: false,
    details: {
      visual: 'research' as const, focus: 'RESEARCH → APPLICATION', headline: 'From microscopy to usable AI.',
      summary: 'Developed image-analysis workflows with microbiologists and clinicians, bringing deep learning into infection research.',
      highlights: [
        { title: 'Faster antibiotic testing', text: 'Built a deep learning pipeline for microfluidics-based antibiotic susceptibility testing, bringing diagnostic turnaround below two hours.' },
        { title: 'More information from every image', text: 'Used CNNs for infection-image classification and Transformers for time-series microscopy. Segmented hyphae with U-Net and Cellpose, augmented data with GANs, and counted fungal microcolonies with Mask R-CNN.' },
        { title: 'Tools researchers could use', text: 'Quantized models for standard PCs and built a CustomTkinter interface to make analysis accessible beyond the development environment.' },
        { title: 'Research built together', text: 'Validated models on diverse microscopy datasets with microbiologists and clinicians, and mentored MSc students through deep learning workflows.' },
      ],
      tools: ['CNNs & Transformers', 'U-Net', 'Cellpose', 'Mask R-CNN', 'GANs', 'CustomTkinter'],
      publication: { href: 'https://doi.org/10.1016/j.snb.2024.136866', label: 'Related publication: rapid antibiotic testing' },
    },
  },
  {
    id: 3, title: 'Intern / Master Thesis', company: 'Cognex Corporation', date: '2020 – 2021',
    description: 'Benchmarking VisionPro Deep Learning against TensorFlow for medical imaging.', current: false,
    details: {
      visual: 'vision' as const, focus: 'COMPARISON → DEPLOYMENT', headline: 'Testing how models perform in practice.',
      summary: 'Compared commercial and open-source deep learning tools across medical-imaging tasks, then explored deployment on compact hardware.',
      highlights: [
        { title: 'Comparisons across clinical datasets', text: 'Benchmarked VisionPro Deep Learning against open-source CNNs for diabetic retinopathy and intracranial hemorrhage, and compared COVID-19 detection on X-ray and CT images.' },
        { title: 'From Python to the edge', text: 'Implemented TensorFlow 2.0 models and deployed TensorFlow Lite on Raspberry Pi to explore edge-learning applications.' },
        { title: 'Integration with imaging workflows', text: 'Developed Cognex plugins in C# and contributed to Project DRACULA, working on image formation and Vidi Suite HIL inspection of blood samples.' },
        { title: 'Collaboration and publication', text: 'Worked with university-hospital digital pathology and radiology departments on research publications.' },
      ],
      tools: ['VisionPro Deep Learning', 'TensorFlow', 'TensorFlow Lite', 'Python', 'C#', 'Raspberry Pi'],
      publication: { href: 'https://doi.org/10.1007/s42979-021-00496-w', label: 'Related publication: COVID-19 image classification' },
    },
  },
  {
    id: 4, title: 'Early Career', company: 'India', date: '2014 – 2018',
    description: 'Medical imaging systems and healthcare technology.', current: false,
    details: {
      visual: 'clinical' as const, focus: 'TECHNOLOGY → CLINICAL PRACTICE', headline: 'A foundation in hands-on healthcare technology.',
      summary: 'Worked directly with imaging equipment and clinical teams, combining installation, demonstrations, training, and technical support.',
      highlights: [
        { title: 'KARL STORZ · Product Specialist', text: 'Demonstrated and installed 3D, HD, and SD laparoscopic and endoscopic imaging systems across Eastern India. Trained doctors and hospital teams in their use.' },
        { title: 'Healthware · Senior Engineer', text: 'Demonstrated and installed Olympus imaging and energy systems, Dornier lithotripters, Lisa lasers, and BK Medical ultrasound equipment. Shared product feedback with Olympus R&D.' },
        { title: 'South India Surgical Co. · Service Engineer', text: 'Provided technical support and maintenance for surgical equipment, building practical experience with the systems used in clinical care.' },
      ],
      tools: ['Endoscopy', 'Laparoscopy', 'Ultrasound', 'Equipment installation', 'Clinical training'],
      publication: null,
    },
  },
];

export default function Experience() {
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <section id="experience" className="career-section">
      <div className="section-shell">
        <div className="section-heading">
          <div><p className="eyebrow">01 / EXPERIENCE</p><h2>A journey from research<br />to real-world impact.</h2></div>
          <p>Building on a foundation in biomedical engineering to solve challenges with AI.</p>
        </div>
        <div className="career-list">
          {experiences.map(exp => (
            <article key={exp.id} className={`career-row ${expanded === exp.id ? 'is-expanded' : ''}`}>
              <div className="career-meta"><span>{exp.date}</span>{exp.current && <span className="current-role"><i /> Current role</span>}</div>
              <div className="career-body">
                <p className="career-company">{exp.company}</p><h3 id={`career-heading-${exp.id}`}>{exp.title}</h3><p className="career-description">{exp.description}</p>
                {exp.details && <button id={`career-toggle-${exp.id}`} className="career-toggle" aria-expanded={expanded === exp.id} aria-controls={`career-details-${exp.id}`} onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}><span className="career-toggle-icon">{expanded === exp.id ? <Minus size={15}/> : <Plus size={15}/>}</span>{expanded === exp.id ? 'Close role' : 'Explore this role'}<span className="career-toggle-note">Projects, approach & tools</span></button>}
              </div>
              {exp.details && <div id={`career-details-${exp.id}`} className="career-details" role="region" aria-labelledby={`career-heading-${exp.id}`} hidden={expanded !== exp.id}>
                <div className="career-story">
                  <div className="career-visual-column">
                    <figure className="career-visual"><CareerVisual kind={exp.details.visual}/><figcaption>Illustrated overview of the work</figcaption></figure>
                    <div className="career-toolkit"><h4>Tools & focus</h4><ul>{exp.details.tools.map(tool => <li key={tool}>{tool}</li>)}</ul></div>
                    {exp.details.publication && <a className="career-publication" href={exp.details.publication.href} target="_blank" rel="noopener noreferrer">{exp.details.publication.label}<ExternalLink size={14}/></a>}
                  </div>
                  <div className="career-story-content">
                    <p className="eyebrow">{exp.details.focus}</p><h4>{exp.details.headline}</h4><p className="career-story-intro">{exp.details.summary}</p>
                    <ul className="career-highlights">{exp.details.highlights.map((item, index) => <li key={item.title}><span className="career-highlight-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h5>{item.title}</h5><p>{item.text}</p></div></li>)}</ul>
                  </div>
                </div>
              </div>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
