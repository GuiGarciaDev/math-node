import {
  add,
  subtract,
  multiply,
  divide,
  power,
  root,
  sin,
  cos,
  tan,
  asin,
  acos,
  atan,
  ln,
  logBase,
  compare,
  makeVector2,
  makeVector3,
  dotProduct,
  crossProduct,
  vectorLength,
  normalizeVector,
  matrixMultiply,
  matrixDeterminant,
  matrixInverse2x2,
  oscillator,
  numericDerivative,
  trapezoidalIntegral,
  velocity,
  acceleration,
  force,
  kineticEnergy,
  potentialEnergy,
  randomInRange,
  type Vector2,
  type Vector3,
  type ComparatorOperator,
} from "./operators"
import { parseLocalizedNumberInput } from "./numberInput"

export type SupportedConstantKey = "pi" | "e"
export type TrigonometricOperation =
  | "sin"
  | "cos"
  | "tan"
  | "asin"
  | "acos"
  | "atan"
export type AngleUnit = "deg" | "rad"

const DEG_TO_RAD = Math.PI / 180
const RAD_TO_DEG = 180 / Math.PI
const SUPPORTED_CONSTANTS: Record<SupportedConstantKey, number> = {
  pi: Math.PI,
  e: Math.E,
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback
  }

  if (typeof value === "string") {
    const parsed = parseLocalizedNumberInput(value)
    if (parsed.isValid && typeof parsed.value === "number") {
      return parsed.value
    }
  }

  return fallback
}

function toInt(value: unknown, fallback: number): number {
  const parsed = Math.round(toNumber(value, fallback))
  return Number.isFinite(parsed) ? parsed : fallback
}

function isVector2(value: unknown): value is Vector2 {
  return (
    typeof value === "object" &&
    value !== null &&
    "x" in value &&
    "y" in value &&
    typeof (value as { x: unknown }).x === "number" &&
    typeof (value as { y: unknown }).y === "number"
  )
}

function isVector3(value: unknown): value is Vector3 {
  return (
    isVector2(value) &&
    "z" in value &&
    typeof (value as { z: unknown }).z === "number"
  )
}

function toVector(value: unknown): Vector2 | Vector3 {
  if (isVector3(value) || isVector2(value)) {
    return value
  }
  throw new Error("Expected vector input")
}

function toVector3(value: unknown): Vector3 {
  if (isVector3(value)) {
    return value
  }
  throw new Error("Expected vector3 input")
}

function toMatrix(value: unknown): number[][] {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    !value.every(Array.isArray)
  ) {
    throw new Error("Expected matrix input")
  }
  const rows = value as unknown[]
  const parsed = rows.map((row) => {
    const cells = row as unknown[]
    return cells.map((cell) => toNumber(cell, 0))
  })
  return parsed
}

export function evaluateConstant(params: {
  constantKey?: unknown
  decimalPlaces?: unknown
  constantType?: unknown
}): number {
  // Backward compatibility for persisted graphs using `constantType`.
  const fallbackKey = String(params.constantType ?? "pi") === "e" ? "e" : "pi"
  const constantKey = String(
    params.constantKey ?? fallbackKey,
  ) as SupportedConstantKey
  const baseValue = SUPPORTED_CONSTANTS[constantKey] ?? Math.PI

  const rawPlaces = Number(params.decimalPlaces ?? 6)
  const decimalPlaces = Number.isFinite(rawPlaces)
    ? Math.max(0, Math.min(15, Math.round(rawPlaces)))
    : 6

  const factor = 10 ** decimalPlaces
  return Math.round(baseValue * factor) / factor
}

export function evaluateNumberInput(value: unknown): number {
  const parsed = parseLocalizedNumberInput(value)
  if (!parsed.isValid) {
    throw new Error(parsed.reason ?? "Invalid number")
  }

  return parsed.value ?? 0
}

export function evaluateArithmetic(
  op: "add" | "subtract" | "multiply" | "divide",
  a: unknown,
  b: unknown,
): number {
  const left = toNumber(a, 0)
  const right = toNumber(b, 0)

  switch (op) {
    case "add":
      return add(left, right)
    case "subtract":
      return subtract(left, right)
    case "multiply":
      return multiply(left, right)
    case "divide":
      return divide(left, right)
  }
}

export function evaluatePower(baseInput: unknown, expInput: unknown): number {
  return power(toNumber(baseInput, 0), toNumber(expInput, 0))
}

export function evaluateRoot(
  valueInput: unknown,
  degreeInput: unknown,
): number {
  return root(toNumber(valueInput, 0), toNumber(degreeInput, 2))
}

export function evaluateTrigonometric(
  operation: unknown,
  valueInput: unknown,
  unitInput: unknown,
): number {
  const op = String(operation ?? "sin") as TrigonometricOperation
  const unit = String(unitInput ?? "rad") as AngleUnit
  const value = toNumber(valueInput, 0)

  const trigValue =
    op === "sin" || op === "cos" || op === "tan"
      ? unit === "deg"
        ? value * DEG_TO_RAD
        : value
      : value

  const result =
    op === "sin"
      ? sin(trigValue)
      : op === "cos"
        ? cos(trigValue)
        : op === "tan"
          ? tan(trigValue)
          : op === "asin"
            ? asin(trigValue)
            : op === "acos"
              ? acos(trigValue)
              : atan(trigValue)

  if (op === "asin" || op === "acos" || op === "atan") {
    return unit === "deg" ? result * RAD_TO_DEG : result
  }

  return result
}

