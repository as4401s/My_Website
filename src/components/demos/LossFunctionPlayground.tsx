import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, TrendingDown } from 'lucide-react';

interface DataPoint {
  x: number;
  y: number;
  predicted: number;
}

type LossType = 'mse' | 'mae' | 'huber' | 'crossentropy';

const lossFunctions: Record<LossType, { name: string; formula: string; description: string }> = {
  mse: {
    name: 'Mean Squared Error',
    formula: 'L = (1/n) × Σ(y - ŷ)²',
    description: 'Penalizes larger errors more heavily. Good for regression.',
  },
  mae: {
    name: 'Mean Absolute Error',
    formula: 'L = (1/n) × Σ|y - ŷ|',
    description: 'More robust to outliers. Linear penalty for errors.',
  },
  huber: {
    name: 'Huber Loss',
    formula: 'L = { 0.5×(y-ŷ)² if |y-ŷ|<δ, δ×|y-ŷ|-0.5×δ² otherwise }',
    description: 'Combines MSE and MAE. Less sensitive to outliers than MSE.',
  },
  crossentropy: {
    name: 'Binary Cross-Entropy',
    formula: 'L = -[y×log(ŷ) + (1-y)×log(1-ŷ)]',
    description: 'Used for classification. Measures probability divergence.',
  },
};

