import { MiniMap, type Node as FlowNode } from "@xyflow/react"

function cssVarColor(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
  return value || fallback
}

const minimapNodeColor = (node: FlowNode) => {
  const category = node.data?.category
  switch (category) {
    case "input":
      return cssVarColor("--category-number", "#22c55e")
    case "arithmetic":
      return cssVarColor("--category-arithmetic", "#f97316")
    case "trigonometry":
      return cssVarColor("--category-trigonometry", "#0ea5e9")
    case "vectors":
      return cssVarColor("--category-trigonometry", "#0ea5e9")
    case "matrices":
      return cssVarColor("--category-matrix", "#ec4899")
    case "physics":
      return cssVarColor("--category-arithmetic", "#f97316")
    case "signals":
      return cssVarColor("--category-expression", "#eab308")
    case "logarithmic":
      return cssVarColor("--category-logarithmic", "#8b5cf6")
    case "logic":
      return cssVarColor("--category-logic", "#14b8a6")
    case "calculus":
      return cssVarColor("--category-expression", "#eab308")
    case "display":
      return cssVarColor("--category-matrix", "#ec4899")
    case "advanced":
      return cssVarColor("--category-advanced", "#bc77f8")
    default:
      return cssVarColor("--text-muted", "#6b7280")
  }
}

export default function MinimapComponent({}) {
  return (
    <MiniMap
      className="rounded-md border-2 border-border bg-background! overflow-hidden"
      nodeColor={minimapNodeColor}
      maskColor="rgba(0, 0, 0, 0.5)"
      pannable
      zoomable
    />
  )
}
