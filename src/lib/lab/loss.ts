export type LossType = 'mse' | 'mae' | 'huber' | 'crossentropy';
export const sigmoid = (value: number) => 1 / (1 + Math.exp(-Math.max(-40, Math.min(40, value))));
export function sampleLoss(logit: number, target: number, type: LossType): { loss: number; gradient: number } {
  const error = logit - target;
  if (type === 'crossentropy') return { loss: Math.max(logit, 0) - target * logit + Math.log1p(Math.exp(-Math.abs(logit))), gradient: sigmoid(logit) - target };
  if (type === 'mae') return { loss: Math.abs(error), gradient: Math.sign(error) };
  if (type === 'huber') return Math.abs(error) <= 0.5 ? { loss: 0.5 * error ** 2, gradient: error } : { loss: 0.5 * (Math.abs(error) - 0.25), gradient: 0.5 * Math.sign(error) };
  return { loss: error ** 2, gradient: 2 * error };
}
