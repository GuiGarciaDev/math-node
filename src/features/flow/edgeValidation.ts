// ─── Edge Validation ──────────────────────────────────────
// Prevents invalid connections based on typed ports.

import type { PortType, MathNode } from "../../types"
import { wouldCreateCycle } from "./executionEngine"
import type { Connection } from "@xyflow/react"

// ─── Compatibility Matrix ─────────────────────────────────
const compatibilityMatrix: Record<PortType, Set<PortType>> = {
  number: new Set(["number"]),
  boolean: new Set(["boolean"]),
  expression: new Set(["expression", "symbolic", "function"]),
  symbolic: new Set(["symbolic", "function"]),
  matrix: new Set(["matrix"]),
  function: new Set(["function", "symbolic", "expression"]),
  array: new Set(["array"]),
}

export function arePortsCompatible(
  sourceType: PortType,
  targetType: PortType,
): boolean {
  return compatibilityMatrix[targetType]?.has(sourceType) ?? false
}

// ─── Connection Validator ─────────────────────────────────

export function validateConnection(
  connection: Connection,
  nodes: MathNode[],
  edges: {
    id: string
    source: string
    target: string
    sourceHandle?: string | null
    targetHandle?: string | null
  }[],
): { valid: boolean; reason?: string } {
  const { source, target, sourceHandle, targetHandle } = connection

  if (!source || !target) {
    return { valid: false, reason: "Missing source or target" }
  }

  // No self-connections
  if (source === target) {
    return { valid: false, reason: "Cannot connect a node to itself" }
  }

  // Check for duplicate connections
  const duplicate = edges.some(
    (e) =>
      e.source === source &&
      e.target === target &&
      (e.sourceHandle ?? null) === (sourceHandle ?? null) &&
      (e.targetHandle ?? null) === (targetHandle ?? null),
  )
  if (duplicate) {
    return { valid: false, reason: "Connection already exists" }
  }

  // Check for cycle
  if (wouldCreateCycle(nodes, edges as any, source, target)) {
    return { valid: false, reason: "Connection would create a cycle" }
  }

  // Get source and target nodes
  const sourceNode = nodes.find((n) => n.id === source)
  const targetNode = nodes.find((n) => n.id === target)

  if (!sourceNode || !targetNode) {
    return { valid: false, reason: "Node not found" }
  }

  if (sourceNode.type === "group" || targetNode.type === "group") {
    return { valid: false, reason: "Groups cannot be connected directly" }
  }

  // Type compatibility check
  const sourcePort = sourceNode.data.outputs.find(
    (p) => p.name === (sourceHandle ?? sourceNode.data.outputs[0]?.name),
  )
  const targetPort = targetNode.data.inputs.find(
    (p) => p.name === (targetHandle ?? targetNode.data.inputs[0]?.name),
  )

  if (
    sourcePort &&
    targetPort &&
    !arePortsCompatible(sourcePort.type, targetPort.type)
  ) {
    return {
      valid: false,
      reason: `Incompatible types: ${sourcePort.type} → ${targetPort.type}`,
    }
  }

  return { valid: true }
}
