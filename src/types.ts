import type { Node, Edge } from "@xyflow/react"
import { IconType } from "react-icons"

// ─── Port & Data Types ────────────────────────────────────
export type PortType =
  | "number"
  | "boolean"
  | "expression"
  | "symbolic"
  | "matrix"
  | "vector"
  | "vector2"
  | "vector3"
  | "function"
  | "array"

export interface PortDefinition {
  name: string
  type: PortType
  label: string
}

// ─── Execution ────────────────────────────────────────────
export type ExecutionMode = "manual" | "step" | "auto"
export type NodeStatus = "idle" | "running" | "success" | "error"
export type ComputeMode = "numeric" | "symbolic"

// ─── Node Data ────────────────────────────────────────────
export interface MathNodeData {
  label: string
  category:
    | "input"
    | "arithmetic"
    | "trigonometry"
    | "vectors"
    | "matrices"
    | "physics"
    | "signals"
    | "logarithmic"
    | "logic"
    | "advanced"
    | "calculus"
    | "display"
  inputs: PortDefinition[]
  outputs: PortDefinition[]
  params: Record<string, unknown>
  dirty: boolean
  status: NodeStatus
  computeTimeMs?: number
  [key: string]: unknown
}

export type MathNode = Node<MathNodeData>
export type MathEdge = Edge

// ─── Store ────────────────────────────────────────────────
export interface LogEntry {
  id: string
  timestamp: number
  level: "info" | "eval" | "success" | "error" | "warn"
  message: string
}

export interface ComputedValue {
  value: unknown
  type: PortType
  error?: string
}

export type InteractionMode = "select" | "pan" | "cut"

export type ContextMenuTarget = "node" | "multi" | "group" | "canvas"

export interface ContextMenuState {
  visible: boolean
  x: number
  y: number
  target: ContextMenuTarget
  nodeId?: string
}

export interface ClipboardData {
  nodes: MathNode[]
  edges: MathEdge[]
}

// ─── Node Type Registry ───────────────────────────────────
export type MathNodeType =
  | "numberInput"
  | "constant"
  | "time"
  | "variable"
  | "expression"
  | "add"
  | "subtract"
  | "multiply"
  | "divide"
  | "power"
  | "root"
  | "sqrt"
  | "trigonometric"
  | "ln"
  | "log"
  | "comparator"
  | "derivative"
  | "integral"
  | "vector2"
  | "vector3"
  | "dotProduct"
  | "crossProduct"
  | "normalize"
  | "length"
  | "plot"
  | "matrix"
  | "matrixMultiply"
  | "determinant"
  | "inverse"
  | "velocity"
  | "acceleration"
  | "force"
  | "kineticEnergy"
  | "potentialEnergy"
  | "oscillator"
  | "random"
  | "group"

export type SidebarTone =
  | "input"
  | "arithmetic"
  | "trigonometry"
  | "vectors"
  | "matrices"
  | "physics"
  | "signals"
  | "logarithmic"
  | "logic"
  | "calculus"
  | "display"
  | "advanced"

// ─── Sidebar Category ─────────────────────────────────────
export interface SidebarNodeItem {
  type: MathNodeType
  label: string
  icon: IconType
  iconColor: SidebarTone
  description?: string
  presetParams?: Record<string, unknown>
}

export interface SidebarCategory {
  name: string
  color: SidebarTone
  items: SidebarNodeItem[]
}

// ─── App Routes ───────────────────────────────────────────
export type AppRouteName = "landingPage" | "FlowCanvasPage" | "Settings"
