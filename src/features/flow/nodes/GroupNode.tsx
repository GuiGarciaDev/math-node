import React, { useCallback, useEffect, useState } from "react"
import { NodeResizer, type NodeProps } from "@xyflow/react"
import type { MathNodeData } from "../../../types"
import { useFlowStore } from "../store/flowStore"

export const GroupNode: React.FC<NodeProps> = React.memo(
  ({ id, data, selected }) => {
    const nodeData = data as unknown as MathNodeData
    const renameNode = useFlowStore((s) => s.renameNode)
    const runGroupNodes = useFlowStore((s) => s.runGroupNodes)
    const isRunning = useFlowStore((s) => s.isRunning)

    const [isEditing, setIsEditing] = useState(false)
    const [draftLabel, setDraftLabel] = useState(nodeData.label)

    useEffect(() => {
      if (!isEditing) {
        setDraftLabel(nodeData.label)
      }
    }, [isEditing, nodeData.label])

    const commitRename = useCallback(() => {
      const nextName = draftLabel.trim()
      if (!nextName) {
        setDraftLabel(nodeData.label)
        setIsEditing(false)
        return
      }

      if (nextName !== nodeData.label) {
        renameNode(id, nextName)
      }

      setIsEditing(false)
    }, [draftLabel, id, nodeData.label, renameNode])

    return (
      <div className="relative h-full w-full overflow-visible">
        <NodeResizer
          isVisible={Boolean(selected)}
          minWidth={220}
          minHeight={140}
          lineClassName="border-accent"
          handleClassName="h-2.5! w-2.5! rounded-sm border border-accent bg-card"
        />

        <div
          className={`pointer-events-auto relative h-full w-full rounded-[14px] bg-[color-mix(in_srgb,var(--bg-secondary)_85%,transparent)] ${
            selected
              ? "shadow-[inset_0_0_0_2px_var(--accent)]"
              : "shadow-[inset_0_0_0_1px_var(--border)]"
          }`}
        >
          {selected && (
            <button
              type="button"
              onClick={() => runGroupNodes(id)}
              disabled={isRunning}
              className={`absolute top-0 -left-12 origin-right z-20 -translate-x-1/2 rounded-md bg-accent px-2 py-2 text-[10px] font-semibold text-accent-foreground shadow-[0_6px_18px_rgba(0,0,0,0.24)] backdrop-blur-sm hover:scale-105 transition-transform disabled:cursor-wait disabled:opacity-60`}
            >
              Run Group
            </button>
          )}

          <div className="absolute z-110 left-2.5 -top-6 max-w-[calc(100%-1.25rem)] text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            {isEditing ? (
              <input
                autoFocus
                value={draftLabel}
                onChange={(event) => setDraftLabel(event.target.value)}
                onBlur={commitRename}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault()
                    commitRename()
                  }
                  if (event.key === "Escape") {
                    event.preventDefault()
                    setDraftLabel(nodeData.label)
                    setIsEditing(false)
                  }
                }}
                className="w-full rounded border border-border bg-input px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-primary)] outline-none"
              />
            ) : (
              <button
                type="button"
                onDoubleClick={(event) => {
                  event.preventDefault()
                  setIsEditing(true)
                }}
                className="max-w-full truncate text-left uppercase z-50"
                title="Double-click to rename group"
              >
                {nodeData.label}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  },
)

GroupNode.displayName = "GroupNode"
