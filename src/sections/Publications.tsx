import { ArrowUpRight } from 'lucide-react';

const publications = [
  {
    id: 1,
    title: 'Rapid detection of microbial antibiotic susceptibility via Deep Learning',
    journal: 'Sensors and Actuators B',
    year: '2025',
    doi: 'https://doi.org/10.1016/j.snb.2024.136866',
    description: 'Deep Learning supported analysis of angle resolved scattered-light images of picoliter droplet cultivations.',
  },
  {
    id: 2,
    title: 'Neutrophil activation phenotypes in ex vivo human Candida blood infections',
    journal: 'Comp. & Struct. Biotech.',
    year: '2024',
    doi: 'https://doi.org/10.1016/j.csbj.2024.03.006',
    description: 'Deep learning-based characterization of immune response phenotypes.',
  },
  {
    id: 3,
    title: 'Explainable AI and its applications in healthcare',
    journal: 'Springer',
    year: '2022',
    doi: 'https://doi.org/10.1007/978-3-031-12807-3_6',
    description: 'Chapter in "Explainable AI: Foundations, Methodologies and Applications".',
  },
  {
    id: 4,
    title: 'Identification of COVID-19 from Chest X-rays',
    journal: 'SN Computer Science',
    year: '2021',
    doi: 'https://doi.org/10.1007/s42979-021-00496-w',
    description: 'Comparing Cognex VisionPro Deep Learning software with open source convolutional neural networks.',
  },
];

export default function Publications() {
  return (
    <section id="publications"><div className="section-shell">
      <div className="section-heading"><div><p className="eyebrow">03 / SELECTED RESEARCH</p><h2>Ideas, tested and published.</h2></div><p>Peer-reviewed work in deep learning, bioimage analysis, and explainable AI.</p></div>
      <div className="research-list">{publications.map(publication => <a className="research-row" key={publication.id} href={publication.doi} target="_blank" rel="noopener noreferrer"><span>{publication.year}</span><div><h3>{publication.title}</h3><p>{publication.description}</p><p className="research-journal">{publication.journal}</p></div><ArrowUpRight aria-label="Open publication" /></a>)}</div>
      <a className="section-link" href="https://orcid.org/0000-0001-8835-8020" target="_blank" rel="noopener noreferrer">Explore my research on ORCID <ArrowUpRight size={16} /></a>
    </div></section>
  );
}
