import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { Scan, ScanEye, Layers } from 'lucide-react';
import { filterPortrait, orientationCells } from '../lib/vision/filters';
import type { EdgeFilter } from '../lib/vision/edges';

type Mode = 'edges' | 'objects' | 'imaging';
const edgeOptions: { id: EdgeFilter | 'features'; name: string; description: string }[] = [
  { id: 'sobel', name: 'Sobel', description: 'Combines horizontal and vertical gradients to reveal changes in brightness.' },
  { id: 'canny', name: 'Canny-style', description: 'Smooths noise, thins edges, and connects strong boundaries with nearby weaker ones.' },
  { id: 'prewitt', name: 'Prewitt', description: 'Uses evenly weighted gradient filters. Compare its texture with Sobel.' },
  { id: 'laplacian', name: 'Laplacian', description: 'Uses second derivatives to highlight rapid intensity changes and fine detail.' },
  { id: 'horizontal', name: 'Horizontal edges', description: 'Measures changes from top to bottom, emphasizing horizontal boundaries.' },
  { id: 'vertical', name: 'Vertical edges', description: 'Measures changes from left to right, emphasizing vertical boundaries.' },
  { id: 'features', name: 'Orientation features', description: 'HOG-style cells summarize local edge directions. Longer strokes mean stronger gradients.' },
];
const annotations = [
  { name: 'Person', box: [18, 4, 65, 96], detail: 'The full subject: a broad region containing several smaller objects.' },
  { name: 'Shirt', box: [19, 33, 64, 67], detail: 'Clothing has an irregular outline, folds, and partially occluded regions.' },
  { name: 'Face', box: [39, 12, 23, 25], detail: 'A smaller region nested within the person, with its own visual features.' },
  { name: 'Hair', box: [35, 4, 29, 23], detail: 'Fine texture and a soft boundary make hair an interesting segmentation target.' },
  { name: 'Glasses', box: [42.5, 18.2, 18, 5.3], detail: 'Thin frames and transparent lenses make this a small, low-contrast object.' },
  { name: 'Watch', box: [50.2, 67, 6.4, 9], detail: 'A small accessory: its scale is very different from the person around it.' },
] as const;
const scans = [
  { id: 'xray', name: 'X-ray', description: 'A radiograph-inspired study of skeletal structure and overlapping forms.' },
  { id: 'ct', name: 'CT', description: 'A CT-inspired volume illustration, emphasizing depth and three-dimensional structure.' },
  { id: 'mri', name: 'MRI', description: 'An MRI-inspired illustration emphasizing soft-tissue forms and layered contrast.' },
] as const;

