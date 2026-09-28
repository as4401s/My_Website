export const kernels = {
  identity: { name: 'Identity', values: [0,0,0,0,1,0,0,0,0], divisor: 1, description: 'Keeps the image unchanged. Only the centre pixel contributes.' },
  blur: { name: 'Box blur', values: [1,1,1,1,1,1,1,1,1], divisor: 9, description: 'Averages nine neighbouring pixels to smooth the image.' },
  sharpen: { name: 'Sharpen', values: [0,-1,0,-1,5,-1,0,-1,0], divisor: 1, description: 'Emphasizes the centre pixel relative to its neighbours.' },
  sobelX: { name: 'Vertical edges', values: [-1,0,1,-2,0,2,-1,0,1], divisor: 1, description: 'Sobel X measures left-to-right changes, revealing vertical edges.' },
  sobelY: { name: 'Horizontal edges', values: [-1,-2,-1,0,0,0,1,2,1], divisor: 1, description: 'Sobel Y measures top-to-bottom changes, revealing horizontal edges.' },
  laplacian: { name: 'All edges', values: [0,-1,0,-1,4,-1,0,-1,0], divisor: 1, description: 'The Laplacian responds to changes around each pixel in both directions.' },
};
export type KernelName = keyof typeof kernels;
export function convolve(image: number[], size: number, kernel: KernelName): number[] {
  const { values, divisor } = kernels[kernel];
  return image.map((_, index) => values.reduce((sum, weight, k) => {
    const x = index % size + k % 3 - 1;
    const y = Math.floor(index / size) + Math.floor(k / 3) - 1;
    return sum + weight * (x >= 0 && x < size && y >= 0 && y < size ? image[y * size + x] : 0);
  }, 0) / divisor);
}
export function imagePreset(name: string): number[] {
  return Array.from({length:64}, (_,i) => {
    const x = i % 8, y = Math.floor(i / 8);
    if (name === 'square') return x >= 2 && x <= 5 && y >= 2 && y <= 5 ? 1 : 0;
    if (name === 'diagonal') return Math.abs(x-y) <= 1 ? 1 : 0;
    if (name === 'stripes') return x % 3 === 1 ? 1 : 0;
    return 0;
  });
}
