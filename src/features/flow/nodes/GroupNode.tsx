import React from "react"
import type { NodeProps } from "@xyflow/react"
import type { MathNodeData } from "../../../types"

export const GroupNode: React.FC<NodeProps> = React.memo(
  ({ data, selected }) => {
    const nodeData = data as unknown as MathNodeData

    return (
      <div
        className={`pointer-events-auto relative h-full w-full rounded-[14px] bg-[color-mix(in_srgb,var(--bg-secondary)_85%,transparent)] ${
          selected
            ? "border border-[var(--accent)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent)_45%,transparent)]"
            : "border border-[var(--border)]"
        }`}
      >
        <div className="absolute left-2.5 top-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          {nodeData.label}
        </div>
      </div>
    )
  },
)

GroupNode.displayName = "GroupNode"