export function evaluateLn(valueInput: unknown): number {
  return ln(toNumber(valueInput, 0))
}

export function evaluateLog(valueInput: unknown, baseInput: unknown): number {
  return logBase(toNumber(valueInput, 0), toNumber(baseInput, 10))
}

export function evaluateComparator(
  operatorInput: unknown,
  leftInput: unknown,
  rightInput: unknown,
): boolean {
  const operator = String(operatorInput ?? "===") as ComparatorOperator
  return compare(toNumber(leftInput, 0), toNumber(rightInput, 0), operator)
}

export function evaluateTime(params: { elapsedSeconds?: unknown }): number {
  return toNumber(params.elapsedSeconds, 0)
}

export function evaluateOscillator(
  amplitudeInput: unknown,
  frequencyInput: unknown,
  phaseInput: unknown,
  timeInput: unknown,
): number {
  return oscillator(
    toNumber(amplitudeInput, 1),
    toNumber(frequencyInput, 1),
    toNumber(phaseInput, 0),
    toNumber(timeInput, 0),
  )
}

export function evaluateVector2(xInput: unknown, yInput: unknown): Vector2 {
  return makeVector2(toNumber(xInput, 0), toNumber(yInput, 0))
}

export function evaluateVector3(
  xInput: unknown,
  yInput: unknown,
  zInput: unknown,
): Vector3 {
  return makeVector3(
    toNumber(xInput, 0),
    toNumber(yInput, 0),
    toNumber(zInput, 0),
  )
}

export function evaluateDotProduct(aInput: unknown, bInput: unknown): number {
  return dotProduct(toVector(aInput), toVector(bInput))
}

export function evaluateCrossProduct(
  aInput: unknown,
  bInput: unknown,
): Vector3 {
  return crossProduct(toVector3(aInput), toVector3(bInput))
}

export function evaluateVectorLength(vectorInput: unknown): number {
  return vectorLength(toVector(vectorInput))
}

export function evaluateNormalize(vectorInput: unknown): Vector2 | Vector3 {
  return normalizeVector(toVector(vectorInput))
}

export function evaluateMatrix(params: {
  values?: unknown
  matrix?: unknown
  rows?: unknown
  cols?: unknown
}): number[][] {
  const rawValues = params.values ?? params.matrix
  if (rawValues !== undefined) {
    return toMatrix(rawValues)
  }

  const rows = Math.max(1, toInt(params.rows, 2))
  const cols = Math.max(1, toInt(params.cols, 2))
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 0),
  )
}

export function evaluateMatrixMultiply(
  aInput: unknown,
  bInput: unknown,
): number[][] {
  return matrixMultiply(toMatrix(aInput), toMatrix(bInput))
}

export function evaluateDeterminant(matrixInput: unknown): number {
  return matrixDeterminant(toMatrix(matrixInput))
}

export function evaluateInverse(matrixInput: unknown): number[][] {
  return matrixInverse2x2(toMatrix(matrixInput))
}

export function evaluateDerivativeNumeric(
  functionValueInput: unknown,
  functionValuePlusDeltaInput: unknown,
  deltaXInput: unknown,
): number {
  return numericDerivative(
    toNumber(functionValueInput, 0),
    toNumber(functionValuePlusDeltaInput, 0),
    toNumber(deltaXInput, 1e-3),
  )
}

export function evaluateIntegralNumeric(
  startInput: unknown,
  endInput: unknown,
  stepsInput: unknown,
  functionAtInput: unknown,
): number {
  const value = toNumber(functionAtInput, 0)
  return trapezoidalIntegral(
    toNumber(startInput, 0),
    toNumber(endInput, 1),
    Math.max(1, toInt(stepsInput, 100)),
    () => value,
  )
}

export function evaluateVelocity(
  positionInput: unknown,
  timeInput: unknown,
): number {
  return velocity(toNumber(positionInput, 0), toNumber(timeInput, 1))
}

export function evaluateAcceleration(
  velocityInput: unknown,
  timeInput: unknown,
): number {
  return acceleration(toNumber(velocityInput, 0), toNumber(timeInput, 1))
}

export function evaluateForce(massInput: unknown, accelInput: unknown): number {
  return force(toNumber(massInput, 0), toNumber(accelInput, 0))
}

export function evaluateKineticEnergy(
  massInput: unknown,
  velocityInput: unknown,
): number {
  return kineticEnergy(toNumber(massInput, 0), toNumber(velocityInput, 0))
}

export function evaluatePotentialEnergy(
  massInput: unknown,
  gravityInput: unknown,
  heightInput: unknown,
): number {
  return potentialEnergy(
    toNumber(massInput, 0),
    toNumber(gravityInput, 9.81),
    toNumber(heightInput, 0),
  )
}

export function evaluateRandom(
  minInput: unknown,
  maxInput: unknown,
  seedInput: unknown,
): number {
  return randomInRange(
    toNumber(minInput, 0),
    toNumber(maxInput, 1),
    toInt(seedInput, 1),
  )
}
