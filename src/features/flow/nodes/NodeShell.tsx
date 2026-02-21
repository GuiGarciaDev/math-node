import React from "react";
import { Handle, Position } from "@xyflow/react";
import type { MathNodeData, PortDefinition } from "../../../types";

interface NodeShellProps {
  data: MathNodeData;
  selected?: boolean;
  children?: React.ReactNode;
}

const categoryColors: Record<string, string> = {
  input: "#3b82f6",
  arithmetic: "#3b82f6",
  calculus: "#8b5cf6",
  display: "#10b981",
  advanced: "#f59e0b",
};

const handleStyle = (
  _port: PortDefinition,
  index: number,
  total: number,
  accentColor: string,
) => {
  const topPercent = total === 1 ? 50 : 20 + (index * 60) / (total - 1);
  return {
    top: `${topPercent}%`,
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#1c1e26",
    border: `2px solid ${accentColor}`,
  };
};

export const NodeShell: React.FC<NodeShellProps> = React.memo(
  ({ data, selected, children }) => {
    const accentColor = categoryColors[data.category] ?? "#6b7280";
    const borderColor =
      data.status === "error"
        ? "#ef4444"
        : data.status === "success"
          ? "#10b981"
          : selected
            ? accentColor
            : "#262830";

    return (
      <div
        style={{
          background: "rgba(17, 19, 26, 0.95)",
          backdropFilter: "blur(16px)",
          borderRadius: 12,
          border: `1px solid ${borderColor}`,
          width: 220,
          boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 15px ${accentColor}10`,
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
            borderBottom: "1px solid #1c1e26",
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
                color: "#e5e5e5",
                letterSpacing: "-0.01em",
              }}
            >
              {data.label}
            </span>
          </div>

          {/* Status indicator */}
          {data.status !== "idle" && (
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background:
                  data.status === "success"
                    ? "#10b981"
                    : data.status === "error"
                      ? "#ef4444"
                      : "#f59e0b",
                animation:
                  data.status === "running"
                    ? "pulse 1s ease infinite"
                    : undefined,
              }}
            />
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "8px 12px" }}>{children}</div>

        {/* Input Handles */}
        {data.inputs.map((port, i) => (
          <Handle
            key={`in-${port.name}`}
            type="target"
            position={Position.Left}
            id={port.name}
            style={handleStyle(port, i, data.inputs.length, accentColor)}
          />
        ))}

        {/* Output Handles */}
        {data.outputs.map((port, i) => (
          <Handle
            key={`out-${port.name}`}
            type="source"
            position={Position.Right}
            id={port.name}
            style={handleStyle(port, i, data.outputs.length, accentColor)}
          />
        ))}
      </div>
    );
  },
);

NodeShell.displayName = "NodeShell";
