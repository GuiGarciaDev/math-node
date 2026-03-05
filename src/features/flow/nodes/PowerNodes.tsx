import React from "react"
import type { NodeProps } from "@xyflow/react"
import type { MathNodeData } from "../../../types"
import { NodeShell } from "./NodeShell"
import { useFlowStore } from "../store/flowStore"

export const PowerNode: React.FC<NodeProps> = React.memo(
  ({ id, data, selected }) => {
    const nodeData = data as unknown as MathNodeData
    const computed = useFlowStore((s) => s.computedValues.get(id))

    const displayValue =
      computed?.value !== undefined && !computed.error
        ? typeof computed.value === "number"
          ? Number.isInteger(computed.value)
            ? computed.value.toString()
            : (computed.value as number).toFixed(4)
          : String(computed.value)
        : "base ^ exp"

    const valueClass = computed?.error
      ? "text-[var(--status-error)]"
      : computed?.value !== undefined
        ? "text-[var(--text-primary)]"
        : "text-[var(--text-muted)]"

    return (
      <NodeShell data={nodeData} selected={selected}>
        <div className={`py-2 text-center font-mono text-[13px] ${valueClass}`}>
          {computed?.error ? "⚠ Error" : displayValue}
        </div>
      </NodeShell>
    )
  },
)

PowerNode.displayName = "PowerNode"

export const RootNode: React.FC<NodeProps> = React.memo(
  ({ id, data, selected }) => {
    const nodeData = data as unknown as MathNodeData
    const computed = useFlowStore((s) => s.computedValues.get(id))

    const displayValue =
      computed?.value !== undefined && !computed.error
        ? typeof computed.value === "number"
          ? (computed.value as number).toFixed(4)
          : String(computed.value)
        : "root(value, n)"

    const valueClass = computed?.error
      ? "text-[var(--status-error)]"
      : computed?.value !== undefined
        ? "text-[var(--text-primary)]"
        : "text-[var(--text-muted)]"

    return (
      <NodeShell data={nodeData} selected={selected}>
        <div className={`py-2 text-center font-mono text-[13px] ${valueClass}`}>
          {computed?.error ? "⚠ Error" : displayValue}
        </div>
      </NodeShell>
    )
  },
)

RootNode.displayName = "RootNode"

// Backward-compatible alias for persisted sqrt nodes.
export const SqrtNode = RootNode
