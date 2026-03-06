import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  type Node as FlowNode,
  type ReactFlowInstance,
  Panel,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { nodeTypes } from "./nodeTypes"
import { useFlowStore } from "./store/flowStore"
import type {
  ContextMenuState,
  MathEdge,
  MathNode,
  MathNodeType,
} from "../../types"
import { RemovableEdge } from "./RemovableEdge"
import { ContextMenu } from "./ContextMenu"
import { InteractionToolbar } from "./InteractionToolbar"
import { MdUndo, MdRedo } from "react-icons/md"
import { LuChevronDown } from "react-icons/lu"
import { VscRunAll } from "react-icons/vsc"
import { FaSpinner } from "react-icons/fa"

const edgeTypes = {
  removable: RemovableEdge,
}

const minimapNodeColor = (node: FlowNode) => {
  const category = node.data?.category
  switch (category) {
    case "input":
      return "var(--category-input)"
    case "arithmetic":
      return "var(--category-arithmetic)"
    case "trigonometry":
      return "var(--category-trigonometry)"
    case "logarithmic":
      return "var(--category-logarithmic)"
    case "logic":
      return "var(--category-logic)"
    case "calculus":
      return "var(--category-calculus)"
    case "display":
      return "var(--category-display)"
    case "advanced":
      return "var(--category-advanced)"
    default:
      return "var(--text-muted)"
  }
}

const edgeOptions = {
  style: { stroke: "var(--accent)", strokeWidth: 2 },
  type: "removable",
}

const connectionLineStyle = {
  stroke: "var(--accent)",
  strokeWidth: 2,
  strokeDasharray: "5 5",
}

function normalizeDomEdgeId(rawId: string): string {
  return rawId.startsWith("xy-edge__") ? rawId.slice(9) : rawId
}

function isPaneEventTarget(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null
  if (!element) return false
  return Boolean(element.closest(".react-flow__pane"))
}

function collectEdgeIdsAlongCutLine(
  cutLine: { x1: number; y1: number; x2: number; y2: number },
  bounds: DOMRect,
): string[] {
  const ids = new Set<string>()
  const dx = cutLine.x2 - cutLine.x1
  const dy = cutLine.y2 - cutLine.y1
  const length = Math.hypot(dx, dy)
  const steps = Math.max(8, Math.ceil(length / 6))

  const offsets = [
    { x: 0, y: 0 },
    { x: 3, y: 0 },
    { x: -3, y: 0 },
    { x: 0, y: 3 },
    { x: 0, y: -3 },
  ]

  for (let index = 0; index <= steps; index += 1) {
    const t = index / steps
    const sampleX = bounds.left + cutLine.x1 + dx * t
    const sampleY = bounds.top + cutLine.y1 + dy * t

    for (const offset of offsets) {
      const hitElements = document.elementsFromPoint(
        sampleX + offset.x,
        sampleY + offset.y,
      )

      for (const element of hitElements) {
        const directEdgeId = (element as HTMLElement).dataset.edgeid
        if (directEdgeId) {
          ids.add(directEdgeId)
          continue
        }

        const edgeElement = (element as HTMLElement).closest(
          ".react-flow__edge",
        ) as HTMLElement | null
        const rawEdgeId = edgeElement?.dataset.id
        if (rawEdgeId) {
          ids.add(normalizeDomEdgeId(rawEdgeId))
        }
      }
    }
  }

  return Array.from(ids)
}

