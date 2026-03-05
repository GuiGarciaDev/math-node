// ─── Pure Mathematical Operators ──────────────────────────
// All functions are pure, deterministic, and side-effect free.

export const add = (a: number, b: number): number => a + b
export const subtract = (a: number, b: number): number => a - b
export const multiply = (a: number, b: number): number => a * b

export const divide = (a: number, b: number): number => {
  if (b === 0) throw new Error("Division by zero")
  return a / b
}

export const power = (base: number, exp: number): number => Math.pow(base, exp)
export const sqrt = (a: number): number => {
  if (a < 0) throw new Error("Square root of negative number")
  return Math.sqrt(a)
}
export const root = (value: number, degree: number): number => {
  if (degree === 0) throw new Error("Root degree cannot be zero")
  if (value < 0 && !Number.isInteger(degree)) {
    throw new Error("Negative values require an integer root degree")
  }
  if (value < 0 && Math.abs(degree % 2) < Number.EPSILON) {
    throw new Error("Even root of negative number")
  }
  return Math.sign(value) * Math.pow(Math.abs(value), 1 / degree)
}

export const abs = (a: number): number => Math.abs(a)
export const negate = (a: number): number => -a

export const sin = (a: number): number => Math.sin(a)
export const cos = (a: number): number => Math.cos(a)
export const tan = (a: number): number => Math.tan(a)
export const asin = (a: number): number => {
  if (a < -1 || a > 1) throw new Error("asin input must be in [-1, 1]")
  return Math.asin(a)
}
export const acos = (a: number): number => {
  if (a < -1 || a > 1) throw new Error("acos input must be in [-1, 1]")
  return Math.acos(a)
}
export const atan = (a: number): number => Math.atan(a)
export const ln = (a: number): number => {
  if (a <= 0) throw new Error("Logarithm of non-positive number")
  return Math.log(a)
}
export const logBase = (value: number, base: number): number => {
  if (value <= 0) throw new Error("Logarithm of non-positive number")
  if (base <= 0 || base === 1) throw new Error("Invalid logarithm base")
  return Math.log(value) / Math.log(base)
}

export type ComparatorOperator = "<" | ">" | "<=" | ">=" | "==="
export const compare = (
  left: number,
  right: number,
  operator: ComparatorOperator,
): boolean => {
  switch (operator) {
    case "<":
      return left < right
    case ">":
      return left > right
    case "<=":
      return left <= right
    case ">=":
      return left >= right
    case "===":
      return left === right
    default:
      throw new Error(`Unsupported comparator operator: ${operator}`)
  }
}

// ─── Node Operator Registry ──────────────────────────────
export type OperatorFn = (...args: number[]) => number

export const operatorRegistry: Record<string, OperatorFn> = {
  add: (a, b) => add(a, b),
  subtract: (a, b) => subtract(a, b),
  multiply: (a, b) => multiply(a, b),
  divide: (a, b) => divide(a, b),
  power: (a, b) => power(a, b),
  sqrt: (a) => sqrt(a),
  root: (a, b) => root(a, b),
  sin: (a) => sin(a),
  cos: (a) => cos(a),
  tan: (a) => tan(a),
  asin: (a) => asin(a),
  acos: (a) => acos(a),
  atan: (a) => atan(a),
  ln: (a) => ln(a),
  log: (a, b) => logBase(a, b),
  abs: (a) => abs(a),
  negate: (a) => negate(a),
}
