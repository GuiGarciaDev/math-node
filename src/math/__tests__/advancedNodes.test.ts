import { describe, expect, test } from "vitest"
import {
  evaluateOscillator,
  evaluateDotProduct,
  evaluateMatrixMultiply,
  evaluateForce,
  evaluateKineticEnergy,
} from "../../lib/math/nodeEvaluation"

describe("Advanced node examples", () => {
  test("Oscillator at t=0 outputs 0", () => {
    expect(evaluateOscillator(1, 1, 0, 0)).toBeCloseTo(0, 8)
  })

  test("Dot product [1,2] . [3,4] = 11", () => {
    expect(evaluateDotProduct({ x: 1, y: 2 }, { x: 3, y: 4 })).toBe(11)
  })

  test("Matrix multiply example", () => {
    expect(
      evaluateMatrixMultiply(
        [
          [1, 2],
          [3, 4],
        ],
        [
          [3, 4],
          [5, 6],
        ],
      ),
    ).toEqual([
      [13, 16],
      [29, 36],
    ])
  })

  test("Force for mass=2 acceleration=5 equals 10", () => {
    expect(evaluateForce(2, 5)).toBe(10)
  })

  test("Kinetic energy for mass=2 velocity=3 equals 9", () => {
    expect(evaluateKineticEnergy(2, 3)).toBe(9)
  })
})
