import React, { useCallback } from "react"
import type { NodeProps } from "@xyflow/react"
import type { MathNodeData } from "../../../types"
import { NodeShell } from "./NodeShell"
import { useFlowStore } from "../store/flowStore"

function formatNumber(value: unknown, fallback: string): string {
  if (typeof value !== "number") return fallback
  return Number.isInteger(value) ? String(value) : value.toFixed(6)
}

export const TrigonometricNode: React.FC<NodeProps> = React.memo(
  ({ id, data, selected }) => {
    const nodeData = data as unknown as MathNodeData
    const computed = useFlowStore((s) => s.computedValues.get(id))
    const updateNodeParam = useFlowStore((s) => s.updateNodeParam)

    const operation = String(nodeData.params.operation ?? "sin")
    const unit = String(nodeData.params.unit ?? "rad")

    const onOperationChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateNodeParam(id, "operation", e.target.value)
      },
      [id, updateNodeParam],
    )

    const onUnitChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateNodeParam(id, "unit", e.target.value)
      },
      [id, updateNodeParam],
    )

    return (
      <NodeShell data={nodeData} selected={selected}>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <select
              value={operation}
              onChange={onOperationChange}
              className="node-input rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-2 py-1.5 font-mono text-xs text-[var(--text-primary)] outline-none"
            >
              <option value="sin">sin</option>
              <option value="cos">cos</option>
              <option value="tan">tan</option>
              <option value="asin">asin</option>
              <option value="acos">acos</option>
              <option value="atan">atan</option>
            </select>
            <select
              value={unit}
              onChange={onUnitChange}
              className="node-input rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-2 py-1.5 font-mono text-xs text-[var(--text-primary)] outline-none"
            >
              <option value="deg">deg</option>
              <option value="rad">rad</option>
            </select>
          </div>
          <div
            className={`rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-2 py-1.5 font-mono text-xs ${
              computed?.error
                ? "text-[var(--status-error)]"
                : "text-[var(--text-primary)]"
            }`}
          >
            {computed?.error
              ? `Error: ${computed.error}`
              : formatNumber(computed?.value, `${operation}(x)`)}
          </div>
        </div>
      </NodeShell>
    )
  },
)

TrigonometricNode.displayName = "TrigonometricNode"

export const LnNode: React.FC<NodeProps> = React.memo(
  ({ id, data, selected }) => {
    const nodeData = data as unknown as MathNodeData
    const computed = useFlowStore((s) => s.computedValues.get(id))

    return (
      <NodeShell data={nodeData} selected={selected}>
        <div
          className={`rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-2 py-1.5 font-mono text-xs ${
            computed?.error
              ? "text-[var(--status-error)]"
              : "text-[var(--text-primary)]"
          }`}
        >
          {computed?.error
            ? `Error: ${computed.error}`
            : formatNumber(computed?.value, "ln(x)")}
        </div>
      </NodeShell>
    )
  },
)

LnNode.displayName = "LnNode"

export const LogNode: React.FC<NodeProps> = React.memo(
  ({ id, data, selected }) => {
    const nodeData = data as unknown as MathNodeData
    const computed = useFlowStore((s) => s.computedValues.get(id))

    return (
      <NodeShell data={nodeData} selected={selected}>
        <div
          className={`rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-2 py-1.5 font-mono text-xs ${
            computed?.error
              ? "text-[var(--status-error)]"
              : "text-[var(--text-primary)]"
          }`}
        >
          {computed?.error
            ? `Error: ${computed.error}`
            : formatNumber(computed?.value, "log(x, b)")}
        </div>
      </NodeShell>
    )
  },
)

LogNode.displayName = "LogNode"

export const ComparatorNode: React.FC<NodeProps> = React.memo(
  ({ id, data, selected }) => {
    const nodeData = data as unknown as MathNodeData
    const computed = useFlowStore((s) => s.computedValues.get(id))
    const updateNodeParam = useFlowStore((s) => s.updateNodeParam)

    const operator = String(nodeData.params.operator ?? "===")

    const onOperatorChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateNodeParam(id, "operator", e.target.value)
      },
      [id, updateNodeParam],
    )

    return (
      <NodeShell data={nodeData} selected={selected}>
        <div className="flex flex-col gap-2">
          <select
            value={operator}
            onChange={onOperatorChange}
            className="node-input rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-2 py-1.5 font-mono text-xs text-[var(--text-primary)] outline-none"
          >
            <option value="<">&lt;</option>
            <option value=">">&gt;</option>
            <option value="<=">&lt;=</option>
            <option value=">=">&gt;=</option>
            <option value="===">===</option>
          </select>

          <div
            className={`rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-2 py-1.5 font-mono text-xs ${
              computed?.error
                ? "text-[var(--status-error)]"
                : "text-[var(--status-success)]"
            }`}
          >
            {computed?.error
              ? `Error: ${computed.error}`
              : String(Boolean(computed?.value))}
          </div>
        </div>
      </NodeShell>
    )
  },
)

ComparatorNode.displayName = "ComparatorNode"
