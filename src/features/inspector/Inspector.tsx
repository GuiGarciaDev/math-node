import React, { useMemo } from "react"
import { useFlowStore } from "../flow/store/flowStore"

const categoryIconClass: Record<string, string> = {
  input:
    "bg-[color-mix(in_srgb,var(--category-number)_14%,transparent)] border-[color-mix(in_srgb,var(--category-number)_28%,transparent)]",
  arithmetic:
    "bg-[color-mix(in_srgb,var(--category-arithmetic)_14%,transparent)] border-[color-mix(in_srgb,var(--category-arithmetic)_28%,transparent)]",
  trigonometry:
    "bg-[color-mix(in_srgb,var(--category-trigonometry)_14%,transparent)] border-[color-mix(in_srgb,var(--category-trigonometry)_28%,transparent)]",
  logarithmic:
    "bg-[color-mix(in_srgb,var(--category-logarithmic)_14%,transparent)] border-[color-mix(in_srgb,var(--category-logarithmic)_28%,transparent)]",
  logic:
    "bg-[color-mix(in_srgb,var(--category-logic)_14%,transparent)] border-[color-mix(in_srgb,var(--category-logic)_28%,transparent)]",
  calculus:
    "bg-[color-mix(in_srgb,var(--category-expression)_14%,transparent)] border-[color-mix(in_srgb,var(--category-expression)_28%,transparent)]",
  display:
    "bg-[color-mix(in_srgb,var(--category-matrix)_14%,transparent)] border-[color-mix(in_srgb,var(--category-matrix)_28%,transparent)]",
  advanced:
    "bg-[color-mix(in_srgb,var(--category-advanced)_14%,transparent)] border-[color-mix(in_srgb,var(--category-advanced)_28%,transparent)]",
}

const statusClass: Record<string, string> = {
  idle: "text-[var(--text-muted)]",
  success: "text-[var(--status-success)]",
  error: "text-[var(--status-error)]",
  running: "text-[var(--status-warn)]",
}

const statusDotClass: Record<string, string> = {
  idle: "bg-[var(--text-dim)]",
  success: "bg-[var(--status-success)]",
  error: "bg-[var(--status-error)]",
  running: "bg-[var(--status-warn)]",
}

const statusLabel: Record<string, string> = {
  idle: "Idle",
  success: "Success",
  error: "Error",
  running: "Running",
}

const sectionTitleClass =
  "text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--text-dim)]"

const shellClass =
  "h-full w-full shrink-0 border-l border-[var(--border)] bg-[var(--bg-secondary)] shadow-[-10px_0_30px_var(--shadow)] backdrop-blur-xl"

