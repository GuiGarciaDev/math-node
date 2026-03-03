import React, { useCallback } from "react"
import type { NodeProps } from "@xyflow/react"
import type { MathNodeData } from "../../../types"
import { NodeShell } from "./NodeShell"
import { useFlowStore } from "../flowStore"

export const ExpressionNode: React.FC<NodeProps> = React.memo(
  ({ id, data, selected }) => {
    const nodeData = data as unknown as MathNodeData
    const updateNodeParam = useFlowStore((s) => s.updateNodeParam)

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        updateNodeParam(id, "expression", e.target.value)
      },
      [id, updateNodeParam],
    )

    return (
      <NodeShell data={nodeData} selected={selected}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
            f(x) =
          </span>
          <input
            type="text"
            value={String(nodeData.params.expression ?? "")}
            onChange={handleChange}
            className="node-input"
            style={{
              width: "100%",
              background: "var(--bg-input)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              padding: "6px 8px",
              fontSize: 12,
              color: "var(--text-primary)",
              outline: "none",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          />
        </div>
      </NodeShell>
    )
  },
)

ExpressionNode.displayName = "ExpressionNode"
