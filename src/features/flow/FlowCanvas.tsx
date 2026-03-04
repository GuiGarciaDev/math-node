import React, { useCallback, useMemo, useRef, useState } from "react"
import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  type Node,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { nodeTypes } from "./nodeTypes"
import { useFlowStore } from "./flowStore"
import type { MathNodeType } from "../../types"
import { RemovableEdge } from "./RemovableEdge"
import { ContextMenu } from "./ContextMenu"

const edgeTypes = {
  removable: RemovableEdge,
}

const minimapStyle = {
  backgroundColor: "var(--bg-secondary)",
  borderRadius: 8,
  border: "1px solid var(--border)",
}

const minimapNodeColor = (node: any) => {
  const category = node.data?.category
  switch (category) {
    case "input":
      return "var(--category-input)"
    case "arithmetic":
      return "var(--category-arithmetic)"
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

function getOrientation(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
) {
  const value = (by - ay) * (cx - bx) - (bx - ax) * (cy - by)
  if (Math.abs(value) < 1e-9) return 0
  return value > 0 ? 1 : 2
}

function isPointOnSegment(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  px: number,
  py: number,
) {
  return (
    px <= Math.max(ax, bx) + 1e-9 &&
    px >= Math.min(ax, bx) - 1e-9 &&
    py <= Math.max(ay, by) + 1e-9 &&
    py >= Math.min(ay, by) - 1e-9
  )
}

function segmentsIntersect(
  a1: { x: number; y: number },
  a2: { x: number; y: number },
  b1: { x: number; y: number },
  b2: { x: number; y: number },
) {
  const o1 = getOrientation(a1.x, a1.y, a2.x, a2.y, b1.x, b1.y)
  const o2 = getOrientation(a1.x, a1.y, a2.x, a2.y, b2.x, b2.y)
  const o3 = getOrientation(b1.x, b1.y, b2.x, b2.y, a1.x, a1.y)
  const o4 = getOrientation(b1.x, b1.y, b2.x, b2.y, a2.x, a2.y)

  if (o1 !== o2 && o3 !== o4) return true

  if (o1 === 0 && isPointOnSegment(a1.x, a1.y, a2.x, a2.y, b1.x, b1.y))
    return true
  if (o2 === 0 && isPointOnSegment(a1.x, a1.y, a2.x, a2.y, b2.x, b2.y))
    return true
  if (o3 === 0 && isPointOnSegment(b1.x, b1.y, b2.x, b2.y, a1.x, a1.y))
    return true
  if (o4 === 0 && isPointOnSegment(b1.x, b1.y, b2.x, b2.y, a2.x, a2.y))
    return true

  return false
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
  const openContextMenu = useFlowStore((s) => s.openContextMenu)
  const closeContextMenu = useFlowStore((s) => s.closeContextMenu)
  const removeEdgesByIds = useFlowStore((s) => s.removeEdgesByIds)
  const addNode = useFlowStore((s) => s.addNode)

  const reactFlowInstance = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [cutStart, setCutStart] = useState<{ x: number; y: number } | null>(
    null,
  )
  const [cutCurrent, setCutCurrent] = useState<{ x: number; y: number } | null>(
    null,
  )

  const onInit = useCallback((instance: any) => {
    reactFlowInstance.current = instance
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
    ({ nodes: selectedNodes }: { nodes: Node[] }) => {
      setSelectedNodeIds(selectedNodes.map((node) => node.id))
    },
    [setSelectedNodeIds],
  )

  const onSelectionContextMenu = useCallback(
    (event: React.MouseEvent, selectionNodes: Node[]) => {
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
    (event: React.MouseEvent, node: Node) => {
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
      const selectedIds =
        selectedNodeIds.length > 0
          ? selectedNodeIds
          : nodes.filter((node) => node.selected).map((node) => node.id)

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
    [closeContextMenu, nodes, openContextMenu, selectedNodeIds],
  )

  const resolveAbsoluteCenter = useCallback(
    (nodeId: string): { x: number; y: number } | null => {
      const byId = new Map(nodes.map((n) => [n.id, n]))
      const node = byId.get(nodeId)
      if (!node) return null

      let x = node.position.x
      let y = node.position.y
      let parentId = node.parentId

      while (parentId) {
        const parent = byId.get(parentId)
        if (!parent) break
        x += parent.position.x
        y += parent.position.y
        parentId = parent.parentId
      }

      const width = node.width ?? 0
      const height = node.height ?? 0

      return { x: x + width / 2, y: y + height / 2 }
    },
    [nodes],
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
      if (interactionMode !== "cut") return
      if (event.button !== 0) return
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
      if (interactionMode !== "cut" || !cutStart) return
      const bounds = containerRef.current?.getBoundingClientRect()
      if (!bounds) return
      setCutCurrent({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      })
    },
    [cutStart, interactionMode],
  )

  const onPaneMouseUp = useCallback(() => {
    if (interactionMode !== "cut" || !cutLine) {
      setCutStart(null)
      setCutCurrent(null)
      return
    }

    const bounds = containerRef.current?.getBoundingClientRect()
    const instance = reactFlowInstance.current
    if (!bounds || !instance) {
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

    const cutStartFlow = instance.screenToFlowPosition({
      x: cutLine.x1 + bounds.left,
      y: cutLine.y1 + bounds.top,
    })
    const cutEndFlow = instance.screenToFlowPosition({
      x: cutLine.x2 + bounds.left,
      y: cutLine.y2 + bounds.top,
    })

    const edgeIdsToRemove = edges
      .map((edge) => {
        const sourcePos = resolveAbsoluteCenter(edge.source)
        const targetPos = resolveAbsoluteCenter(edge.target)
        if (!sourcePos || !targetPos) return null

        if (segmentsIntersect(cutStartFlow, cutEndFlow, sourcePos, targetPos)) {
          return edge.id
        }
        return null
      })
      .filter((edgeId): edgeId is string => Boolean(edgeId))

    if (edgeIdsToRemove.length > 0) {
      removeEdgesByIds(edgeIdsToRemove)
    }

    setCutStart(null)
    setCutCurrent(null)
  }, [cutLine, edges, interactionMode, removeEdgesByIds, resolveAbsoluteCenter])

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

  return (
    <div
      ref={containerRef}
      onMouseDown={onPaneMouseDown}
      onMouseMove={onPaneMouseMove}
      onMouseUp={onPaneMouseUp}
      style={{
        width: "100%",
        height: "100%",
        cursor: interactionMode === "cut" ? "crosshair" : "default",
        position: "relative",
      }}
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
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onPaneClick}
        onPaneContextMenu={onPaneContextMenu}
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
        snapToGrid
        snapGrid={[12, 12]}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="var(--border)"
        />
        <MiniMap
          style={minimapStyle}
          nodeColor={minimapNodeColor}
          maskColor="rgba(0, 0, 0, 0.5)"
          pannable
          zoomable
        />
      </ReactFlow>

      {cutLine && (
        <svg
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 30,
          }}
        >
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

      <ContextMenu />
    </div>
  )
})

FlowCanvas.displayName = "FlowCanvas"
