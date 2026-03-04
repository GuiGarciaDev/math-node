import React from "react"
import type { NodeProps } from "@xyflow/react"
import type { MathNodeData } from "../../../types"

export const GroupNode: React.FC<NodeProps> = React.memo(
  ({ data, selected, width, height }) => {
    const nodeData = data as unknown as MathNodeData
    const nodeWidth = Number(width ?? nodeData.params.width ?? 280)
    const nodeHeight = Number(height ?? nodeData.params.height ?? 180)

    return (
      <div
        style={{
          width: nodeWidth,
          height: nodeHeight,
          borderRadius: 14,
          border: `1px solid ${selected ? "var(--accent)" : "var(--border)"}`,
          background:
            "color-mix(in srgb, var(--bg-secondary) 85%, transparent)",
          boxShadow: selected
            ? "0 0 0 1px color-mix(in srgb, var(--accent) 45%, transparent)"
            : "none",
          pointerEvents: "all",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 10,
            fontSize: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            fontWeight: 600,
          }}
        >
          {nodeData.label}
        </div>
      </div>
    )
  },
)

GroupNode.displayName = "GroupNode"
