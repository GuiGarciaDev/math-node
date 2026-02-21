import React from "react";
import type { NodeProps } from "@xyflow/react";
import type { MathNodeData } from "../../../types";
import { NodeShell } from "./NodeShell";
import { useFlowStore } from "../flowStore";

/** Shared component for binary arithmetic nodes (add, subtract, multiply, divide) */
function createArithmeticNode(
  displayName: string,
  _icon: string,
  operatorSymbol: string,
) {
  const ArithmeticNode: React.FC<NodeProps> = React.memo(
    ({ id, data, selected }) => {
      const nodeData = data as unknown as MathNodeData;
      const computed = useFlowStore((s) => s.computedValues.get(id));

      const displayValue =
        computed?.value !== undefined && computed.value !== null
          ? typeof computed.value === "number"
            ? Number.isInteger(computed.value)
              ? computed.value.toString()
              : (computed.value as number).toFixed(4)
            : String(computed.value)
          : operatorSymbol;

      const hasError = computed?.error;

      return (
        <NodeShell data={nodeData} selected={selected}>
          <div
            style={{
              textAlign: "center",
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              color: hasError
                ? "#ef4444"
                : computed?.value !== undefined
                  ? "#e5e5e5"
                  : "#6b7280",
              padding: "8px 0",
              minHeight: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {hasError ? "⚠ Error" : displayValue}
          </div>
        </NodeShell>
      );
    },
  );

  ArithmeticNode.displayName = displayName;
  return ArithmeticNode;
}

export const AddNode = createArithmeticNode("AddNode", "＋", "a + b");
export const SubtractNode = createArithmeticNode("SubtractNode", "−", "a − b");
export const MultiplyNode = createArithmeticNode("MultiplyNode", "×", "a × b");
export const DivideNode = createArithmeticNode("DivideNode", "÷", "a ÷ b");
