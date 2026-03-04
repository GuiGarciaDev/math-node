import React, { useMemo, useCallback } from "react"
import type { NodeProps } from "@xyflow/react"
import type { MathNodeData } from "../../../types"
import { NodeShell } from "./NodeShell"
import { useFlowStore } from "../flowStore"
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
            style={{
              width: 20,
              height: 20,
              borderRadius: 6,
              border: "1px solid var(--border)",
              background: "var(--bg-input)",
              color: "var(--text-secondary)",
              cursor: "pointer",
              fontSize: 12,
              lineHeight: 1,
            }}
          >
            ⤢
          </button>
        }
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            width: "100%",
          }}
        >
          <PlotChart points={points} height={120} />

          {/* Controls */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
              Domain: [{domain[0].toFixed(0)}, {domain[1].toFixed(0)}]
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                onClick={handleZoomOut}
                style={{
                  width: 20,
                  height: 20,
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                }}
              >
                −
              </button>
              <button
                onClick={handleZoomIn}
                style={{
                  width: 20,
                  height: 20,
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                }}
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
