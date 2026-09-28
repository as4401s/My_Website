import { useState } from 'react';
import { ArrowLeft, ArrowRight, Shuffle, BookOpen } from 'lucide-react';
import { aiFacts, factTopics } from '../../data/aiFacts';

export default function FactExplorer() {
  const [topic, setTopic] = useState('All topics');
  const [index, setIndex] = useState(0);
  const facts = topic === 'All topics' ? aiFacts : aiFacts.filter(fact => fact.topic === topic);
  const fact = facts[index];
  const navigate = (offset: number) => setIndex(i => (i + offset + facts.length) % facts.length);
  return (
    <section className="fact-explorer" aria-label="AI field notes">
      <div className="fact-heading"><div><p className="eyebrow">THE CURIOSITY FILE</p><h3>A little more to think about.</h3><p>{aiFacts.length} bite-sized facts across {factTopics.length} topics.</p></div><label className="fact-filter">Explore a topic<select value={topic} onChange={e => {setTopic(e.target.value);setIndex(0);}}>{['All topics', ...factTopics].map(value=><option key={value}>{value}</option>)}</select></label></div>
      <div className="fact-body" aria-live="polite" aria-atomic="true"><span className="fact-number">{String(index+1).padStart(3,'0')}<small> / {facts.length}</small></span><div><span className="eyebrow">{fact.topic}</span><p key={fact.id}>{fact.text}</p></div></div>
      <div className="fact-footer"><a href="https://d2l.ai/" target="_blank" rel="noopener noreferrer"><BookOpen size={15}/>Go deeper with Dive into Deep Learning</a><div><button onClick={()=>navigate(-1)} aria-label="Previous fact"><ArrowLeft size={17}/></button><button onClick={()=>setIndex(i=>(i+1+Math.floor(Math.random()*(facts.length-1)))%facts.length)}><Shuffle size={15}/>Surprise me</button><button onClick={()=>navigate(1)} aria-label="Next fact"><ArrowRight size={17}/></button></div></div>
    </section>
  );
}
