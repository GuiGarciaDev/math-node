import React, { useMemo, useState } from "react"
import { getBezierPath, type EdgeProps } from "@xyflow/react"
import { useFlowStore } from "./store/flowStore.ts"
import { getHandleTypeConfig } from "./handleTypeConfig.ts"

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

        <path
          d={edgePath}
          fill="none"
          stroke={stroke}
          strokeWidth={selected ? 2.8 : 2.2}
          mask={`url(#${maskId})`}
        />

        <path
          d={edgePath}
          fill="none"
          stroke={stroke}
          strokeWidth={STROKE_WIDTH}
          data-edgeid={id}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="cursor-pointer [pointer-events:stroke]"
        />

        <g
          transform={`translate(${labelX} ${labelY})`}
          opacity={isButtonVisible ? 1 : 0}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={(event) => {
            event.stopPropagation()
            removeEdge(id)
          }}
          className="cursor-pointer"
        >
          <circle
            cx={0}
            cy={0}
            r={11}
            fill="var(--bg-secondary)"
            stroke={edgeColor}
            strokeWidth={1}
          />
          <text
            x={0}
            y={0}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={11}
            fontWeight={600}
            fill={edgeColor}
          >
            ✕
          </text>
        </g>
      </>
    )
  },
)

RemovableEdge.displayName = "RemovableEdge"
