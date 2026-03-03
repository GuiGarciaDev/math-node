import React, { useCallback } from "react"
import type { NodeProps } from "@xyflow/react"
import type { MathNodeData } from "../../../types"
import { NodeShell } from "./NodeShell"
import { useFlowStore } from "../flowStore"

export const NumberInputNode: React.FC<NodeProps> = React.memo(
  ({ id, data, selected }) => {
    const nodeData = data as unknown as MathNodeData
    const updateNodeParam = useFlowStore((s) => s.updateNodeParam)

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        updateNodeParam(id, "value", val === "" ? "" : Number(val))
      },
      [id, updateNodeParam],
    )

    return (
      <NodeShell data={nodeData} selected={selected}>
        <input
          type="text"
          value={String(nodeData.params.value ?? "")}
          onChange={handleChange}
          className="node-input"
          style={{
            width: "100%",
            background: "var(--bg-input)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            padding: "6px 8px",
            fontSize: 12,
            color: "var(--category-input)",
            outline: "none",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        />
      </NodeShell>
    )
  },
)

NumberInputNode.displayName = "NumberInputNode"
