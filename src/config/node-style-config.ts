import type { MathNodeData, NodeStatus } from "../types"

export type NodeCategory = MathNodeData["category"]
export type NodeVisualStatus = Extract<NodeStatus, "success" | "error">

interface BorderToken {
  cssVar: string
  borderClass: string
}

interface HandleToken {
  cssVar: string
  bgClass: string
}

export type HandleColorKey =
  | "number"
  | "expression"
  | "matrix"
  | "vector"
  | "muted"
  | "success"

export const categoryBorderTokens: Record<NodeCategory, BorderToken> = {
  input: {
    cssVar: "var(--category-number)",
    borderClass: "border-[var(--category-number)]",
  },
  arithmetic: {
    cssVar: "var(--category-arithmetic)",
    borderClass: "border-[var(--category-arithmetic)]",
  },
  trigonometry: {
    cssVar: "var(--category-trigonometry)",
    borderClass: "border-[var(--category-trigonometry)]",
  },
  vectors: {
    cssVar: "var(--category-trigonometry)",
    borderClass: "border-[var(--category-trigonometry)]",
  },
  matrices: {
    cssVar: "var(--category-matrix)",
    borderClass: "border-[var(--category-matrix)]",
  },
  physics: {
    cssVar: "var(--category-arithmetic)",
    borderClass: "border-[var(--category-arithmetic)]",
  },
  signals: {
    cssVar: "var(--category-expression)",
    borderClass: "border-[var(--category-expression)]",
  },
  logarithmic: {
    cssVar: "var(--category-logarithmic)",
    borderClass: "border-[var(--category-logarithmic)]",
  },
  logic: {
    cssVar: "var(--category-logic)",
    borderClass: "border-[var(--category-logic)]",
  },
  calculus: {
    cssVar: "var(--category-expression)",
    borderClass: "border-[var(--category-expression)]",
  },
  display: {
    cssVar: "var(--category-matrix)",
    borderClass: "border-[var(--category-matrix)]",
  },
  advanced: {
    cssVar: "var(--category-advanced)",
    borderClass: "border-[var(--category-advanced)]",
  },
}

export const statusBorderTokens: Record<NodeVisualStatus, BorderToken> = {
  error: {
    cssVar: "var(--status-error)",
    borderClass: "border-[var(--status-error)]",
  },
  success: {
    cssVar: "var(--status-success)",
    borderClass: "border-[var(--status-success)]",
  },
}

export const defaultBorderToken: BorderToken = {
  cssVar: "var(--border)",
  borderClass: "border-[var(--border)]",
}

export const handleColorTokens: Record<HandleColorKey, HandleToken> = {
  number: {
    cssVar: "var(--handle-category-number)",
    bgClass: "bg-[var(--handle-category-number)]!",
  },
  success: {
    cssVar: "var(--status-success)",
    bgClass: "bg-[var(--status-success)]!",
  },
  expression: {
    cssVar: "var(--handle-category-expression)",
    bgClass: "bg-[var(--handle-category-expression)]!",
  },
  matrix: {
    cssVar: "var(--handle-category-matrix)",
    bgClass: "bg-[var(--handle-category-matrix)]!",
  },
  vector: {
    cssVar: "var(--handle-category-expression)",
    bgClass: "bg-[var(--handle-category-expression)]!",
  },
  muted: {
    cssVar: "var(--text-muted)",
    bgClass: "bg-[var(--text-muted)]!",
  },
}
