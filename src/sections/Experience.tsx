import { ArrowUpRight, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

const experiences = [
  {
    id: 1,
    title: 'AI Data Scientist',
    company: 'HKCM',
    date: 'Nov 2025 - Present',
    description: 'Applying advanced AI methodologies to solve complex data challenges in finance.',
    current: true,
    details: null, // No details for current role as requested
  },
  {
    id: 2,
    title: 'Ph.D. Researcher',
    company: 'Leibniz-HKI & Uni Jena',
    date: '2021 - 2025',
    description: 'Topic: Artificial Intelligence driven Bioimage analysis in Infection Research.',
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
    current: false,
    details: [
      'Product Specialist at KARL STORZ: Demonstrated and installed 3D, HD, and SD Laparoscopic and Endoscopy Imaging Solutions across Eastern India. Trained doctors and hospital staff on KARL STORZ imaging systems.',
      'Senior Engineer at Healthware Pvt Ltd: Demonstrated and installed Olympus medical equipment including HD/3D Imaging Systems, Energy Systems (Ultrasonic and RF), Dornier Medtech Lithotripters, Lisa Laser Systems, and BK Medical Ultrasound systems. Coordinated with Olympus R&D for product feedback.',
      'Service Engineer at South India Surgical Co.: Provided technical support and maintenance for surgical equipment.',
    ],
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
          {experiences.map((exp) => (
            <article key={exp.id} className={`career-row ${expanded === exp.id ? 'is-expanded' : ''}`}>
              <div className="career-meta"><span>{exp.date}</span>{exp.current && <span className="current-role"><i /> Current role</span>}</div>
              <div className="career-body"><p className="career-company">{exp.company}</p><h3>{exp.title}</h3><p className="career-description">{exp.description}</p>
                {exp.details && <>
                  <button className="career-toggle" aria-expanded={expanded === exp.id} aria-controls={`career-details-${exp.id}`} onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}>{expanded === exp.id ? 'Less detail' : 'Explore this role'}{expanded === exp.id ? <Minus size={15} /> : <Plus size={15} />}</button>
                  <div id={`career-details-${exp.id}`} className="career-details" hidden={expanded !== exp.id}><ul>{exp.details.map(detail => <li key={detail}>{detail}</li>)}</ul></div>
                </>}
              </div>
              <ArrowUpRight className="career-arrow" size={24} aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
