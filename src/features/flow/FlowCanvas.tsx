import React, { useCallback, useEffect, useRef, useState } from "react"
import {
  ReactFlow,
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
import RunNodesDropdown from "./run-nodes-dropdown/RunNodesDropdown"
import WorkflowHeaderDropdown from "./workflow-dropdown/WorkflowHeaderDropdown"
import { Routes } from "@/types/routes-types"
import WorkflowAppearanceSheet from "./workflow-dropdown/WorkflowAppearanceSheet"
import { saveWorkflow } from "@/storage/workflowRepository"
import type { WorkflowAppearance } from "@/utils/workflowAppearance"
import { useUIStore } from "./store/ui-store"
import UndoRedoComponent from "@/components/canvas/UndoRedoComponent"
import MinimapComponent from "@/components/canvas/MinimapComponent"
import { HiScissors } from "react-icons/hi2"
import { LuPanelRight } from "react-icons/lu"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const STATIC_SCISSOR_ANGLE = 45

const edgeTypes = {
  removable: RemovableEdge,
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

function isNodeInputTarget(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null
  if (!element) return false
  return Boolean(element.closest(".node-input"))
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
    const runPipeline = useFlowStore((s) => s.runPipeline)
    const resetNodeStats = useFlowStore((s) => s.resetNodeStats)
    const executionMode = useFlowStore((s) => s.executionMode)
    const setExecutionMode = useFlowStore((s) => s.setExecutionMode)
    const isRunning = useFlowStore((s) => s.isRunning)
    const renameNode = useFlowStore((s) => s.renameNode)
    const currentWorkflowName = useFlowStore((s) => s.currentWorkflowName)
    const setCurrentWorkflowName = useFlowStore((s) => s.setCurrentWorkflowName)
    const currentWorkflowId = useFlowStore((s) => s.currentWorkflowId)
    const currentWorkflowAppearance = useFlowStore(
      (s) => s.currentWorkflowAppearance,
    )
    const setCurrentWorkflowAppearance = useFlowStore(
      (s) => s.setCurrentWorkflowAppearance,
    )
    const isWorkflowSheetOpen = useUIStore((s) => s.isWorkflowSheetOpen)
    const setIsWorkflowSheetOpen = useUIStore((s) => s.setWorkflowSheetOpen)
    const inspectorOpen = useFlowStore((s) => s.inspectorOpen)
    const toggleInspector = useFlowStore((s) => s.toggleInspector)

    const reactFlowInstance = useRef<ReactFlowInstance<
      MathNode,
      MathEdge
    > | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [isNodeDragActive, setIsNodeDragActive] = useState(false)
    const [isNodeInputFocused, setIsNodeInputFocused] = useState(false)
    const cutLineRef = useRef<SVGLineElement | null>(null)
    const cutCursorRef = useRef<HTMLDivElement | null>(null)
    const cutStartRef = useRef<{ x: number; y: number } | null>(null)
    const cutCurrentRef = useRef<{ x: number; y: number } | null>(null)
    const isCuttingRef = useRef(false)
    const cursorMotionRef = useRef({
      currentX: 0,
      currentY: 0,
      currentAngle: STATIC_SCISSOR_ANGLE,
      targetX: 0,
      targetY: 0,
      targetAngle: STATIC_SCISSOR_ANGLE,
      visible: false,
    })
    const animationFrameRef = useRef<number | null>(null)
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

    useEffect(() => {
      const container = containerRef.current
      if (!container) return

      const handleFocusIn = (event: FocusEvent) => {
        if (!isNodeInputTarget(event.target)) return
        setIsNodeInputFocused(true)
      }

      const handleFocusOut = () => {
        window.requestAnimationFrame(() => {
          setIsNodeInputFocused(isNodeInputTarget(document.activeElement))
        })
      }

      container.addEventListener("focusin", handleFocusIn)
      container.addEventListener("focusout", handleFocusOut)

      return () => {
        container.removeEventListener("focusin", handleFocusIn)
        container.removeEventListener("focusout", handleFocusOut)
      }
    }, [])

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

    const clearCutLine = useCallback(() => {
      cutStartRef.current = null
      cutCurrentRef.current = null
      isCuttingRef.current = false

      const lineElement = cutLineRef.current
      if (lineElement) {
        lineElement.setAttribute("x1", "0")
        lineElement.setAttribute("y1", "0")
        lineElement.setAttribute("x2", "0")
        lineElement.setAttribute("y2", "0")
        lineElement.style.opacity = "0"
      }
    }, [])

    useEffect(() => {
      if (interactionMode === "cut") return
      clearCutLine()
      cursorMotionRef.current.visible = false
      if (cutCursorRef.current) {
        cutCursorRef.current.style.opacity = "0"
      }

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }, [clearCutLine, interactionMode])

    useEffect(() => {
      if (interactionMode !== "cut") return

      const animate = () => {
        const cursorElement = cutCursorRef.current

        if (cursorElement) {
          const motion = cursorMotionRef.current

          if (motion.visible) {
            const deltaX = motion.targetX - motion.currentX
            const deltaY = motion.targetY - motion.currentY
            motion.currentX += deltaX * 0.35
            motion.currentY += deltaY * 0.35
            motion.currentAngle = STATIC_SCISSOR_ANGLE

            cursorElement.style.opacity = "1"
            cursorElement.style.transform = `translate(${motion.currentX}px, ${motion.currentY}px) rotate(${motion.currentAngle}deg)`
          } else {
            cursorElement.style.opacity = "0"
          }
        }

        animationFrameRef.current = window.requestAnimationFrame(animate)
      }

      animationFrameRef.current = window.requestAnimationFrame(animate)

      return () => {
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current)
          animationFrameRef.current = null
        }
      }
    }, [interactionMode])

    const onPaneMouseDown = useCallback(
      (event: React.MouseEvent) => {
        if (!isPaneEventTarget(event.target)) return
        if (interactionMode !== "cut") return
        if (event.button !== 0) return
        event.preventDefault()
        const bounds = containerRef.current?.getBoundingClientRect()
        if (!bounds) return
        closeContextMenu()
        const startPoint = {
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top,
        }

        clearCutLine()
        isCuttingRef.current = true
        cutStartRef.current = startPoint
        cutCurrentRef.current = startPoint

        const lineElement = cutLineRef.current
        if (lineElement) {
          lineElement.setAttribute("x1", String(startPoint.x))
          lineElement.setAttribute("y1", String(startPoint.y))
          lineElement.setAttribute("x2", String(startPoint.x))
          lineElement.setAttribute("y2", String(startPoint.y))
          lineElement.style.opacity = "1"
        }

        const motion = cursorMotionRef.current
        motion.currentX = startPoint.x
        motion.currentY = startPoint.y
        motion.targetX = startPoint.x
        motion.targetY = startPoint.y
        motion.currentAngle = STATIC_SCISSOR_ANGLE
        motion.targetAngle = STATIC_SCISSOR_ANGLE
        motion.visible = true
      },
      [clearCutLine, closeContextMenu, interactionMode],
    )

    const onPaneMouseMove = useCallback(
      (event: React.MouseEvent) => {
        if (interactionMode !== "cut") return

        const bounds = containerRef.current?.getBoundingClientRect()
        if (!bounds) return

        event.preventDefault()

        const currentPoint = {
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top,
        }

        const motion = cursorMotionRef.current
        motion.targetX = currentPoint.x
        motion.targetY = currentPoint.y
        motion.targetAngle = STATIC_SCISSOR_ANGLE
        motion.visible = true

        if (isCuttingRef.current) {
          cutCurrentRef.current = currentPoint
          const lineElement = cutLineRef.current
          if (lineElement) {
            lineElement.setAttribute("x2", String(currentPoint.x))
            lineElement.setAttribute("y2", String(currentPoint.y))
          }
        }
      },
      [interactionMode],
    )

    const onPaneMouseUp = useCallback(
      (event: React.MouseEvent) => {
        if (interactionMode === "cut") {
          event.preventDefault()
        }

        if (interactionMode !== "cut" || !isCuttingRef.current) {
          clearCutLine()
          return
        }

        const bounds = containerRef.current?.getBoundingClientRect()
        if (!bounds) {
          clearCutLine()
          return
        }

        const startPoint = cutStartRef.current
        const currentPoint = cutCurrentRef.current

        if (!startPoint || !currentPoint) {
          clearCutLine()
          return
        }

        const cutLength = Math.hypot(
          currentPoint.x - startPoint.x,
          currentPoint.y - startPoint.y,
        )

        if (cutLength < 4) {
          clearCutLine()
          return
        }

        const edgeIdsToRemove = collectEdgeIdsAlongCutLine(
          {
            x1: startPoint.x,
            y1: startPoint.y,
            x2: currentPoint.x,
            y2: currentPoint.y,
          },
          bounds,
        )

        if (edgeIdsToRemove.length > 0) {
          removeEdgesByIds(edgeIdsToRemove)
        }

        clearCutLine()
      },
      [clearCutLine, interactionMode, removeEdgesByIds],
    )

    const onContainerMouseLeave = useCallback(() => {
      if (interactionMode !== "cut") return
      cursorMotionRef.current.visible = false
      clearCutLine()
    }, [clearCutLine, interactionMode])

    // Drag and drop from sidebar
    const onDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = "move"
    }, [])

    const onDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault()
        const rawPayload = e.dataTransfer.getData("application/mathflow-node")
        if (!rawPayload) return

        let type: MathNodeType
        let presetParams: Record<string, unknown> | undefined
        try {
          const parsed = JSON.parse(rawPayload) as {
            type?: MathNodeType
            presetParams?: Record<string, unknown>
          }
          type = parsed.type ?? (rawPayload as MathNodeType)
          presetParams = parsed.presetParams
        } catch {
          type = rawPayload as MathNodeType
        }

        if (!type || !reactFlowInstance.current) return

        const position = reactFlowInstance.current.screenToFlowPosition({
          x: e.clientX,
          y: e.clientY,
        })

        addNode(type, position, presetParams)
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

    const handleContextMenuAction = useCallback(
      (action: string, nodeId?: string) => {
        if (action === "rename_group" && nodeId) {
          const groupNode = nodes.find((node) => node.id === nodeId)
          const currentName = String(groupNode?.data.label ?? "Group")
          const nextName = window.prompt("Rename group", currentName)
          if (nextName && nextName.trim()) {
            renameNode(nodeId, nextName)
          }
          closeContextMenu()
          return
        }

        dispatchContextAction(action, nodeId)
      },
      [closeContextMenu, dispatchContextAction, nodes, renameNode],
    )

    const handleSaveAppearance = useCallback(
      (appearance: WorkflowAppearance) => {
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
        onMouseLeave={onContainerMouseLeave}
        className={`relative h-full w-full ${interactionMode === "cut" ? "cursor-none" : "cursor-default"}`}
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
          nodesDraggable={interactionMode === "select" && !isNodeInputFocused}
          elementsSelectable={interactionMode === "select"}
          selectionOnDrag={interactionMode === "select"}
          nodesConnectable={interactionMode !== "cut"}
          noDragClassName="node-input"
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
            color="var(--foreground-muted)"
          />
          <Panel position="top-center" className="w-full px-4">
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
                  onResetNodeStats={resetNodeStats}
                />
                <TooltipProvider delayDuration={500}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={toggleInspector}
                        // title={
                        //   inspectorOpen ? "Hide Inspector" : "Show Inspector"
                        // }
                        className={cn(
                          `flex h-10 items-center rounded-md justify-center border border-border bg-card text-md transition-all duration-300 px-3 hover:brightness-125 cursor-pointer`,
                          inspectorOpen && "bg-primary/30",
                        )}
                      >
                        <LuPanelRight />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent align="center">
                      {inspectorOpen ? "Hide Inspector" : "Show Inspector"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </Panel>
          <Panel position="center-left">
            <InteractionToolbar />
          </Panel>
          <Panel position="bottom-right">
            {!isNodeDragActive && <MinimapComponent />}
          </Panel>
          <Panel position="bottom-left">
            <UndoRedoComponent />
          </Panel>
        </ReactFlow>

        {interactionMode === "cut" && (
          <>
            <svg className="pointer-events-none absolute inset-0 z-30 h-full w-full">
              <line
                ref={cutLineRef}
                x1={0}
                y1={0}
                x2={0}
                y2={0}
                fill="none"
                stroke="var(--status-error)"
                strokeWidth={2}
                strokeDasharray="6 4"
                strokeLinecap="round"
                style={{ opacity: 0 }}
              />
            </svg>

            <div
              ref={cutCursorRef}
              className="pointer-events-none absolute left-0 top-0 z-40 text-(--status-error) opacity-0"
              style={{
                transform: "translate(0px, 0px) rotate(45deg)",
                transformOrigin: "50% 50%",
              }}
            >
              <HiScissors className="h-5 w-5 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_8px_rgba(255,80,80,0.45)]" />
            </div>
          </>
        )}

        <ContextMenu
          contextMenu={contextMenu}
          onClose={closeContextMenu}
          onAction={handleContextMenuAction}
        />

        <WorkflowAppearanceSheet
          open={isWorkflowSheetOpen}
          onOpenChange={setIsWorkflowSheetOpen}
          value={currentWorkflowAppearance}
          disabled={!currentWorkflowId}
          onSave={handleSaveAppearance}
        />
      </div>
    )
  },
)

FlowCanvas.displayName = "FlowCanvas"
