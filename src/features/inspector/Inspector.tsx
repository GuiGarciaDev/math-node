import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useFlowStore } from "../flow/store/flowStore"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { categories } from "@/features/content/sidebar-config"
import { cn } from "@/lib/utils"
import { getSidebarToneClasses } from "@/lib/theme"

const nodeItems = categories.flatMap((category) =>
  category.items.map((item) => ({
    type: item.type,
    label: item.label,
    icon: item.icon,
    tone: item.iconColor,
  })),
)

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
  "text-[10px] font-semibold uppercase tracking-[0.14em] text-(--text-dim)"

const INSPECTOR_MIN_WIDTH = 260
const INSPECTOR_MAX_WIDTH = 320

function clampInspectorWidth(width: number): number {
  return Math.min(INSPECTOR_MAX_WIDTH, Math.max(INSPECTOR_MIN_WIDTH, width))
}

function parseInspectorInput(raw: string, currentValue: unknown): unknown {
  if (typeof currentValue === "number") {
    const parsed = Number(raw)
    return Number.isFinite(parsed) ? parsed : currentValue
  }

  if (typeof currentValue === "boolean") {
    const normalized = raw.trim().toLowerCase()
    if (["true", "1", "yes", "on"].includes(normalized)) return true
    if (["false", "0", "no", "off"].includes(normalized)) return false
    return currentValue
  }

  return raw
}