export default function PortraitLens() {
  const frame = useRef<HTMLDivElement>(null), image = useRef<HTMLImageElement>(null), canvas = useRef<HTMLCanvasElement>(null);
  const source = useRef<ImageData | null>(null), position = useRef({ x: 72, y: 72 });
  const [mode, setMode] = useState<Mode>('edges');
  const [edge, setEdge] = useState<EdgeFilter | 'features'>('sobel');
  const [ready, setReady] = useState(false), [enabled, setEnabled] = useState(true);
  const [selected, setSelected] = useState(0), [scan, setScan] = useState(0), [fullView, setFullView] = useState(false);
  const [scanError, setScanError] = useState(false);

  useEffect(() => {
    const portrait = image.current;
    if (!portrait) return;
    const prepare = () => {
      const buffer = document.createElement('canvas'); buffer.width = 576; buffer.height = 576;
      const context = buffer.getContext('2d', { willReadFrequently: true });
      if (!context) return;
      context.drawImage(portrait, 0, 0, 576, 576);
      source.current = context.getImageData(0, 0, 576, 576); setReady(true);
    };
    if (portrait.complete && portrait.naturalWidth) prepare();
    portrait.addEventListener('load', prepare);
    return () => portrait.removeEventListener('load', prepare);
  }, []);

  useEffect(() => {
    const original = source.current, context = canvas.current?.getContext('2d');
    if (!ready || !original || !context) return;
    if (edge === 'features') {
      context.fillStyle = '#0b141b'; context.fillRect(0, 0, 576, 576);
      for (const cell of orientationCells(original.data, 576, 576)) {
        context.strokeStyle = '#8edbd219'; context.lineWidth = .7;
        context.strokeRect(cell.x - cell.size / 2, cell.y - cell.size / 2, cell.size, cell.size);
        cell.bins.forEach((weight, bin) => {
          if (weight < .06 || cell.energy < 1) return;
          const angle = bin * Math.PI / 9 + Math.PI / 2, radius = cell.size * .42 * weight;
          context.strokeStyle = `rgba(175,235,219,${Math.min(1, .2 + weight * .8)})`; context.lineWidth = 1.5;
          context.beginPath(); context.moveTo(cell.x - Math.cos(angle) * radius, cell.y - Math.sin(angle) * radius);
          context.lineTo(cell.x + Math.cos(angle) * radius, cell.y + Math.sin(angle) * radius); context.stroke();
        });
      }
    } else context.putImageData(new ImageData(filterPortrait(original.data, 576, 576, 'edges', edge), 576, 576), 0, 0);
  }, [ready, edge]);

  const move = (x: number, y: number) => {
    position.current = { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
    frame.current?.style.setProperty('--lens-x', `${position.current.x}%`);
    frame.current?.style.setProperty('--lens-y', `${position.current.y}%`);
    if (mode === 'objects') {
      // Prefer the smallest nested annotation under the pointer.
      const hit = annotations.map((item, index) => ({...item, index})).filter(({box:[bx,by,w,h]}) => x >= bx && x <= bx+w && y >= by && y <= by+h).sort((a,b) => a.box[2]*a.box[3] - b.box[2]*b.box[3])[0];
      if (hit) setSelected(hit.index);
    }
  };
  const point = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect(); move((event.clientX - bounds.left) / bounds.width * 100, (event.clientY - bounds.top) / bounds.height * 100);
  };
  const key = (event: KeyboardEvent<HTMLDivElement>) => {
    const directions: Record<string, [number, number]> = { ArrowLeft: [-5, 0], ArrowRight: [5, 0], ArrowUp: [0, -5], ArrowDown: [0, 5] };
    if (directions[event.key]) {
      event.preventDefault();
      if (mode === 'objects') setSelected(value => (value + (event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? annotations.length - 1 : 1)) % annotations.length);
      else { const [dx, dy] = directions[event.key]; move(position.current.x + dx, position.current.y + dy); }
    }
    if (event.key === 'Home') { event.preventDefault(); move(72, 72); setSelected(0); }
  };
  const choose = (next: Mode) => { setMode(next); setEnabled(true); };
  const lens = enabled && (mode === 'edges' && ready || mode === 'imaging' && !fullView);
  const annotation = annotations[selected], [x,y,w,h] = annotation.box;
  const description = mode === 'edges' ? edgeOptions.find(item => item.id === edge)!.description : mode === 'objects' ? annotation.detail : scans[scan].description;

  return <figure className="portrait-experience">
    <div className="portrait-caption"><span>A CLOSER LOOK</span><span>01 / COMPUTER VISION</span></div>
    <div ref={frame} className={`portrait-frame ${lens ? 'lens-enabled' : ''} ${mode === 'imaging' ? 'imaging-mode' : ''} ${mode === 'imaging' && enabled && fullView ? 'full-scan' : ''}`} role="group" tabIndex={enabled ? 0 : -1} aria-label="Interactive portrait" aria-describedby="lens-instructions" onPointerMove={point} onPointerDown={point} onKeyDown={key}>
      <img ref={image} src="/1.webp" alt="Dr. Arjun Sarkar" width="576" height="576" fetchPriority="high" />
      <canvas ref={canvas} width="576" height="576" aria-hidden="true" />
      {mode === 'imaging' && <img key={scans[scan].id} className="scan-layer" src={`/vision/portrait-${scans[scan].id}.webp`} alt="" aria-hidden="true" onError={() => setScanError(true)} onLoad={() => setScanError(false)} />}
      <span className="portrait-lens-ring" aria-hidden="true"><span>{mode === 'imaging' ? scans[scan].name.toUpperCase() : edge === 'features' ? 'HOG' : edge.toUpperCase()}</span></span>
      {enabled && mode === 'objects' && <div className="detection-overlay"><div className="detection-box" style={{left:`${x}%`,top:`${y}%`,width:`${w}%`,height:`${h}%`}}><span>{annotation.name}</span></div></div>}
      <span className="portrait-hint" id="lens-instructions">{mode === 'objects' ? 'Hover, tap, or use arrow keys to explore objects' : 'Move, tap, or use arrow keys to explore'}</span>
      {enabled && mode === 'imaging' && <span className="scan-disclosure">CONCEPTUAL ILLUSTRATION</span>}
    </div>
    <figcaption className="portrait-tools">
      <div className="portrait-controls" role="group" aria-label="Portrait modes">
        <button type="button" disabled={!ready} aria-pressed={enabled && mode === 'edges'} onClick={() => choose('edges')}><Scan size={15}/>Edges</button>
        <button type="button" aria-pressed={enabled && mode === 'objects'} onClick={() => choose('objects')}><ScanEye size={15}/>Detect</button>
        <button type="button" aria-pressed={enabled && mode === 'imaging'} onClick={() => choose('imaging')}><Layers size={15}/>Imaging</button>
        <button type="button" className="portrait-original" aria-pressed={!enabled} onClick={() => setEnabled(value => !value)}>{enabled ? 'Original' : 'Show effect'}</button>
      </div>
      <div className="vision-options">
        {mode === 'edges' && <label className="edge-selector">Filter<select value={edge} onChange={event => { setEdge(event.target.value as EdgeFilter | 'features'); setEnabled(true); }}>{edgeOptions.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>}
        {mode === 'objects' && <div className="object-selectors" role="group" aria-label="Portrait annotations">{annotations.map((item, index) => <button key={item.name} aria-pressed={selected === index} onClick={() => {setSelected(index);setEnabled(true);}}>{item.name}</button>)}</div>}
        {mode === 'imaging' && <div className="scan-options" role="group" aria-label="Imaging illustration">{scans.map((item, index) => <button key={item.id} aria-pressed={scan === index} onClick={() => {setScan(index);setEnabled(true);setScanError(false);}}>{item.name}</button>)}<button className="scan-view-toggle" aria-pressed={fullView} onClick={() => setFullView(value => !value)}>{fullView ? 'Use lens' : 'Full view'}</button></div>}
      </div>
      <p className="portrait-explanation" aria-live="polite">{description}</p>
      <p className="vision-footnote">{mode === 'objects' ? 'Curated portrait annotations · explore by hovering or tapping' : mode === 'imaging' ? 'AI-created illustrations, not actual scans or inferred anatomy.' : 'Calculated from this portrait · no model downloads'}</p>
      {scanError && mode === 'imaging' && <p className="vision-error" role="alert">This illustration could not load. Please try another view.</p>}
    </figcaption>
  </figure>;
}
