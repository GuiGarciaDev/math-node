// ─── Zustand Flow Store ───────────────────────────────────
// Central state management for the entire application.
// No useEffect-driven computation — all updates are event-driven.

import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  applyNodeChanges,
  applyEdgeChanges,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from "@xyflow/react"
import type {
  MathNode,
  MathEdge,
  ExecutionMode,
  ComputedValue,
  LogEntry,
  MathNodeType,
  MathNodeData,
  InteractionMode,
  ContextMenuState,
  ClipboardData,
} from "../../../types"
import { runPipeline, runSingleNode } from "../executionEngine"
import { validateConnection } from "../edgeValidation"
import {
  cancelAutosave,
  createAutosave,
  isAutosaveActiveFor,
  triggerAutosave,
} from "../../../storage/autosave"
import { loadWorkflow } from "../../../storage/workflowRepository"
import {
  type WorkflowAppearance,
  createDefaultWorkflowAppearance,
  normalizeWorkflowAppearance,
} from "@/utils/workflowAppearance"

const MATRIX_MIN_DIMENSION = 1
const MATRIX_MAX_DIMENSION = 6

function clampMatrixDimension(value: unknown, fallback: number): number {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) {
    return fallback
  }

  return Math.max(
    MATRIX_MIN_DIMENSION,
    Math.min(MATRIX_MAX_DIMENSION, Math.round(parsed)),
  )
}

function normalizeMatrixValues(raw: unknown): number[][] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return [[0]]
  }

  const rows = raw
    .filter((row) => Array.isArray(row))
    .map((row) =>
      (row as unknown[]).map((cell) => {
        const parsed = Number(cell)
        return Number.isFinite(parsed) ? parsed : 0
      }),
    )

  if (rows.length === 0) {
    return [[0]]
  }

  const safeColumnCount = Math.max(
    MATRIX_MIN_DIMENSION,
    ...rows.map((row) => row.length || MATRIX_MIN_DIMENSION),
  )

  return rows.map((row) => {
    const next = [...row]
    while (next.length < safeColumnCount) {
      next.push(0)
    }
    return next
  })
}

function resizeMatrixValues(
  matrix: number[][],
  targetRows: number,
  targetCols: number,
): number[][] {
  return Array.from({ length: targetRows }, (_, rowIndex) =>
    Array.from(
      { length: targetCols },
      (_, colIndex) => matrix[rowIndex]?.[colIndex] ?? 0,
    ),
  )
}

// ─── Node Factory ─────────────────────────────────────────

const nodeDefaults: Record<
  MathNodeType,
  Omit<MathNodeData, "dirty" | "status">
