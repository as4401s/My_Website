export type Activation = 'tanh' | 'relu' | 'sigmoid';
export interface Network { sizes: number[]; activation: Activation; weights: number[][][]; biases: number[][] }
export const xorData = [[0, 0, 0], [0, 1, 1], [1, 0, 1], [1, 1, 0]];
const sigmoid = (x: number) => 1 / (1 + Math.exp(-Math.max(-40, Math.min(40, x))));
const activate = (x: number, kind: Activation) => kind === 'tanh' ? Math.tanh(x) : kind === 'relu' ? Math.max(0, x) : sigmoid(x);
const derivative = (output: number, kind: Activation) => kind === 'tanh' ? 1 - output * output : kind === 'relu' ? Number(output > 0) : output * (1 - output);

export function createNetwork(hidden: number[], activation: Activation = 'tanh', seed = 42): Network {
  const sizes = [2, ...hidden, 1];
  let state = seed >>> 0;
  const random = () => { state = (Math.imul(1664525, state) + 1013904223) >>> 0; return state / 4294967296; };
  return {
    sizes, activation,
    weights: sizes.slice(1).map((size, layer) => Array.from({ length: size }, () => Array.from({ length: sizes[layer] }, () => (random() * 2 - 1) * Math.sqrt(6 / (size + sizes[layer]))))),
    biases: sizes.slice(1).map(size => Array(size).fill(0)),
  };
}

export function forward(network: Network, input: number[]): number[][] {
  const outputs = [input];
  network.weights.forEach((layer, index) => {
    const kind = index === network.weights.length - 1 ? 'sigmoid' : network.activation;
    outputs.push(layer.map((weights, neuron) => activate(weights.reduce((sum, weight, i) => sum + weight * outputs[index][i], network.biases[index][neuron]), kind)));
  });
  return outputs;
}

export function networkLoss(network: Network): number {
  return xorData.reduce((sum, [x, y, target]) => {
    const p = Math.max(1e-12, Math.min(1 - 1e-12, forward(network, [x, y]).at(-1)![0]));
    return sum - target * Math.log(p) - (1 - target) * Math.log(1 - p);
  }, 0) / xorData.length;
}

/** One full-batch SGD update, using backpropagation and sigmoid cross-entropy. */
export function trainNetwork(network: Network, rate: number): Network {
  const dw = network.weights.map(layer => layer.map(weights => weights.map(() => 0)));
  const db = network.biases.map(layer => layer.map(() => 0));
  for (const [x, y, target] of xorData) {
    const outputs = forward(network, [x, y]);
    let delta = [outputs.at(-1)![0] - target];
    for (let layer = network.weights.length - 1; layer >= 0; layer--) {
      for (let neuron = 0; neuron < delta.length; neuron++) {
        db[layer][neuron] += delta[neuron] / 4;
        for (let input = 0; input < outputs[layer].length; input++) dw[layer][neuron][input] += delta[neuron] * outputs[layer][input] / 4;
      }
      if (layer > 0) delta = outputs[layer].map((output, neuron) => network.weights[layer].reduce((sum, weights, next) => sum + weights[neuron] * delta[next], 0) * derivative(output, network.activation));
    }
  }
  return { ...network,
    weights: network.weights.map((layer, l) => layer.map((weights, n) => weights.map((weight, i) => weight - rate * dw[l][n][i]))),
    biases: network.biases.map((layer, l) => layer.map((bias, n) => bias - rate * db[l][n])),
  };
}
