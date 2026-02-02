import { useState } from 'react';
import { Layers, ArrowRight, Cpu, Filter, Maximize2, Minimize2 } from 'lucide-react';

interface Layer {
  id: string;
  name: string;
  type: 'input' | 'conv' | 'pool' | 'dense' | 'output' | 'skip';
  params: string;
  description: string;
  outputShape: string;
}

const efficientNetV2Layers: Layer[] = [
  { id: 'input', name: 'Input', type: 'input', params: '-', description: '224×224 RGB image', outputShape: '224×224×3' },
  { id: 'stem', name: 'Stem Conv', type: 'conv', params: '1.2K', description: '3×3 conv, stride 2', outputShape: '112×112×24' },
  { id: 'block1', name: 'Fused-MBConv1', type: 'conv', params: '14K', description: '3×3 depthwise + 1×1 pointwise', outputShape: '112×112×24' },
  { id: 'block2', name: 'Fused-MBConv2', type: 'conv', params: '25K', description: '3×3 depthwise, expansion=4', outputShape: '56×56×48' },
  { id: 'block3', name: 'Fused-MBConv3', type: 'conv', params: '35K', description: '3×3 depthwise, SE block', outputShape: '28×28×64' },
  { id: 'block4', name: 'MBConv1', type: 'conv', params: '89K', description: '5×5 depthwise, expansion=6', outputShape: '14×14×128' },
  { id: 'block5', name: 'MBConv2', type: 'conv', params: '312K', description: '5×5 depthwise + SE', outputShape: '14×14×160' },
  { id: 'block6', name: 'MBConv3', type: 'conv', params: '524K', description: '5×5 depthwise, expansion=6', outputShape: '7×7×256' },
  { id: 'pool', name: 'Global Avg Pool', type: 'pool', params: '-', description: 'Spatial average pooling', outputShape: '1×1×256' },
  { id: 'dense', name: 'Classifier', type: 'dense', params: '256K', description: 'Fully connected + dropout', outputShape: '1×1×1000' },
  { id: 'output', name: 'Output', type: 'output', params: '-', description: 'Softmax probabilities', outputShape: '1000 classes' },
];

const mobileNetLayers: Layer[] = [
  { id: 'input', name: 'Input', type: 'input', params: '-', description: '224×224 RGB image', outputShape: '224×224×3' },
  { id: 'conv1', name: 'Conv2D', type: 'conv', params: '864', description: '3×3 conv, stride 2', outputShape: '112×112×32' },
  { id: 'dw1', name: 'Depthwise Conv', type: 'conv', params: '288', description: '3×3 depthwise', outputShape: '112×112×32' },
  { id: 'pw1', name: 'Pointwise Conv', type: 'conv', params: '1K', description: '1×1 conv, 64 filters', outputShape: '112×112×64' },
  { id: 'dw2', name: 'Depthwise Conv', type: 'conv', params: '576', description: '3×3 depthwise, stride 2', outputShape: '56×56×64' },
  { id: 'pw2', name: 'Pointwise Conv', type: 'conv', params: '8K', description: '1×1 conv, 128 filters', outputShape: '56×56×128' },
  { id: 'dw3', name: 'Depthwise Conv', type: 'conv', params: '1K', description: '3×3 depthwise', outputShape: '56×56×128' },
  { id: 'pw3', name: 'Pointwise Conv', type: 'conv', params: '16K', description: '1×1 conv, 128 filters', outputShape: '56×56×128' },
  { id: 'pool', name: 'Global Avg Pool', type: 'pool', params: '-', description: 'Spatial average pooling', outputShape: '1×1×128' },
  { id: 'dense', name: 'Classifier', type: 'dense', params: '128K', description: 'Fully connected', outputShape: '1000 classes' },
];

const resNetLayers: Layer[] = [
  { id: 'input', name: 'Input', type: 'input', params: '-', description: '224×224 RGB image', outputShape: '224×224×3' },
  { id: 'conv1', name: 'Conv1', type: 'conv', params: '9K', description: '7×7 conv, stride 2, 64 filters', outputShape: '112×112×64' },
  { id: 'pool1', name: 'Max Pool', type: 'pool', params: '-', description: '3×3 max pool, stride 2', outputShape: '56×56×64' },
  { id: 'block1', name: 'ResBlock 1', type: 'conv', params: '75K', description: '3×3 conv × 2, 64 filters', outputShape: '56×56×64' },
  { id: 'skip1', name: 'Skip Connection', type: 'skip', params: '-', description: 'Identity shortcut', outputShape: '56×56×64' },
  { id: 'block2', name: 'ResBlock 2', type: 'conv', params: '230K', description: '3×3 conv × 2, 128 filters', outputShape: '28×28×128' },
  { id: 'skip2', name: 'Skip Connection', type: 'skip', params: '-', description: '1×1 projection', outputShape: '28×28×128' },
  { id: 'block3', name: 'ResBlock 3', type: 'conv', params: '919K', description: '3×3 conv × 2, 256 filters', outputShape: '14×14×256' },
  { id: 'skip3', name: 'Skip Connection', type: 'skip', params: '-', description: '1×1 projection', outputShape: '14×14×256' },
  { id: 'pool', name: 'Global Avg Pool', type: 'pool', params: '-', description: 'Spatial average pooling', outputShape: '1×1×256' },
  { id: 'dense', name: 'FC Layer', type: 'dense', params: '512K', description: 'Fully connected', outputShape: '1000 classes' },
];