> = {
  numberInput: {
    label: "Number",
    category: "input",
    inputs: [],
    outputs: [{ name: "value", type: "number", label: "number" }],
    params: { value: "0" },
  },
  constant: {
    label: "Constant",
    category: "input",
    inputs: [],
    outputs: [{ name: "value", type: "number", label: "number" }],
    params: { constantKey: "pi", decimalPlaces: 6 },
  },
  time: {
    label: "Time",
    category: "input",
    inputs: [],
    outputs: [{ name: "value", type: "number", label: "seconds" }],
    params: { elapsedSeconds: 0 },
  },
  variable: {
    label: "Variable",
    category: "input",
    inputs: [],
    outputs: [{ name: "value", type: "symbolic", label: "Value" }],
    params: { name: "x" },
  },
  expression: {
    label: "Expression",
    category: "input",
    inputs: [],
    outputs: [{ name: "value", type: "symbolic", label: "f(x)" }],
    params: { expression: "x^2" },
  },
  add: {
    label: "Addition",
    category: "arithmetic",
    inputs: [
      { name: "a", type: "number", label: "Input A" },
      { name: "b", type: "number", label: "Input B" },
    ],
    outputs: [{ name: "result", type: "number", label: "number" }],
    params: {},
  },
  subtract: {
    label: "Subtract",
    category: "arithmetic",
    inputs: [
      { name: "a", type: "number", label: "A" },
      { name: "b", type: "number", label: "B" },
    ],
    outputs: [{ name: "result", type: "number", label: "Result" }],
    params: {},
  },
  multiply: {
    label: "Multiply",
    category: "arithmetic",
    inputs: [
      { name: "a", type: "number", label: "A" },
      { name: "b", type: "number", label: "B" },
    ],
    outputs: [{ name: "result", type: "number", label: "Result" }],
    params: {},
  },
  divide: {
    label: "Divide",
    category: "arithmetic",
    inputs: [
      { name: "a", type: "number", label: "A" },
      { name: "b", type: "number", label: "B" },
    ],
    outputs: [{ name: "result", type: "number", label: "Result" }],
    params: {},
  },
  power: {
    label: "Power",
    category: "arithmetic",
    inputs: [
      { name: "base", type: "number", label: "Base" },
      { name: "exp", type: "number", label: "Exponent" },
    ],
    outputs: [{ name: "result", type: "number", label: "Result" }],
    params: {},
  },
  root: {
    label: "Root",
    category: "arithmetic",
    inputs: [
      { name: "value", type: "number", label: "Value" },
      { name: "degree", type: "number", label: "n" },
    ],
    outputs: [{ name: "result", type: "number", label: "Result" }],
    params: { degree: 2 },
  },
  sqrt: {
    label: "Root",
    category: "arithmetic",
    inputs: [
      { name: "value", type: "number", label: "Value" },
      { name: "degree", type: "number", label: "n" },
    ],
    outputs: [{ name: "result", type: "number", label: "Result" }],
    params: { degree: 2 },
  },
  trigonometric: {
    label: "Trigonometric Function",
    category: "trigonometry",
    inputs: [{ name: "value", type: "number", label: "Value" }],
    outputs: [{ name: "result", type: "number", label: "Result" }],
    params: { operation: "sin", unit: "deg" },
  },
  ln: {
    label: "ln",
    category: "logarithmic",
    inputs: [{ name: "value", type: "number", label: "Value" }],
    outputs: [{ name: "result", type: "number", label: "Result" }],
    params: {},
  },
  log: {
    label: "log",
    category: "logarithmic",
    inputs: [
      { name: "value", type: "number", label: "Value" },
      { name: "base", type: "number", label: "Base" },
    ],
    outputs: [{ name: "result", type: "number", label: "Result" }],
    params: { base: 10 },
  },
  comparator: {
    label: "Comparator",
    category: "logic",
    inputs: [
      { name: "left", type: "number", label: "A" },
      { name: "right", type: "number", label: "B" },
    ],
    outputs: [{ name: "result", type: "boolean", label: "Result" }],
    params: { operator: ">" },
  },
  derivative: {
    label: "Derivative",
    category: "calculus",
    inputs: [
      { name: "functionValue", type: "number", label: "f(x)" },
      { name: "functionValuePlusDelta", type: "number", label: "f(x+h)" },
      { name: "deltaX", type: "number", label: "h" },
    ],
    outputs: [{ name: "result", type: "number", label: "f'(x)" }],
    params: { deltaX: 0.001 },
  },
  integral: {
    label: "Integral",
    category: "calculus",
    inputs: [
      { name: "function", type: "number", label: "f(x)" },
      { name: "start", type: "number", label: "Start" },
      { name: "end", type: "number", label: "End" },
      { name: "steps", type: "number", label: "Steps" },
    ],
    outputs: [{ name: "result", type: "number", label: "Integral" }],
    params: { steps: 100 },
  },
  vector2: {
    label: "Vector2",
    category: "vectors",
    inputs: [
      { name: "x", type: "number", label: "x" },
      { name: "y", type: "number", label: "y" },
    ],
    outputs: [{ name: "vector", type: "vector2", label: "vector2" }],
    params: {},
  },
  vector3: {
    label: "Vector3",
    category: "vectors",
    inputs: [
      { name: "x", type: "number", label: "x" },
      { name: "y", type: "number", label: "y" },
      { name: "z", type: "number", label: "z" },
    ],
    outputs: [{ name: "vector", type: "vector3", label: "vector3" }],
    params: {},
  },
  dotProduct: {
    label: "Dot Product",
    category: "vectors",
    inputs: [
      { name: "vectorA", type: "vector", label: "A" },
      { name: "vectorB", type: "vector", label: "B" },
    ],
    outputs: [{ name: "result", type: "number", label: "dot" }],
    params: {},
  },
  crossProduct: {
    label: "Cross Product",
    category: "vectors",
    inputs: [
      { name: "vectorA", type: "vector3", label: "A" },
      { name: "vectorB", type: "vector3", label: "B" },
    ],
    outputs: [{ name: "result", type: "vector3", label: "vector3" }],
    params: {},
  },
  normalize: {
    label: "Normalize",
    category: "vectors",
    inputs: [{ name: "vector", type: "vector", label: "v" }],
    outputs: [{ name: "result", type: "vector", label: "unit" }],
    params: {},
  },
  length: {
    label: "Length",
    category: "vectors",
    inputs: [{ name: "vector", type: "vector", label: "v" }],
    outputs: [{ name: "result", type: "number", label: "|v|" }],
    params: {},
  },
  plot: {
    label: "Plot",
    category: "display",
    inputs: [{ name: "fn", type: "symbolic", label: "Function" }],
    outputs: [],
    params: { domain: [-10, 10], variable: "x" },
  },
  matrix: {
    label: "Matrix",
    category: "matrices",
    inputs: [],
    outputs: [{ name: "value", type: "matrix", label: "Matrix" }],
    params: {
      values: [
        [0, 0],
        [0, 0],
      ],
      rows: 2,
      cols: 2,
    },
  },
  matrixMultiply: {
    label: "Matrix Multiply",
    category: "matrices",
    inputs: [
      { name: "matrixA", type: "matrix", label: "A" },
      { name: "matrixB", type: "matrix", label: "B" },
    ],
    outputs: [{ name: "result", type: "matrix", label: "A*B" }],
    params: {},
  },
  determinant: {
    label: "Determinant",
    category: "matrices",
    inputs: [{ name: "matrix", type: "matrix", label: "M" }],
    outputs: [{ name: "result", type: "number", label: "det(M)" }],
    params: {},
  },
  inverse: {
    label: "Inverse",
    category: "matrices",
    inputs: [{ name: "matrix", type: "matrix", label: "M" }],
    outputs: [{ name: "result", type: "matrix", label: "M^-1" }],
    params: {},
  },
  velocity: {
    label: "Velocity",
    category: "physics",
    inputs: [
      { name: "position", type: "number", label: "dx" },
      { name: "time", type: "number", label: "dt" },
    ],
    outputs: [{ name: "result", type: "number", label: "v" }],
    params: {},
  },
  acceleration: {
    label: "Acceleration",
    category: "physics",
    inputs: [
      { name: "velocity", type: "number", label: "dv" },
      { name: "time", type: "number", label: "dt" },
    ],
    outputs: [{ name: "result", type: "number", label: "a" }],
    params: {},
  },
  force: {
    label: "Force",
    category: "physics",
    inputs: [
      { name: "mass", type: "number", label: "m" },
      { name: "acceleration", type: "number", label: "a" },
    ],
    outputs: [{ name: "result", type: "number", label: "F" }],
    params: {},
  },
  kineticEnergy: {
    label: "Kinetic Energy",
    category: "physics",
    inputs: [
      { name: "mass", type: "number", label: "m" },
      { name: "velocity", type: "number", label: "v" },
    ],
    outputs: [{ name: "result", type: "number", label: "Ek" }],
    params: {},
  },
  potentialEnergy: {
    label: "Potential Energy",
    category: "physics",
    inputs: [
      { name: "mass", type: "number", label: "m" },
      { name: "gravity", type: "number", label: "g" },
      { name: "height", type: "number", label: "h" },
    ],
    outputs: [{ name: "result", type: "number", label: "Ep" }],
    params: { gravity: 9.81 },
  },
  oscillator: {
    label: "Oscillator",
    category: "signals",
    inputs: [
      { name: "amplitude", type: "number", label: "A" },
      { name: "frequency", type: "number", label: "f" },
      { name: "phase", type: "number", label: "phi" },
      { name: "time", type: "number", label: "t" },
    ],
    outputs: [{ name: "result", type: "number", label: "wave" }],
    params: { amplitude: 1, frequency: 1, phase: 0 },
  },
  random: {
    label: "Random",
    category: "signals",
    inputs: [
      { name: "min", type: "number", label: "min" },
      { name: "max", type: "number", label: "max" },
    ],
    outputs: [{ name: "result", type: "number", label: "rand" }],
    params: { seed: 1 },
  },
  group: {
    label: "Group",
    category: "advanced",
    inputs: [],
    outputs: [],
    params: {
      width: 280,
      height: 180,
    },
  },
}

let nodeIdCounter = 0
function generateNodeId(prefix = "node"): string {
  return `${prefix}_${(++nodeIdCounter).toString(36)}_${Date.now().toString(36).slice(-4)}`
}

