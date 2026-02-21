// ─── Symbolic Math Engine ─────────────────────────────────
// Lightweight symbolic differentiation and integration for polynomials
// and basic expressions. No external dependencies.

export interface Term {
  coefficient: number;
  variable: string;
  exponent: number;
}

export type Expression = Term[];

// ─── Parsing ──────────────────────────────────────────────

/** Parse a polynomial string like "3x^2 - 2x + 5" into terms */
export function parseExpression(expr: string): Expression {
  const terms: Expression = [];
  // Normalize: remove spaces around operators, but keep sign info
  const normalized = expr.replace(/\s+/g, "").replace(/(?<=[0-9a-z^])-/g, "+-");
  const parts = normalized.split("+").filter((p) => p.length > 0);

  for (const part of parts) {
    const term = parseTerm(part);
    if (term) terms.push(term);
  }
  return terms;
}

function parseTerm(str: string): Term | null {
  str = str.trim();
  if (!str) return null;

  // Constant: just a number
  if (/^-?[\d.]+$/.test(str)) {
    return { coefficient: parseFloat(str), variable: "", exponent: 0 };
  }

  // Match patterns like: -3x^2, 2x, x, -x, x^3
  const match = str.match(/^(-?[\d.]*)([a-z])(?:\^(-?[\d.]+))?$/);
  if (match) {
    let coef =
      match[1] === "" || match[1] === "+"
        ? 1
        : match[1] === "-"
          ? -1
          : parseFloat(match[1]);
    const variable = match[2];
    const exp = match[3] ? parseFloat(match[3]) : 1;
    return { coefficient: coef, variable, exponent: exp };
  }

  return null;
}

// ─── Formatting ───────────────────────────────────────────

export function formatExpression(terms: Expression): string {
  if (terms.length === 0) return "0";

  const parts: string[] = [];
  for (const term of terms) {
    if (term.coefficient === 0) continue;

    let str = "";
    const absCoef = Math.abs(term.coefficient);

    if (!term.variable || term.exponent === 0) {
      str = `${absCoef}`;
    } else if (absCoef === 1) {
      str = term.variable;
    } else {
      str = `${absCoef}${term.variable}`;
    }

    if (term.variable && term.exponent !== 0 && term.exponent !== 1) {
      str += `^${term.exponent}`;
    }

    if (parts.length === 0) {
      parts.push(term.coefficient < 0 ? `-${str}` : str);
    } else {
      parts.push(term.coefficient < 0 ? `- ${str}` : `+ ${str}`);
    }
  }

  return parts.length > 0 ? parts.join(" ") : "0";
}

// ─── Symbolic Differentiation ─────────────────────────────

export function differentiate(terms: Expression, variable: string): Expression {
  const result: Expression = [];

  for (const term of terms) {
    if (term.variable !== variable || term.exponent === 0) {
      // Constant term → derivative is 0
      continue;
    }

    result.push({
      coefficient: term.coefficient * term.exponent,
      variable: term.exponent - 1 === 0 ? "" : variable,
      exponent: term.exponent - 1 === 0 ? 0 : term.exponent - 1,
    });
  }

  return result.length > 0
    ? result
    : [{ coefficient: 0, variable: "", exponent: 0 }];
}

// ─── Symbolic Integration ─────────────────────────────────

export function integrate(terms: Expression, variable: string): Expression {
  const result: Expression = [];

  for (const term of terms) {
    if (!term.variable || term.exponent === 0) {
      // Constant → cx
      result.push({
        coefficient: term.coefficient,
        variable: variable,
        exponent: 1,
      });
    } else if (term.variable === variable) {
      const newExp = term.exponent + 1;
      if (newExp === 0) {
        // ln|x| case — simplify to 0 for now
        continue;
      }
      result.push({
        coefficient: term.coefficient / newExp,
        variable: variable,
        exponent: newExp,
      });
    }
  }

  // Add constant of integration
  result.push({ coefficient: 0, variable: "C", exponent: 0 });

  return result;
}

// ─── Simplify ─────────────────────────────────────────────

export function simplify(terms: Expression): Expression {
  // Combine like terms
  const map = new Map<string, Term>();

  for (const term of terms) {
    const key = `${term.variable}^${term.exponent}`;
    const existing = map.get(key);
    if (existing) {
      existing.coefficient += term.coefficient;
    } else {
      map.set(key, { ...term });
    }
  }

  // Sort by exponent descending
  const result = Array.from(map.values())
    .filter((t) => t.coefficient !== 0)
    .sort((a, b) => b.exponent - a.exponent);

  return result.length > 0
    ? result
    : [{ coefficient: 0, variable: "", exponent: 0 }];
}
