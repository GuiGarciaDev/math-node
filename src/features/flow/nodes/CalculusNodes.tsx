import React, { useCallback } from "react"
import type { NodeProps } from "@xyflow/react"
import type { MathNodeData } from "../../../types"
import { NodeShell } from "./NodeShell"
import { useFlowStore } from "../store/flowStore"

// ─── Derivative Node ──────────────────────────────────────

export const DerivativeNode: React.FC<NodeProps> = React.memo(
  ({ id, data, selected }) => {
    const nodeData = data as unknown as MathNodeData
    const computed = useFlowStore((s) => s.computedValues.get(id))
    const updateNodeParam = useFlowStore((s) => s.updateNodeParam)

    const handleVarChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        updateNodeParam(id, "variable", e.target.value)
      },
      [id, updateNodeParam],
    )

    const resultStr =
      computed?.value &&
      typeof computed.value === "object" &&
      "raw" in (computed.value as Record<string, unknown>)
        ? (computed.value as { raw: string }).raw
        : computed?.error
          ? `Error: ${computed.error}`
          : "—"
    const resultColorClass = computed?.error
      ? "text-[var(--status-error)]"
      : "text-[var(--text-primary)]"

    return (
      <NodeShell data={nodeData} selected={selected}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-[var(--text-muted)]">
              Respect to
            </span>
            <input
              type="text"
              value={String(nodeData.params.variable ?? "x")}
              onChange={handleVarChange}
              className="node-input w-10 rounded border border-[var(--border)] bg-[var(--bg-input)] px-1.5 py-0.5 text-center font-mono text-xs text-[var(--category-expression)] outline-none"
            />
          </div>

          <div className="my-0.5 h-px bg-[var(--border)]" />

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-medium text-[var(--text-muted)]">
              Result d/dx
            </span>
            <div
              className={`min-w-[120px] rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-2 py-1.5 font-mono text-xs shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] ${resultColorClass}`}
            >
              {resultStr}
            </div>
          </div>
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
    const updateNodeParam = useFlowStore((s) => s.updateNodeParam)

    const handleVarChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        updateNodeParam(id, "variable", e.target.value)
      },
      [id, updateNodeParam],
    )

    const resultStr =
      computed?.value &&
      typeof computed.value === "object" &&
      "raw" in (computed.value as Record<string, unknown>)
        ? (computed.value as { raw: string }).raw
        : computed?.error
          ? `Error: ${computed.error}`
          : "—"
    const resultColorClass = computed?.error
      ? "text-[var(--status-error)]"
      : "text-[var(--text-primary)]"

    return (
      <NodeShell data={nodeData} selected={selected}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-[var(--text-muted)]">
              Respect to
            </span>
            <input
              type="text"
              value={String(nodeData.params.variable ?? "x")}
              onChange={handleVarChange}
              className="node-input w-10 rounded border border-[var(--border)] bg-[var(--bg-input)] px-1.5 py-0.5 text-center font-mono text-xs text-[var(--category-expression)] outline-none"
            />
          </div>

          <div className="my-0.5 h-px bg-[var(--border)]" />

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-medium text-[var(--text-muted)]">
              Result ∫dx
            </span>
            <div
              className={`min-w-[120px] rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-2 py-1.5 font-mono text-xs shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] ${resultColorClass}`}
            >
              {resultStr}
            </div>
          </div>
        </div>
      </NodeShell>
    )
  },
)

IntegralNode.displayName = "IntegralNode"
