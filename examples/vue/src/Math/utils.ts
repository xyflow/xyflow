import type { Operator } from './types';

export const mathFunctions: Record<Operator, (a: number, b: number) => number> = {
  '+': (a: number, b: number) => a + b,
  '-': (a: number, b: number) => a - b,
  '*': (a: number, b: number) => a * b,
  '/': (a: number, b: number) => a / b,
};
