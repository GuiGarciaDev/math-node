import type { SidebarTone } from "../types"

type ToneClasses = {
  text: string
  bg: string
  ring: string
  soft: string
}

const toneClasses: Record<SidebarTone, ToneClasses> = {
  input: {
    text: "text-[var(--node-input)]",
    bg: "bg-[var(--node-input)]",
    ring: "ring-[color-mix(in_srgb,var(--node-input)_40%,transparent)]",
    soft: "bg-[color-mix(in_srgb,var(--node-input)_12%,transparent)]",
  },
  arithmetic: {
    text: "text-[var(--node-arithmetic)]",
    bg: "bg-[var(--node-arithmetic)]",
    ring: "ring-[color-mix(in_srgb,var(--node-arithmetic)_40%,transparent)]",
    soft: "bg-[color-mix(in_srgb,var(--node-arithmetic)_12%,transparent)]",
  },
  trigonometry: {
    text: "text-[var(--node-trigonometry)]",
    bg: "bg-[var(--node-trigonometry)]",
    ring: "ring-[color-mix(in_srgb,var(--node-trigonometry)_40%,transparent)]",
    soft: "bg-[color-mix(in_srgb,var(--node-trigonometry)_12%,transparent)]",
  },
  logarithmic: {
    text: "text-[var(--node-logarithmic)]",
    bg: "bg-[var(--node-logarithmic)]",
    ring: "ring-[color-mix(in_srgb,var(--node-logarithmic)_40%,transparent)]",
    soft: "bg-[color-mix(in_srgb,var(--node-logarithmic)_12%,transparent)]",
  },
  logic: {
    text: "text-[var(--node-logic)]",
    bg: "bg-[var(--node-logic)]",
    ring: "ring-[color-mix(in_srgb,var(--node-logic)_40%,transparent)]",
    soft: "bg-[color-mix(in_srgb,var(--node-logic)_12%,transparent)]",
  },
  calculus: {
    text: "text-[var(--node-calculus)]",
    bg: "bg-[var(--node-calculus)]",
    ring: "ring-[color-mix(in_srgb,var(--node-calculus)_40%,transparent)]",
    soft: "bg-[color-mix(in_srgb,var(--node-calculus)_12%,transparent)]",
  },
  display: {
    text: "text-[var(--node-display)]",
    bg: "bg-[var(--node-display)]",
    ring: "ring-[color-mix(in_srgb,var(--node-display)_40%,transparent)]",
    soft: "bg-[color-mix(in_srgb,var(--node-display)_12%,transparent)]",
  },
  advanced: {
    text: "text-[var(--node-advanced)]",
    bg: "bg-[var(--node-advanced)]",
    ring: "ring-[color-mix(in_srgb,var(--node-advanced)_40%,transparent)]",
    soft: "bg-[color-mix(in_srgb,var(--node-advanced)_12%,transparent)]",
  },
}

const legacyToneMap: Record<string, SidebarTone> = {
  "var(--category-number)": "input",
  "var(--category-arithmetic)": "arithmetic",
  "var(--category-trigonometry)": "trigonometry",
  "var(--category-logarithmic)": "logarithmic",
  "var(--category-logic)": "logic",
  "var(--category-expression)": "calculus",
  "var(--category-matrix)": "display",
  "var(--category-advanced)": "advanced",
}

export function resolveSidebarTone(value: SidebarTone | string): SidebarTone {
  return legacyToneMap[value] ?? (value as SidebarTone)
}

export function getSidebarToneClasses(
  value: SidebarTone | string,
): ToneClasses {
  return toneClasses[resolveSidebarTone(value)] ?? toneClasses.input
}
