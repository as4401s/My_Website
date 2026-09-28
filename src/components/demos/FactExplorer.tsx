import { useState } from 'react';
import { ArrowLeft, ArrowRight, Shuffle, BookOpen } from 'lucide-react';
import { aiFacts, factTopics } from '../../data/aiFacts';
import FactVisual from './FactVisual';

export default function FactExplorer() {
  const [topic, setTopic] = useState('All topics');
  const [index, setIndex] = useState(0);
  const facts = topic === 'All topics' ? aiFacts : aiFacts.filter(fact => fact.topic === topic);
  const fact = facts[index];
  const navigate = (offset: number) => setIndex(i => (i + offset + facts.length) % facts.length);
  return (
    <section className="fact-explorer" aria-label="AI field notes">
      <div className="fact-heading"><div><p className="eyebrow">THE CURIOSITY FILE</p><h3>Small ideas. New perspectives.</h3><p>{aiFacts.length} facts. Pick a topic, then explore with Next fact.</p></div><label className="fact-filter">Choose a topic<select aria-label="Choose a topic" value={topic} onChange={e => {setTopic(e.target.value);setIndex(0);}}>{['All topics', ...factTopics].map(value=><option key={value}>{value}</option>)}</select></label></div>
      <div className="fact-card">
        <FactVisual topic={fact.topic}/>
        <div className="fact-reading">
          <div className="fact-body" aria-live="polite" aria-atomic="true"><div className="fact-meta"><span className="eyebrow">{fact.topic}</span><span className="fact-number">{String(index+1).padStart(2,'0')}<small> / {facts.length}</small></span></div><p key={fact.id}>{fact.text}</p></div>
          <div className="fact-actions"><button className="fact-next" onClick={()=>navigate(1)}>Next fact<ArrowRight size={17}/></button><button onClick={()=>navigate(-1)} aria-label="Previous fact" title="Previous fact"><ArrowLeft size={17}/></button><button onClick={()=>setIndex(i=>(i+1+Math.floor(Math.random()*Math.max(1,facts.length-1)))%facts.length)}><Shuffle size={15}/><span>Surprise me</span></button></div>
        </div>
      </div>
      <a className="fact-source" href="https://d2l.ai/" target="_blank" rel="noopener noreferrer"><BookOpen size={14}/>Further reading: Dive into Deep Learning<ArrowRight size={13}/></a>
    </section>
  );
}
