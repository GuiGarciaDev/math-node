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
} from "../../types"
import { runPipeline, runSingleNode } from "./executionEngine"
import { validateConnection } from "./edgeValidation"

// ─── Node Factory ─────────────────────────────────────────

const nodeDefaults: Record<
  MathNodeType,
  Omit<MathNodeData, "dirty" | "status">
> = {
  numberInput: {
    label: "Number",
    category: "input",
    inputs: [],
    outputs: [{ name: "value", type: "number", label: "Value" }],
    params: { value: 0 },
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
    label: "Add",
    category: "arithmetic",
    inputs: [
      { name: "a", type: "number", label: "A" },
      { name: "b", type: "number", label: "B" },
    ],
    outputs: [{ name: "result", type: "number", label: "Result" }],
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
  sqrt: {
    label: "Square Root",
    category: "arithmetic",
    inputs: [{ name: "value", type: "number", label: "Value" }],
    outputs: [{ name: "result", type: "number", label: "Result" }],
    params: {},
  },
  derivative: {
    label: "Derivative",
    category: "calculus",
    inputs: [
      { name: "fn", type: "symbolic", label: "Function" },
      { name: "var", type: "symbolic", label: "Variable" },
    ],
    outputs: [{ name: "result", type: "symbolic", label: "f'(x)" }],
    params: { variable: "x" },
  },
  integral: {
    label: "Integral",
    category: "calculus",
    inputs: [
      { name: "fn", type: "symbolic", label: "Function" },
      { name: "var", type: "symbolic", label: "Variable" },
    ],
    outputs: [{ name: "result", type: "symbolic", label: "∫f(x)dx" }],
    params: { variable: "x" },
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
    category: "display",
    inputs: [],
    outputs: [{ name: "value", type: "matrix", label: "Matrix" }],
    params: {
      matrix: [
        [0, 0],
        [0, 0],
      ],
      rows: 2,
      cols: 2,
    },
  },
}

let nodeIdCounter = 0
function generateNodeId(): string {
  return `node_${(++nodeIdCounter).toString(36)}_${Date.now().toString(36).slice(-4)}`
}

function createNodeData(type: MathNodeType): MathNodeData {
  const defaults = nodeDefaults[type]
  return {
    ...JSON.parse(JSON.stringify(defaults)),
    dirty: true,
    status: "idle" as const,
  }
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
  consoleLogs: LogEntry[]
  isRunning: boolean
  computeMode: "numeric" | "symbolic"
  consoleOpen: boolean
  inspectorOpen: boolean
  appStarted: boolean
  theme: "dark" | "light"
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
  addNode: (type: MathNodeType, position: { x: number; y: number }) => void
  removeNode: (nodeId: string) => void
  removeEdge: (edgeId: string) => void
  updateNodeParam: (nodeId: string, key: string, value: unknown) => void
  selectNode: (nodeId: string | null) => void
  setExecutionMode: (mode: ExecutionMode) => void
  setComputeMode: (mode: "numeric" | "symbolic") => void

  // Execution
  runPipeline: () => void
  stepExecute: () => void
  clearConsole: () => void
  setAppStarted: (started: boolean) => void
  toggleConsole: () => void
  toggleInspector: () => void
  toggleTheme: () => void
  showLanding: () => void
  openGraphModal: (payload: {
    title: string
    points: Array<{ x: number; y: number }>
    domain: [number, number]
  }) => void
  closeGraphModal: () => void
}

// ─── Default scene ────────────────────────────────────────

const defaultNodes: MathNode[] = [
  {
    id: "num_1",
    type: "numberInput",
    position: { x: 60, y: 200 },
    data: { ...createNodeData("numberInput"), params: { value: 42 } },
  },
  {
    id: "num_2",
    type: "numberInput",
    position: { x: 60, y: 340 },
    data: { ...createNodeData("numberInput"), params: { value: 3.14 } },
  },
  {
    id: "add_1",
    type: "add",
    position: { x: 360, y: 250 },
    data: createNodeData("add"),
  },
  {
    id: "var_1",
    type: "variable",
    position: { x: 60, y: 500 },
    data: { ...createNodeData("variable"), params: { name: "x" } },
  },
  {
    id: "expr_1",
    type: "expression",
    position: { x: 60, y: 620 },
    data: {
      ...createNodeData("expression"),
      params: { expression: "x^3 - 2x + 5" },
    },
  },
  {
    id: "deriv_1",
    type: "derivative",
    position: { x: 400, y: 540 },
    data: createNodeData("derivative"),
  },
  {
    id: "plot_1",
    type: "plot",
    position: { x: 740, y: 500 },
    data: createNodeData("plot"),
  },
]

const defaultEdges: MathEdge[] = [
  {
    id: "e_num1_add",
    source: "num_1",
    target: "add_1",
    sourceHandle: "value",
    targetHandle: "a",
  },
  {
    id: "e_num2_add",
    source: "num_2",
    target: "add_1",
    sourceHandle: "value",
    targetHandle: "b",
  },
  {
    id: "e_var_deriv",
    source: "var_1",
    target: "deriv_1",
    sourceHandle: "value",
    targetHandle: "var",
  },
  {
    id: "e_expr_deriv",
    source: "expr_1",
    target: "deriv_1",
    sourceHandle: "value",
    targetHandle: "fn",
  },
  {
    id: "e_deriv_plot",
    source: "deriv_1",
    target: "plot_1",
    sourceHandle: "result",
    targetHandle: "fn",
  },
]

// ─── Create Store ─────────────────────────────────────────

export const useFlowStore = create<FlowState>()(
  persist(
    (set, get) => ({
      // Initial data
      nodes: defaultNodes,
      edges: defaultEdges,
      computedValues: new Map(),

      // UI State
      executionMode: "manual",
      selectedNodeId: null,
      consoleLogs: [],
      isRunning: false,
      computeMode: "numeric",
      consoleOpen: true,
      inspectorOpen: true,
      appStarted: false,
      theme: "dark" as const,
      graphModal: null,

      // ─── React Flow Handlers ────────────────────────────────
      onNodesChange: (changes) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        })
      },

      onEdgesChange: (changes) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
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
        }

        // Mark target and downstream nodes as dirty
        const newNodes = nodes.map((n) =>
          n.id === connection.target
            ? { ...n, data: { ...n.data, dirty: true } }
            : n,
        )

        set({ edges: [...edges, newEdge], nodes: newNodes })

        // Auto-run if in auto mode
        if (executionMode === "auto") {
          setTimeout(() => get().runPipeline(), 0)
        }
      },

      // ─── Actions ────────────────────────────────────────────
      addNode: (type, position) => {
        const newNode: MathNode = {
          id: generateNodeId(),
          type,
          position,
          data: createNodeData(type),
        }
        set({ nodes: [...get().nodes, newNode] })
      },

      removeNode: (nodeId) => {
        set({
          nodes: get().nodes.filter((n) => n.id !== nodeId),
          edges: get().edges.filter(
            (e) => e.source !== nodeId && e.target !== nodeId,
          ),
          selectedNodeId:
            get().selectedNodeId === nodeId ? null : get().selectedNodeId,
        })
      },

      removeEdge: (edgeId) => {
        set({
          edges: get().edges.filter((e) => e.id !== edgeId),
        })
      },

      updateNodeParam: (nodeId, key, value) => {
        const { nodes, executionMode } = get()
        const newNodes = nodes.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                data: {
                  ...n.data,
                  params: { ...n.data.params, [key]: value },
                  dirty: true,
                },
              }
            : n,
        )
        set({ nodes: newNodes })

        // Auto-run if in auto mode
        if (executionMode === "auto") {
          setTimeout(() => get().runPipeline(), 0)
        }
      },

      selectNode: (nodeId) => {
        set({ selectedNodeId: nodeId })
      },

      setExecutionMode: (mode) => {
        set({ executionMode: mode })
      },

      setComputeMode: (mode) => {
        set({ computeMode: mode })
      },

      // ─── Execution ──────────────────────────────────────────
      runPipeline: () => {
        const { nodes, edges } = get()
        set({ isRunning: true })

        // Mark all nodes as running
        const runningNodes = nodes.map((n) => ({
          ...n,
          data: { ...n.data, status: "running" as const },
        }))
        set({ nodes: runningNodes })

        // Execute (using requestAnimationFrame for visual feedback)
        requestAnimationFrame(() => {
          const result = runPipeline(nodes, edges)

          // Update node statuses and clear dirty flags
          const updatedNodes = get().nodes.map((n) => {
            const computed = result.computedValues.get(n.id)
            return {
              ...n,
              data: {
                ...n.data,
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

      stepExecute: () => {
        const { nodes, edges, computedValues } = get()

        // Find first dirty node in topo order
        const dirtyNode = nodes.find((n) => n.data.dirty)
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

        const result = runSingleNode(dirtyNode.id, nodes, edges, computedValues)

        const updatedNodes = nodes.map((n) => {
          if (n.id === dirtyNode.id) {
            const computed = result.computedValues.get(n.id)
            return {
              ...n,
              data: {
                ...n.data,
                dirty: false,
                status: computed?.error
                  ? ("error" as const)
                  : ("success" as const),
              },
            }
          }
          return n
        })

        set({
          nodes: updatedNodes,
          computedValues: result.computedValues,
          consoleLogs: [...get().consoleLogs, ...result.logs],
        })
      },

      clearConsole: () => set({ consoleLogs: [] }),
      setAppStarted: (started) => set({ appStarted: started }),
      toggleConsole: () => set({ consoleOpen: !get().consoleOpen }),
      toggleInspector: () => set({ inspectorOpen: !get().inspectorOpen }),
      toggleTheme: () => {
        const next = get().theme === "dark" ? "light" : "dark"
        document.documentElement.setAttribute("data-theme", next)
        set({ theme: next })
      },
      showLanding: () => set({ appStarted: false }),
      openGraphModal: (payload) => set({ graphModal: payload }),
      closeGraphModal: () => set({ graphModal: null }),
    }),
    {
      name: "mathflow-prefs",
      partialize: (state) => ({
        appStarted: state.appStarted,
        consoleOpen: state.consoleOpen,
        inspectorOpen: state.inspectorOpen,
        theme: state.theme,
        computeMode: state.computeMode,
        executionMode: state.executionMode,
      }),
    },
  ),
)