function createNodeData(type: MathNodeType): MathNodeData {
  const defaults = nodeDefaults[type]
  return {
    ...JSON.parse(JSON.stringify(defaults)),
    dirty: true,
    status: "idle" as const,
  }
}

function normalizeSelection(nodeIds: string[]): string[] {
  return Array.from(new Set(nodeIds))
}

function areSameStringArrays(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false
  }
  return true
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

function collectExpandedSelection(
  nodes: MathNode[],
  selectedIds: string[],
): string[] {
  const selected = new Set(selectedIds)
  const queue = [...selected]

  while (queue.length > 0) {
    const current = queue.shift()!
    for (const node of nodes) {
      if (node.parentId === current && !selected.has(node.id)) {
        selected.add(node.id)
        queue.push(node.id)
      }
    }
  }

  return Array.from(selected)
}

function getAbsoluteNodePosition(
  node: MathNode,
  byId: Map<string, MathNode>,
): { x: number; y: number } {
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

  return { x, y }
}

function collectUpstreamNodeIds(
  targetIds: string[],
  edges: MathEdge[],
): Set<string> {
  const upstreamByTarget = new Map<string, string[]>()

  for (const edge of edges) {
    const existing = upstreamByTarget.get(edge.target)
    if (existing) {
      existing.push(edge.source)
    } else {
      upstreamByTarget.set(edge.target, [edge.source])
    }
  }

  const visited = new Set<string>()
  const queue = [...targetIds]

  while (queue.length > 0) {
    const current = queue.shift()
    if (!current || visited.has(current)) continue
    visited.add(current)

    const upstream = upstreamByTarget.get(current) ?? []
    for (const sourceId of upstream) {
      if (!visited.has(sourceId)) {
        queue.push(sourceId)
      }
    }
  }

  return visited
}

const MAX_HISTORY_ENTRIES = 100

interface FlowHistorySnapshot {
  nodes: MathNode[]
  edges: MathEdge[]
  selectedNodeId: string | null
  selectedNodeIds: string[]
}

function createHistorySnapshot(state: {
  nodes: MathNode[]
  edges: MathEdge[]
  selectedNodeId: string | null
  selectedNodeIds: string[]
}): FlowHistorySnapshot {
  return {
    nodes: clone(state.nodes),
    edges: clone(state.edges),
    selectedNodeId: state.selectedNodeId,
    selectedNodeIds: [...state.selectedNodeIds],
  }
}

function withRecordedHistory(state: {
  historyPast: FlowHistorySnapshot[]
  nodes: MathNode[]
  edges: MathEdge[]
  selectedNodeId: string | null
  selectedNodeIds: string[]
}) {
  return {
    historyPast: [...state.historyPast, createHistorySnapshot(state)].slice(
      -MAX_HISTORY_ENTRIES,
    ),
    historyFuture: [] as FlowHistorySnapshot[],
  }
}

let suppressNextAutosave = false
let timeAnimationFrameId: number | null = null
let timeAnimationStartMs: number | null = null

function stopTimeAnimationLoop(): void {
  if (timeAnimationFrameId !== null) {
    cancelAnimationFrame(timeAnimationFrameId)
    timeAnimationFrameId = null
  }
  timeAnimationStartMs = null
}

// ─── Store Interface ──────────────────────────────────────

interface FlowState {
  // Data
  nodes: MathNode[]
  edges: MathEdge[]
  computedValues: Map<string, ComputedValue>

  // UI State
  executionMode: ExecutionMode
  selectedNodeId: string | null
  selectedNodeIds: string[]
  nodeDragInProgress: boolean
  interactionMode: InteractionMode
  contextMenu: ContextMenuState
  historyPast: FlowHistorySnapshot[]
  historyFuture: FlowHistorySnapshot[]
  clipboard: ClipboardData | null
  sidebarOpen: boolean
  presetsOpen: boolean
  consoleLogs: LogEntry[]
  isRunning: boolean
  computeMode: "numeric" | "symbolic"
  consoleOpen: boolean
  inspectorOpen: boolean
  appStarted: boolean
  currentWorkflowId: string | null
  currentWorkflowName: string
  currentWorkflowAppearance: WorkflowAppearance
  graphModal: {
    title: string
    points: Array<{ x: number; y: number }>
    domain: [number, number]
  } | null

  // React Flow handlers
  onNodesChange: (changes: NodeChange<MathNode>[]) => void
  onEdgesChange: (changes: EdgeChange<MathEdge>[]) => void
  onConnect: (connection: Connection) => void

  // Actions
  addNode: (
    type: MathNodeType,
    position: { x: number; y: number },
    presetParams?: Record<string, unknown>,
  ) => void
  removeNode: (nodeId: string) => void
  removeEdge: (edgeId: string) => void
  removeEdgesByIds: (edgeIds: string[]) => void
  updateNodeParam: (nodeId: string, key: string, value: unknown) => void
  selectNode: (nodeId: string | null) => void
  setSelectedNodeIds: (nodeIds: string[]) => void
  toggleNodeSelection: (nodeId: string) => void
  clearSelection: () => void
  setExecutionMode: (mode: ExecutionMode) => void
  setComputeMode: (mode: "numeric" | "symbolic") => void
  setInteractionMode: (mode: InteractionMode) => void
  toggleSidebar: () => void
  togglePresets: () => void

  openContextMenu: (payload: Omit<ContextMenuState, "visible">) => void
  closeContextMenu: () => void
  dispatchContextAction: (action: string, nodeId?: string) => void

  // Selection actions
  deleteSelectedNodes: () => void
  copySelection: () => void
  pasteClipboard: () => void
  duplicateSelection: () => void
  groupSelectedNodes: () => void
  ungroupNode: (groupId: string) => void
  undo: () => void
  redo: () => void

  // Execution
  runPipeline: () => void
  runPipelineToNode: (nodeId: string) => void
  runGroupNodes: (groupId: string) => void
  resetNodeStats: () => void
  stepExecute: () => void
  renameNode: (nodeId: string, name: string) => void
  clearConsole: () => void
  setAppStarted: (started: boolean) => void
  openWorkflowSession: (payload: {
    id: string
    name: string
    nodes: MathNode[]
    edges: MathEdge[]
    tag?: string
    gradient?: string
    tone?: string
    illustration?: WorkflowAppearance["illustration"]
  }) => void
  setCurrentWorkflowName: (name: string) => void
  setCurrentWorkflowAppearance: (
    appearance: Partial<WorkflowAppearance>,
  ) => void
  toggleConsole: () => void
  setInspectorOpen: (open: boolean) => void
  toggleInspector: () => void
  showLanding: () => void
  openGraphModal: (payload: {
    title: string
    points: Array<{ x: number; y: number }>
    domain: [number, number]
  }) => void
  closeGraphModal: () => void
}

