import React, { useMemo, useCallback } from "react"
import type { NodeProps } from "@xyflow/react"
import type { MathNodeData } from "../../../types"
import { NodeShell } from "./NodeShell"
import { useFlowStore } from "../store/flowStore"
import { PlotChart } from "./PlotChart"

export const PlotNode: React.FC<NodeProps> = React.memo(
  ({ id, data, selected }) => {
    const nodeData = data as unknown as MathNodeData
    const computed = useFlowStore((s) => s.computedValues.get(id))
    const updateNodeParam = useFlowStore((s) => s.updateNodeParam)
    const openGraphModal = useFlowStore((s) => s.openGraphModal)

    const domain = (nodeData.params.domain as [number, number]) ?? [-10, 10]

    const points = useMemo(() => {
      if (!computed?.value) return []
      if (Array.isArray(computed.value)) {
        return computed.value as Array<{ x: number; y: number }>
      }
      if (
        typeof computed.value === "object" &&
        computed.value !== null &&
        "points" in (computed.value as Record<string, unknown>) &&
        Array.isArray((computed.value as { points: unknown[] }).points)
      ) {
        return (computed.value as { points: Array<{ x: number; y: number }> })
          .points
      }
      return []
    }, [computed])

    const handleZoomIn = useCallback(() => {
      const range = domain[1] - domain[0]
      const mid = (domain[0] + domain[1]) / 2
      const newHalf = range * 0.4
      updateNodeParam(id, "domain", [mid - newHalf, mid + newHalf])
    }, [id, domain, updateNodeParam])

    const handleZoomOut = useCallback(() => {
      const range = domain[1] - domain[0]
      const mid = (domain[0] + domain[1]) / 2
      const newHalf = range * 0.6
      updateNodeParam(id, "domain", [mid - newHalf, mid + newHalf])
    }, [id, domain, updateNodeParam])

    const handleExpand = useCallback(() => {
      openGraphModal({
        title: `${nodeData.label} • ${id}`,
        points,
        domain,
      })
    }, [domain, id, nodeData.label, openGraphModal, points])

    return (
      <NodeShell
        data={nodeData}
        selected={selected}
        width={280}
        headerActions={
          <button
            onClick={handleExpand}
            title="Expand graph"
            className="flex h-5 w-5 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-input)] text-xs leading-none text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text-primary)]"
          >
            ⤢
          </button>
        }
      >
        <div className="flex w-full flex-col gap-2">
          <PlotChart points={points} heightClassName="h-[120px]" />

          {/* Controls */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[var(--text-muted)]">
              Domain: [{domain[0].toFixed(0)}, {domain[1].toFixed(0)}]
            </span>
            <div className="flex gap-1">
              <button
                onClick={handleZoomOut}
                className="flex h-5 w-5 items-center justify-center rounded border border-[var(--border)] bg-[var(--bg-tertiary)] text-xs text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text-primary)]"
              >
                −
              </button>
              <button
                onClick={handleZoomIn}
                className="flex h-5 w-5 items-center justify-center rounded border border-[var(--border)] bg-[var(--bg-tertiary)] text-xs text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text-primary)]"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </NodeShell>
    )
  },
)

PlotNode.displayName = "PlotNode"
