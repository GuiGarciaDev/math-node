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

export interface Vector2 {
  x: number
  y: number
}

export interface Vector3 {
  x: number
  y: number
  z: number
}

export const makeVector2 = (x: number, y: number): Vector2 => ({ x, y })
export const makeVector3 = (x: number, y: number, z: number): Vector3 => ({
  x,
  y,
  z,
})

export const dotProduct = (
  a: Vector2 | Vector3,
  b: Vector2 | Vector3,
): number => a.x * b.x + a.y * b.y + ("z" in a ? a.z : 0) * ("z" in b ? b.z : 0)

export const crossProduct = (a: Vector3, b: Vector3): Vector3 => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
})

export const vectorLength = (v: Vector2 | Vector3): number =>
  Math.sqrt(v.x * v.x + v.y * v.y + ("z" in v ? v.z * v.z : 0))

export const normalizeVector = (v: Vector2 | Vector3): Vector2 | Vector3 => {
  const length = vectorLength(v)
  if (length === 0) {
    throw new Error("Cannot normalize a zero vector")
  }
  if ("z" in v) {
    return { x: v.x / length, y: v.y / length, z: v.z / length }
  }
  return { x: v.x / length, y: v.y / length }
}

export const matrixMultiply = (a: number[][], b: number[][]): number[][] => {
  if (a.length === 0 || b.length === 0)
    throw new Error("Matrices must not be empty")
  const aCols = a[0].length
  const bCols = b[0].length
  if (
    !a.every((row) => row.length === aCols) ||
    !b.every((row) => row.length === bCols)
  ) {
    throw new Error("Matrix rows must have consistent lengths")
  }
  if (aCols !== b.length) {
    throw new Error("Matrix dimensions do not align for multiplication")
  }

  const result = Array.from({ length: a.length }, () =>
    Array.from({ length: bCols }, () => 0),
  )
  for (let i = 0; i < a.length; i += 1) {
    for (let j = 0; j < bCols; j += 1) {
      let sum = 0
      for (let k = 0; k < aCols; k += 1) {
        sum += a[i][k] * b[k][j]
      }
      result[i][j] = sum
    }
  }
  return result
}

export const matrixDeterminant = (m: number[][]): number => {
  if (m.length === 2 && m[0].length === 2 && m[1].length === 2) {
    return m[0][0] * m[1][1] - m[0][1] * m[1][0]
  }
  if (
    m.length === 3 &&
    m[0].length === 3 &&
    m[1].length === 3 &&
    m[2].length === 3
  ) {
    const [a, b, c] = m[0]
    const [d, e, f] = m[1]
    const [g, h, i] = m[2]
    return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g)
  }
  throw new Error("Determinant supports only 2x2 and 3x3 matrices")
}

export const matrixInverse2x2 = (m: number[][]): number[][] => {
  if (!(m.length === 2 && m[0].length === 2 && m[1].length === 2)) {
    throw new Error("Inverse currently supports only 2x2 matrices")
  }
  const det = matrixDeterminant(m)
  if (det === 0) throw new Error("Matrix is singular and cannot be inverted")
  return [
    [m[1][1] / det, -m[0][1] / det],
    [-m[1][0] / det, m[0][0] / det],
  ]
}

export const oscillator = (
  amplitude: number,
  frequency: number,
  phase: number,
  timeSeconds: number,
): number => amplitude * Math.sin(2 * Math.PI * frequency * timeSeconds + phase)

export const numericDerivative = (
  fx: number,
  fxPlusDelta: number,
  deltaX: number,
): number => {
  if (deltaX === 0) throw new Error("deltaX cannot be zero")
  return (fxPlusDelta - fx) / deltaX
}

export const trapezoidalIntegral = (
  start: number,
  end: number,
  steps: number,
  evaluateAt: (x: number) => number,
): number => {
  if (steps < 1 || !Number.isInteger(steps)) {
    throw new Error("steps must be a positive integer")
  }
  const h = (end - start) / steps
  let sum = 0.5 * (evaluateAt(start) + evaluateAt(end))
  for (let i = 1; i < steps; i += 1) {
    sum += evaluateAt(start + i * h)
  }
  return sum * h
}

export const velocity = (deltaPosition: number, deltaTime: number): number => {
  if (deltaTime === 0) throw new Error("Time delta cannot be zero")
  return deltaPosition / deltaTime
}

export const acceleration = (
  deltaVelocity: number,
  deltaTime: number,
): number => {
  if (deltaTime === 0) throw new Error("Time delta cannot be zero")
  return deltaVelocity / deltaTime
}

export const force = (mass: number, accel: number): number => mass * accel
export const kineticEnergy = (mass: number, speed: number): number =>
  0.5 * mass * speed * speed
export const potentialEnergy = (
  mass: number,
  gravity: number,
  height: number,
): number => mass * gravity * height

function xorshift32(seed: number): number {
  let x = seed | 0
  x ^= x << 13
  x ^= x >>> 17
  x ^= x << 5
  return x | 0
}

export const seededRandom = (seed: number): number => {
  const next = xorshift32(seed)
  return (next >>> 0) / 4294967296
}

export const randomInRange = (
  min: number,
  max: number,
  seed: number,
): number => {
  if (max < min) throw new Error("max must be greater than or equal to min")
  return min + seededRandom(seed) * (max - min)
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
  oscillator: (a, f, p, t) => oscillator(a, f, p, t),
}
