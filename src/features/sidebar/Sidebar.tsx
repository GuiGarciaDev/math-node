import React, { useCallback, useState } from "react";
import type { SidebarCategory, MathNodeType } from "../../types";

const categories: SidebarCategory[] = [
  {
    name: "Input",
    color: "#3b82f6",
    items: [
      {
        type: "numberInput",
        label: "Number",
        icon: "🔢",
        iconColor: "#3b82f6",
        description: "Numeric constant input",
      },
      {
        type: "variable",
        label: "Variable",
        icon: "𝑥",
        iconColor: "#8b5cf6",
        description: "Symbolic variable",
      },
      {
        type: "expression",
        label: "Expression",
        icon: "ƒ",
        iconColor: "#8b5cf6",
        description: "Mathematical expression",
      },
    ],
  },
  {
    name: "Arithmetic",
    color: "#3b82f6",
    items: [
      { type: "add", label: "Add", icon: "＋", iconColor: "#3b82f6" },
      { type: "subtract", label: "Subtract", icon: "−", iconColor: "#3b82f6" },
      { type: "multiply", label: "Multiply", icon: "×", iconColor: "#3b82f6" },
      { type: "divide", label: "Divide", icon: "÷", iconColor: "#3b82f6" },
      { type: "power", label: "Power", icon: "^", iconColor: "#3b82f6" },
      { type: "sqrt", label: "Square Root", icon: "√", iconColor: "#3b82f6" },
    ],
  },
  {
    name: "Calculus",
    color: "#8b5cf6",
    items: [
      {
        type: "derivative",
        label: "Derivative",
        icon: "∂",
        iconColor: "#8b5cf6",
        description: "Symbolic differentiation",
      },
      {
        type: "integral",
        label: "Integral",
        icon: "∫",
        iconColor: "#8b5cf6",
        description: "Symbolic integration",
      },
    ],
  },
  {
    name: "Display",
    color: "#10b981",
    items: [
      {
        type: "plot",
        label: "Plot Function",
        icon: "📈",
        iconColor: "#10b981",
        description: "Function visualization",
      },
      {
        type: "matrix",
        label: "Matrix",
        icon: "▦",
        iconColor: "#f59e0b",
        description: "Matrix editor",
      },
    ],
  },
];

export const Sidebar: React.FC = React.memo(() => {
  const [searchQuery, setSearchQuery] = useState("");

  const onDragStart = useCallback(
    (e: React.DragEvent, nodeType: MathNodeType) => {
      e.dataTransfer.setData("application/mathflow-node", nodeType);
      e.dataTransfer.effectAllowed = "move";
    },
    [],
  );

  const filteredCategories = searchQuery
    ? categories
        .map((cat) => ({
          ...cat,
          items: cat.items.filter((item) =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        }))
        .filter((cat) => cat.items.length > 0)
    : categories;

  return (
    <aside
      style={{
        width: 256,
        background: "rgba(17, 19, 26, 0.95)",
        backdropFilter: "blur(12px)",
        borderRight: "1px solid #262830",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        boxShadow: "10px 0 30px rgba(0,0,0,0.5)",
      }}
    >
      {/* Search */}
      <div style={{ padding: 12, borderBottom: "1px solid #262830" }}>
        <div style={{ position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 13,
              color: "#6b7280",
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
              background: "#0f1117",
              border: "1px solid #262830",
              borderRadius: 8,
              padding: "6px 12px 6px 32px",
              fontSize: 12,
              color: "#e5e5e5",
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
                color: "#6b7280",
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
                    color: "#d4d4d4",
                    border: "1px solid transparent",
                    transition: "all 0.15s",
                    userSelect: "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "#1c1e26";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "#262830";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "transparent";
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
    </aside>
  );
});

Sidebar.displayName = "Sidebar";
