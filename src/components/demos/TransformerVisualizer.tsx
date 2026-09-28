import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface Token {
  text: string;
  id: number;
  attention: number[];
}

const sentences = [
  ['The', 'cat', 'sat', 'on', 'the', 'mat'],
  ['AI', 'is', 'transforming', 'the', 'world'],
  ['Deep', 'learning', 'powers', 'modern', 'AI'],
];

export default function TransformerVisualizer() {
  const [selectedSentence, setSelectedSentence] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredToken, setHoveredToken] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tokens = sentences[selectedSentence];

  // Generate attention weights based on position
  const generateAttention = (tokenIndex: number) => {
    const scores = tokens.map((_, i) => Math.exp(-Math.abs(i - tokenIndex) * 0.7));
    const total = scores.reduce((sum, value) => sum + value, 0);
    return scores.map(value => value / total);
  };

  const tokenData: Token[] = tokens.map((text, id) => ({
    text,
    id,
    attention: generateAttention(id),
  }));

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= tokens.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, tokens.length]);

  const reset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setHoveredToken(null);
  };

  const getAttentionColor = (weight: number) => {
    // Gradient from low (blue) to high (purple/pink)
    const intensity = Math.min(1, weight * 2);
    return `rgba(80, 155, 145, ${0.2 + intensity * 0.8})`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
        <select
          aria-label="Example sentence"
          value={selectedSentence}
          onChange={(e) => {
            setSelectedSentence(Number(e.target.value));
            reset();
          }}
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:border-brand-accent focus:outline-none"
        >
          {sentences.map((s, i) => (
            <option key={i} value={i}>{s.join(' ')}</option>
          ))}
        </select>

        <button
          onClick={() => { if (!isPlaying && currentStep === tokens.length - 1) setCurrentStep(0); setIsPlaying(!isPlaying); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-accent text-white text-sm font-medium hover:bg-brand-accent/80 transition-colors"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg glass-card text-white text-sm hover:bg-white/5 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-1 mb-8">
        {tokens.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i <= currentStep ? 'w-8 bg-brand-accent' : 'w-8 bg-white/10'
            }`}
          />
        ))}
      </div>

      {/* Token Row */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tokenData.map((token, i) => (
          <button
            type="button"
            aria-pressed={hoveredToken === i}
            onClick={() => {setHoveredToken(i);setCurrentStep(i);}}
            onFocus={() => setHoveredToken(i)}
            key={token.id}
            className={`relative px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer ${
              i === currentStep && isPlaying
                ? 'bg-brand-accent text-white scale-110 shadow-lg shadow-brand-accent/30'
                : i < currentStep
                ? 'bg-brand-accent/30 text-white'
                : 'glass-card text-gray-300 hover:bg-white/5'
            }`}
            onMouseEnter={() => setHoveredToken(i)}
            onMouseLeave={() => setHoveredToken(null)}
          >
            <span className="font-medium">{token.text}</span>
            {i === currentStep && isPlaying && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Attention Matrix */}
      <div className="glass-card p-4 rounded-xl">
        <h4 className="text-sm font-medium text-gray-400 mb-4 text-center">
          Attention Heatmap {hoveredToken !== null && `(Selected: "${tokens[hoveredToken]}")`}
        </h4>
        
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Header row */}
            <div className="flex">
              <div className="flex-shrink-0 w-16" />
              {tokens.map((token, i) => (
                <div
                  key={i}
                  className={`w-14 text-center text-xs py-2 transition-colors ${
                    hoveredToken === i ? 'text-brand-accent font-medium' : 'text-gray-500'
                  }`}
                >
                  {token}
                </div>
              ))}
            </div>

            {/* Matrix rows */}
            {tokenData.map((token, rowIdx) => (
              <div key={rowIdx} className="flex items-center">
                <div
                  className={`w-16 text-right text-xs pr-3 py-2 transition-colors ${
                    hoveredToken === rowIdx ? 'text-brand-accent font-medium' : 'text-gray-500'
                  }`}
                >
                  {token.text}
                </div>
                {token.attention.map((weight, colIdx) => {
                  const isHighlighted = hoveredToken === rowIdx || hoveredToken === colIdx;
                  const displayWeight = weight;
                  
                  return (
                    <div
                      key={colIdx}
                      className="flex-shrink-0 w-14 h-10 flex items-center justify-center p-1"
                    >
                      <div
                        className={`w-full h-full rounded flex items-center justify-center text-xs font-mono transition-all duration-200 ${
                          isHighlighted ? 'scale-110' : ''
                        }`}
                        style={{
                          backgroundColor: getAttentionColor(displayWeight),
                          color: displayWeight > 0.3 ? 'white' : 'rgba(255,255,255,0.5)',
                        }}
                      >
                        {(displayWeight * 100).toFixed(0)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
          <span>Low Attention</span>
          <div className="w-24 h-2 rounded-full bg-gradient-to-r from-teal-900 to-teal-300" />
          <span>High Attention</span>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-6 text-center text-sm text-gray-400">
        <p>
          Illustrative attention weights, normalized so each row sums to 100%. These are not outputs from a trained transformer.
          <br />
          Select or focus a token to inspect its attention pattern.
        </p>
      </div>
    </div>
  );
}
