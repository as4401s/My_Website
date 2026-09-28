export type Point = { x: number; y: number };
export type Optimizer = 'sgd' | 'momentum' | 'adam';
export type OptimizerState = { m: Point; v: Point; step: number };
export const initialOptimizer = (): OptimizerState => ({ m: { x: 0, y: 0 }, v: { x: 0, y: 0 }, step: 0 });
export function optimize(position: Point, gradient: Point, rate: number, type: Optimizer, state: OptimizerState) {
  const next = { m: { ...state.m }, v: { ...state.v }, step: state.step + 1 };
  const point = { ...position };
  for (const key of ['x', 'y'] as const) {
    let update = gradient[key];
    if (type === 'momentum') { next.m[key] = .9 * state.m[key] + gradient[key]; update = next.m[key]; }
    if (type === 'adam') {
      next.m[key] = .9 * state.m[key] + .1 * gradient[key];
      next.v[key] = .999 * state.v[key] + .001 * gradient[key] ** 2;
      const m = next.m[key] / (1 - .9 ** next.step);
      const v = next.v[key] / (1 - .999 ** next.step);
      update = m / (Math.sqrt(v) + 1e-8);
    }
    point[key] -= rate * update;
  }
  return { position: point, state: next };
}