// ─── Create Store ─────────────────────────────────────────

export const useFlowStore = create<FlowState>()(
  persist(
    (set, get) => ({
      // Initial data
      nodes: [],
      edges: [],
      computedValues: new Map(),

      // UI State
      executionMode: "manual",
      selectedNodeId: null,
      selectedNodeIds: [],
      nodeDragInProgress: false,
      interactionMode: "select",
      contextMenu: { visible: false, x: 0, y: 0, target: "canvas" },
      historyPast: [],
      historyFuture: [],
      clipboard: null,
      sidebarOpen: true,
      presetsOpen: false,
      consoleLogs: [],
      isRunning: false,
      computeMode: "numeric",
      consoleOpen: true,
      inspectorOpen: true,
      appStarted: false,
      currentWorkflowId: null,
      currentWorkflowName: "Untitled",
      currentWorkflowAppearance: createDefaultWorkflowAppearance(),
      graphModal: null,

      // ─── React Flow Handlers ────────────────────────────────
      onNodesChange: (changes) => {
        const state = get()
        const nextNodes = applyNodeChanges(changes, state.nodes)

        const hasDraggingPositionChange = changes.some(
          (change) => change.type === "position" && change.dragging === true,
        )
        const hasDragEndPositionChange = changes.some(
          (change) => change.type === "position" && change.dragging === false,
        )
        const hasStructuralChange = changes.some(
          (change) =>
            change.type === "remove" ||
            change.type === "add" ||
            change.type === "replace",
        )
        const shouldSyncSelection =
          hasStructuralChange ||
          changes.some((change) => change.type === "select")

        const nextSelectedNodeIds = shouldSyncSelection
          ? normalizeSelection(
              nextNodes.filter((node) => node.selected).map((node) => node.id),
            )
          : state.selectedNodeIds
        const selectionChanged = shouldSyncSelection
          ? !areSameStringArrays(nextSelectedNodeIds, state.selectedNodeIds)
          : false

        // Record one undo entry when drag starts, not for every pointer-move frame.
        const shouldRecordHistory =
          hasStructuralChange ||
          (hasDraggingPositionChange && !state.nodeDragInProgress)

        set({
          nodes: nextNodes,
          ...(selectionChanged
            ? {
                selectedNodeIds: nextSelectedNodeIds,
                selectedNodeId:
                  nextSelectedNodeIds.length === 1
                    ? nextSelectedNodeIds[0]
                    : null,
              }
            : {}),
          ...(hasDraggingPositionChange && !state.nodeDragInProgress
            ? { nodeDragInProgress: true }
            : {}),
          ...(hasDragEndPositionChange && state.nodeDragInProgress
            ? { nodeDragInProgress: false }
            : {}),
          ...(shouldRecordHistory ? withRecordedHistory(state) : {}),
        })
      },

      onEdgesChange: (changes) => {
        const state = get()
        const shouldRecordHistory = changes.some(
          (change) => change.type !== "select",
        )

        set({
          edges: applyEdgeChanges(changes, state.edges),
          ...(shouldRecordHistory ? withRecordedHistory(state) : {}),
        })
      },

      onConnect: (connection) => {
        const { nodes, edges, executionMode } = get()
        const validation = validateConnection(connection, nodes, edges)

        if (!validation.valid) {
          set({
            consoleLogs: [
              ...get().consoleLogs,
              {
                id: `log_${Date.now()}`,
                timestamp: Date.now(),
                level: "warn",
                message: `Connection rejected: ${validation.reason}`,
              },
            ],
          })
          return
        }

        const newEdge: MathEdge = {
          id: `e_${connection.source}_${connection.target}_${Date.now()}`,
          source: connection.source!,
          target: connection.target!,
          sourceHandle: connection.sourceHandle,
          targetHandle: connection.targetHandle,
          type: "removable",
        }

        const newNodes = nodes.map((node) =>
          node.id === connection.target
            ? { ...node, data: { ...node.data, dirty: true } }
            : node,
        )

        set({
          edges: [...edges, newEdge],
          nodes: newNodes,
          ...withRecordedHistory(get()),
        })

        if (executionMode === "auto") {
          setTimeout(() => get().runPipeline(), 0)
        }
      },

      // ─── Actions ────────────────────────────────────────────
      addNode: (type, position, presetParams) => {
        const state = get()
        const data = createNodeData(type)
        if (presetParams) {
          data.params = { ...data.params, ...presetParams }
        }
        const newNode: MathNode = {
          id: generateNodeId(type),
          type,
          position,
          data,
          selected: false,
        }
        set({ nodes: [...state.nodes, newNode], ...withRecordedHistory(state) })
      },

      removeNode: (nodeId) => {
        const state = get()
        const expandedNodeIds = collectExpandedSelection(state.nodes, [nodeId])
        const removeSet = new Set(expandedNodeIds)
        const selectedNodeId = state.selectedNodeId
        set({
          nodes: state.nodes.filter((n) => !removeSet.has(n.id)),
          edges: state.edges.filter(
            (edge) =>
              !removeSet.has(edge.source) && !removeSet.has(edge.target),
          ),
          selectedNodeIds: state.selectedNodeIds.filter(
            (id) => !removeSet.has(id),
          ),
          selectedNodeId:
            selectedNodeId !== null && removeSet.has(selectedNodeId)
              ? null
              : selectedNodeId,
          ...withRecordedHistory(state),
        })
      },

      removeEdge: (edgeId) => {
        const state = get()
        set({
          edges: state.edges.filter((edge) => edge.id !== edgeId),
          ...withRecordedHistory(state),
        })
      },

      removeEdgesByIds: (edgeIds) => {
        if (edgeIds.length === 0) return
        const state = get()
        const edgeSet = new Set(edgeIds)
        set({
          edges: state.edges.filter((edge) => !edgeSet.has(edge.id)),
          ...withRecordedHistory(state),
        })
      },

      updateNodeParam: (nodeId, key, value) => {
        const state = get()
        const { nodes, executionMode } = state
        const newNodes = nodes.map((node) =>
          node.id === nodeId
            ? (() => {
                let nextParams: Record<string, unknown> = {
                  ...node.data.params,
                  [key]: value,
                }

                if (node.type === "matrix") {
                  const normalizedKey = key.toLowerCase()
                  const touchesMatrixShape =
                    normalizedKey === "rows" ||
                    normalizedKey === "row" ||
                    normalizedKey === "cols" ||
                    normalizedKey === "col" ||
                    normalizedKey === "values" ||
                    normalizedKey === "matrix"

                  if (touchesMatrixShape) {
                    const baseMatrix = normalizeMatrixValues(
                      nextParams.values ?? nextParams.matrix,
                    )
                    const currentRows = baseMatrix.length
                    const currentCols = baseMatrix[0]?.length ?? 1
                    const targetRows = clampMatrixDimension(
                      nextParams.rows ?? nextParams.row,
                      currentRows,
                    )
                    const targetCols = clampMatrixDimension(
                      nextParams.cols ?? nextParams.col,
                      currentCols,
                    )

                    nextParams = {
                      ...nextParams,
                      values: resizeMatrixValues(
                        baseMatrix,
                        targetRows,
                        targetCols,
                      ),
                      rows: targetRows,
                      cols: targetCols,
                    }
                  }
                }

                return {
                  ...node,
                  data: {
                    ...node.data,
                    params: nextParams,
                    dirty: true,
                  },
                }
              })()
            : node,
        )
        set({ nodes: newNodes, ...withRecordedHistory(state) })

        if (executionMode === "auto") {
          setTimeout(() => get().runPipeline(), 0)
        }
      },

      selectNode: (nodeId) => {
        if (!nodeId) {
          const nodes = get().nodes.map((node) => ({
            ...node,
            selected: false,
          }))
          set({ nodes, selectedNodeId: null, selectedNodeIds: [] })
          return
        }

        const nodes = get().nodes.map((node) => ({
          ...node,
          selected: node.id === nodeId,
        }))
        set({ nodes, selectedNodeId: nodeId, selectedNodeIds: [nodeId] })
      },

      setSelectedNodeIds: (nodeIds) => {
        const state = get()
        const selectedNodeIds = normalizeSelection(nodeIds)
        const selectedNodeId =
          selectedNodeIds.length === 1 ? selectedNodeIds[0] : null

        if (
          areSameStringArrays(selectedNodeIds, state.selectedNodeIds) &&
          selectedNodeId === state.selectedNodeId
        ) {
          return
        }

        const selectedSet = new Set(selectedNodeIds)
        const nodesNeedSync = state.nodes.some(
          (node) => node.selected !== selectedSet.has(node.id),
        )

        set({
          ...(nodesNeedSync
            ? {
                nodes: state.nodes.map((node) => ({
                  ...node,
                  selected: selectedSet.has(node.id),
                })),
              }
            : {}),
          selectedNodeIds,
          selectedNodeId,
        })
      },

      toggleNodeSelection: (nodeId) => {
        const existing = new Set(get().selectedNodeIds)
        if (existing.has(nodeId)) {
          existing.delete(nodeId)
        } else {
          existing.add(nodeId)
        }
        get().setSelectedNodeIds(Array.from(existing))
      },

      clearSelection: () => {
        get().setSelectedNodeIds([])
      },

      setExecutionMode: (mode) => {
        set({ executionMode: mode })
      },

      setComputeMode: (mode) => {
        set({ computeMode: mode })
      },

      setInteractionMode: (mode) => {
        set({ interactionMode: mode })
      },

      toggleSidebar: () => {
        set({ sidebarOpen: !get().sidebarOpen })
      },

      togglePresets: () => {
        set({ presetsOpen: !get().presetsOpen })
      },

      openContextMenu: (payload) => {
        set({ contextMenu: { ...payload, visible: true } })
      },

      closeContextMenu: () => {
        set({ contextMenu: { visible: false, x: 0, y: 0, target: "canvas" } })
      },

      dispatchContextAction: (action, nodeId) => {
        const state = get()

        if (action === "copy") {
          if (nodeId) {
            state.setSelectedNodeIds([nodeId])
          }
          state.copySelection()
        } else if (action === "duplicate") {
          if (nodeId) {
            state.setSelectedNodeIds([nodeId])
          }
          state.duplicateSelection()
        } else if (action === "delete") {
          if (nodeId) {
            state.setSelectedNodeIds([nodeId])
          }
          state.deleteSelectedNodes()
        } else if (action === "group") {
          state.groupSelectedNodes()
        } else if (action === "ungroup") {
          if (nodeId) {
            state.ungroupNode(nodeId)
          }
        } else if (action === "copy_all") {
          state.copySelection()
        } else if (action === "duplicate_all") {
          state.duplicateSelection()
        } else if (action === "delete_all") {
          state.deleteSelectedNodes()
        } else if (action === "copy_group") {
          if (nodeId) {
            state.setSelectedNodeIds([nodeId])
          }
          state.copySelection()
        } else if (action === "delete_group") {
          if (nodeId) {
            state.setSelectedNodeIds([nodeId])
            state.deleteSelectedNodes()
          }
        } else if (action === "run_group") {
          if (nodeId) {
            state.runGroupNodes(nodeId)
          }
        }

        state.closeContextMenu()
      },

      renameNode: (nodeId, name) => {
        const trimmedName = name.trim()
        if (!trimmedName) return

        const state = get()
        const targetExists = state.nodes.some((node) => node.id === nodeId)
        if (!targetExists) return

        set({
          nodes: state.nodes.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, label: trimmedName } }
              : node,
          ),
          ...withRecordedHistory(state),
        })
      },

      deleteSelectedNodes: () => {
        const state = get()
        const expandedNodeIds = collectExpandedSelection(
          state.nodes,
          state.selectedNodeIds,
        )
        if (expandedNodeIds.length === 0) return

        const removeSet = new Set(expandedNodeIds)
        set({
          nodes: state.nodes.filter((node) => !removeSet.has(node.id)),
          edges: state.edges.filter(
            (edge) =>
              !removeSet.has(edge.source) && !removeSet.has(edge.target),
          ),
          selectedNodeId: null,
          selectedNodeIds: [],
          ...withRecordedHistory(state),
        })
      },

      copySelection: () => {
        const state = get()
        const selectedNodeIds =
          state.selectedNodeIds.length > 0
            ? state.selectedNodeIds
            : state.selectedNodeId
              ? [state.selectedNodeId]
              : []

        const expandedNodeIds = collectExpandedSelection(
          state.nodes,
          selectedNodeIds,
        )
        if (expandedNodeIds.length === 0) return

        const selectedSet = new Set(expandedNodeIds)
        const nodes = clone(
          state.nodes.filter((node) => selectedSet.has(node.id)),
        )
        const edges = clone(
          state.edges.filter(
            (edge) =>
              selectedSet.has(edge.source) && selectedSet.has(edge.target),
          ),
        )

        set({ clipboard: { nodes, edges } })
      },

      pasteClipboard: () => {
        const state = get()
        if (!state.clipboard || state.clipboard.nodes.length === 0) return

        const idMap = new Map<string, string>()
        for (const node of state.clipboard.nodes) {
          idMap.set(node.id, generateNodeId(String(node.type ?? "node")))
        }

        const offset = 40
        const pastedNodes: MathNode[] = state.clipboard.nodes.map((node) => {
          const nextId = idMap.get(node.id)!
          const remappedParentId = node.parentId
            ? idMap.get(node.parentId)
            : undefined

          return {
            ...clone(node),
            id: nextId,
            parentId: remappedParentId,
            position: {
              x: node.position.x + offset,
              y: node.position.y + offset,
            },
            selected: true,
          }
        })

        const pastedEdges: MathEdge[] = state.clipboard.edges
          .map((edge) => {
            const source = idMap.get(edge.source)
            const target = idMap.get(edge.target)
            if (!source || !target) return null
            return {
              ...clone(edge),
              id: generateNodeId("edge"),
              source,
              target,
              type: "removable",
            } as MathEdge
          })
          .filter((edge): edge is MathEdge => edge !== null)

        const selectedNodeIds = pastedNodes.map((node) => node.id)
        const selectedSet = new Set(selectedNodeIds)

        set({
          nodes: [
            ...state.nodes.map((node) => ({ ...node, selected: false })),
            ...pastedNodes,
          ],
          edges: [...state.edges, ...pastedEdges],
          selectedNodeIds,
          selectedNodeId:
            selectedNodeIds.length === 1 ? selectedNodeIds[0] : null,
          ...withRecordedHistory(state),
        })

        void selectedSet
      },

      duplicateSelection: () => {
        get().copySelection()
        get().pasteClipboard()
      },

      groupSelectedNodes: () => {
        const state = get()
        const selectedNodeIds = state.selectedNodeIds.filter((nodeId) => {
          const node = state.nodes.find((n) => n.id === nodeId)
          return node && node.type !== "group"
        })

        const byId = new Map(state.nodes.map((node) => [node.id, node]))
        const selectedSet = new Set(selectedNodeIds)
        const topLevelSelectedNodeIds = selectedNodeIds.filter((nodeId) => {
          let parentId = byId.get(nodeId)?.parentId
          while (parentId) {
            if (selectedSet.has(parentId)) {
              return false
            }
            parentId = byId.get(parentId)?.parentId
          }
          return true
        })

        if (topLevelSelectedNodeIds.length < 2) return

        const selectedNodes = state.nodes.filter((node) =>
          topLevelSelectedNodeIds.includes(node.id),
        )
        if (selectedNodes.length < 2) return

        const selectedAbs = selectedNodes.map((node) => {
          const abs = getAbsoluteNodePosition(node, byId)
          return {
            id: node.id,
            x: abs.x,
            y: abs.y,
            width: node.width ?? 220,
            height: node.height ?? 120,
          }
        })

        const minX = Math.min(...selectedAbs.map((node) => node.x))
        const minY = Math.min(...selectedAbs.map((node) => node.y))
        const maxX = Math.max(...selectedAbs.map((node) => node.x + node.width))
        const maxY = Math.max(
          ...selectedAbs.map((node) => node.y + node.height),
        )

        const padding = 24
        const groupId = generateNodeId("group")
        const groupPosition = { x: minX - padding, y: minY - padding }
        const groupWidth = Math.max(220, maxX - minX + padding * 2)
        const groupHeight = Math.max(140, maxY - minY + padding * 2)

        const groupNode: MathNode = {
          id: groupId,
          type: "group",
          position: groupPosition,
          style: {
            width: groupWidth,
            height: groupHeight,
            background: "transparent",
            border: "none",
            padding: 0,
          },
          data: {
            ...createNodeData("group"),
            params: {
              width: groupWidth,
              height: groupHeight,
            },
          },
          selected: true,
          draggable: true,
        }

        const topLevelSelectedSet = new Set(topLevelSelectedNodeIds)
        const selectedAbsById = new Map(
          selectedAbs.map((node) => [node.id, node]),
        )
        const nodes = state.nodes.map((node) => {
          if (!topLevelSelectedSet.has(node.id)) {
            return { ...node, selected: false }
          }

          const abs = selectedAbsById.get(node.id)
          if (!abs) {
            return { ...node, selected: false }
          }

          return {
            ...node,
            parentId: groupId,
            extent: "parent" as const,
            position: {
              x: abs.x - groupPosition.x,
              y: abs.y - groupPosition.y,
            },
            selected: false,
          }
        })

        set({
          nodes: [groupNode, ...nodes],
          selectedNodeIds: [groupId],
          selectedNodeId: groupId,
          ...withRecordedHistory(state),
        })
      },

      ungroupNode: (groupId) => {
        const state = get()
        const groupNode = state.nodes.find((node) => node.id === groupId)
        if (!groupNode) return

        const children = state.nodes.filter((node) => node.parentId === groupId)
        if (children.length === 0) {
          set({
            nodes: state.nodes.filter((node) => node.id !== groupId),
            ...withRecordedHistory(state),
          })
          return
        }

        const childIds = children.map((node) => node.id)

        const nodes = state.nodes
          .filter((node) => node.id !== groupId)
          .map((node) => {
            if (node.parentId !== groupId) {
              return { ...node, selected: false }
            }

            return {
              ...node,
              parentId: undefined,
              extent: undefined,
              position: {
                x: groupNode.position.x + node.position.x,
                y: groupNode.position.y + node.position.y,
              },
              selected: true,
            }
          })

        set({
          nodes,
          selectedNodeIds: childIds,
          selectedNodeId: childIds.length === 1 ? childIds[0] : null,
          ...withRecordedHistory(state),
        })
      },

      undo: () => {
        const state = get()
        if (state.historyPast.length === 0) return

        const previous = state.historyPast[state.historyPast.length - 1]
        const current = createHistorySnapshot(state)

        set({
          nodes: clone(previous.nodes),
          edges: clone(previous.edges),
          selectedNodeId: previous.selectedNodeId,
          selectedNodeIds: [...previous.selectedNodeIds],
          historyPast: state.historyPast.slice(0, -1),
          historyFuture: [current, ...state.historyFuture].slice(
            0,
            MAX_HISTORY_ENTRIES,
          ),
        })
      },

      redo: () => {
        const state = get()
        if (state.historyFuture.length === 0) return

        const [next, ...futureTail] = state.historyFuture
        const current = createHistorySnapshot(state)

        set({
          nodes: clone(next.nodes),
          edges: clone(next.edges),
          selectedNodeId: next.selectedNodeId,
          selectedNodeIds: [...next.selectedNodeIds],
          historyPast: [...state.historyPast, current].slice(
            -MAX_HISTORY_ENTRIES,
          ),
          historyFuture: futureTail,
        })
      },

      // ─── Execution ──────────────────────────────────────────
      runPipeline: () => {
        const { nodes } = get()
        set({ isRunning: true })

        const runningNodes = nodes.map((node) => ({
          ...node,
          data: { ...node.data, status: "running" as const },
        }))
        set({ nodes: runningNodes })

        requestAnimationFrame(() => {
          const nowMs = performance.now()
          const hasTimeNode = get().nodes.some((node) => node.type === "time")
          if (hasTimeNode && timeAnimationStartMs === null) {
            timeAnimationStartMs = nowMs
          }
          const elapsedSeconds =
            hasTimeNode && timeAnimationStartMs !== null
              ? (nowMs - timeAnimationStartMs) / 1000
              : 0

          const executableNodes = get()
            .nodes.filter((node) => node.type !== "group")
            .map((node) => {
              if (node.type !== "time") {
                return node
              }

              return {
                ...node,
                data: {
                  ...node.data,
                  params: {
                    ...node.data.params,
                    elapsedSeconds,
                  },
                },
              }
            })
          const executableNodeIds = new Set(
            executableNodes.map((node) => node.id),
          )
          const executableEdges = get().edges.filter(
            (edge) =>
              executableNodeIds.has(edge.source) &&
              executableNodeIds.has(edge.target),
          )

          const result = runPipeline(executableNodes, executableEdges)

          const updatedNodes = get().nodes.map((node) => {
            if (node.type === "group") {
              return {
                ...node,
                data: {
                  ...node.data,
                  dirty: false,
                  status: "success" as const,
                  computeTimeMs: result.totalTimeMs,
                },
              }
            }

            const computed = result.computedValues.get(node.id)
            return {
              ...node,
              data: {
                ...node.data,
                dirty: false,
                status: computed?.error
                  ? ("error" as const)
                  : ("success" as const),
                computeTimeMs: result.totalTimeMs,
              },
            }
          })

          set({
            nodes: updatedNodes,
            computedValues: result.computedValues,
            consoleLogs: [...get().consoleLogs, ...result.logs],
            isRunning: false,
          })
        })
      },

      runPipelineToNode: (nodeId) => {
        const state = get()
        const executableNodes = state.nodes.filter(
          (node) => node.type !== "group",
        )
        const executableNodeIds = new Set(
          executableNodes.map((node) => node.id),
        )

        if (!executableNodeIds.has(nodeId)) return

        const executableEdges = state.edges.filter(
          (edge) =>
            executableNodeIds.has(edge.source) &&
            executableNodeIds.has(edge.target),
        )

        const scopedNodeIds = collectUpstreamNodeIds([nodeId], executableEdges)
        if (scopedNodeIds.size === 0) return

        const scopedNodes = executableNodes.filter((node) =>
          scopedNodeIds.has(node.id),
        )
        const scopedEdges = executableEdges.filter(
          (edge) =>
            scopedNodeIds.has(edge.source) && scopedNodeIds.has(edge.target),
        )

        set({
          isRunning: true,
          nodes: state.nodes.map((node) =>
            scopedNodeIds.has(node.id)
              ? {
                  ...node,
                  data: { ...node.data, status: "running" as const },
                }
              : node,
          ),
        })

        requestAnimationFrame(() => {
          const result = runPipeline(scopedNodes, scopedEdges)
          const computedValues = new Map(get().computedValues)
          for (const [computedNodeId, computedValue] of result.computedValues) {
            computedValues.set(computedNodeId, computedValue)
          }

          set({
            nodes: get().nodes.map((node) => {
              if (!scopedNodeIds.has(node.id)) {
                return node
              }

              const computed = result.computedValues.get(node.id)
              return {
                ...node,
                data: {
                  ...node.data,
                  dirty: false,
                  status: computed?.error
                    ? ("error" as const)
                    : ("success" as const),
                  computeTimeMs: result.totalTimeMs,
                },
              }
            }),
            computedValues,
            consoleLogs: [...get().consoleLogs, ...result.logs],
            isRunning: false,
          })
        })
      },

      runGroupNodes: (groupId) => {
        const state = get()
        const childNodes = state.nodes.filter(
          (node) => node.parentId === groupId && node.type !== "group",
        )
        if (childNodes.length === 0) return

        const executableNodes = state.nodes.filter(
          (node) => node.type !== "group",
        )
        const executableNodeIds = new Set(
          executableNodes.map((node) => node.id),
        )
        const executableEdges = state.edges.filter(
          (edge) =>
            executableNodeIds.has(edge.source) &&
            executableNodeIds.has(edge.target),
        )

        const targetIds = childNodes.map((node) => node.id)
        const scopedNodeIds = collectUpstreamNodeIds(targetIds, executableEdges)
        if (scopedNodeIds.size === 0) return

        const scopedNodes = executableNodes.filter((node) =>
          scopedNodeIds.has(node.id),
        )
        const scopedEdges = executableEdges.filter(
          (edge) =>
            scopedNodeIds.has(edge.source) && scopedNodeIds.has(edge.target),
        )

        set({
          isRunning: true,
          nodes: state.nodes.map((node) =>
            scopedNodeIds.has(node.id) || node.id === groupId
              ? {
                  ...node,
                  data: { ...node.data, status: "running" as const },
                }
              : node,
          ),
        })

        requestAnimationFrame(() => {
          const result = runPipeline(scopedNodes, scopedEdges)
          const computedValues = new Map(get().computedValues)
          for (const [computedNodeId, computedValue] of result.computedValues) {
            computedValues.set(computedNodeId, computedValue)
          }

          set({
            nodes: get().nodes.map((node) => {
              if (node.id === groupId) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    dirty: false,
                    status: "success" as const,
                    computeTimeMs: result.totalTimeMs,
                  },
                }
              }

              if (!scopedNodeIds.has(node.id)) {
                return node
              }

              const computed = result.computedValues.get(node.id)
              return {
                ...node,
                data: {
                  ...node.data,
                  dirty: false,
                  status: computed?.error
                    ? ("error" as const)
                    : ("success" as const),
                  computeTimeMs: result.totalTimeMs,
                },
              }
            }),
            computedValues,
            consoleLogs: [...get().consoleLogs, ...result.logs],
            isRunning: false,
          })
        })
      },

      resetNodeStats: () => {
        const state = get()
        set({
          nodes: state.nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              dirty: true,
              status: "idle" as const,
              computeTimeMs: undefined,
            },
          })),
          computedValues: new Map(),
        })
      },

      stepExecute: () => {
        const { nodes, edges, computedValues } = get()

        const executableNodes = nodes.filter((node) => node.type !== "group")
        const executableNodeIds = new Set(
          executableNodes.map((node) => node.id),
        )
        const executableEdges = edges.filter(
          (edge) =>
            executableNodeIds.has(edge.source) &&
            executableNodeIds.has(edge.target),
        )

        const dirtyNode = executableNodes.find((node) => node.data.dirty)
        if (!dirtyNode) {
          set({
            consoleLogs: [
              ...get().consoleLogs,
              {
                id: `log_${Date.now()}`,
                timestamp: Date.now(),
                level: "info",
                message: "All nodes are up to date.",
              },
            ],
          })
          return
        }

        const result = runSingleNode(
          dirtyNode.id,
          executableNodes,
          executableEdges,
          computedValues,
        )

        const updatedNodes = nodes.map((node) => {
          if (node.id === dirtyNode.id) {
            const computed = result.computedValues.get(node.id)
            return {
              ...node,
              data: {
                ...node.data,
                dirty: false,
                status: computed?.error
                  ? ("error" as const)
                  : ("success" as const),
              },
            }
          }
          return node
        })

        set({
          nodes: updatedNodes,
          computedValues: result.computedValues,
          consoleLogs: [...get().consoleLogs, ...result.logs],
        })
      },

      clearConsole: () => set({ consoleLogs: [] }),
      setAppStarted: (started) => set({ appStarted: started }),
      openWorkflowSession: (payload) => {
        const appearance = normalizeWorkflowAppearance(payload)
        createAutosave(payload.id, payload.name)
        suppressNextAutosave = true
        set({
          nodes: clone(payload.nodes),
          edges: clone(payload.edges),
          computedValues: new Map(),
          selectedNodeId: null,
          selectedNodeIds: [],
          historyPast: [],
          historyFuture: [],
          nodeDragInProgress: false,
          currentWorkflowId: payload.id,
          currentWorkflowName: payload.name,
          currentWorkflowAppearance: appearance,
          appStarted: true,
        })
      },
      setCurrentWorkflowName: (name) => set({ currentWorkflowName: name }),
      setCurrentWorkflowAppearance: (appearance) =>
        set((state) => ({
          currentWorkflowAppearance: normalizeWorkflowAppearance({
            ...state.currentWorkflowAppearance,
            ...appearance,
          }),
        })),
      toggleConsole: () => set({ consoleOpen: !get().consoleOpen }),
      setInspectorOpen: (open) => set({ inspectorOpen: open }),
      toggleInspector: () => set({ inspectorOpen: !get().inspectorOpen }),
      showLanding: () => set({ appStarted: false }),
      openGraphModal: (payload) => set({ graphModal: payload }),
      closeGraphModal: () => set({ graphModal: null }),
    }),
    {
      name: "mathflow-prefs",
      partialize: (state) => ({
        appStarted: state.appStarted,
        currentWorkflowId: state.currentWorkflowId,
        currentWorkflowName: state.currentWorkflowName,
        currentWorkflowAppearance: state.currentWorkflowAppearance,
        consoleOpen: state.consoleOpen,
        inspectorOpen: state.inspectorOpen,
        computeMode: state.computeMode,
        executionMode: state.executionMode,
        sidebarOpen: state.sidebarOpen,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error || !state?.appStarted || !state.currentWorkflowId) {
          return
        }

        void loadWorkflow(state.currentWorkflowId)
          .then((workflow) => {
            if (!workflow) {
              state.setAppStarted(false)
              return
            }

            state.openWorkflowSession({
              id: workflow.id,
              name: workflow.name,
              nodes: workflow.nodes,
              edges: workflow.edges,
              tag: workflow.tag,
              gradient: workflow.gradient,
              tone: workflow.tone,
              illustration: workflow.illustration,
            })
          })
          .catch(() => {
            state.setAppStarted(false)
          })
      },
    },
  ),
)

