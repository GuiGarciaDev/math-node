import React from "react"
import type { NodeProps } from "@xyflow/react"
import type { MathNodeData } from "../../../types"
import { NodeShell } from "./NodeShell"
import { useFlowStore } from "../store/flowStore"

/** Shared component for binary arithmetic nodes (add, subtract, multiply, divide) */
function createArithmeticNode(
  displayName: string,
  _icon: string,
  operatorSymbol: string,
) {
  const ArithmeticNode: React.FC<NodeProps> = React.memo(
    ({ id, data, selected }) => {
      const nodeData = data as unknown as MathNodeData
      const computed = useFlowStore((s) => s.computedValues.get(id))

      const displayValue =
        computed?.value !== undefined && computed.value !== null
          ? typeof computed.value === "number"
            ? Number.isInteger(computed.value)
              ? computed.value.toString()
              : (computed.value as number).toFixed(4)
            : String(computed.value)
          : operatorSymbol

      const hasError = computed?.error
      const valueClass = hasError
        ? "text-[var(--status-error)]"
        : computed?.value !== undefined
          ? "text-[var(--text-primary)]"
          : "text-[var(--text-muted)]"

      return (
        <NodeShell data={nodeData} selected={selected}>
          <div
            className={`flex min-h-8 items-center justify-center py-2 text-center font-mono text-[13px] ${valueClass}`}
          >
            {hasError ? "⚠ Error" : displayValue}
          </div>
        </NodeShell>
      )
    },
  )

  ArithmeticNode.displayName = displayName
  return ArithmeticNode
}

export const AddNode = createArithmeticNode("AddNode", "＋", "a + b")
export const SubtractNode = createArithmeticNode("SubtractNode", "−", "a − b")
export const MultiplyNode = createArithmeticNode("MultiplyNode", "×", "a × b")
export const DivideNode = createArithmeticNode("DivideNode", "÷", "a ÷ b")
