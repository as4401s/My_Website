import { lazy, Suspense, useRef, useState } from 'react';
import { ArrowUpRight, Brain, ScanLine, Network, TrendingDown, Route, Layers, SlidersHorizontal } from 'lucide-react';
import FactExplorer from '../components/demos/FactExplorer';

const demos = [
  { id: 'neural-network', title: 'Neural networks', category: 'BUILD & TRAIN', icon: Brain, description: 'Build a neural network and teach it XOR. Inspect real weights, activations, and predictions as it learns.', challenge: 'Can you solve XOR with fewer than four hidden neurons?', component: lazy(() => import('../components/demos/NeuralNetworkPlayground')) },
  { id: 'convolution', title: 'Convolution explorer', category: 'COMPUTER VISION', icon: ScanLine, description: 'Paint an image and see exactly how a filter transforms it, one pixel at a time.', challenge: 'Draw a diagonal line. How do the horizontal and vertical edge filters respond?', component: lazy(() => import('../components/demos/ConvolutionExplorer')) },
  { id: 'gradient-descent', title: 'Gradient descent', category: 'OPTIMIZATION', icon: TrendingDown, description: 'Follow an optimizer across a loss landscape and explore the effect of step size and momentum.', challenge: 'Compare SGD and Adam on the same landscape. Which path is more direct?', component: lazy(() => import('../components/demos/GradientDescentVisualizer')) },
  { id: 'transformer', title: 'Attention explorer', category: 'TRANSFORMERS', icon: Network, description: 'Inspect a normalized, illustrative attention matrix and follow the relationships between tokens.', challenge: 'Select a token and compare its attention row with a token at the other end.', component: lazy(() => import('../components/demos/TransformerVisualizer')) },
  { id: 'loss-functions', title: 'Loss functions', category: 'TRAINING OBJECTIVES', icon: SlidersHorizontal, description: 'Fit a small model with different loss functions. Compare how each objective changes the updates.', challenge: 'Compare MSE and MAE using the same data. Watch their learning curves.', component: lazy(() => import('../components/demos/LossFunctionPlayground')) },
  { id: 'rl-maze', title: 'Reinforcement learning', category: 'LEARNING BY DOING', icon: Route, description: 'Watch a Q-learning agent explore a maze and improve its decisions from rewards.', challenge: 'Lower exploration after the agent learns. Does it reach the goal more directly?', component: lazy(() => import('../components/demos/RLMaze')) },
  { id: 'architectures', title: 'Architecture explorer', category: 'MODEL DESIGN', icon: Layers, description: 'Explore simplified network diagrams and compare the roles of convolution, pooling, and skip connections.', challenge: 'Find the skip connections in ResNet. What information can travel along them?', component: lazy(() => import('../components/demos/ModelArchitectureExplorer')) },
];

export default function Lab() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const demo = demos[active];
  const ActiveDemo = demo.component;
  return (
    <section id="lab" className="lab-section">
      <div className="section-shell">
        <div className="section-heading"><div><p className="eyebrow">04 / THE AI LAB</p><h2>Less theory.<br/>More discovery.</h2></div><p>Seven hands-on experiments to make deep learning tangible. Pick a question. Change a parameter. See what happens.</p></div>
        <div className="lab-workspace">
          <div className="experiment-tabs" role="tablist" aria-label="AI experiments">{demos.map((item, index) => <button key={item.id} id={`tab-${item.id}`} role="tab" type="button" aria-selected={active === index} aria-controls="experiment-panel" tabIndex={active === index ? 0 : -1} ref={node => {tabs.current[index] = node;}} onClick={()=>setActive(index)} onKeyDown={event => {
            let next: number | undefined;
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index+1)%demos.length;
            if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index+demos.length-1)%demos.length;
            if (event.key === 'Home') next = 0;
            if (event.key === 'End') next = demos.length-1;
            if (next !== undefined) {event.preventDefault();setActive(next);tabs.current[next]?.focus();}
          }}><item.icon size={18} strokeWidth={1.5}/><span>{item.title}</span><small>{String(index+1).padStart(2,'0')}</small></button>)}</div>
          <div id="experiment-panel" className="experiment-panel" role="tabpanel" aria-labelledby={`tab-${demo.id}`} tabIndex={0}>
            <div className="experiment-heading"><div><p className="eyebrow">{demo.category}</p><h3>{demo.title}</h3><p>{demo.description}</p></div><span className="experiment-counter">{String(active+1).padStart(2,'0')} / 07</span></div>
            <Suspense fallback={<div className="experiment-loading" role="status">Loading experiment…</div>}><ActiveDemo key={demo.id}/></Suspense>
            <div className="experiment-challenge"><ArrowUpRight size={18}/><p><strong>Try this</strong>{demo.challenge}</p></div>
            <p className="experiment-reset-note">Switching experiments resets the current run.</p>
          </div>
        </div>
        <FactExplorer/>
      </div>
    </section>
  );
}