const architectures = {
  efficientnetv2: { name: 'EfficientNetV2', layers: efficientNetV2Layers, totalParams: '21.5M' },
  mobilenet: { name: 'MobileNet', layers: mobileNetLayers, totalParams: '4.2M' },
  resnet: { name: 'ResNet-18', layers: resNetLayers, totalParams: '11.7M' },
};

export default function ModelArchitectureExplorer() {
  const [selectedArch, setSelectedArch] = useState<keyof typeof architectures>('efficientnetv2');
  const [selectedLayer, setSelectedLayer] = useState<Layer | null>(null);
  const [showDetails, setShowDetails] = useState(true);

  const arch = architectures[selectedArch];

  const getLayerIcon = (type: Layer['type']) => {
    switch (type) {
      case 'input':
      case 'output':
        return <Cpu className="w-4 h-4" />;
      case 'conv':
        return <Filter className="w-4 h-4" />;
      case 'pool':
        return <Minimize2 className="w-4 h-4" />;
      case 'dense':
        return <Layers className="w-4 h-4" />;
      case 'skip':
        return <ArrowRight className="w-4 h-4" />;
      default:
        return <Maximize2 className="w-4 h-4" />;
    }
  };

  const getLayerColor = (type: Layer['type']) => {
    switch (type) {
      case 'input':
      case 'output':
        return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      case 'conv':
        return 'bg-purple-500/20 border-purple-500/50 text-purple-400';
      case 'pool':
        return 'bg-amber-500/20 border-amber-500/50 text-amber-400';
      case 'dense':
        return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'skip':
        return 'bg-pink-500/20 border-pink-500/50 text-pink-400';
      default:
        return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Architecture Selector */}
      <div className="glass-card p-4 rounded-xl mb-4">
        <div className="flex flex-wrap gap-2">
          {Object.entries(architectures).map(([key, info]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedArch(key as keyof typeof architectures);
                setSelectedLayer(null);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedArch === key
                  ? 'bg-brand-accent text-white'
                  : 'glass-card text-gray-400 hover:bg-white/5'
              }`}
            >
              {info.name}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <div>
            <p className="text-xs text-gray-500">Total Parameters</p>
            <p className="text-xl font-bold text-white">{arch.totalParams}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Layers</p>
            <p className="text-xl font-bold text-white">{arch.layers.length}</p>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-1.5 rounded-lg glass-card text-xs text-gray-400 hover:text-white transition-colors"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="glass-card p-4 rounded-xl">
        <div className="flex flex-col gap-2">
          {arch.layers.map((layer, index) => (
            <div key={layer.id} className="relative">
              {/* Connection line */}
              {index > 0 && (
                <div className="absolute -top-2 left-6 w-0.5 h-4 bg-gradient-to-b from-gray-600 to-gray-500" />
              )}
              
              <div
                onClick={() => setSelectedLayer(layer)}
                className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${
                  selectedLayer?.id === layer.id
                    ? 'bg-white/10 border-brand-accent'
                    : getLayerColor(layer.type)
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getLayerColor(layer.type)}`}>
                  {getLayerIcon(layer.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{layer.name}</span>
                    <span className="text-xs text-gray-500">{layer.params}</span>
                  </div>
                  {showDetails && (
                    <p className="text-xs text-gray-400 mt-0.5">{layer.description}</p>
                  )}
                </div>
                
                <div className="text-right">
                  <p className="text-xs font-mono text-gray-500">{layer.outputShape}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layer Details Panel */}
      {selectedLayer && (
        <div className="glass-card p-4 rounded-xl mt-4 border-brand-accent/30">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-white">{selectedLayer.name}</h4>
            <button
              onClick={() => setSelectedLayer(null)}
              className="text-gray-500 hover:text-white"
            >
              ×
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Description</p>
              <p className="text-gray-300">{selectedLayer.description}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Output Shape</p>
              <p className="font-mono text-brand-accent">{selectedLayer.outputShape}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Parameters</p>
              <p className="text-gray-300">{selectedLayer.params}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Layer Type</p>
              <p className="text-purple-400 capitalize">{selectedLayer.type}</p>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs">
        {[
          { type: 'conv', label: 'Convolution' },
          { type: 'pool', label: 'Pooling' },
          { type: 'dense', label: 'Dense' },
          { type: 'skip', label: 'Skip Connection' },
        ].map(({ type, label }) => (
          <div key={type} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded border ${getLayerColor(type as Layer['type'])}`} />
            <span className="text-gray-400">{label}</span>
          </div>
        ))}
      </div>

      {/* Explanation */}
      <div className="mt-4 text-center text-sm text-gray-400">
        <p>
          Click on any layer to see detailed information.
          <br />
          Compare different architectures to understand their design choices.
        </p>
      </div>
    </div>
  );
}