useFlowStore.subscribe((state, previous) => {
  if (!state.currentWorkflowId) {
    cancelAutosave()
    return
  }

  // Skip immediate save when switching/opening workflows.
  if (state.currentWorkflowId !== previous.currentWorkflowId) {
    return
  }

  if (suppressNextAutosave) {
    suppressNextAutosave = false
    return
  }

  const graphChanged =
    state.nodes !== previous.nodes || state.edges !== previous.edges
  const nameChanged = state.currentWorkflowName !== previous.currentWorkflowName
  const appearanceChanged =
    state.currentWorkflowAppearance !== previous.currentWorkflowAppearance

  if (!graphChanged && !nameChanged && !appearanceChanged) {
    return
  }

  try {
    if (!isAutosaveActiveFor(state.currentWorkflowId)) {
      createAutosave(state.currentWorkflowId, state.currentWorkflowName)
    }

    triggerAutosave({
      name: state.currentWorkflowName,
      nodes: state.nodes,
      edges: state.edges,
      tag: state.currentWorkflowAppearance.tag,
      gradient: state.currentWorkflowAppearance.gradient,
      tone: state.currentWorkflowAppearance.tone,
      illustration: state.currentWorkflowAppearance.illustration,
    })
  } catch {
    // Ignore autosave failures to avoid interrupting editor interactions.
  }
})

useFlowStore.subscribe((state, previous) => {
  const hasTimeNode = state.nodes.some((node) => node.type === "time")
  const hadTimeNode = previous.nodes.some((node) => node.type === "time")

  if (!state.appStarted || !hasTimeNode) {
    stopTimeAnimationLoop()
    return
  }

  if (hasTimeNode && !hadTimeNode) {
    timeAnimationStartMs = performance.now()
  }

  if (timeAnimationFrameId !== null) {
    return
  }

  const tick = () => {
    const current = useFlowStore.getState()
    const stillHasTime = current.nodes.some((node) => node.type === "time")
    if (!current.appStarted || !stillHasTime) {
      stopTimeAnimationLoop()
      return
    }

    if (!current.isRunning) {
      current.runPipeline()
    }

    timeAnimationFrameId = requestAnimationFrame(tick)
  }

  timeAnimationFrameId = requestAnimationFrame(tick)
})
