import { describe, expect, test } from "vitest"
import {
  evaluateNumberInput,
  evaluateConstant,
  evaluateArithmetic,
  evaluatePower,
  evaluateRoot,
  evaluateTrigonometric,
  evaluateLn,
  evaluateLog,
  evaluateComparator,
  evaluateOscillator,
  evaluateVector2,
  evaluateVector3,
  evaluateDotProduct,
  evaluateCrossProduct,
  evaluateVectorLength,
  evaluateNormalize,
  evaluateMatrixMultiply,
  evaluateDeterminant,
  evaluateInverse,
  evaluateForce,
  evaluateKineticEnergy,
  evaluatePotentialEnergy,
  evaluateRandom,
  evaluateTime,
  evaluateDerivativeNumeric,
  evaluateIntegralNumeric,
  evaluateVelocity,
  evaluateAcceleration,
} from "./nodeEvaluation"

describe("Arithmetic node evaluation", () => {
  test("adds with both inputs", () => {
    expect(evaluateArithmetic("add", 2, 3)).toBe(5)
  })

  test("treats missing input as zero", () => {
    expect(evaluateArithmetic("add", undefined, 3)).toBe(3)
    expect(evaluateArithmetic("subtract", undefined, 3)).toBe(-3)
  })

  test("multiplies and divides", () => {
    expect(evaluateArithmetic("multiply", 6, 7)).toBe(42)
    expect(evaluateArithmetic("divide", 9, 3)).toBe(3)
  })

  test("power evaluates correctly", () => {
    expect(evaluatePower(2, 4)).toBe(16)
  })
})

describe("Root node evaluation", () => {
  test("evaluates n-th roots", () => {
    expect(evaluateRoot(9, 2)).toBe(3)
    expect(evaluateRoot(27, 3)).toBe(3)
    expect(evaluateRoot(16, 4)).toBe(2)
  })
})

describe("Trigonometric node evaluation", () => {
  test("handles degree input", () => {
    expect(evaluateTrigonometric("sin", 30, "deg")).toBeCloseTo(0.5, 6)
    expect(evaluateTrigonometric("sin", 90, "deg")).toBeCloseTo(1, 6)
    expect(evaluateTrigonometric("cos", 0, "deg")).toBeCloseTo(1, 6)
    expect(evaluateTrigonometric("tan", 45, "deg")).toBeCloseTo(1, 6)
  })
})

describe("Logarithmic node evaluation", () => {
  test("evaluates ln and log base", () => {
    expect(evaluateLn(Math.E)).toBeCloseTo(1, 6)
    expect(evaluateLog(100, 10)).toBeCloseTo(2, 6)
  })
})

describe("Number node evaluation", () => {
  test("accepts integer input", () => {
    expect(evaluateNumberInput("5")).toBe(5)
  })

  test("accepts floating point input", () => {
    expect(evaluateNumberInput("3.14")).toBeCloseTo(3.14, 6)
  })

  test("accepts negative input", () => {
    expect(evaluateNumberInput("-2")).toBe(-2)
  })
})

describe("Constant node evaluation", () => {
  test("returns pi with selected precision", () => {
    expect(
      evaluateConstant({
        constantKey: "pi",
        decimalPlaces: 2,
      }),
    ).toBeCloseTo(3.14, 6)
  })

  test("returns euler number with selected precision", () => {
    expect(
      evaluateConstant({
        constantKey: "e",
        decimalPlaces: 3,
      }),
    ).toBeCloseTo(2.718, 6)
  })

  test("applies precision handling correctly", () => {
    expect(
      evaluateConstant({
        constantKey: "pi",
        decimalPlaces: 5,
      }),
    ).toBeCloseTo(3.14159, 8)
  })
})

describe("Comparator node evaluation", () => {
  test("evaluates logical operators", () => {
    expect(evaluateComparator(">", 5, 3)).toBe(true)
    expect(evaluateComparator("<", 3, 2)).toBe(false)
    expect(evaluateComparator(">=", 4, 4)).toBe(true)
    expect(evaluateComparator("===", 2, 4)).toBe(false)
  })
})

describe("Signal node evaluation", () => {
  test("time output uses elapsed seconds", () => {
    expect(evaluateTime({ elapsedSeconds: 3.5 })).toBe(3.5)
  })

  test("oscillator returns zero at t=0", () => {
    expect(evaluateOscillator(1, 1, 0, 0)).toBeCloseTo(0, 8)
  })

  test("seeded random is deterministic", () => {
    const first = evaluateRandom(0, 10, 42)
    const second = evaluateRandom(0, 10, 42)
    expect(first).toBeCloseTo(second, 12)
  })
})

describe("Vector node evaluation", () => {
  test("dot product for 2D vectors", () => {
    const a = evaluateVector2(1, 2)
    const b = evaluateVector2(3, 4)
    expect(evaluateDotProduct(a, b)).toBe(11)
  })

  test("cross product for 3D vectors", () => {
    const a = evaluateVector3(1, 0, 0)
    const b = evaluateVector3(0, 1, 0)
    expect(evaluateCrossProduct(a, b)).toEqual({ x: 0, y: 0, z: 1 })
  })

  test("length and normalize", () => {
    const v = evaluateVector3(0, 3, 4)
    expect(evaluateVectorLength(v)).toBeCloseTo(5, 8)
    expect(evaluateNormalize(v)).toEqual({ x: 0, y: 0.6, z: 0.8 })
  })
})

describe("Matrix node evaluation", () => {
  test("matrix multiply 2x2", () => {
    expect(
      evaluateMatrixMultiply(
        [
          [1, 2],
          [3, 4],
        ],
        [
          [5, 6],
          [7, 8],
        ],
      ),
    ).toEqual([
      [19, 22],
      [43, 50],
    ])
  })

  test("determinant and inverse", () => {
    expect(
      evaluateDeterminant([
        [1, 2],
        [3, 4],
      ]),
    ).toBe(-2)

    expect(
      evaluateInverse([
        [4, 7],
        [2, 6],
      ]),
    ).toEqual([
      [0.6, -0.7],
      [-0.2, 0.4],
    ])
  })
})

describe("Physics node evaluation", () => {
  test("velocity and acceleration", () => {
    expect(evaluateVelocity(10, 2)).toBe(5)
    expect(evaluateAcceleration(12, 3)).toBe(4)
  })

  test("force calculation", () => {
    expect(evaluateForce(2, 5)).toBe(10)
  })

  test("kinetic energy calculation", () => {
    expect(evaluateKineticEnergy(2, 3)).toBe(9)
  })

  test("potential energy calculation", () => {
    expect(evaluatePotentialEnergy(2, 9.81, 5)).toBeCloseTo(98.1, 8)
  })
})

describe("Numeric calculus node evaluation", () => {
  test("forward derivative approximation", () => {
    expect(evaluateDerivativeNumeric(4, 4.2, 0.1)).toBeCloseTo(2, 8)
  })

  test("trapezoidal integration for constant function", () => {
    expect(evaluateIntegralNumeric(0, 10, 100, 2)).toBeCloseTo(20, 6)
  })
})
