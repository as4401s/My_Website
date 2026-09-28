import { edgeMap } from './edges.ts';
import type { EdgeFilter } from './edges.ts';
export type VisionMode = 'edges' | 'pixels' | 'features';

/** Compute once per selection; moving the lens only updates its CSS clip. */
export function filterPortrait(source: Uint8ClampedArray, width: number, height: number, mode: Exclude<VisionMode, 'features'>, filter: EdgeFilter = 'sobel') {
  const result = new Uint8ClampedArray(source.length);
  const gray = mode === 'edges' ? Float32Array.from({ length: width * height }, (_, i) =>
    .2126 * source[i * 4] + .7152 * source[i * 4 + 1] + .0722 * source[i * 4 + 2]) : null;
  const edges = gray ? edgeMap(gray, width, height, filter) : null;
  const block = Math.max(1, Math.round(width / 36));
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4;
    if (edges) {
      const edge = Math.min(255, edges[y * width + x]);
      // Mint edges on a dark background, with luminance encoding gradient magnitude.
      result[i] = 11 + edge * .51;
      result[i + 1] = 20 + edge * .84;
      result[i + 2] = 25 + edge * .76;
    } else {
      const sx = Math.min(width - 1, Math.floor(x / block) * block + Math.floor(block / 2));
      const sy = Math.min(height - 1, Math.floor(y / block) * block + Math.floor(block / 2));
      const sample = (sy * width + sx) * 4;
      result[i] = source[sample]; result[i + 1] = source[sample + 1]; result[i + 2] = source[sample + 2];
    }
    result[i + 3] = source[i + 3];
  }
  return result;
}

/** HOG-style visualization: nine unsigned orientation bins, normalized per cell.
 * This exposes local gradient features, not predictions from a trained network.
 */
export function orientationCells(source: Uint8ClampedArray, width: number, height: number, size = 32) {
  const columns = Math.ceil(width / size);
  const rows = Math.ceil(height / size);
  const gray = Float32Array.from({ length: width * height }, (_, i) =>
    .2126 * source[i * 4] + .7152 * source[i * 4 + 1] + .0722 * source[i * 4 + 2]);
  const cells = Array.from({ length: columns * rows }, (_, i) => ({
    x: (i % columns + .5) * size, y: (Math.floor(i / columns) + .5) * size,
    size, bins: Array<number>(9).fill(0), energy: 0,
  }));
  for (let y = 1; y < height - 1; y++) for (let x = 1; x < width - 1; x++) {
    const dx = gray[y * width + x + 1] - gray[y * width + x - 1];
    const dy = gray[(y + 1) * width + x] - gray[(y - 1) * width + x];
    const magnitude = Math.hypot(dx, dy);
    const angle = ((Math.atan2(dy, dx) % Math.PI + Math.PI) % Math.PI) * 9 / Math.PI;
    const bin = Math.floor(angle), fraction = angle - bin;
    const cell = cells[Math.floor(y / size) * columns + Math.floor(x / size)];
    cell.bins[bin % 9] += magnitude * (1 - fraction);
    cell.bins[(bin + 1) % 9] += magnitude * fraction;
    cell.energy += magnitude;
  }
  for (const cell of cells) {
    const norm = Math.sqrt(cell.bins.reduce((sum, value) => sum + value * value, 0) + 1e-6);
    cell.bins = cell.bins.map(value => value / norm);
  }
  return cells;
}
