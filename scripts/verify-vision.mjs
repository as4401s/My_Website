import test from 'node:test';
import assert from 'node:assert/strict';
import { filterPortrait, orientationCells } from '../src/lib/vision/filters.ts';

test('Sobel responds to a brightness boundary and stays quiet in a uniform region', () => {
  const source = new Uint8ClampedArray(5 * 5 * 4);
  for (let i = 0; i < 25; i++) {
    const value = i % 5 >= 3 ? 255 : 0;
    source.set([value, value, value, 255], i * 4);
  }
  const result = filterPortrait(source, 5, 5, 'edges');
  assert.equal(result[(2 * 5) * 4 + 1], 20);
  assert.ok(result[(2 * 5 + 2) * 4 + 1] > 200);
  assert.equal(result[(2 * 5 + 2) * 4 + 3], 255);
});

test('pixel blocks share a sampled color and retain alpha', () => {
  const source = new Uint8ClampedArray(72 * 4);
  for (let x = 0; x < 72; x++) source.set([x, x * 2, 200, 255], x * 4);
  const result = filterPortrait(source, 72, 1, 'pixels');
  assert.deepEqual([...result.slice(0, 4)], [...result.slice(4, 8)]);
  assert.notDeepEqual([...result.slice(4, 8)], [...result.slice(8, 12)]);
  assert.equal(result[3], 255);
});

test('orientation features identify horizontal gradients and normalize cell energy', () => {
  const source = new Uint8ClampedArray(8 * 8 * 4);
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) source.set([x * 30, x * 30, x * 30, 255], (y * 8 + x) * 4);
  const cells = orientationCells(source, 8, 8, 4);
  assert.equal(cells.length, 4);
  for (const cell of cells) {
    assert.ok(cell.energy > 0);
    assert.ok(cell.bins[0] > .999);
    assert.ok(Math.abs(cell.bins.reduce((sum, value) => sum + value * value, 0) - 1) < 1e-6);
    assert.ok(cell.bins.slice(1).every(value => value === 0));
  }
});

test('uniform images have no orientation features', () => {
  const cells = orientationCells(new Uint8ClampedArray(8 * 8 * 4).fill(100), 8, 8, 4);
  assert.ok(cells.every(cell => cell.energy === 0 && cell.bins.every(value => value === 0)));
});

test('edge operators distinguish orientation and stay quiet on flat images', async () => {
  const { edgeMap } = await import('../src/lib/vision/edges.ts');
  const image = Float32Array.from({length: 81}, (_, i) => i % 9 >= 4 ? 255 : 0);
  const vertical = edgeMap(image, 9, 9, 'vertical');
  const horizontal = edgeMap(image, 9, 9, 'horizontal');
  assert.ok(vertical.some(value => value > 0));
  assert.ok(horizontal.every(value => value === 0));
  for (const filter of ['sobel','prewitt','laplacian','canny','horizontal','vertical']) {
    assert.ok(edgeMap(new Float32Array(81).fill(100), 9, 9, filter).every(value => value === 0));
  }
  const canny = edgeMap(image, 9, 9, 'canny');
  assert.ok(canny.some(value => value === 255));
  assert.ok(canny.every(value => value === 0 || value === 255));
  assert.ok([...canny].filter(Boolean).length < [...vertical].filter(Boolean).length);
});
