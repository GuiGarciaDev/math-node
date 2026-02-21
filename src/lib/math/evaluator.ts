// ─── Expression Evaluator ─────────────────────────────────
// Numerically evaluates polynomial expressions at a given point.

import type { Expression } from "./symbolic";

/** Evaluate a polynomial expression at x = value */
export function evaluateExpression(
  terms: Expression,
  variable: string,
  value: number,
): number {
  let result = 0;

  for (const term of terms) {
    if (!term.variable || term.exponent === 0) {
      result += term.coefficient;
    } else if (term.variable === variable) {
      result += term.coefficient * Math.pow(value, term.exponent);
    }
  }

  return result;
}

/** Evaluate an expression over a range and return an array of {x, y} points */
export function evaluateRange(
  terms: Expression,
  variable: string,
  start: number,
  end: number,
  steps: number = 100,
): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];
  const stepSize = (end - start) / steps;

  for (let i = 0; i <= steps; i++) {
    const x = start + i * stepSize;
    const y = evaluateExpression(terms, variable, x);
    points.push({ x, y });
  }

  return points;
}

/** Generate a function from expression terms for quick repeated evaluation */
export function compileExpression(
  terms: Expression,
  variable: string,
): (value: number) => number {
  return (value: number) => evaluateExpression(terms, variable, value);
}
