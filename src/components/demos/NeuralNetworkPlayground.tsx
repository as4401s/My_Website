import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, StepForward, Plus, Minus } from 'lucide-react';
import { createNetwork, forward, networkLoss, trainNetwork, xorData } from '../../lib/lab/neuralNetwork';
import type { Activation } from '../../lib/lab/neuralNetwork';

export default function NeuralNetworkPlayground() {
  const [network, setNetwork] = useState(() => createNetwork([4]));
  const [running, setRunning] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [rate, setRate] = useState(0.5);
  const [sample, setSample] = useState(1);
  const [history, setHistory] = useState<number[]>([]);
  const loss = networkLoss(network);
  const activations = forward(network, xorData[sample].slice(0, 2));
  const hidden = network.sizes.slice(1, -1);
  const parameterCount = network.weights.reduce((sum, layer) => sum + layer.reduce((n, weights) => n + weights.length + 1, 0), 0);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      if (document.hidden) return;
      let next = network;
      for (let i = 0; i < 20; i++) next = trainNetwork(next, rate);
      setNetwork(next);
      setEpoch(value => value + 20);
      const nextLoss = networkLoss(next);
      setHistory(values => [...values.slice(-99), nextLoss]);
      if (nextLoss < 0.005 || epoch >= 9980) setRunning(false);
    }, 50);
    return () => clearInterval(timer);
  }, [running, network, rate, epoch]);

  const reset = (sizes = hidden, activation = network.activation) => {
    setRunning(false); setEpoch(0); setHistory([]); setNetwork(createNetwork(sizes, activation));
  };
  const step = () => {
    const next = trainNetwork(network, rate);
    setNetwork(next); setEpoch(value => value + 1); setHistory(values => [...values.slice(-99), networkLoss(next)]);
  };
  const positions = network.sizes.map((size, l) => Array.from({ length: size }, (_, n) => ({ x: 55 + l * (570 / (network.sizes.length - 1)), y: 65 + (n + 0.5) * (210 / size) })));
  return (
    <div className="network-lab">
      <div className="lab-metrics"><div><span>Training epochs</span><strong>{epoch.toLocaleString()}</strong></div><div><span>Binary cross-entropy</span><strong>{loss.toFixed(4)}</strong></div><div><span>Learnable parameters</span><strong>{parameterCount}</strong></div></div>
      <div className="network-stage">
        <div className="visualization-label"><span>LIVE NETWORK</span><span>Line colour = weight sign · Node fill = activation</span></div>
        <svg viewBox="0 0 680 320" role="img" aria-label={`Neural network with ${network.sizes.join(', ')} neurons per layer. Current loss ${loss.toFixed(4)}.`}>
          {network.weights.map((layer, l) => layer.map((weights, n) => weights.map((weight, i) => <line key={`${l}-${n}-${i}`} x1={positions[l][i].x} y1={positions[l][i].y} x2={positions[l + 1][n].x} y2={positions[l + 1][n].y} stroke={weight >= 0 ? '#8edbd2' : '#cfac83'} strokeOpacity={Math.min(.65, .08 + Math.abs(weight) * .12)} strokeWidth={Math.min(3, .5 + Math.abs(weight) * .5)} />)))}
          {positions.map((layer, l) => <g key={l}><text x={layer[0].x} y="28" textAnchor="middle" fill="#92a5aa" fontSize="11">{l === 0 ? 'INPUT' : l === positions.length - 1 ? 'OUTPUT' : `HIDDEN ${l}`}</text>{layer.map((point, n) => <g key={n}><circle cx={point.x} cy={point.y} r="15" fill="#0e191e" stroke="#8edbd2" strokeOpacity=".5" /><circle cx={point.x} cy={point.y} r="12" fill="#8edbd2" fillOpacity={Math.min(1, Math.abs(activations[l][n]))} /><text x={point.x} y={point.y + 4} textAnchor="middle" fill={Math.abs(activations[l][n]) > .5 ? '#102322' : '#dce9e8'} fontSize="8">{activations[l][n].toFixed(1)}</text></g>)}</g>)}
        </svg>
        <div className="network-legend"><span><i style={{background:'#8edbd2'}} /> Positive weight</span><span><i style={{background:'#cfac83'}} /> Negative weight</span><span>Sample: [{xorData[sample].slice(0,2).join(', ')}]</span></div>
      </div>
      <div className="lab-toolbar"><button className="lab-run" onClick={() => setRunning(value => !value)}>{running ? <Pause size={15} /> : <Play size={15} />}{running ? 'Pause training' : 'Train network'}</button><button onClick={step} disabled={running}><StepForward size={15} />One step</button><button onClick={() => reset()}><RotateCcw size={15} />Reset</button><span>{loss < .05 ? 'The network is learning XOR.' : 'Train to separate the four XOR examples.'}</span></div>
      <div className="network-controls">
        <div className="lab-control-group"><h4>Architecture</h4><p>Two inputs, one output. Customize the hidden layers.</p>{hidden.map((count, i) => <div className="layer-control" key={i}><span>Hidden layer {i + 1}</span><button aria-label={`Remove neuron from hidden layer ${i + 1}`} disabled={count <= 1} onClick={() => reset(hidden.map((v,n) => n === i ? v - 1 : v))}><Minus size={14} /></button><strong>{count}</strong><button aria-label={`Add neuron to hidden layer ${i + 1}`} disabled={count >= 8} onClick={() => reset(hidden.map((v,n) => n === i ? v + 1 : v))}><Plus size={14} /></button></div>)}<div className="lab-toolbar"><button disabled={hidden.length >= 3} onClick={() => reset([...hidden, 4])}>Add layer</button><button disabled={hidden.length === 0} onClick={() => reset(hidden.slice(0,-1))}>Remove layer</button></div><label>Hidden activation<select value={network.activation} onChange={e => reset(hidden, e.target.value as Activation)}><option value="tanh">Tanh</option><option value="relu">ReLU</option><option value="sigmoid">Sigmoid</option></select></label><label>Learning rate <span>{rate.toFixed(2)}</span><input type="range" min="0.05" max="1" step="0.05" value={rate} onChange={e => setRate(+e.target.value)} /></label></div>
        <div className="lab-control-group"><h4>Test the predictions</h4><p>Select an input to inspect its activations above.</p><div className="prediction-header"><span>Input</span><span>Target</span><span>Prediction</span></div>{xorData.map(([x,y,target], i) => { const probability = forward(network,[x,y]).at(-1)![0]; return <button className="prediction-row" aria-pressed={sample === i} key={i} onClick={() => setSample(i)}><span>[{x}, {y}]</span><span>{target}</span><span className={Number(probability >= .5) === target ? 'prediction-correct' : ''}>{probability.toFixed(3)}</span></button>; })}<div className="loss-sparkline"><span>Loss history</span><svg viewBox="0 0 300 58" role="img" aria-label="Training loss over the last 100 updates"><polyline fill="none" stroke="#8edbd2" strokeWidth="2" points={history.map((v,i) => `${i / Math.max(1,history.length-1) * 296 + 2},${55 - v / Math.max(.8,...history) * 50}`).join(' ')} /></svg></div></div>
      </div>
      <p className="lab-note">This is a real, small neural network trained in your browser with full-batch gradient descent. Try removing all hidden layers: a linear decision boundary cannot solve XOR. Changing the architecture resets training.</p>
    </div>
  );
}
