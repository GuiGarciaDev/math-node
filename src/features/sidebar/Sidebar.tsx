import React, { useCallback, useState } from "react"
import type { SidebarCategory, MathNodeType } from "../../types"

interface SidebarProps {
  collapsed?: boolean
}

const categories: SidebarCategory[] = [
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

const tokenToTextClass: Record<string, string> = {
  "var(--category-input)": "text-[var(--category-input)]",
  "var(--category-arithmetic)": "text-[var(--category-arithmetic)]",
  "var(--category-trigonometry)": "text-[var(--category-trigonometry)]",
  "var(--category-logarithmic)": "text-[var(--category-logarithmic)]",
  "var(--category-logic)": "text-[var(--category-logic)]",
  "var(--category-calculus)": "text-[var(--category-calculus)]",
  "var(--category-display)": "text-[var(--category-display)]",
  "var(--category-advanced)": "text-[var(--category-advanced)]",
}

const tokenToBgClass: Record<string, string> = {
  "var(--category-input)": "bg-[var(--category-input)]",
  "var(--category-arithmetic)": "bg-[var(--category-arithmetic)]",
  "var(--category-trigonometry)": "bg-[var(--category-trigonometry)]",
  "var(--category-logarithmic)": "bg-[var(--category-logarithmic)]",
  "var(--category-logic)": "bg-[var(--category-logic)]",
  "var(--category-calculus)": "bg-[var(--category-calculus)]",
  "var(--category-display)": "bg-[var(--category-display)]",
  "var(--category-advanced)": "bg-[var(--category-advanced)]",
}

export const Sidebar: React.FC<SidebarProps> = React.memo(({ collapsed }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >(() =>
    Object.fromEntries(categories.map((category) => [category.name, true])),
  )

  const onDragStart = useCallback(
    (e: React.DragEvent, nodeType: MathNodeType) => {
      e.dataTransfer.setData("application/mathflow-node", nodeType)
      e.dataTransfer.effectAllowed = "move"
    },
    [],
  )

  const filteredCategories = searchQuery
    ? categories
        .map((cat) => ({
          ...cat,
          items: cat.items.filter((item) =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        }))
        .filter((cat) => cat.items.length > 0)
    : categories

  const toggleCategory = useCallback((categoryName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }))
  }, [])

  const collapsedItems = filteredCategories.flatMap((category) =>
    category.items.slice(0, 2),
  )

  return (
    <aside
      className={`relative flex h-full shrink-0 flex-col overflow-hidden border-r border-[var(--border)] bg-[var(--bg-secondary)] shadow-[10px_0_30px_rgba(0,0,0,0.35)] backdrop-blur-md transition-[width] duration-200 ${
        collapsed ? "w-14" : "w-64"
      }`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--accent)_7%,transparent),transparent)]" />
      <div
        className={`flex h-full w-64 min-w-64 flex-col transition-opacity duration-200 ${
          collapsed ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <div className="border-b border-[var(--border)] p-3">
          <div className="relative">
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] text-[var(--text-muted)]">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="node-input w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] py-1.5 pl-8 pr-3 text-xs text-[var(--text-primary)] outline-none placeholder:text-[var(--text-dim)]"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-3">
          {filteredCategories.map((category) => (
            <div key={category.name}>
              <button
                type="button"
                onClick={() => toggleCategory(category.name)}
                className="mb-2 flex w-full items-center justify-between pl-1 text-left text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--text-muted)]"
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`h-1 w-1 rounded-full ${tokenToBgClass[category.color] ?? "bg-[var(--text-muted)]"}`}
                  />
                  {category.name}
                </span>
                <span className="text-[9px] text-[var(--text-dim)]">
                  {expandedCategories[category.name] ? "−" : "+"}
                </span>
              </button>

              {expandedCategories[category.name] && (
                <div className="flex flex-col gap-1">
                  {category.items.map((item) => (
                    <div
                      key={item.type}
                      draggable
                      onDragStart={(e) => onDragStart(e, item.type)}
                      className="group flex cursor-grab select-none items-center gap-2.5 rounded-lg border border-transparent px-2 py-1.5 text-xs text-[var(--text-secondary)] transition-all duration-150 hover:border-[var(--border)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] active:cursor-grabbing"
                      title={item.description ?? item.label}
                    >
                      <span
                        className={`w-[18px] text-center text-sm ${tokenToTextClass[item.iconColor] ?? "text-[var(--text-muted)]"}`}
                      >
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {collapsed && (
        <div className="absolute inset-0 flex flex-col items-center gap-2 px-2 pb-2 pt-12">
          <div className="mb-1 h-8 w-8 rounded-lg border border-[var(--border)] bg-[color-mix(in_srgb,var(--accent)_16%,transparent)]" />
          {collapsedItems.slice(0, 8).map((item) => (
            <div
              key={`collapsed-${item.type}`}
              className={`group flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)]/70 text-sm shadow-[0_0_0_1px_rgba(0,0,0,0.15)] transition-all duration-150 hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:bg-[var(--bg-tertiary)] ${tokenToTextClass[item.iconColor] ?? "text-[var(--text-muted)]"}`}
              title={item.label}
            >
              {item.icon}
            </div>
          ))}
        </div>
      )}
    </aside>
  )
})

Sidebar.displayName = "Sidebar"
