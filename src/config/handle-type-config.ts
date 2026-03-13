import type { PortType } from "../types"
import type { HandleColorKey } from "./node-style-config"

export interface HandleTypeConfigEntry {
  colorKey: HandleColorKey
  label: string
}

export const HANDLE_TYPE_CONFIG: Record<string, HandleTypeConfigEntry> = {
  number: {
    colorKey: "number",
    label: "number",
  },
  boolean: {
    colorKey: "success",
    label: "boolean",
  },
  expression: {
    colorKey: "expression",
    label: "expression",
  },
  symbolic: {
    colorKey: "expression",
    label: "expression",
  },
  matrix: {
    colorKey: "matrix",
    label: "matrix",
  },
  vector: {
    colorKey: "vector",
    label: "vector",
  },
  vector2: {
    colorKey: "vector",
    label: "vector2",
  },
  vector3: {
    colorKey: "vector",
    label: "vector3",
  },
  function: {
    colorKey: "matrix",
    label: "function",
  },
  array: {
    colorKey: "matrix",
    label: "array",
  },
}

const fallbackType: HandleTypeConfigEntry = {
  colorKey: "muted",
  label: "value",
}

export function getHandleTypeConfig(type: PortType): HandleTypeConfigEntry {
  return HANDLE_TYPE_CONFIG[type] ?? fallbackType
}
