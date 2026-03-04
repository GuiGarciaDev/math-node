import React, { useCallback, useState } from "react"
import type { SidebarCategory, MathNodeType } from "../../types"

interface SidebarProps {
  collapsed?: boolean
}

const categories: SidebarCategory[] = [
  {
    name: "Input",
    color: "var(--category-input)",
    items: [
      {
        type: "numberInput",
        label: "Number",
        icon: "🔢",
        iconColor: "var(--category-input)",
        description: "Numeric constant input",
      },
      {
        type: "variable",
        label: "Variable",
        icon: "𝑥",
        iconColor: "var(--category-input)",
        description: "Symbolic variable",
      },
      {
        type: "expression",
        label: "Expression",
        icon: "ƒ",
        iconColor: "var(--category-input)",
        description: "Mathematical expression",
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
        type: "sqrt",
        label: "Square Root",
        icon: "√",
        iconColor: "var(--category-arithmetic)",
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
        description: "Symbolic differentiation",
      },
      {
        type: "integral",
        label: "Integral",
        icon: "∫",
        iconColor: "var(--category-calculus)",
        description: "Symbolic integration",
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
        description: "Function visualization",
      },
      {
        type: "matrix",
        label: "Matrix",
        icon: "▦",
        iconColor: "var(--category-display)",
        description: "Matrix editor",
      },
    ],
  },
]

export const Sidebar: React.FC<SidebarProps> = React.memo(({ collapsed }) => {
  const [searchQuery, setSearchQuery] = useState("")

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

  return (
    <aside
      style={{
        width: collapsed ? 44 : 256,
        background: "var(--bg-secondary)",
        backdropFilter: "blur(12px)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        boxShadow: "10px 0 30px rgba(0,0,0,0.5)",
        transition: "width 0.24s ease",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          width: 256,
          minWidth: 256,
          opacity: collapsed ? 0 : 1,
          transition: "opacity 0.18s ease",
          pointerEvents: collapsed ? "none" : "all",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Search */}
        <div style={{ padding: 12, borderBottom: "1px solid var(--border)" }}>
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 13,
                color: "var(--text-muted)",
              }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                background: "var(--bg-input)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "6px 12px 6px 32px",
                fontSize: 12,
                color: "var(--text-primary)",
                outline: "none",
                fontFamily: "'Inter', sans-serif",
              }}
            />
          </div>
        </div>

        {/* Node Library */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 12,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {filteredCategories.map((category) => (
            <div key={category.name}>
              <h3
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--text-muted)",
                  fontWeight: 500,
                  marginBottom: 8,
                  paddingLeft: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: category.color,
                  }}
                />
                {category.name}
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {category.items.map((item) => (
                  <div
                    key={item.type}
                    draggable
                    onDragStart={(e) => onDragStart(e, item.type)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "6px 8px",
                      borderRadius: 8,
                      cursor: "grab",
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      border: "1px solid transparent",
                      transition: "all 0.15s",
                      userSelect: "none",
                    }}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLElement).style.background =
                        "var(--bg-tertiary)"
                      ;(e.currentTarget as HTMLElement).style.borderColor =
                        "var(--border)"
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLElement).style.background =
                        "transparent"
                      ;(e.currentTarget as HTMLElement).style.borderColor =
                        "transparent"
                    }}
                  >
                    <span
                      style={{
                        color: item.iconColor,
                        fontSize: 14,
                        width: 18,
                        textAlign: "center",
                      }}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {collapsed && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 52,
            gap: 12,
            pointerEvents: "none",
            color: "var(--text-muted)",
            fontSize: 13,
          }}
        >
          <span>🔢</span>
          <span>＋</span>
          <span>∂</span>
          <span>📈</span>
        </div>
      )}
    </aside>
  )
})

Sidebar.displayName = "Sidebar"
