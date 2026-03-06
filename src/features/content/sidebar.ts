import type { SidebarCategory } from "../../types"

export const categories: SidebarCategory[] = [
  {
    name: "Inputs",
    color: "var(--category-input)",
    items: [
      {
        type: "numberInput",
        label: "Number",
        icon: "#",
        iconColor: "var(--category-input)",
      },
      {
        type: "constant",
        label: "Constant",
        icon: "π",
        iconColor: "var(--category-input)",
        description: "pi, e",
      },
      {
        type: "variable",
        label: "Variable",
        icon: "𝑥",
        iconColor: "var(--category-input)",
      },
      {
        type: "expression",
        label: "Expression",
        icon: "ƒ",
        iconColor: "var(--category-input)",
      },
    ],
  },
  {
    name: "Arithmetic",
    color: "var(--category-arithmetic)",
    items: [
      {
        type: "add",
        label: "Add",
        icon: "＋",
        iconColor: "var(--category-arithmetic)",
      },
      {
        type: "subtract",
        label: "Subtract",
        icon: "−",
        iconColor: "var(--category-arithmetic)",
      },
      {
        type: "multiply",
        label: "Multiply",
        icon: "×",
        iconColor: "var(--category-arithmetic)",
      },
      {
        type: "divide",
        label: "Divide",
        icon: "÷",
        iconColor: "var(--category-arithmetic)",
      },
      {
        type: "power",
        label: "Power",
        icon: "^",
        iconColor: "var(--category-arithmetic)",
      },
      {
        type: "root",
        label: "Root",
        icon: "√",
        iconColor: "var(--category-arithmetic)",
      },
    ],
  },
  {
    name: "Trigonometry",
    color: "var(--category-trigonometry)",
    items: [
      {
        type: "trigonometric",
        label: "Trigonometric Function",
        icon: "∿",
        iconColor: "var(--category-trigonometry)",
        description: "sin, cos, tan, asin, acos, atan",
      },
    ],
  },
  {
    name: "Logarithmic",
    color: "var(--category-logarithmic)",
    items: [
      {
        type: "ln",
        label: "ln",
        icon: "ln",
        iconColor: "var(--category-logarithmic)",
      },
      {
        type: "log",
        label: "log",
        icon: "log",
        iconColor: "var(--category-logarithmic)",
      },
    ],
  },
  {
    name: "Logic",
    color: "var(--category-logic)",
    items: [
      {
        type: "comparator",
        label: "Comparator",
        icon: "⊨",
        iconColor: "var(--category-logic)",
        description: "< > <= >= ===",
      },
    ],
  },
  {
    name: "Calculus",
    color: "var(--category-calculus)",
    items: [
      {
        type: "derivative",
        label: "Derivative",
        icon: "∂",
        iconColor: "var(--category-calculus)",
      },
      {
        type: "integral",
        label: "Integral",
        icon: "∫",
        iconColor: "var(--category-calculus)",
      },
    ],
  },
  {
    name: "Display",
    color: "var(--category-display)",
    items: [
      {
        type: "plot",
        label: "Plot Function",
        icon: "📈",
        iconColor: "var(--category-display)",
      },
      {
        type: "matrix",
        label: "Matrix",
        icon: "▦",
        iconColor: "var(--category-display)",
      },
    ],
  },
]
