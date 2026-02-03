import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Layers, TrendingUp } from 'lucide-react';

interface Layer {
  neurons: number;
  activation: 'relu' | 'sigmoid' | 'tanh';
}

export default function NeuralNetworkPlayground() {
  const [layers, setLayers] = useState<Layer[]>([
    { neurons: 2, activation: 'relu' },
    { neurons: 4, activation: 'relu' },
    { neurons: 1, activation: 'sigmoid' },
  ]);
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(1.0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Simple 2D dataset for XOR problem
  const dataset = [
    { input: [0, 0], output: 0 },
    { input: [0, 1], output: 1 },
    { input: [1, 0], output: 1 },
    { input: [1, 1], output: 0 },
  ];

  useEffect(() => {
    drawNetwork();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layers]);

  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(() => {
        setEpoch(prev => prev + 1);
        // Simulate loss decreasing
        setLoss(prev => Math.max(0.01, prev * 0.98 + (Math.random() - 0.5) * 0.02));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isTraining]);

  const drawNetwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Calculate layer positions
    const layerSpacing = width / (layers.length + 1);
    const layerPositions: { x: number; y: number }[][] = [];

    // Draw connections first (behind neurons)
    layers.forEach((layer, layerIndex) => {
      const x = layerSpacing * (layerIndex + 1);
      const positions: { x: number; y: number }[] = [];

      const neuronSpacing = height / (layer.neurons + 1);

      for (let i = 0; i < layer.neurons; i++) {
        const y = neuronSpacing * (i + 1);
        positions.push({ x, y });
      }

      layerPositions.push(positions);
    });

    // Draw connections
    for (let i = 0; i < layerPositions.length - 1; i++) {
      layerPositions[i].forEach(start => {
        layerPositions[i + 1].forEach(end => {
          const weight = Math.random();
          ctx.strokeStyle = `rgba(59, 130, 246, ${weight * 0.3})`;
          ctx.lineWidth = 1 + weight * 2;
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
        });
      });
    }

    // Draw neurons
    layers.forEach((_layer, layerIndex) => {
      layerPositions[layerIndex].forEach((pos, neuronIndex) => {
        // Neuron glow
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 15);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
        gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.4)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 15, 0, Math.PI * 2);
        ctx.fill();

        // Neuron core
        ctx.fillStyle = isTraining ? '#3b82f6' : '#1e40af';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Neuron border
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Activation indicator
        if (isTraining) {
          const activation = Math.sin(Date.now() / 200 + neuronIndex);
          ctx.fillStyle = `rgba(34, 197, 94, ${(activation + 1) / 2})`;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Layer label
      ctx.fillStyle = '#9ca3af';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      const x = layerSpacing * (layerIndex + 1);
      const label = layerIndex === 0 ? 'Input' : layerIndex === layers.length - 1 ? 'Output' : `Hidden ${layerIndex}`;
      ctx.fillText(label, x, 20);
    });

    if (isTraining) {
      animationRef.current = requestAnimationFrame(drawNetwork);
    }
  };

  const addLayer = () => {
    if (layers.length < 5) {
      const newLayers = [...layers];
      newLayers.splice(layers.length - 1, 0, { neurons: 3, activation: 'relu' });
      setLayers(newLayers);
    }
  };

  const removeLayer = () => {
    if (layers.length > 2) {
      const newLayers = [...layers];
      newLayers.splice(layers.length - 2, 1);
      setLayers(newLayers);
    }
  };

  const updateNeurons = (layerIndex: number, delta: number) => {
    const newLayers = [...layers];
    const newNeurons = Math.max(1, Math.min(8, newLayers[layerIndex].neurons + delta));
    newLayers[layerIndex].neurons = newNeurons;
    setLayers(newLayers);
  };

  const updateActivation = (layerIndex: number, activation: 'relu' | 'sigmoid' | 'tanh') => {
    const newLayers = [...layers];
    newLayers[layerIndex].activation = activation;
    setLayers(newLayers);
  };

  const reset = () => {
    setIsTraining(false);
    setEpoch(0);
    setLoss(1.0);
    drawNetwork();
  };

  const toggleTraining = () => {
    setIsTraining(!isTraining);
    if (!isTraining) {
      drawNetwork();
    }
  };

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="relative bg-black/40 rounded-lg p-4 border border-white/10">
        <canvas
          ref={canvasRef}
          width={600}
          height={300}
          className="w-full h-auto"
        />

        {/* Training Stats Overlay */}
        <div className="absolute top-6 right-6 glass-card px-4 py-2 rounded-lg">
          <div className="flex items-center gap-3 text-sm">
            <div>
              <span className="text-gray-400">Epoch:</span>
              <span className="ml-2 text-brand-accent font-mono font-bold">{epoch}</span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div>
              <span className="text-gray-400">Loss:</span>
              <span className="ml-2 text-green-400 font-mono font-bold">{loss.toFixed(4)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Network Architecture */}
        <div className="glass-card p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-brand-accent" />
            <h4 className="font-semibold text-white">Network Architecture</h4>
          </div>

          <div className="space-y-2 mb-3">
            {layers.map((layer, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-16">
                  {index === 0 ? 'Input' : index === layers.length - 1 ? 'Output' : `Layer ${index}`}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateNeurons(index, -1)}
                    className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-gray-400 text-xs"
                    disabled={layer.neurons <= 1}
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm text-white font-mono">{layer.neurons}</span>
                  <button
                    onClick={() => updateNeurons(index, 1)}
                    className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-gray-400 text-xs"
                    disabled={layer.neurons >= 8}
                  >
                    +
                  </button>
                </div>
                <select
                  value={layer.activation}
                  onChange={(e) => updateActivation(index, e.target.value as any)}
                  className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white"
                  disabled={index === 0}
                >
                  <option value="relu">ReLU</option>
                  <option value="sigmoid">Sigmoid</option>
                  <option value="tanh">Tanh</option>
                </select>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={addLayer}
              disabled={layers.length >= 5}
              className="flex-1 px-3 py-1.5 rounded bg-brand-accent/20 text-brand-accent text-xs hover:bg-brand-accent/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Add Layer
            </button>
            <button
              onClick={removeLayer}
              disabled={layers.length <= 2}
              className="flex-1 px-3 py-1.5 rounded bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              - Remove Layer
            </button>
          </div>
        </div>

        {/* Training Controls */}
        <div className="glass-card p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <h4 className="font-semibold text-white">Training</h4>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={toggleTraining}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isTraining
                    ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'
                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                }`}
              >
                {isTraining ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isTraining ? 'Pause' : 'Train'}
              </button>
              <button
                onClick={reset}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-2">Dataset: XOR Problem</div>
              <div className="space-y-1">
                {dataset.map((data, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-gray-500 font-mono">
                      [{data.input.join(', ')}]
                    </span>
                    <span className="text-brand-accent font-mono">→ {data.output}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-gray-500 leading-relaxed">
              Build your own neural network! Add/remove layers, adjust neurons, and watch it train on the classic XOR problem.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