export const FlowCanvas: React.FC = React.memo(() => {
  const nodes = useFlowStore((s) => s.nodes)
  const edges = useFlowStore((s) => s.edges)
  const onNodesChange = useFlowStore((s) => s.onNodesChange)
  const onEdgesChange = useFlowStore((s) => s.onEdgesChange)
  const onConnect = useFlowStore((s) => s.onConnect)
  const setSelectedNodeIds = useFlowStore((s) => s.setSelectedNodeIds)
  const clearSelection = useFlowStore((s) => s.clearSelection)
  const selectedNodeIds = useFlowStore((s) => s.selectedNodeIds)
  const interactionMode = useFlowStore((s) => s.interactionMode)
  const dispatchContextAction = useFlowStore((s) => s.dispatchContextAction)
  const removeEdgesByIds = useFlowStore((s) => s.removeEdgesByIds)
  const addNode = useFlowStore((s) => s.addNode)
  const undo = useFlowStore((s) => s.undo)
  const redo = useFlowStore((s) => s.redo)
  const canUndo = useFlowStore((s) => s.historyPast.length > 0)
  const canRedo = useFlowStore((s) => s.historyFuture.length > 0)
  const runPipeline = useFlowStore((s) => s.runPipeline)
  const executionMode = useFlowStore((s) => s.executionMode)
  const setExecutionMode = useFlowStore((s) => s.setExecutionMode)
  const isRunning = useFlowStore((s) => s.isRunning)
  const theme = useFlowStore((s) => s.theme)
  const toggleTheme = useFlowStore((s) => s.toggleTheme)

  const reactFlowInstance = useRef<ReactFlowInstance<
    MathNode,
    MathEdge
  > | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const runMenuRef = useRef<HTMLDivElement | null>(null)
  const [cutStart, setCutStart] = useState<{ x: number; y: number } | null>(
    null,
  )
  const [cutCurrent, setCutCurrent] = useState<{ x: number; y: number } | null>(
    null,
  )
  const [isNodeDragActive, setIsNodeDragActive] = useState(false)
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    target: "canvas",
  })
  const [runMenuOpen, setRunMenuOpen] = useState(false)

  useEffect(() => {
    if (!runMenuOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!runMenuRef.current?.contains(event.target as globalThis.Node)) {
        setRunMenuOpen(false)
      }
    }

    window.addEventListener("pointerdown", handlePointerDown)
    return () => window.removeEventListener("pointerdown", handlePointerDown)
  }, [runMenuOpen])

  const openContextMenu = useCallback(
    (payload: Omit<ContextMenuState, "visible">) => {
      setContextMenu({ ...payload, visible: true })
    },
    [],
  )

  const closeContextMenu = useCallback(() => {
    setContextMenu((prev) =>
      prev.visible ? { visible: false, x: 0, y: 0, target: "canvas" } : prev,
    )
  }, [])

  const onInit = useCallback(
    (instance: ReactFlowInstance<MathNode, MathEdge>) => {
      reactFlowInstance.current = instance
    },
    [],
  )

  const onNodeClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.button !== 0) return
      if (interactionMode === "cut") return

      closeContextMenu()
    },
    [closeContextMenu, interactionMode],
  )

  const onPaneClick = useCallback(() => {
    clearSelection()
    closeContextMenu()
  }, [clearSelection, closeContextMenu])

  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: FlowNode[] }) => {
      setSelectedNodeIds(selectedNodes.map((node) => node.id))
    },
    [setSelectedNodeIds],
  )

  const onSelectionContextMenu = useCallback(
    (event: React.MouseEvent, selectionNodes: FlowNode[]) => {
      event.preventDefault()

      const selectedIds = selectionNodes.map((node) => node.id)
      if (selectedIds.length === 0) {
        closeContextMenu()
        return
      }

      openContextMenu({
        x: event.clientX,
        y: event.clientY,
        target: selectedIds.length > 1 ? "multi" : "node",
        nodeId: selectedIds.length === 1 ? selectedIds[0] : undefined,
      })
    },
    [closeContextMenu, openContextMenu],
  )

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: FlowNode) => {
      event.preventDefault()

      const hasMultiSelection =
        selectedNodeIds.length > 1 && selectedNodeIds.includes(node.id)

      if (!selectedNodeIds.includes(node.id)) {
        setSelectedNodeIds([node.id])
      }

      openContextMenu({
        x: event.clientX,
        y: event.clientY,
        target:
          node.type === "group"
            ? "group"
            : hasMultiSelection
              ? "multi"
              : "node",
        nodeId: node.id,
      })
    },
    [openContextMenu, selectedNodeIds, setSelectedNodeIds],
  )

  const onPaneContextMenu = useCallback(
    (event: React.MouseEvent | MouseEvent) => {
      event.preventDefault()
      const selectedIds = selectedNodeIds

      if (selectedIds.length > 0) {
        openContextMenu({
          x: event.clientX,
          y: event.clientY,
          target: selectedIds.length > 1 ? "multi" : "node",
          nodeId: selectedIds.length === 1 ? selectedIds[0] : undefined,
        })
        return
      }
      closeContextMenu()
    },
    [closeContextMenu, openContextMenu, selectedNodeIds],
  )

  const cutLine = useMemo(() => {
    if (!cutStart || !cutCurrent) return null
    return {
      x1: cutStart.x,
      y1: cutStart.y,
      x2: cutCurrent.x,
      y2: cutCurrent.y,
    }
  }, [cutCurrent, cutStart])

  const onPaneMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (!isPaneEventTarget(event.target)) return
      if (interactionMode !== "cut") return
      if (event.button !== 0) return
      event.preventDefault()
      const bounds = containerRef.current?.getBoundingClientRect()
      if (!bounds) return
      closeContextMenu()
      setCutStart({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      })
      setCutCurrent({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      })
    },
    [closeContextMenu, interactionMode],
  )

  const onPaneMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!isPaneEventTarget(event.target)) return
      if (interactionMode !== "cut" || !cutStart) return
      event.preventDefault()
      const bounds = containerRef.current?.getBoundingClientRect()
      if (!bounds) return
      setCutCurrent({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      })
    },
    [cutStart, interactionMode],
  )

  const onPaneMouseUp = useCallback(
    (event: React.MouseEvent) => {
      if (!isPaneEventTarget(event.target)) return
      if (interactionMode === "cut") {
        event.preventDefault()
      }

      if (interactionMode !== "cut" || !cutLine) {
        setCutStart(null)
        setCutCurrent(null)
        return
      }

      const bounds = containerRef.current?.getBoundingClientRect()
      if (!bounds) {
        setCutStart(null)
        setCutCurrent(null)
        return
      }

      const cutLength = Math.hypot(
        cutLine.x2 - cutLine.x1,
        cutLine.y2 - cutLine.y1,
      )
      if (cutLength < 4) {
        setCutStart(null)
        setCutCurrent(null)
        return
      }

      const edgeIdsToRemove = collectEdgeIdsAlongCutLine(cutLine, bounds)

      if (edgeIdsToRemove.length > 0) {
        removeEdgesByIds(edgeIdsToRemove)
      }

      setCutStart(null)
      setCutCurrent(null)
    },
    [cutLine, interactionMode, removeEdgesByIds],
  )

  // Drag and drop from sidebar
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const type = e.dataTransfer.getData(
        "application/mathflow-node",
      ) as MathNodeType
      if (!type || !reactFlowInstance.current) return

      const position = reactFlowInstance.current.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      })

      addNode(type, position)
    },
    [addNode],
  )

  const onNodeDragStart = useCallback(() => {
    setIsNodeDragActive(true)
  }, [])

  const onNodeDragStop = useCallback(() => {
    setIsNodeDragActive(false)
  }, [])

  const toggleAutoRun = useCallback(() => {
    setExecutionMode(executionMode === "auto" ? "manual" : "auto")
  }, [executionMode, setExecutionMode])

  const isDark = theme === "dark"

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full ${interactionMode === "cut" ? "cursor-crosshair" : "cursor-default"}`}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onSelectionChange={onSelectionChange}
        onSelectionContextMenu={onSelectionContextMenu}
        onConnect={onConnect}
        onInit={onInit}
        onNodeClick={onNodeClick}
        onNodeDragStart={onNodeDragStart}
        onNodeDragStop={onNodeDragStop}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onPaneClick}
        onPaneContextMenu={onPaneContextMenu}
        onMouseDown={onPaneMouseDown}
        onMouseMove={onPaneMouseMove}
        onMouseUp={onPaneMouseUp}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={edgeOptions}
        connectionLineStyle={connectionLineStyle}
        panOnDrag={interactionMode === "pan"}
        nodesDraggable={interactionMode === "select"}
        elementsSelectable={interactionMode === "select"}
        selectionOnDrag={interactionMode === "select"}
        nodesConnectable={interactionMode !== "cut"}
        multiSelectionKeyCode="Shift"
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={null}
        onlyRenderVisibleElements
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="var(--border)"
        />
        <Panel position="top-center" className="w-full pl-5 pr-8">
          <div className="flex justify-between">
            <div>Workflow2</div>
            <div className="pointer-events-nonez-40 flex justify-between gap-6">
              <div ref={runMenuRef} className="pointer-events-auto relative">
                <div className="flex h-10 items-center gap-2 rounded-xl border border-(--border) bg-[color-mix(in_srgb,var(--bg-secondary)_92%,transparent)] text-sm font-medium text-(--text-primary) shadow-[0_10px_24px_rgba(0,0,0,0.28)] backdrop-blur-md transition-all duration-150 hover:border-[var(--border-hover)] hover:bg-[var(--bg-tertiary)]">
                  <button
                    type="button"
                    className="flex h-10 items-center pl-4 pr-2"
                  >
                    <span className="text-base text-(--accent)">
                      <VscRunAll />
                    </span>
                    {isRunning && <FaSpinner />}
                  </button>
                  <button
                    className="flex items-center h-10 pr-2 pl-1"
                    onClick={() => setRunMenuOpen((open) => !open)}
                  >
                    <LuChevronDown
                      className={`text-(--text-muted) transition-transform duration-150 ${
                        runMenuOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>
                </div>

                {runMenuOpen && (
                  <div className="absolute right-0 top-[calc(100%+0.5rem)] w-56 rounded-2xl border border-(--border) bg-[color-mix(in_srgb,var(--bg-secondary)_96%,transparent)] p-2 shadow-[0_18px_40px_rgba(0,0,0,0.32)] backdrop-blur-xl">
                    <button
                      type="button"
                      onClick={() => {
                        runPipeline()
                        setRunMenuOpen(false)
                      }}
                      disabled={isRunning}
                      className="flex w-full items-center justify-between rounded-xl border border-[color-mix(in_srgb,var(--accent)_28%,transparent)] bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] px-3 py-2 text-left text-sm font-medium text-[var(--accent)] transition-all duration-150 hover:bg-[var(--accent)] hover:text-[var(--text-primary)] disabled:cursor-wait disabled:opacity-70"
                    >
                      <span>Run workflow</span>
                      <span>
                        <VscRunAll />
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={toggleAutoRun}
                      className={`mt-2 flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm font-medium transition-all duration-150 ${
                        executionMode === "auto"
                          ? "border-[color-mix(in_srgb,var(--status-success)_24%,transparent)] bg-[color-mix(in_srgb,var(--status-success)_14%,transparent)] text-(--status-success)"
                          : "border-transparent bg-(--bg-tertiary)/70 text-(--text-secondary) hover:border-(--border) hover:text-(--text-primary)"
                      }`}
                    >
                      <span>Auto run</span>
                      <span className="flex items-center gap-2">
                        {executionMode === "auto" && (
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-(--status-success)" />
                        )}
                        <span>{executionMode === "auto" ? "On" : "Off"}</span>
                      </span>
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                title={
                  isDark ? "Switch to light theme" : "Switch to dark theme"
                }
                className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-secondary)_92%,transparent)] text-base text-[var(--text-secondary)] shadow-[0_10px_24px_rgba(0,0,0,0.28)] backdrop-blur-md transition-all duration-150 hover:border-[var(--accent)] hover:text-[var(--text-primary)] hover:shadow-[0_0_18px_var(--accent-glow)]"
              >
                {isDark ? "☀" : "🌙"}
              </button>
            </div>
          </div>
        </Panel>
        <Panel position="center-left">
          <InteractionToolbar />
        </Panel>
        <Panel position="bottom-right">
          {!isNodeDragActive && (
            <MiniMap
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]"
              nodeColor={minimapNodeColor}
              maskColor="rgba(0, 0, 0, 0.5)"
              pannable
              zoomable
            />
          )}
        </Panel>
        <Panel position="bottom-left">
          <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-secondary)_92%,transparent)] p-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.25)] backdrop-blur-md">
            <button
              onClick={undo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              className="button-pop flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-[var(--text-secondary)] transition-all duration-150 hover:border-[var(--border)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-35"
            >
              <MdUndo />
            </button>

            <button
              onClick={redo}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
              className="button-pop flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-[var(--text-secondary)] transition-all duration-150 hover:border-[var(--border)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-35"
            >
              <MdRedo />
            </button>
          </div>
        </Panel>
      </ReactFlow>

      {cutLine && (
        <svg className="pointer-events-none absolute inset-0 z-30 h-full w-full">
          <line
            x1={cutLine.x1}
            y1={cutLine.y1}
            x2={cutLine.x2}
            y2={cutLine.y2}
            stroke="var(--status-error)"
            strokeWidth={2}
            strokeDasharray="6 4"
            strokeLinecap="round"
          />
        </svg>
      )}

      <ContextMenu
        contextMenu={contextMenu}
        onClose={closeContextMenu}
        onAction={dispatchContextAction}
      />
    </div>
  )
})

FlowCanvas.displayName = "FlowCanvas"
