// ─── Pure Mathematical Operators ──────────────────────────
// All functions are pure, deterministic, and side-effect free.

export const add = (a: number, b: number): number => a + b;
export const subtract = (a: number, b: number): number => a - b;
export const multiply = (a: number, b: number): number => a * b;

export const divide = (a: number, b: number): number => {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
};

export const power = (base: number, exp: number): number => Math.pow(base, exp);
export const sqrt = (a: number): number => {
  if (a < 0) throw new Error("Square root of negative number");
  return Math.sqrt(a);
};

export const abs = (a: number): number => Math.abs(a);
export const negate = (a: number): number => -a;

export const sin = (a: number): number => Math.sin(a);
export const cos = (a: number): number => Math.cos(a);
export const tan = (a: number): number => Math.tan(a);
export const ln = (a: number): number => {
  if (a <= 0) throw new Error("Logarithm of non-positive number");
  return Math.log(a);
};

// ─── Node Operator Registry ──────────────────────────────
export type OperatorFn = (...args: number[]) => number;

export const operatorRegistry: Record<string, OperatorFn> = {
  add: (a, b) => add(a, b),
  subtract: (a, b) => subtract(a, b),
  multiply: (a, b) => multiply(a, b),
  divide: (a, b) => divide(a, b),
  power: (a, b) => power(a, b),
  sqrt: (a) => sqrt(a),
  abs: (a) => abs(a),
  negate: (a) => negate(a),
};
