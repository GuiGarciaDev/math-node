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
