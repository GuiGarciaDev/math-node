export interface ParsedLocalizedNumber {
  isValid: boolean
  value?: number
  normalized: string
  reason?: string
}

const localizedNumberPattern = /^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/

export function parseLocalizedNumberInput(
  input: unknown,
): ParsedLocalizedNumber {
  if (typeof input === "number") {
    if (Number.isFinite(input)) {
      return {
        isValid: true,
        value: input,
        normalized: String(input),
      }
    }

    return {
      isValid: false,
      normalized: String(input),
      reason: "Number must be finite",
    }
  }

  const raw = String(input ?? "").trim()
  if (raw.length === 0) {
    return {
      isValid: false,
      normalized: "",
      reason: "Number is required",
    }
  }

  if (!localizedNumberPattern.test(raw)) {
    return {
      isValid: false,
      normalized: raw,
      reason: "Use a valid number (e.g. 12, 3.14 or 3,14)",
    }
  }

  const normalized = raw.replace(",", ".")
  const parsed = Number(normalized)

  if (!Number.isFinite(parsed)) {
    return {
      isValid: false,
      normalized,
      reason: "Number must be finite",
    }
  }

  return {
    isValid: true,
    value: parsed,
    normalized,
  }
}
