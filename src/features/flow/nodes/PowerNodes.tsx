import React from "react"
import type { NodeProps } from "@xyflow/react"
import type { MathNodeData } from "../../../types"
import { NodeShell } from "./NodeShell"
import { useFlowStore } from "../flowStore"

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

    return (
      <NodeShell data={nodeData} selected={selected}>
        <div
          style={{
            textAlign: "center",
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            color: computed?.error
              ? "var(--status-error)"
              : computed?.value !== undefined
                ? "var(--text-primary)"
                : "var(--text-muted)",
            padding: "8px 0",
          }}
        >
          {computed?.error ? "⚠ Error" : displayValue}
        </div>
      </NodeShell>
    )
  },
)

PowerNode.displayName = "PowerNode"

export const SqrtNode: React.FC<NodeProps> = React.memo(
  ({ id, data, selected }) => {
    const nodeData = data as unknown as MathNodeData
    const computed = useFlowStore((s) => s.computedValues.get(id))

    const displayValue =
      computed?.value !== undefined && !computed.error
        ? typeof computed.value === "number"
          ? (computed.value as number).toFixed(4)
          : String(computed.value)
        : "√x"

    return (
      <NodeShell data={nodeData} selected={selected}>
        <div
          style={{
            textAlign: "center",
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            color: computed?.error
              ? "var(--status-error)"
              : computed?.value !== undefined
                ? "var(--text-primary)"
                : "var(--text-muted)",
            padding: "8px 0",
          }}
        >
          {computed?.error ? "⚠ Error" : displayValue}
        </div>
      </NodeShell>
    )
  },
)

SqrtNode.displayName = "SqrtNode"
