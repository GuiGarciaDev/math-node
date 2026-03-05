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
