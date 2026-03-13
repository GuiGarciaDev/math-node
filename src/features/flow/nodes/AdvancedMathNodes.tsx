import React, { useCallback } from "react"
import type { NodeProps } from "@xyflow/react"
import type { MathNodeData } from "../../../types"
import { NodeShell } from "./NodeShell"
import { useFlowStore } from "../store/flowStore"

function formatValue(value: unknown): string {
  if (value === undefined || value === null) return "-"
  if (typeof value === "number") {
    return Number.isInteger(value) ? String(value) : value.toFixed(6)
  }
  return JSON.stringify(value)
}

function createValueNode(displayName: string, placeholder: string) {
  const ValueNode: React.FC<NodeProps> = React.memo(
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
              : computed?.value !== undefined
                ? formatValue(computed.value)
                : placeholder}
          </div>
        </NodeShell>
      )
    },
  )

  ValueNode.displayName = displayName
  return ValueNode
}

export const TimeNode = createValueNode("TimeNode", "t (seconds)")
export const Vector2Node = createValueNode("Vector2Node", "{ x, y }")
export const Vector3Node = createValueNode("Vector3Node", "{ x, y, z }")
export const DotProductNode = createValueNode("DotProductNode", "A . B")
export const CrossProductNode = createValueNode("CrossProductNode", "A x B")
export const NormalizeNode = createValueNode("NormalizeNode", "v / |v|")
export const LengthNode = createValueNode("LengthNode", "|v|")
export const MatrixMultiplyNode = createValueNode("MatrixMultiplyNode", "A * B")
export const DeterminantNode = createValueNode("DeterminantNode", "det(M)")
export const InverseNode = createValueNode("InverseNode", "M^-1")
export const VelocityNode = createValueNode("VelocityNode", "v = dx / dt")
export const AccelerationNode = createValueNode(
  "AccelerationNode",
  "a = dv / dt",
)
export const ForceNode = createValueNode("ForceNode", "F = m * a")
export const KineticEnergyNode = createValueNode(
  "KineticEnergyNode",
  "Ek = 1/2 mv^2",
)
export const PotentialEnergyNode = createValueNode(
  "PotentialEnergyNode",
  "Ep = mgh",
)
export const OscillatorNode = createValueNode(
  "OscillatorNode",
  "A * sin(2pift + phi)",
)

export const RandomNode: React.FC<NodeProps> = React.memo(
  ({ id, data, selected }) => {
    const nodeData = data as unknown as MathNodeData
    const computed = useFlowStore((s) => s.computedValues.get(id))
    const updateNodeParam = useFlowStore((s) => s.updateNodeParam)

    const seed = Number(nodeData.params.seed ?? 1)

    const onSeedChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const parsed = Number(event.target.value)
        updateNodeParam(
          id,
          "seed",
          Number.isFinite(parsed) ? Math.round(parsed) : 1,
        )
      },
      [id, updateNodeParam],
    )

    return (
      <NodeShell data={nodeData} selected={selected}>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-[0.08em] text-[var(--text-dim)]">
            Seed
            <input
              type="number"
              value={seed}
              onChange={onSeedChange}
              className="node-input mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-2 py-1.5 font-mono text-xs text-[var(--text-primary)] outline-none"
            />
          </label>

          <div
            className={`rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-2 py-1.5 font-mono text-xs ${
              computed?.error
                ? "text-[var(--status-error)]"
                : "text-[var(--text-primary)]"
            }`}
          >
            {computed?.error
              ? `Error: ${computed.error}`
              : computed?.value !== undefined
                ? formatValue(computed.value)
                : "random(min, max)"}
          </div>
        </div>
      </NodeShell>
    )
  },
)

RandomNode.displayName = "RandomNode"
