import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Mountain, Zap, StepForward } from 'lucide-react';

import { optimize, initialOptimizer } from '../../lib/lab/optimizer';

type OptimizationType = 'sgd' | 'momentum' | 'adam';
type FunctionType = 'quadratic' | 'rosenbrock' | 'himmelblau';

export default function GradientDescentVisualizer() {
  const [isRunning, setIsRunning] = useState(false);
  const [position, setPosition] = useState({ x: 4, y: 4 });
  const [learningRate, setLearningRate] = useState(0.1);
  const [optimizer, setOptimizer] = useState<OptimizationType>('sgd');
  const [functionType, setFunctionType] = useState<FunctionType>('quadratic');
  const [iteration, setIteration] = useState(0);
  const [path, setPath] = useState<{ x: number; y: number }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const optimizerRef = useRef(initialOptimizer());

  // Objective functions
  const functions = {
    quadratic: {
      f: (x: number, y: number) => (x - 2) ** 2 + (y - 2) ** 2,
      grad: (x: number, y: number) => ({ x: 2 * (x - 2), y: 2 * (y - 2) }),
      name: 'Quadratic Bowl',
      minima: { x: 2, y: 2 },
    },
    rosenbrock: {
      f: (x: number, y: number) => (1 - x) ** 2 + 100 * (y - x ** 2) ** 2,
      grad: (x: number, y: number) => ({
        x: -2 * (1 - x) - 400 * x * (y - x ** 2),
        y: 200 * (y - x ** 2),
      }),
      name: "Rosenbrock's Valley",
      minima: { x: 1, y: 1 },
    },
    himmelblau: {
      f: (x: number, y: number) => (x ** 2 + y - 11) ** 2 + (x + y ** 2 - 7) ** 2,
      grad: (x: number, y: number) => ({
        x: 4 * x * (x ** 2 + y - 11) + 2 * (x + y ** 2 - 7),
        y: 2 * (x ** 2 + y - 11) + 4 * y * (x + y ** 2 - 7),
      }),
      name: "Himmelblau's Function",
      minima: { x: 3, y: 2 },
    },
  };

  const currentFunc = functions[functionType];

  const drawLandscape = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const scale = 40;
    const offsetX = width / 2;
    const offsetY = height / 2;

    // Sample the actual objective to display its loss landscape.
    for (let px = 0; px < width; px += 5) {
      for (let py = 0; py < height; py += 5) {
        const value = currentFunc.f((px - offsetX) / scale, (py - offsetY) / scale);
        const intensity = Math.min(1, Math.log1p(value) / (functionType === 'quadratic' ? 5 : 12));
        ctx.fillStyle = `rgba(70, 145, 138, ${0.06 + (1-intensity) * 0.32})`;
        ctx.fillRect(px, py, 5, 5);
      }
    }

    // Draw gradient field (arrows)
    for (let x = -4; x <= 4; x += 1) {
      for (let y = -4; y <= 4; y += 1) {
        const grad = currentFunc.grad(x, y);
        const magnitude = Math.sqrt(grad.x ** 2 + grad.y ** 2);
        const normalized = {
          x: -grad.x / (magnitude + 0.1),
          y: -grad.y / (magnitude + 0.1),
        };

        const startX = offsetX + x * scale;
        const startY = offsetY + y * scale;
        const endX = startX + normalized.x * 15;
        const endY = startY + normalized.y * 15;

        ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Arrow head
        const angle = Math.atan2(normalized.y, normalized.x);
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - 5 * Math.cos(angle - Math.PI / 6),
          endY - 5 * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - 5 * Math.cos(angle + Math.PI / 6),
          endY - 5 * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
      }
    }

    // Draw path
    if (path.length > 1) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      path.forEach((p, i) => {
        const x = offsetX + p.x * scale;
        const y = offsetY + p.y * scale;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Draw dots along path
      path.forEach((p, i) => {
        const x = offsetX + p.x * scale;
        const y = offsetY + p.y * scale;
        const alpha = (i / path.length) * 0.7 + 0.3;
        ctx.fillStyle = `rgba(245, 158, 11, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Draw minima
    const minimaX = offsetX + currentFunc.minima.x * scale;
    const minimaY = offsetY + currentFunc.minima.y * scale;
    ctx.strokeStyle = '#10b981';
    ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(minimaX, minimaY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw current position
    const posX = offsetX + position.x * scale;
    const posY = offsetY + position.y * scale;

    // Glow
    const gradient = ctx.createRadialGradient(posX, posY, 0, posX, posY, 20);
    gradient.addColorStop(0, 'rgba(239, 68, 68, 0.6)');
    gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(posX, posY, 20, 0, Math.PI * 2);
    ctx.fill();

    // Position marker
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(posX, posY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [currentFunc, position, path, functionType]);

  const performStep = useCallback(() => {
    const grad = currentFunc.grad(position.x, position.y);
    const result = optimize(position, grad, learningRate, optimizer, optimizerRef.current);
    const newPos = result.position;
    optimizerRef.current = result.state;

    // Bounds checking
    newPos.x = Math.max(-5, Math.min(5, newPos.x));
    newPos.y = Math.max(-5, Math.min(5, newPos.y));

    setPosition(newPos);
    setPath((prev) => [...prev.slice(-50), newPos]);
    setIteration((prev) => prev + 1);

    // Stop if converged
    const nextGradient = currentFunc.grad(newPos.x, newPos.y);
    if (Math.hypot(nextGradient.x, nextGradient.y) < 0.01) {
      setIsRunning(false);
    }
  }, [position, optimizer, learningRate, currentFunc]);

  useEffect(() => {
    drawLandscape();
  }, [drawLandscape]);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        if (!document.hidden) performStep();
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isRunning, performStep]);

  const reset = () => {
    setIsRunning(false);
    setPosition({ x: 4, y: 4 });
    setPath([]);
    setIteration(0);
    optimizerRef.current = initialOptimizer();
  };

  const currentLoss = currentFunc.f(position.x, position.y);

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="relative bg-black/40 rounded-lg p-4 border border-white/10">
        <canvas role="img" aria-label="Loss landscape, gradient directions, and optimizer path" ref={canvasRef} width={500} height={500} className="w-full h-auto" />

        {/* Stats Overlay */}
        <div className="absolute top-6 right-6 glass-card px-4 py-2 rounded-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Iteration:</span>
              <span className="text-brand-accent font-mono font-bold">{iteration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Loss:</span>
              <span className="text-orange-400 font-mono font-bold">{currentLoss.toFixed(4)}</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 left-6 glass-card px-3 py-2 rounded-lg">
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-gray-400">Current Position</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-400">Known Minimum</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-amber-500" />
              <span className="text-gray-400">Optimization Path</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Function Selection */}
        <div className="glass-card p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Mountain className="w-4 h-4 text-brand-accent" />
            <h4 className="font-semibold text-white">Loss Landscape</h4>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Function Type</label>
              <select
                aria-label="Loss landscape"
                value={functionType}
                onChange={(e) => {
                  setFunctionType(e.target.value as FunctionType);
                  setLearningRate(e.target.value === 'rosenbrock' ? .001 : e.target.value === 'himmelblau' ? .01 : .1);
                  reset();
                }}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="quadratic">Quadratic Bowl (Easy)</option>
                <option value="rosenbrock">Rosenbrock's Valley (Hard)</option>
                <option value="himmelblau">Himmelblau's Function (Complex)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                Learning Rate: {learningRate.toFixed(4)}
              </label>
              <input
                aria-label="Optimizer learning rate"
                type="range"
                min="0.0001"
                max="0.5"
                step="0.0001"
                value={learningRate}
                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                className="w-full accent-brand-accent"
              />
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Position:</div>
              <div className="text-sm text-white font-mono">
                x: {position.x.toFixed(2)}, y: {position.y.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400 mt-2 mb-1">One minimum:</div>
              <div className="text-sm text-green-400 font-mono">
                x: {currentFunc.minima.x.toFixed(2)}, y: {currentFunc.minima.y.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Optimizer Settings */}
        <div className="glass-card p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-yellow-400" />
            <h4 className="font-semibold text-white">Optimizer</h4>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              {(['sgd', 'momentum', 'adam'] as OptimizationType[]).map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setOptimizer(opt);
                    reset();
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${optimizer === opt
                    ? 'bg-brand-accent/30 text-brand-accent border border-brand-accent/50'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                >
                  {opt === 'sgd' && 'SGD (Stochastic Gradient Descent)'}
                  {opt === 'momentum' && 'SGD with Momentum'}
                  {opt === 'adam' && 'Adam Optimizer'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isRunning
                  ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'
                  : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  }`}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isRunning ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={reset}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>

            <button disabled={isRunning} onClick={performStep} className="flex items-center gap-2 text-sm text-brand-accent disabled:opacity-40"><StepForward size={15} />One step</button>
            <div className="text-xs text-gray-500 leading-relaxed">
              Visualize how different optimizers navigate loss landscapes. Brighter regions have lower loss. Paths are clipped at the plotting boundary; reduce the learning rate if updates bounce at the edges.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
