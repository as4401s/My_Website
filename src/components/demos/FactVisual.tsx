type Props = { topic: string };

/** Topic illustrations explain a concept; they are not measured model outputs. */
export default function FactVisual({ topic }: Props) {
  const kind = topic === 'Activations' ? 'activation'
    : ['Optimization', 'Loss functions'].includes(topic) ? 'loss'
    : ['Computer vision', 'Vision tasks'].includes(topic) ? 'vision'
    : ['Transformers', 'Language models'].includes(topic) ? 'attention'
    : topic === 'Reinforcement learning' ? 'reward'
    : topic === 'Efficient models' ? 'deployment'
    : ['Generalization', 'Training practice'].includes(topic) ? 'fit' : 'network';
  const labels = { activation: 'Nonlinearity · ReLU', loss: 'Descending a loss landscape', vision: 'A filter’s receptive field', attention: 'Relationships between tokens', reward: 'A path shaped by rewards', deployment: 'From model to edge device', fit: 'Learning a pattern from data', network: 'Weighted inputs → activation' };
  const layers = [[48, 60, 105, 150], [132, 42, 84, 126, 168], [220, 84, 126]];
  return <figure className="fact-visual">
    <svg viewBox="0 0 270 210" role="img" aria-label={labels[kind]}>
      <g stroke="#8edbd2" fill="none" strokeWidth="1.3">
        {kind === 'network' && <>
          {layers.slice(0, -1).map((layer, l) => layer.slice(1).flatMap((y, i) => layers[l + 1].slice(1).map((nextY, j) => <line key={`${l}-${i}-${j}`} x1={layer[0]} y1={y} x2={layers[l + 1][0]} y2={nextY} opacity={.12 + ((i + j) % 3) * .12}/>)))}
          {layers.map((layer, l) => layer.slice(1).map((y, i) => <g key={`${l}-${i}`}><circle cx={layer[0]} cy={y} r="12" fill="#111f26"/><circle cx={layer[0]} cy={y} r="5" fill="#8edbd2" opacity={.2 + i * .2}/></g>))}
        </>}
        {kind === 'activation' && <><path d="M25 150H245M100 180V30" opacity=".25"/><path d="M25 150H100L220 30" strokeWidth="3"/><circle cx="160" cy="90" r="5" fill="#8edbd2"/><text x="190" y="177">x</text><text x="112" y="37">ReLU(x)</text></>}
        {kind === 'loss' && <><ellipse cx="145" cy="112" rx="110" ry="74" opacity=".2" transform="rotate(-20 145 112)"/><ellipse cx="145" cy="112" rx="82" ry="55" opacity=".3" transform="rotate(-20 145 112)"/><ellipse cx="145" cy="112" rx="53" ry="35" opacity=".4" transform="rotate(-20 145 112)"/><ellipse cx="145" cy="112" rx="22" ry="15" opacity=".6"/><path d="M55 55L190 72L113 98L163 103L141 114" stroke="#cfac83" strokeWidth="2"/>{[[55,55],[190,72],[113,98],[163,103],[141,114]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="4" fill={i===4?'#8edbd2':'#cfac83'} stroke="none"/>)}</>}
        {kind === 'vision' && <>{Array.from({length:49},(_,i)=><rect key={i} x={46+i%7*25} y={18+Math.floor(i/7)*25} width="22" height="22" rx="2" fill="#8edbd2" fillOpacity={Math.abs(i%7-Math.floor(i/7))<2?.55:.04} strokeOpacity=".12"/>)}<rect x="94" y="66" width="77" height="77" stroke="#e5bf8a" strokeWidth="2"/><path d="M171 104H250" stroke="#e5bf8a" strokeDasharray="3 4"/></>}
        {kind === 'attention' && <>{Array.from({length:25},(_,i)=><rect key={i} x={62+i%5*30} y={33+Math.floor(i/5)*30} width="26" height="26" rx="3" fill="#8edbd2" fillOpacity={i%5===Math.floor(i/5)?.7:((i*7)%5+1)*.08} stroke="none"/>)}<path d="M49 33V179M62 20H208" opacity=".35"/><text x="75" y="199">query × key</text></>}
        {kind === 'reward' && <>{Array.from({length:35},(_,i)=><rect key={i} x={31+i%7*30} y={30+Math.floor(i/7)*30} width="27" height="27" rx="2" fill="#8edbd2" fillOpacity={[3,10,12,15,17,19,26].includes(i)?.25:.03} strokeOpacity=".12"/>)}<path d="M44 43V73H104V133H164V163H224" strokeWidth="2.5" strokeDasharray="5 4"/><circle cx="44" cy="43" r="7" fill="#8edbd2"/><circle cx="224" cy="163" r="10" stroke="#cfac83" strokeWidth="2"/></>}
        {kind === 'deployment' && <><rect x="25" y="50" width="90" height="105" rx="8"/><rect x="40" y="65" width="60" height="60" rx="3" opacity=".35"/>{[0,1,2].map(i=><path key={i} d={`M50 ${80+i*15}H90`} opacity=".6"/>)}<path d="M128 102H165L158 95M165 102L158 109"/><rect x="182" y="72" width="57" height="62" rx="6"/><rect x="196" y="88" width="29" height="29" rx="3" fill="#8edbd2" fillOpacity=".2"/><text x="41" y="177">model</text><text x="194" y="158">edge</text></>}
        {kind === 'fit' && <><path d="M28 30V180H245" opacity=".25"/><path d="M40 154C86 159 96 83 140 93S192 47 235 40" strokeWidth="2.5"/>{[[45,142],[69,150],[80,116],[108,101],[131,83],[159,101],[179,63],[207,54],[230,30]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="4" fill="#cfac83" stroke="none"/>)}</>}
      </g>
    </svg>
    <figcaption>{labels[kind]}</figcaption>
  </figure>;
}
