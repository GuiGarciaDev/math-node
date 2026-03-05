import React, { useCallback } from "react"
import type { NodeProps } from "@xyflow/react"
import type { MathNodeData } from "../../../types"
import { NodeShell } from "./NodeShell"
import { useFlowStore } from "../store/flowStore"

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
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] text-[var(--text-muted)]">f(x) =</span>
          <input
            type="text"
            value={String(nodeData.params.expression ?? "")}
            onChange={handleChange}
            className="node-input w-full rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-2 py-1.5 font-mono text-xs text-[var(--text-primary)] outline-none"
          />
        </div>
      </NodeShell>
    )
  },
)

ExpressionNode.displayName = "ExpressionNode"
