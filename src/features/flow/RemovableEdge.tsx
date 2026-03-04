import React, { useMemo, useState } from "react"
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react"
import { useFlowStore } from "./flowStore.ts"
import { getHandleTypeConfig } from "./nodes/handleTypeConfig"

const STROKE_WIDTH = 2

export const RemovableEdge: React.FC<EdgeProps> = React.memo(
  ({
    id,
    source,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    selected,
  }) => {
    const removeEdge = useFlowStore((s) => s.removeEdge)
    const nodes = useFlowStore((s) => s.nodes)
    const edges = useFlowStore((s) => s.edges)
    const [isHovered, setIsHovered] = useState(false)
    const maskId = useMemo(
      () => `edge-cutout-${id.replace(/[^a-zA-Z0-9_-]/g, "_")}`,
      [id],
    )

    const [edgePath, labelX, labelY] = useMemo(
      () =>
        getBezierPath({
          sourceX,
          sourceY,
          sourcePosition,
          targetX,
          targetY,
          targetPosition,
        }),
      [sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition],
    )

    const edgeColor = useMemo(() => {
      const sourceNode = nodes.find((node) => node.id === source)
      if (!sourceNode) return "var(--accent)"

      const sourceHandle = edges.find((edge) => edge.id === id)?.sourceHandle

      const outputPort = sourceHandle
        ? sourceNode.data.outputs.find((port) => port.name === sourceHandle)
        : sourceNode.data.outputs[0]
      if (!outputPort) return "var(--accent)"

      return getHandleTypeConfig(outputPort.type).color
    }, [edges, id, nodes, source])

    const stroke = edgeColor
    const isButtonVisible = isHovered || selected
    const cutoutRadius = isButtonVisible ? 11 : 0

    return (
      <>
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse">
            <rect
              x="-10000"
              y="-10000"
              width="20000"
              height="20000"
              fill="white"
            />
            <circle cx={labelX} cy={labelY} r={cutoutRadius} fill="black" />
          </mask>
        </defs>

        <BaseEdge
          id={id}
          path={edgePath}
          style={{
            stroke,
            strokeWidth: selected ? 2.8 : 2.2,
            mask: `url(#${maskId})`,
          }}
        />

        <path
          d={edgePath}
          fill="none"
          stroke={stroke}
          strokeWidth={STROKE_WIDTH}
          data-edgeid={id}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ cursor: "pointer", pointerEvents: "stroke" }}
        />

        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
              opacity: isButtonVisible ? 1 : 0,
              transition: "opacity 0.14s ease",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <button
              title="Remove connection"
              onClick={(event) => {
                event.stopPropagation()
                removeEdge(id)
              }}
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                border: `1px solid ${edgeColor}`,
                background: "var(--bg-secondary)",
                color: edgeColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
                lineHeight: 1,
                boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.2)",
              }}
            >
              ✕
            </button>
          </div>
        </EdgeLabelRenderer>
      </>
    )
  },
)

RemovableEdge.displayName = "RemovableEdge"
