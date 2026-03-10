import React, { useCallback, useMemo, useRef, useState } from "react"
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
import { nodeTypes } from "../../types/node-types"
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
import RunNodesDropdown from "./run-nodes-dropdown/RunNodesDropdown"
import WorkflowHeaderDropdown from "./workflow-dropdown/WorkflowHeaderDropdown"
import { Routes } from "@/types/routes-types"
import ToggleThemeButton from "@/components/toggle-theme"
import WorkflowAppearanceSheet from "./workflow-dropdown/WorkflowAppearanceSheet"
import { saveWorkflow } from "@/storage/workflowRepository"

const edgeTypes = {
  removable: RemovableEdge,
}

const minimapNodeColor = (node: FlowNode) => {
  const category = node.data?.category
  switch (category) {
    case "input":
      return "var(--category-number)"
    case "arithmetic":
      return "var(--category-arithmetic)"
    case "trigonometry":
      return "var(--category-trigonometry)"
    case "logarithmic":
      return "var(--category-logarithmic)"
    case "logic":
      return "var(--category-logic)"
    case "calculus":
      return "var(--category-expression)"
    case "display":
      return "var(--category-matrix)"
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

interface FlowCanvasProps {
  onRouteChange?: (route: Routes) => void
}

export const FlowCanvas: React.FC<FlowCanvasProps> = React.memo(
  ({ onRouteChange }) => {
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
    const currentWorkflowName = useFlowStore((s) => s.currentWorkflowName)
    const setCurrentWorkflowName = useFlowStore((s) => s.setCurrentWorkflowName)
    const currentWorkflowId = useFlowStore((s) => s.currentWorkflowId)
    const currentWorkflowAppearance = useFlowStore(
      (s) => s.currentWorkflowAppearance,
    )
    const setCurrentWorkflowAppearance = useFlowStore(
      (s) => s.setCurrentWorkflowAppearance,
    )

    const reactFlowInstance = useRef<ReactFlowInstance<
      MathNode,
      MathEdge
    > | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [cutStart, setCutStart] = useState<{ x: number; y: number } | null>(
      null,
    )
    const [cutCurrent, setCutCurrent] = useState<{
      x: number
      y: number
    } | null>(null)
    const [isNodeDragActive, setIsNodeDragActive] = useState(false)
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({
      visible: false,
      x: 0,
      y: 0,
      target: "canvas",
    })

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

    const handleBackHome = useCallback(() => {
      onRouteChange?.("PROJECTS_PAGE")
    }, [onRouteChange])

    const handleRenameWorkflow = useCallback(
      (name: string) => {
        setCurrentWorkflowName(name)
      },
      [setCurrentWorkflowName],
    )

    const handleSaveAppearance = useCallback(
      (appearance: {
        tag: string
        gradient: string
        tone: string
        preview: "panel" | "orbit" | "bars" | "lattice"
      }) => {
        setCurrentWorkflowAppearance(appearance)

        if (!currentWorkflowId) return

        void saveWorkflow({
          id: currentWorkflowId,
          name: currentWorkflowName,
          nodes,
          edges,
          ...appearance,
        })
      },
      [
        currentWorkflowId,
        currentWorkflowName,
        edges,
        nodes,
        setCurrentWorkflowAppearance,
      ],
    )

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
              <WorkflowHeaderDropdown
                workflowName={currentWorkflowName}
                onRenameWorkflow={handleRenameWorkflow}
                onBackHome={handleBackHome}
              />
              <div className="z-40 flex justify-between gap-6">
                <RunNodesDropdown
                  isRunning={isRunning}
                  executionMode={executionMode}
                  onRunWorkflow={runPipeline}
                  onToggleAutoRun={toggleAutoRun}
                />

                <WorkflowAppearanceSheet
                  value={currentWorkflowAppearance}
                  disabled={!currentWorkflowId}
                  onSave={handleSaveAppearance}
                />

                <ToggleThemeButton />
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
  },
)

FlowCanvas.displayName = "FlowCanvas"
