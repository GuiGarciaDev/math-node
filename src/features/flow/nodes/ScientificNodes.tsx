import React, { useCallback } from "react"
import type { NodeProps } from "@xyflow/react"
import type { MathNodeData } from "../../../types"
import { NodeShell } from "./NodeShell"
import { useFlowStore } from "../store/flowStore"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
      (value: string) => {
        updateNodeParam(id, "operation", value)
      },
      [id, updateNodeParam],
    )

    const onUnitChange = useCallback(
      (value: string) => {
        updateNodeParam(id, "unit", value)
      },
      [id, updateNodeParam],
    )

    return (
      <NodeShell data={nodeData} selected={selected}>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <Select value={operation} onValueChange={onOperationChange}>
              <SelectTrigger className="node-input h-8 border-[var(--border)] bg-[var(--bg-input)] px-2 py-1.5 font-mono text-xs text-[var(--text-primary)] ring-offset-0 focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sin">sin</SelectItem>
                <SelectItem value="cos">cos</SelectItem>
                <SelectItem value="tan">tan</SelectItem>
                <SelectItem value="asin">asin</SelectItem>
                <SelectItem value="acos">acos</SelectItem>
                <SelectItem value="atan">atan</SelectItem>
              </SelectContent>
            </Select>
            <Select value={unit} onValueChange={onUnitChange}>
              <SelectTrigger className="node-input h-8 border-[var(--border)] bg-[var(--bg-input)] px-2 py-1.5 font-mono text-xs text-[var(--text-primary)] ring-offset-0 focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deg">deg</SelectItem>
                <SelectItem value="rad">rad</SelectItem>
              </SelectContent>
            </Select>
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
      (value: string) => {
        updateNodeParam(id, "operator", value)
      },
      [id, updateNodeParam],
    )

    return (
      <NodeShell data={nodeData} selected={selected}>
        <div className="flex flex-col gap-2">
          <Select value={operator} onValueChange={onOperatorChange}>
            <SelectTrigger className="node-input h-8 border-[var(--border)] bg-[var(--bg-input)] px-2 py-1.5 font-mono text-xs text-[var(--text-primary)] ring-offset-0 focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<">&lt;</SelectItem>
              <SelectItem value=">">&gt;</SelectItem>
              <SelectItem value="<=">&lt;=</SelectItem>
              <SelectItem value=">=">&gt;=</SelectItem>
              <SelectItem value="===">===</SelectItem>
            </SelectContent>
          </Select>

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