export const Inspector: React.FC = React.memo(() => {
  const selectedNodeId = useFlowStore((s) => s.selectedNodeId)
  const selectedNodeIds = useFlowStore((s) => s.selectedNodeIds)
  const nodes = useFlowStore((s) => s.nodes)
  const computedValues = useFlowStore((s) => s.computedValues)
  const updateNodeParam = useFlowStore((s) => s.updateNodeParam)

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId),
    [nodes, selectedNodeId],
  )

  const computed = useMemo(
    () => (selectedNodeId ? computedValues.get(selectedNodeId) : undefined),
    [computedValues, selectedNodeId],
  )

  const formatValue = (val: unknown): string => {
    if (val === undefined || val === null) return "—"
    if (typeof val === "number") return val.toFixed(4)
    if (typeof val === "string") return val
    if (typeof val === "object" && "raw" in (val as Record<string, unknown>))
      return (val as { raw: string }).raw
    if (Array.isArray(val)) return `[${val.length} items]`
    return JSON.stringify(val)
  }

  if (selectedNodeIds.length > 1) {
    return (
      <aside className={shellClass}>
        <div className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-tertiary)_68%,transparent)] px-3 py-3">
          <span className="text-xs font-semibold text-[var(--text-primary)]">
            Properties
          </span>
        </div>
        <div className="flex h-[calc(100%-44px)] items-center justify-center p-6">
          <div className="text-center">
            <div className="text-sm text-[var(--text-primary)]">
              {selectedNodeIds.length} nodes selected
            </div>
            <div className="mt-2 text-[11px] leading-relaxed text-[var(--text-muted)]">
              Use context menu or shortcuts for bulk actions:
              <br />
              Delete, Copy, Duplicate, Group.
            </div>
          </div>
        </div>
      </aside>
    )
  }

  if (!selectedNode) {
    return (
      <aside className={shellClass}>
        <div className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-tertiary)_68%,transparent)] px-3 py-3">
          <span className="text-xs font-semibold text-[var(--text-primary)]">
            Properties
          </span>
        </div>
        <div className="flex h-[calc(100%-44px)] items-center justify-center p-6">
          <p className="text-center text-xs text-[var(--text-dim)]">
            Select a node to view its properties
          </p>
        </div>
      </aside>
    )
  }

  const { data } = selectedNode

  return (
    <aside className={shellClass}>
      <div className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-tertiary)_68%,transparent)] px-3 py-3">
        <span className="text-xs font-semibold text-[var(--text-primary)]">
          Properties
        </span>
      </div>

      <div className="flex h-[calc(100%-44px)] flex-col gap-5 overflow-y-auto p-4">
        <div>
          <div className="mb-1 flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-md border text-base ${
                categoryIconClass[data.category] ?? categoryIconClass.input
              }`}
            >
              {data.category === "calculus"
                ? "∂"
                : data.category === "display"
                  ? "📊"
                  : data.category === "trigonometry"
                    ? "∿"
                    : data.category === "logarithmic"
                      ? "log"
                      : data.category === "logic"
                        ? "⊨"
                        : "🔢"}
            </div>
            <div>
              <h2 className="text-sm font-medium text-[var(--text-primary)]">
                {data.label}
              </h2>
              <p className="font-mono text-[10px] text-[var(--text-dim)]">
                ID: {selectedNode.id}
              </p>
            </div>
          </div>
        </div>

        <div className="h-px bg-[var(--border)]" />

        {Object.keys(data.params).length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className={sectionTitleClass}>Parameters</h3>
            {Object.entries(data.params).map(([key, value]) => {
              if (
                typeof value === "object" &&
                value !== null &&
                !Array.isArray(value)
              )
                return null
              if (Array.isArray(value) && Array.isArray(value[0])) return null

              return (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-[11px] capitalize text-[var(--text-secondary)]">
                    {key}
                  </label>
                  <input
                    type="text"
                    value={
                      Array.isArray(value)
                        ? value.join(", ")
                        : String(value ?? "")
                    }
                    onChange={(e) => {
                      const raw = e.target.value
                      if (
                        (selectedNode.type === "numberInput" ||
                          selectedNode.type === "constant") &&
                        key === "value"
                      ) {
                        updateNodeParam(selectedNode.id, key, raw)
                        return
                      }
                      const asNum = Number(raw)
                      updateNodeParam(
                        selectedNode.id,
                        key,
                        isNaN(asNum) ? raw : asNum,
                      )
                    }}
                    className="node-input w-full rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-2 py-1.5 font-mono text-xs text-[var(--text-primary)] outline-none"
                  />
                </div>
              )
            })}
          </div>
        )}

        <div className="h-px bg-[var(--border)]" />

        <div className="flex flex-col gap-2">
          <h3 className={sectionTitleClass}>Ports</h3>

          {data.inputs.length > 0 && (
            <div>
              <span className="text-[10px] text-[var(--text-dim)]">Inputs</span>
              {data.inputs.map((port) => (
                <div
                  key={port.name}
                  className="flex items-center justify-between py-1 text-[11px]"
                >
                  <span className="text-[var(--text-secondary)]">
                    {port.label}
                  </span>
                  <span className="rounded bg-[var(--bg-tertiary)] px-1.5 py-[1px] font-mono text-[10px] text-[var(--text-dim)]">
                    {port.type}
                  </span>
                </div>
              ))}
            </div>
          )}

          {data.outputs.length > 0 && (
            <div>
              <span className="text-[10px] text-[var(--text-dim)]">
                Outputs
              </span>
              {data.outputs.map((port) => (
                <div
                  key={port.name}
                  className="flex items-center justify-between py-1 text-[11px]"
                >
                  <span className="text-[var(--text-secondary)]">
                    {port.label}
                  </span>
                  <span className="rounded bg-[var(--bg-tertiary)] px-1.5 py-[1px] font-mono text-[10px] text-[var(--text-dim)]">
                    {port.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="h-px bg-[var(--border)]" />

        <div className="flex flex-col gap-2">
          <h3 className={sectionTitleClass}>Execution</h3>

          <div className="flex flex-col gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-input)] p-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[var(--text-dim)]">Status</span>
              <span
                className={`flex items-center gap-1 ${statusClass[data.status] ?? statusClass.idle}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${statusDotClass[data.status] ?? statusDotClass.idle}`}
                />
                {statusLabel[data.status] ?? "Idle"}
              </span>
            </div>

            {computed && (
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[var(--text-dim)]">Value</span>
                <span
                  className={`max-w-[150px] truncate whitespace-nowrap font-mono text-[11px] ${
                    computed.error
                      ? "text-[var(--status-error)]"
                      : "text-[var(--text-primary)]"
                  }`}
                >
                  {computed.error ?? formatValue(computed.value)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
})

Inspector.displayName = "Inspector"