export default function LossFunctionPlayground() {
  const [lossType, setLossType] = useState<LossType>('mse');
  const [learningRate, setLearningRate] = useState(0.1);
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(0);
  const [weight, setWeight] = useState(0.5);
  const [bias, setBias] = useState(0);
  const [lossHistory, setLossHistory] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

  // Generate sample data
  const generateData = (): DataPoint[] => {
    const points: DataPoint[] = [];
    for (let i = 0; i < 20; i++) {
      const x = i / 19;
      const noise = (Math.random() - 0.5) * 0.3;
      points.push({ x, y: 0.5 + 0.3 * x + noise, predicted: 0 });
    }
    return points;
  };

  const [data, setData] = useState<DataPoint[]>(generateData());

  const calculateLoss = (w: number, b: number, points: DataPoint[]): number => {
    let totalLoss = 0;
    
    points.forEach((point) => {
      const predicted = w * point.x + b;
      const error = point.y - predicted;
      
      switch (lossType) {
        case 'mse':
          totalLoss += error * error;
          break;
        case 'mae':
          totalLoss += Math.abs(error);
          break;
        case 'huber':
          const delta = 0.5;
          if (Math.abs(error) < delta) {
            totalLoss += 0.5 * error * error;
          } else {
            totalLoss += delta * Math.abs(error) - 0.5 * delta * delta;
          }
          break;
        case 'crossentropy':
          // Simplified for demo
          const p = Math.max(0.001, Math.min(0.999, predicted));
          const y = point.y > 0.5 ? 1 : 0;
          totalLoss += -(y * Math.log(p) + (1 - y) * Math.log(1 - p));
          break;
      }
    });
    
    return totalLoss / points.length;
  };

  const trainStep = () => {
    setWeight((prevW) => {
      setBias((prevB) => {
        // Simple gradient descent
        let dw = 0;
        let db = 0;
        
        data.forEach((point) => {
          const predicted = prevW * point.x + prevB;
          const error = point.y - predicted;
          
          dw += -2 * error * point.x;
          db += -2 * error;
        });
        
        dw /= data.length;
        db /= data.length;
        
        const newW = prevW - learningRate * dw;
        const newB = prevB - learningRate * db;
        
        const newLoss = calculateLoss(newW, newB, data);
        setLoss(newLoss);
        setLossHistory((prev) => [...prev.slice(-49), newLoss]);
        setEpoch((e) => e + 1);
        
        return newB;
      });
      return prevW - learningRate * (() => {
        let dw = 0;
        data.forEach((point) => {
          const predicted = prevW * point.x + bias;
          const error = point.y - predicted;
          dw += -2 * error * point.x;
        });
        return dw / data.length;
      })();
    });
  };

  useEffect(() => {
    if (isTraining) {
      const animate = () => {
        trainStep();
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isTraining, learningRate, data, lossType]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * width;
      const y = (i / 10) * height;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw data points
    data.forEach((point) => {
      const px = point.x * width;
      const py = height - point.y * height;
      
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw regression line
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const y1 = height - (weight * 0 + bias) * height;
    const y2 = height - (weight * 1 + bias) * height;
    ctx.moveTo(0, y1);
    ctx.lineTo(width, y2);
    ctx.stroke();

    // Draw predicted points
    data.forEach((point) => {
      const px = point.x * width;
      const py = height - (weight * point.x + bias) * height;
      
      ctx.fillStyle = 'rgba(139, 92, 246, 0.5)';
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw error line
      const actualY = height - point.y * height;
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px, actualY);
      ctx.stroke();
    });
  }, [data, weight, bias]);

  const reset = () => {
    setIsTraining(false);
    setEpoch(0);
    setLoss(0);
    setWeight(0.5);
    setBias(0);
    setLossHistory([]);
    setData(generateData());
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Controls */}
      <div className="glass-card p-4 rounded-xl mb-4">
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Loss Function Selector */}
          <div>
            <label className="text-xs text-gray-500 mb-2 block">Loss Function</label>
            <select
              value={lossType}
              onChange={(e) => {
                setLossType(e.target.value as LossType);
                reset();
              }}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:border-brand-accent focus:outline-none"
            >
              {Object.entries(lossFunctions).map(([key, info]) => (
                <option key={key} value={key}>{info.name}</option>
              ))}
            </select>
          </div>

          {/* Learning Rate */}
          <div>
            <label className="text-xs text-gray-500 mb-2 block">
              Learning Rate: {learningRate.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.01"
              max="0.5"
              step="0.01"
              value={learningRate}
              onChange={(e) => setLearningRate(Number(e.target.value))}
              className="w-full accent-brand-accent"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setIsTraining(!isTraining)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-brand-accent text-white text-sm font-medium hover:bg-brand-accent/80 transition-colors"
          >
            {isTraining ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isTraining ? 'Pause' : 'Train'}
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg glass-card text-white text-sm hover:bg-white/5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Formula Display */}
      <div className="glass-card p-3 rounded-lg mb-4 text-center">
        <p className="text-xs text-gray-500 mb-1">{lossFunctions[lossType].name}</p>
        <p className="text-sm font-mono text-brand-accent">{lossFunctions[lossType].formula}</p>
        <p className="text-xs text-gray-500 mt-2">{lossFunctions[lossType].description}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="glass-card p-3 rounded-lg text-center">
          <p className="text-xs text-gray-500">Epoch</p>
          <p className="text-xl font-bold text-white">{epoch}</p>
        </div>
        <div className="glass-card p-3 rounded-lg text-center">
          <p className="text-xs text-gray-500">Loss</p>
          <p className="text-xl font-bold text-brand-accent">{loss.toFixed(4)}</p>
        </div>
        <div className="glass-card p-3 rounded-lg text-center">
          <p className="text-xs text-gray-500">Weight</p>
          <p className="text-xl font-bold text-purple-400">{weight.toFixed(3)}</p>
        </div>
      </div>

      {/* Visualization */}
      <div className="glass-card p-4 rounded-xl">
        <canvas
          ref={canvasRef}
          width={600}
          height={300}
          className="w-full h-auto rounded-lg"
        />
        
        <div className="flex items-center justify-center gap-6 mt-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-gray-400">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500/50" />
            <span className="text-gray-400">Predicted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-purple-500" />
            <span className="text-gray-400">Model</span>
          </div>
        </div>
      </div>

      {/* Loss History Chart */}
      {lossHistory.length > 1 && (
        <div className="glass-card p-4 rounded-xl mt-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-400">Loss Over Time</span>
          </div>
          <div className="h-20 flex items-end gap-0.5">
            {lossHistory.map((l, i) => {
              const maxLoss = Math.max(...lossHistory);
              const height = maxLoss > 0 ? (l / maxLoss) * 100 : 0;
              return (
                <div
                  key={i}
                  className="flex-1 bg-brand-accent/50 rounded-t"
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
