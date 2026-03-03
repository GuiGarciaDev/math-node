import React, { useMemo, useState } from "react"
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react"
import { useFlowStore } from "./flowStore"

export const RemovableEdge: React.FC<EdgeProps> = React.memo(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    selected,
  }) => {
    const removeEdge = useFlowStore((s) => s.removeEdge)
    const [isHovered, setIsHovered] = useState(false)

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

    const stroke = selected
      ? "var(--accent)"
      : "color-mix(in srgb, var(--accent) 58%, transparent)"

    return (
      <>
        <BaseEdge id={id} path={edgePath} style={{ stroke, strokeWidth: 2 }} />

        <path
          d={edgePath}
          fill="none"
          stroke="transparent"
          strokeWidth={24}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ cursor: "pointer" }}
        />

        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
              opacity: isHovered ? 1 : 0,
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
                border: "1px solid var(--accent)",
                background: "transparent",
                color: "var(--accent)",
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
