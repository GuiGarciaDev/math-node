import React from "react"
import { Handle, Position } from "@xyflow/react"
import type { MathNodeData } from "../../../types"

interface NodeShellProps {
  data: MathNodeData
  selected?: boolean
  children?: React.ReactNode
  headerActions?: React.ReactNode
}

const categoryColors: Record<string, string> = {
  input: "var(--category-input)",
  arithmetic: "var(--category-arithmetic)",
  calculus: "var(--category-calculus)",
  display: "var(--category-display)",
  advanced: "var(--category-advanced)",
}

const handleStyle = (index: number, total: number, accentColor: string) => {
  const topPercent = total === 1 ? 50 : 20 + (index * 60) / (total - 1)
  return {
    top: `${topPercent}%`,
    width: 11,
    height: 11,
    borderRadius: "50%",
    background: accentColor,
    border: "2px solid var(--bg-secondary)",
    boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.25)",
  } as React.CSSProperties
}

export const NodeShell: React.FC<NodeShellProps> = React.memo(
  ({ data, selected, children, headerActions }) => {
    const accentColor = categoryColors[data.category] ?? "#6b7280"
    const borderColor =
      data.status === "error"
        ? "var(--status-error)"
        : data.status === "success"
          ? "var(--status-success)"
          : selected
            ? accentColor
            : "var(--border)"

    return (
      <div style={{ position: "relative", width: 220 }}>
        {/* Inner body — clipped for rounded corners */}
        <div
          style={{
            background: "var(--bg-secondary)",
            backdropFilter: "blur(16px)",
            borderRadius: 12,
            border: `1px solid ${borderColor}`,
            boxShadow: `0 4px 20px rgba(0,0,0,0.3)`,
            transition: "border-color 0.2s, box-shadow 0.2s",
            overflow: "hidden",
          }}
        >
          {/* Top glow accent line */}
          <div
            style={{
              height: 1,
              background: `linear-gradient(90deg, transparent, ${accentColor ?? "transparent"}, transparent)`,
              opacity: 0.4,
            }}
          />

          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: accentColor,
                  boxShadow: `0 0 6px ${accentColor}`,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.01em",
                }}
              >
                {data.label}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {headerActions}
              {data.status !== "idle" && (
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background:
                      data.status === "success"
                        ? "var(--status-success)"
                        : data.status === "error"
                          ? "var(--status-error)"
                          : "var(--status-warn)",
                    animation:
                      data.status === "running"
                        ? "pulse 1s ease infinite"
                        : undefined,
                  }}
                />
              )}
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: "8px 12px" }}>{children}</div>
        </div>

        {/* Handles — rendered OUTSIDE overflow:hidden container */}
        {data.inputs.map((port, i) => (
          <Handle
            key={`in-${port.name}`}
            type="target"
            position={Position.Left}
            id={port.name}
            style={handleStyle(i, data.inputs.length, accentColor)}
          />
        ))}

        {data.outputs.map((port, i) => (
          <Handle
            key={`out-${port.name}`}
            type="source"
            position={Position.Right}
            id={port.name}
            style={handleStyle(i, data.outputs.length, accentColor)}
          />
        ))}
      </div>
    )
  },
)

NodeShell.displayName = "NodeShell"
