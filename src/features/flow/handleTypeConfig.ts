import type { PortType } from "../../types"

export interface HandleTypeConfigEntry {
  color: string
  label: string
}

export const HANDLE_TYPE_CONFIG: Record<string, HandleTypeConfigEntry> = {
  number: {
    color: "var(--category-input)",
    label: "number",
  },
  boolean: {
    color: "var(--status-success)",
    label: "boolean",
  },
  expression: {
    color: "var(--category-calculus)",
    label: "expression",
  },
  symbolic: {
    color: "var(--category-calculus)",
    label: "expression",
  },
  matrix: {
    color: "var(--category-display)",
    label: "matrix",
  },
  function: {
    color: "var(--category-display)",
    label: "function",
  },
  array: {
    color: "var(--category-display)",
    label: "array",
  },
}

const fallbackType: HandleTypeConfigEntry = {
  color: "var(--text-muted)",
  label: "value",
}

export function getHandleTypeConfig(type: PortType): HandleTypeConfigEntry {
  return HANDLE_TYPE_CONFIG[type] ?? fallbackType
}
