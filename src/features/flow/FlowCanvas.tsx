import React, { useCallback, useRef } from "react"
import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { nodeTypes } from "./nodeTypes"
import { useFlowStore } from "./flowStore"
import type { MathNodeType } from "../../types"
import { RemovableEdge } from "./RemovableEdge"

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

export const FlowCanvas: React.FC = React.memo(() => {
  const nodes = useFlowStore((s) => s.nodes)
  const edges = useFlowStore((s) => s.edges)
  const onNodesChange = useFlowStore((s) => s.onNodesChange)
  const onEdgesChange = useFlowStore((s) => s.onEdgesChange)
  const onConnect = useFlowStore((s) => s.onConnect)
  const selectNode = useFlowStore((s) => s.selectNode)
  const addNode = useFlowStore((s) => s.addNode)

  const reactFlowInstance = useRef<any>(null)

  const onInit = useCallback((instance: any) => {
    reactFlowInstance.current = instance
  }, [])

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: any) => {
      selectNode(node.id)
    },
    [selectNode],
  )

  const onPaneClick = useCallback(() => {
    selectNode(null)
  }, [selectNode])

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
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={edgeOptions}
        connectionLineStyle={connectionLineStyle}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={["Backspace", "Delete"]}
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
    </div>
  )
})

FlowCanvas.displayName = "FlowCanvas"
