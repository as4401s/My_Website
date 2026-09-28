import assert from 'node:assert/strict';
import test from 'node:test';
import { createNetwork, trainNetwork, networkLoss, forward, xorData } from '../src/lib/lab/neuralNetwork.ts';
import { sampleLoss } from '../src/lib/lab/loss.ts';
import { convolve, imagePreset } from '../src/lib/lab/convolution.ts';
import { optimize, initialOptimizer } from '../src/lib/lab/optimizer.ts';
import { aiFacts, factTopics } from '../src/data/aiFacts.ts';

const near = (actual, expected, tolerance = 1e-6) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);

test('backpropagation matches numerical gradients for every weight and bias', () => {
  for (const activation of ['tanh', 'sigmoid', 'relu']) {
    const network = createNetwork([3, 2], activation);
    const next = trainNetwork(network, .01);
    const epsilon = 1e-5;
    network.weights.forEach((layer, l) => layer.forEach((weights, n) => weights.forEach((w, i) => {
      const plus = structuredClone(network), minus = structuredClone(network);
      plus.weights[l][n][i] += epsilon;
      minus.weights[l][n][i] -= epsilon;
      near((w - next.weights[l][n][i]) / .01, (networkLoss(plus) - networkLoss(minus)) / (2 * epsilon), 1e-5);
    })));
    // ReLU is not differentiable at zero; check smooth activations for biases.
    if (activation !== 'relu') network.biases.forEach((layer,l) => layer.forEach((b,n) => {
      const plus = structuredClone(network), minus = structuredClone(network);
      plus.biases[l][n] += epsilon;
      minus.biases[l][n] -= epsilon;
      near((b-next.biases[l][n])/.01,(networkLoss(plus)-networkLoss(minus))/(2*epsilon),1e-5);
    }));
  }
});

test('default network learns XOR instead of simulating loss', () => {
  let network = createNetwork([4]);
  const original = structuredClone(network);
  for (let i = 0; i < 3000; i++) network = trainNetwork(network, .5);
  assert.ok(networkLoss(network) < .01);
  for (const [x,y,label] of xorData) assert.equal(Number(forward(network,[x,y]).at(-1)[0] >= .5), label);
  assert.deepEqual(createNetwork([4]), original);
});

test('all supported loss gradients agree with finite differences', () => {
  for (const kind of ['mse','mae','huber','crossentropy']) for (const prediction of [-2,-.3,.2,2]) {
    const epsilon = 1e-5, target = 1;
    near(sampleLoss(prediction,target,kind).gradient, (sampleLoss(prediction+epsilon,target,kind).loss - sampleLoss(prediction-epsilon,target,kind).loss)/(2*epsilon));
  }
  assert.ok(Number.isFinite(sampleLoss(-1000,1,'crossentropy').loss));
});

test('convolution preserves identity and uses zero padding', () => {
  const image = imagePreset('square');
  assert.deepEqual(convolve(image,8,'identity'),image);
  const solid = Array(64).fill(1);
  near(convolve(solid,8,'blur')[27],1);
  near(convolve(solid,8,'blur')[0],4/9);
  near(convolve(solid,8,'sobelX')[27],0);
  assert.equal(convolve(imagePreset('blank'),8,'laplacian').every(v => v === 0), true);
});

test('Adam uses coordinate-wise second moments and step-wise bias correction', () => {
  let result = optimize({x:0,y:0},{x:2,y:20},.1,'adam',initialOptimizer());
  near(result.position.x,-.1); near(result.position.y,-.1);
  result = optimize(result.position,{x:2,y:20},.1,'adam',result.state);
  near(result.position.x,-.2); near(result.position.y,-.2);
  const sgd = optimize({x:4,y:4},{x:4,y:4},.1,'sgd',initialOptimizer());
  near(sgd.position.x,3.6);
});

test('fact collection has 144 unique entries across 12 populated topics', () => {
  assert.equal(aiFacts.length,144);
  assert.equal(factTopics.length,12);
  assert.equal(new Set(aiFacts.map(f=>f.id)).size,144);
  assert.equal(new Set(aiFacts.map(f=>f.text)).size,144);
  for (const topic of factTopics) assert.equal(aiFacts.filter(f=>f.topic===topic).length,12);
});
