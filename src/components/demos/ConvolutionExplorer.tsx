import { useEffect, useState } from 'react';
import { Play, Pause, StepForward } from 'lucide-react';
import { convolve, imagePreset, kernels } from '../../lib/lab/convolution';
import type { KernelName } from '../../lib/lab/convolution';

export default function ConvolutionExplorer() {
  const [pixels, setPixels] = useState(() => imagePreset('square'));
  const [kernel, setKernel] = useState<KernelName>('sobelX');
  const [selected, setSelected] = useState(27);
  const [playing, setPlaying] = useState(false);
  const output = convolve(pixels, 8, kernel);
  const max = Math.max(1, ...output.map(Math.abs));
  const filter = kernels[kernel];
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => { if (!document.hidden) setSelected(i => (i + 1) % 64); }, 250);
    return () => clearInterval(timer);
  }, [playing]);
  const terms = filter.values.map((weight, k) => {
    const x = selected % 8 + k % 3 - 1, y = Math.floor(selected / 8) + Math.floor(k / 3) - 1;
    const value = x < 0 || x >= 8 || y < 0 || y >= 8 ? 0 : pixels[y * 8 + x];
    return { value, weight };
  });
  return (
    <div>
      <div className="convolution-toolbar"><label>Image preset<select defaultValue="square" onChange={e => {setPixels(imagePreset(e.target.value));setPlaying(false);}}><option value="square">Square</option><option value="diagonal">Diagonal</option><option value="stripes">Stripes</option><option value="blank">Blank canvas</option></select></label><label>Filter<select value={kernel} onChange={e => setKernel(e.target.value as KernelName)}>{Object.entries(kernels).map(([key,value]) => <option key={key} value={key}>{value.name}</option>)}</select></label></div>
      <div className="convolution-stage">
        <div><h4>01 / Paint the input</h4><p>Click pixels to turn them on or off.</p><div className="pixel-grid">{pixels.map((value, i) => <button key={i} aria-label={`Input row ${Math.floor(i/8)+1}, column ${i%8+1}`} aria-pressed={!!value} onClick={() => setPixels(p => p.map((v,n) => n === i ? 1-v : v))} className={Math.abs(i%8-selected%8)<=1 && Math.abs(Math.floor(i/8)-Math.floor(selected/8))<=1 ? 'in-patch' : ''} style={{background: value ? '#8edbd2' : '#14242b'}} />)}</div></div>
        <div className="kernel-display"><h4>02 / Apply the kernel</h4><p>Multiply, then sum.</p><div className="kernel-grid">{filter.values.map((value,i) => <span key={i}>{value}</span>)}</div>{filter.divisor !== 1 && <span className="kernel-divisor">÷ {filter.divisor}</span>}</div>
        <div><h4>03 / Inspect the output</h4><p>Select a pixel to inspect its calculation.</p><div className="pixel-grid">{output.map((value, i) => <button key={i} aria-label={`Output row ${Math.floor(i/8)+1}, column ${i%8+1}: ${value.toFixed(2)}`} aria-pressed={selected===i} onClick={() => {setSelected(i);setPlaying(false);}} style={{background: value < 0 ? `rgba(207,172,131,${.12+Math.abs(value)/max*.88})` : `rgba(142,219,210,${.12+Math.abs(value)/max*.88})`}} />)}</div></div>
      </div>
      <div className="lab-toolbar"><button className="lab-run" onClick={() => setPlaying(v=>!v)}>{playing ? <Pause size={15}/> : <Play size={15}/>} {playing ? 'Pause scan' : 'Scan image'}</button><button disabled={playing} onClick={()=>setSelected(i=>(i+1)%64)}><StepForward size={15}/>Next pixel</button><span>Row {Math.floor(selected/8)+1}, column {selected%8+1}</span></div>
      <div className="kernel-calculation"><span>({terms.map(({value,weight})=>`${value} × ${weight}`).join(' + ')}) ÷ {filter.divisor}</span><strong>= {output[selected].toFixed(3)}</strong></div>
      <p className="lab-note">{filter.description} Borders use zero padding. Teal represents positive responses; warm tones represent negative responses. This uses cross-correlation, the operation commonly called convolution in neural networks. CNNs learn their kernel weights during training.</p>
    </div>
  );
}