export const Inspector: React.FC = React.memo(() => {
  const selectedNodeId = useFlowStore((s) => s.selectedNodeId)
  const selectedNodeIds = useFlowStore((s) => s.selectedNodeIds)
  const nodes = useFlowStore((s) => s.nodes)
  const computedValues = useFlowStore((s) => s.computedValues)
  const updateNodeParam = useFlowStore((s) => s.updateNodeParam)
  const inspectorOpen = useFlowStore((s) => s.inspectorOpen)
  const setInspectorOpen = useFlowStore((s) => s.setInspectorOpen)
  const [inspectorWidth, setInspectorWidth] = useState(288)
  const [isResizing, setIsResizing] = useState(false)
  const resizeRef = useRef<{ startX: number; startWidth: number } | null>(null)

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId),
    [nodes, selectedNodeId],
  )

  const computed = useMemo(
    () => (selectedNodeId ? computedValues.get(selectedNodeId) : undefined),
    [computedValues, selectedNodeId],
  )

  const selectedNodeMeta = useMemo(() => {
    if (!selectedNode) return null

    return (
      nodeItems.find(
        (item) =>
          item.type === selectedNode.type &&
          item.label.toLowerCase() === selectedNode.data.label.toLowerCase(),
      ) ?? nodeItems.find((item) => item.type === selectedNode.type)
    )
  }, [selectedNode])

  const onResizeStart = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault()
      resizeRef.current = {
        startX: event.clientX,
        startWidth: inspectorWidth,
      }
      setIsResizing(true)
    },
    [inspectorWidth],
  )

  useEffect(() => {
    if (!isResizing) return

    const onMouseMove = (event: MouseEvent) => {
      const resizeState = resizeRef.current
      if (!resizeState) return

      const delta = resizeState.startX - event.clientX
      setInspectorWidth(clampInspectorWidth(resizeState.startWidth + delta))
    }

    const onMouseUp = () => {
      setIsResizing(false)
      resizeRef.current = null
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [isResizing])

  useEffect(() => {
    if (!isResizing) return

    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"

    return () => {
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isResizing])

  const formatValue = (val: unknown): string => {
    if (val === undefined || val === null) return "—"
    if (typeof val === "number") return val.toFixed(4)
    if (typeof val === "string") return val
    if (typeof val === "object" && "raw" in (val as Record<string, unknown>))
      return (val as { raw: string }).raw
    if (Array.isArray(val)) return `[${val.length} items]`
    return JSON.stringify(val)
  }

  const dynamicContent = () => {
    const selectedTone = selectedNodeMeta?.tone ?? "input"
    const toneClasses = getSidebarToneClasses(selectedTone)

    if (selectedNodeIds.length > 1) {
      return (
        <div className="space-y-3 rounded-xl bg-(--bg-secondary) p-4 text-center">
          <div className="text-sm font-medium text-(--text-primary)">
            {selectedNodeIds.length} Nodes Selected
          </div>
          <div className="text-[11px] leading-relaxed text-(--text-muted)">
            Use context menu or shortcuts for bulk actions:
            <br />
            Delete, Copy, Duplicate, Group.
          </div>
        </div>
      )
    }

    if (!selectedNode) {
      return (
        <div className="space-y-3 rounded-xl bg-(--bg-secondary) p-5 text-center">
          <p className="text-sm font-medium text-(--text-primary)">
            Nothing selected
          </p>
          <p className="text-xs text-(--text-muted)">
            Select a node on the canvas to inspect parameters, ports, and
            execution results.
          </p>
        </div>
      )
    }

    const { data } = selectedNode
    const NodeIcon = selectedNodeMeta?.icon
    const categoryName = selectedNodeMeta?.tone
      ? `${selectedNodeMeta.tone[0].toUpperCase()}${selectedNodeMeta.tone.slice(1)}`
      : data.category

    return (
      <div className="flex h-full flex-col gap-3 p-2">
        <div className="rounded-xl bg-(--bg-secondary) p-2.5">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl ring-1",
                toneClasses.soft,
                toneClasses.text,
                toneClasses.ring,
              )}
            >
              {NodeIcon ? <NodeIcon className="text-base" /> : "#"}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-(--text-primary)">
                {data.label}
              </h2>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-(--text-dim)">
                ID: {selectedNode.id}
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className={cn("h-2 w-2 rounded-full", toneClasses.bg)} />
            <span className="text-[10px] uppercase tracking-[0.12em] text-(--text-muted)">
              {categoryName}
            </span>
          </div>
        </div>

        {Object.keys(data.params).length > 0 && (
          <div className="rounded-xl bg-(--bg-secondary) p-2.5">
            <h3 className={sectionTitleClass}>Parameters</h3>
            <div className="mt-2 space-y-2.5">
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
                    <label className="text-[11px] capitalize text-(--text-secondary)">
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
                        updateNodeParam(
                          selectedNode.id,
                          key,
                          parseInspectorInput(raw, value),
                        )
                      }}
                      className="node-input w-full rounded-md border border-border bg-input px-2 py-1.5 font-mono text-xs text-(--text-primary) outline-none focus:border-border"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="rounded-xl bg-(--bg-secondary) p-2.5">
          <h3 className={sectionTitleClass}>Ports</h3>

          <div className="mt-2 space-y-2.5">
            {data.inputs.length > 0 && (
              <div>
                <span className="text-[10px] uppercase tracking-[0.12em] text-(--text-dim)">
                  Inputs
                </span>
                {data.inputs.map((port) => (
                  <div
                    key={port.name}
                    className="flex items-center justify-between py-1 text-[11px]"
                  >
                    <span className="text-(--text-secondary)">
                      {port.label}
                    </span>
                    <span className="rounded bg-(--bg-tertiary) px-1.5 py-px font-mono text-[10px] text-(--text-dim)">
                      {port.type}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {data.outputs.length > 0 && (
              <div>
                <span className="text-[10px] uppercase tracking-[0.12em] text-(--text-dim)">
                  Outputs
                </span>
                {data.outputs.map((port) => (
                  <div
                    key={port.name}
                    className="flex items-center justify-between py-1 text-[11px]"
                  >
                    <span className="text-(--text-secondary)">
                      {port.label}
                    </span>
                    <span className="rounded bg-(--bg-tertiary) px-1.5 py-px font-mono text-[10px] text-(--text-dim)">
                      {port.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-(--bg-secondary) p-2.5">
          <h3 className={sectionTitleClass}>Execution</h3>

          <div className="mt-2 flex flex-col gap-2 rounded-xl bg-(--bg-input) p-2.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-(--text-dim)">Status</span>
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
                <span className="text-(--text-dim)">Value</span>
                <span
                  className={`max-w-40 truncate whitespace-nowrap font-mono text-[11px] ${
                    computed.error
                      ? "text-(--status-error)"
                      : "text-(--text-primary)"
                  }`}
                >
                  {computed.error ?? formatValue(computed.value)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider
      className="contents"
      style={
        { "--sidebar-width": `${inspectorWidth}px` } as React.CSSProperties
      }
      open={inspectorOpen}
      onOpenChange={setInspectorOpen}
    >
      <Sidebar side="right">
        <div className="relative h-full">
          <div
            className="absolute left-0 top-0 z-30 h-full w-2 -translate-x-1/2 cursor-col-resize"
            onMouseDown={onResizeStart}
            aria-label="Resize inspector"
            title="Drag to resize inspector"
          />
          <SidebarHeader className="bg-sidebar px-4 py-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sidebar-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-sidebar-foreground">
                Inspector
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent className="min-h-0 overflow-y-auto bg-sidebar px-2 pb-2">
            {dynamicContent()}
          </SidebarContent>
        </div>
      </Sidebar>
    </SidebarProvider>
  )
})

Inspector.displayName = "Inspector"
