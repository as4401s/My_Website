import { useState } from 'react';
import { FlaskConical, Globe2, Newspaper, ChartNoAxesCombined } from 'lucide-react';

const workstreams = [
  { id: 'news', label: 'News', icon: Newspaper, title: 'FROM INFORMATION TO CONTENT', input: 'Financial information', process: 'Content workflow', output: 'Articles & breaking news', caption: 'Automated content tools for internal workflows.' },
  { id: 'analysis', label: 'Stocks', icon: ChartNoAxesCombined, title: 'FROM RESEARCH TO RANKING', input: 'Stock information', process: 'LLMs & agents', output: 'Analysis & ranking', caption: 'Agent-assisted stock analysis and comparison.' },
  { id: 'research', label: 'R&D', icon: FlaskConical, title: 'FROM IDEA TO IMPLEMENTATION', input: 'Financial question', process: 'Research & prototype', output: 'Working tool', caption: 'Exploring novel ideas and putting them into practice.' },
  { id: 'web', label: 'Web', icon: Globe2, title: 'FROM CAPABILITY TO INTERFACE', input: 'Team & user needs', process: 'Web development', output: 'Internal & external apps', caption: 'Useful capabilities, delivered through the web.' },
];

export default function FinanceWorkflow() {
  const [active, setActive] = useState(0);
  const item = workstreams[active];
  return <div className="finance-workflow">
    <div className="finance-workstream-tabs" role="group" aria-label="HKCM workstreams">
      {workstreams.map((stream, index) => <button type="button" key={stream.id} aria-pressed={active === index} aria-controls="hkcm-workflow" onClick={() => setActive(index)}><stream.icon size={15} aria-hidden="true"/>{stream.label}</button>)}
    </div>
    <div id="hkcm-workflow" className="finance-workflow-view" aria-live="polite" aria-atomic="true">
      <svg key={item.id} viewBox="0 0 400 390" role="img" aria-label={`${item.input}, through ${item.process}, to ${item.output}`}>
        <defs><pattern id="finance-grid" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" fill="none" stroke="currentColor" opacity=".06"/></pattern></defs>
        <rect width="400" height="390" fill="url(#finance-grid)"/>
        <text x="24" y="31" className="visual-kicker">{item.title}</text>
        <g fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M200 108V151M200 207V251" opacity=".35"/>
          <path className="finance-flow-line" d="M200 108V151M200 207V251" strokeDasharray="3 12" strokeWidth="2"/>
          <rect x="75" y="62" width="250" height="46" rx="5" fill="#111e25" strokeOpacity=".25"/>
          <rect x="75" y="152" width="250" height="54" rx="5" fill="#122a30" strokeOpacity=".7"/>
          <circle cx="96" cy="85" r="4" fill="currentColor" fillOpacity=".4" stroke="none"/>
          <path d="M90 179h12m-6-6v12"/>
        </g>
        <text x="113" y="89" className="visual-label">{item.input}</text>
        <text x="113" y="183" className="visual-label">{item.process}</text>
        <g fill="#101e25" stroke="currentColor" strokeWidth="1" strokeOpacity=".3">
          <rect x="84" y="244" width="240" height="108" rx="6" opacity=".25"/>
          <rect x="78" y="250" width="240" height="108" rx="6" opacity=".5"/>
          <rect x="72" y="256" width="240" height="108" rx="6"/>
        </g>
        <g stroke="currentColor" fill="none" strokeWidth="2">
          {item.id === 'news' && <><rect x="90" y="275" width="42" height="32" rx="3" fill="currentColor" fillOpacity=".12" strokeOpacity=".2"/><path d="M147 281H290M147 293H267M91 322H290M91 334H240" opacity=".4"/></>}
          {item.id === 'analysis' && <>{[145,112,80].map((w,i)=><g key={w}><text x="91" y={284+i*24} className="visual-caption">0{i+1}</text><rect x="118" y={275+i*24} width={w} height="10" rx="2" fill="currentColor" fillOpacity={.65-i*.18} stroke="none"/></g>)}</>}
          {item.id === 'research' && <><path d="M95 323L140 294L185 310L231 279L286 291" opacity=".5"/>{[[95,323],[140,294],[185,310],[231,279],[286,291]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="5" fill="#142e32"/>)}<path d="M95 343H286" opacity=".15"/></>}
          {item.id === 'web' && <><path d="M90 282H294" opacity=".2"/><circle cx="94" cy="271" r="2"/><circle cx="103" cy="271" r="2"/><rect x="90" y="296" width="60" height="47" rx="3" fill="currentColor" fillOpacity=".08" strokeOpacity=".25"/><path d="M164 303H287M164 316H265M164 338H212" opacity=".4"/></>}
        </g>
        <text x="200" y="236" textAnchor="middle" className="visual-caption">{item.output}</text>
      </svg>
      <p>{item.caption}</p>
    </div>
  </div>;
}
