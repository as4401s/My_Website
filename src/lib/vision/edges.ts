export type EdgeFilter = 'sobel' | 'prewitt' | 'laplacian' | 'canny' | 'horizontal' | 'vertical';

export function edgeMap(gray: Float32Array, width: number, height: number, filter: EdgeFilter) {
  const count = width * height;
  let input = gray;
  // A 5×5 separable Gaussian suppresses noise before Canny-style edge thinning.
  if (filter === 'canny') {
    const kernel = [1, 4, 6, 4, 1];
    const horizontal = new Float32Array(count);
    input = new Float32Array(count);
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      for (let k = -2; k <= 2; k++) horizontal[y * width + x] += gray[y * width + Math.max(0, Math.min(width - 1, x + k))] * kernel[k + 2] / 16;
    }
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      for (let k = -2; k <= 2; k++) input[y * width + x] += horizontal[Math.max(0, Math.min(height - 1, y + k)) * width + x] * kernel[k + 2] / 16;
    }
  }
  const magnitude = new Float32Array(count), direction = new Float32Array(count);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const at = (dx: number, dy: number) => input[Math.max(0, Math.min(height - 1, y + dy)) * width + Math.max(0, Math.min(width - 1, x + dx))];
    const centerWeight = filter === 'prewitt' ? 1 : 2;
    const gx = -at(-1,-1) + at(1,-1) - centerWeight*at(-1,0) + centerWeight*at(1,0) - at(-1,1) + at(1,1);
    const gy = -at(-1,-1) - centerWeight*at(0,-1) - at(1,-1) + at(-1,1) + centerWeight*at(0,1) + at(1,1);
    const i = y * width + x;
    magnitude[i] = filter === 'laplacian' ? Math.abs(at(-1,0) + at(1,0) + at(0,-1) + at(0,1) - 4*at(0,0)) * 2
      : filter === 'horizontal' ? Math.abs(gy) : filter === 'vertical' ? Math.abs(gx) : Math.hypot(gx, gy);
    direction[i] = ((Math.atan2(gy, gx) * 180 / Math.PI) + 180) % 180;
  }
  if (filter !== 'canny') return magnitude;
  const thin = new Float32Array(count);
  let peak = 0;
  for (let y = 1; y < height - 1; y++) for (let x = 1; x < width - 1; x++) {
    const i = y * width + x, angle = direction[i];
    const offset = angle < 22.5 || angle >= 157.5 ? 1 : angle < 67.5 ? width + 1 : angle < 112.5 ? width : width - 1;
    if (magnitude[i] >= magnitude[i - offset] && magnitude[i] >= magnitude[i + offset]) {
      thin[i] = magnitude[i]; peak = Math.max(peak, thin[i]);
    }
  }
  const result = new Float32Array(count);
  const high = Math.max(20, peak * .2), low = high * .4;
  const stack: number[] = [];
  for (let i = 0; i < count; i++) if (thin[i] >= high) { result[i] = 255; stack.push(i); }
  while (stack.length) {
    const i = stack.pop()!;
    const x = i % width, y = Math.floor(i / width);
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const nx = x + dx, ny = y + dy, next = ny * width + nx;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height && !result[next] && thin[next] >= low) {
        result[next] = 255; stack.push(next);
      }
    }
  }
  return result;
}
