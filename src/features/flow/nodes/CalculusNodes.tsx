import React from "react"
import type { NodeProps } from "@xyflow/react"
import type { MathNodeData } from "../../../types"
import { NodeShell } from "./NodeShell"
import { useFlowStore } from "../store/flowStore"

// ─── Derivative Node ──────────────────────────────────────

export const DerivativeNode: React.FC<NodeProps> = React.memo(
  ({ id, data, selected }) => {
    const nodeData = data as unknown as MathNodeData
    const computed = useFlowStore((s) => s.computedValues.get(id))
    const value =
      typeof computed?.value === "number"
        ? computed.value.toFixed(6)
        : "(f(x+h)-f(x))/h"

    return (
      <NodeShell data={nodeData} selected={selected}>
        <div
          className={`rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-2 py-1.5 font-mono text-xs ${
            computed?.error
              ? "text-[var(--status-error)]"
              : "text-[var(--text-primary)]"
          }`}
        >
          {computed?.error ? `Error: ${computed.error}` : value}
        </div>
      </NodeShell>
    )
  },
)

DerivativeNode.displayName = "DerivativeNode"

// ─── Integral Node ────────────────────────────────────────

export const IntegralNode: React.FC<NodeProps> = React.memo(
  ({ id, data, selected }) => {
    const nodeData = data as unknown as MathNodeData
    const computed = useFlowStore((s) => s.computedValues.get(id))
    const value =
      typeof computed?.value === "number"
        ? computed.value.toFixed(6)
        : "trapezoidal integral"

    return (
      <NodeShell data={nodeData} selected={selected}>
        <div
          className={`rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-2 py-1.5 font-mono text-xs ${
            computed?.error
              ? "text-[var(--status-error)]"
              : "text-[var(--text-primary)]"
          }`}
        >
          {computed?.error ? `Error: ${computed.error}` : value}
        </div>
      </NodeShell>
    )
  },
)

IntegralNode.displayName = "IntegralNode"
