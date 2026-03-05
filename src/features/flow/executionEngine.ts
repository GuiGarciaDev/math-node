// ─── Execution Engine ─────────────────────────────────────
// Graph traversal, topological sorting, and node evaluation.
// Pure, deterministic, side-effect free.

import type { MathNode, MathEdge, ComputedValue, LogEntry } from "../../types"
import {
  parseExpression,
  differentiate,
  integrate,
  simplify,
  formatExpression,
} from "../../lib/math/symbolic"
import { evaluateRange } from "../../lib/math/evaluator"
import {
  evaluateNumberInput,
  evaluateConstant,
  evaluateArithmetic,
  evaluatePower,
  evaluateRoot,
  evaluateTrigonometric,
  evaluateLn,
  evaluateLog,
  evaluateComparator,
} from "../../lib/math/nodeEvaluation"

type ComputedMap = Map<string, ComputedValue>

// ─── Graph Utilities ──────────────────────────────────────

interface AdjacencyInfo {
  adjacency: Map<string, string[]>
  inDegree: Map<string, number>
  edgeMap: Map<string, MathEdge[]> // targetId → edges pointing into it
}

export function buildAdjacencyList(
  nodes: MathNode[],
  edges: MathEdge[],
): AdjacencyInfo {
  const adjacency = new Map<string, string[]>()
  const inDegree = new Map<string, number>()
  const edgeMap = new Map<string, MathEdge[]>()

  for (const node of nodes) {
    adjacency.set(node.id, [])
    inDegree.set(node.id, 0)
    edgeMap.set(node.id, [])
  }

  for (const edge of edges) {
    const neighbors = adjacency.get(edge.source)
    if (neighbors) neighbors.push(edge.target)

    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1)

    const targetEdges = edgeMap.get(edge.target)
    if (targetEdges) targetEdges.push(edge)
  }

  return { adjacency, inDegree, edgeMap }
}

/** Kahn's algorithm for topological sort. Returns null if cycle detected. */
export function topologicalSort(
  nodes: MathNode[],
  edges: MathEdge[],
): string[] | null {
  const { adjacency, inDegree } = buildAdjacencyList(nodes, edges)
  const queue: string[] = []
  const sorted: string[] = []

  for (const [nodeId, degree] of inDegree) {
    if (degree === 0) queue.push(nodeId)
  }

  while (queue.length > 0) {
    const current = queue.shift()!
    sorted.push(current)

    const neighbors = adjacency.get(current) ?? []
    for (const neighbor of neighbors) {
      const newDegree = (inDegree.get(neighbor) ?? 1) - 1
      inDegree.set(neighbor, newDegree)
      if (newDegree === 0) queue.push(neighbor)
    }
  }

  // If not all nodes are in sorted, there's a cycle
  if (sorted.length !== nodes.length) return null
  return sorted
}

/** Check if adding an edge would create a cycle */
export function wouldCreateCycle(
  nodes: MathNode[],
  edges: MathEdge[],
  newSource: string,
  newTarget: string,
): boolean {
  const testEdges: MathEdge[] = [
    ...edges,
    { id: "__test__", source: newSource, target: newTarget },
  ]
  return topologicalSort(nodes, testEdges) === null
}

// ─── Node Evaluation ─────────────────────────────────────

function getInputValues(
  nodeId: string,
  edges: MathEdge[],
  computed: ComputedMap,
  nodes: MathNode[],
): Record<string, ComputedValue | undefined> {
  const inputs: Record<string, ComputedValue | undefined> = {}
  const incomingEdges = edges.filter((e) => e.target === nodeId)

  for (const edge of incomingEdges) {
    const handleId = edge.targetHandle ?? "default"
    inputs[handleId] = computed.get(edge.source)
  }

  // Also map by index for nodes with ordered inputs
  const node = nodes.find((n) => n.id === nodeId)
  if (node?.data.inputs) {
    const inputDefs = node.data.inputs
    const sortedEdges = incomingEdges.sort((a, b) => {
      const aIdx = inputDefs.findIndex((d) => d.name === (a.targetHandle ?? ""))
      const bIdx = inputDefs.findIndex((d) => d.name === (b.targetHandle ?? ""))
      return aIdx - bIdx
    })
    sortedEdges.forEach((edge, i) => {
      if (inputDefs[i]) {
        inputs[inputDefs[i].name] = computed.get(edge.source)
      }
    })
  }

  return inputs
}

function evaluateSingleNode(
  node: MathNode,
  inputs: Record<string, ComputedValue | undefined>,
): ComputedValue {
  const nodeType = node.type ?? ""
  const params = node.data.params

  try {
    switch (nodeType) {
      case "numberInput": {
        try {
          return { value: evaluateNumberInput(params.value), type: "number" }
        } catch (error) {
          return {
            value: undefined,
            type: "number",
            error: error instanceof Error ? error.message : "Invalid number",
          }
        }
      }

      case "constant": {
        const value = evaluateConstant({
          constantKey: params.constantKey,
          decimalPlaces: params.decimalPlaces,
          constantType: params.constantType,
        })
        return { value, type: "number" }
      }

      case "variable": {
        const name = String(params.name ?? "x")
        return { value: name, type: "symbolic" }
      }

      case "expression": {
        const expr = String(params.expression ?? "0")
        const terms = parseExpression(expr)
        return { value: { raw: expr, terms }, type: "symbolic" }
      }

      case "add":
      case "subtract":
      case "multiply":
      case "divide": {
        const result = evaluateArithmetic(
          nodeType,
          inputs["a"]?.value,
          inputs["b"]?.value,
        )
        return { value: result, type: "number" }
      }

      case "power": {
        return {
          value: evaluatePower(inputs["base"]?.value, inputs["exp"]?.value),
          type: "number",
        }
      }

      case "sqrt": {
        return {
          value: evaluateRoot(inputs["value"]?.value, params.degree ?? 2),
          type: "number",
        }
      }

      case "root": {
        return {
          value: evaluateRoot(inputs["value"]?.value, inputs["degree"]?.value),
          type: "number",
        }
      }

      case "trigonometric": {
        const result = evaluateTrigonometric(
          params.operation,
          inputs["value"]?.value,
          params.unit,
        )
        return { value: result, type: "number" }
      }

      case "ln": {
        return { value: evaluateLn(inputs["value"]?.value), type: "number" }
      }

      case "log": {
        return {
          value: evaluateLog(inputs["value"]?.value, inputs["base"]?.value),
          type: "number",
        }
      }

      case "comparator": {
        return {
          value: evaluateComparator(
            params.operator,
            inputs["left"]?.value,
            inputs["right"]?.value,
          ),
          type: "boolean",
        }
      }

      case "derivative": {
        const fnInput = inputs["fn"]
        const varInput = inputs["var"]
        const variable =
          (varInput?.value as string) ?? String(params.variable ?? "x")

        if (!fnInput?.value) {
          return {
            value: undefined,
            type: "symbolic",
            error: "Missing function input",
          }
        }

        let terms
        if (
          typeof fnInput.value === "object" &&
          "terms" in (fnInput.value as Record<string, unknown>)
        ) {
          terms = (
            fnInput.value as { terms: ReturnType<typeof parseExpression> }
          ).terms
        } else if (typeof fnInput.value === "string") {
          terms = parseExpression(fnInput.value)
        } else {
          return {
            value: undefined,
            type: "symbolic",
            error: "Invalid function input",
          }
        }

        const result = simplify(differentiate(terms, variable))
        const formatted = formatExpression(result)
        return {
          value: { raw: formatted, terms: result },
          type: "symbolic",
        }
      }

      case "integral": {
        const fnInput = inputs["fn"]
        const varInput = inputs["var"]
        const variable =
          (varInput?.value as string) ?? String(params.variable ?? "x")

        if (!fnInput?.value) {
          return {
            value: undefined,
            type: "symbolic",
            error: "Missing function input",
          }
        }

        let terms
        if (
          typeof fnInput.value === "object" &&
          "terms" in (fnInput.value as Record<string, unknown>)
        ) {
          terms = (
            fnInput.value as { terms: ReturnType<typeof parseExpression> }
          ).terms
        } else if (typeof fnInput.value === "string") {
          terms = parseExpression(fnInput.value)
        } else {
          return {
            value: undefined,
            type: "symbolic",
            error: "Invalid function input",
          }
        }

        const result = simplify(integrate(terms, variable))
        const formatted = formatExpression(result)
        return {
          value: { raw: formatted, terms: result },
          type: "symbolic",
        }
      }

      case "plot": {
        const fnInput = inputs["fn"]
        if (!fnInput?.value) {
          return {
            value: undefined,
            type: "array",
            error: "Missing function input",
          }
        }

        const domain = (params.domain as [number, number]) ?? [-10, 10]
        let terms: ReturnType<typeof parseExpression>
        const variable = String(params.variable ?? "x")

        if (
          typeof fnInput.value === "object" &&
          "terms" in (fnInput.value as Record<string, unknown>)
        ) {
          const valueObj = fnInput.value as {
            terms?: ReturnType<typeof parseExpression>
            raw?: string
          }
          terms =
            valueObj.terms && valueObj.terms.length > 0
              ? valueObj.terms
              : valueObj.raw
                ? parseExpression(valueObj.raw)
                : []
        } else if (
          typeof fnInput.value === "object" &&
          "raw" in (fnInput.value as Record<string, unknown>)
        ) {
          terms = parseExpression(
            String((fnInput.value as { raw: string }).raw ?? ""),
          )
        } else if (typeof fnInput.value === "string") {
          terms = parseExpression(fnInput.value)
        } else if (typeof fnInput.value === "number") {
          // Constant function
          return {
            value: Array.from({ length: 101 }, (_, i) => ({
              x: domain[0] + (i * (domain[1] - domain[0])) / 100,
              y: fnInput.value as number,
            })),
            type: "array",
          }
        } else {
          return {
            value: undefined,
            type: "array",
            error: "Invalid plot input",
          }
        }

        if (!terms || terms.length === 0) {
          return {
            value: undefined,
            type: "array",
            error: "Invalid function input",
          }
        }

        const points = evaluateRange(terms, variable, domain[0], domain[1], 100)

        const validPoints = points.filter(
          (point) =>
            Number.isFinite(point.x) &&
            Number.isFinite(point.y) &&
            Math.abs(point.y) < 1e8,
        )

        if (validPoints.length === 0) {
          return {
            value: undefined,
            type: "array",
            error: "No plottable points for current domain",
          }
        }
        return { value: validPoints, type: "array" }
      }

      case "matrix": {
        const matrix = (params.matrix as number[][]) ?? [[0]]
        return { value: matrix, type: "matrix" }
      }

      default:
        return {
          value: undefined,
          type: "number",
          error: `Unknown node type: ${nodeType}`,
        }
    }
  } catch (err) {
    return {
      value: undefined,
      type: "number",
      error: err instanceof Error ? err.message : String(err),
    }
  }
}

// ─── Pipeline Runner ──────────────────────────────────────

export interface ExecutionResult {
  computedValues: ComputedMap
  logs: LogEntry[]
  totalTimeMs: number
  error?: string
}

let logCounter = 0
function createLog(level: LogEntry["level"], message: string): LogEntry {
  return {
    id: `log_${++logCounter}_${Date.now()}`,
    timestamp: Date.now(),
    level,
    message,
  }
}

export function runPipeline(
  nodes: MathNode[],
  edges: MathEdge[],
): ExecutionResult {
  const logs: LogEntry[] = []
  const computed: ComputedMap = new Map()
  const startTime = performance.now()

  logs.push(createLog("info", "Initializing computational graph..."))
  logs.push(createLog("info", `${nodes.length} nodes loaded successfully.`))

  // Topological sort
  const sorted = topologicalSort(nodes, edges)
  if (!sorted) {
    logs.push(createLog("error", "Cycle detected in graph! Cannot execute."))
    return {
      computedValues: computed,
      logs,
      totalTimeMs: performance.now() - startTime,
      error: "Cycle detected",
    }
  }

  // Execute in topological order
  for (const nodeId of sorted) {
    const node = nodes.find((n) => n.id === nodeId)
    if (!node) continue

    const nodeStart = performance.now()
    const inputs = getInputValues(nodeId, edges, computed, nodes)

    logs.push(createLog("eval", `Executing ${node.data.label} (${nodeId})...`))

    const result = evaluateSingleNode(node, inputs)
    const nodeTime = performance.now() - nodeStart

    computed.set(nodeId, result)

    if (result.error) {
      logs.push(createLog("error", `${node.data.label}: ${result.error}`))
    } else {
      const valueStr = formatComputedValue(result)
      logs.push(
        createLog(
          "success",
          `${node.data.label} computed in ${nodeTime.toFixed(1)}ms. Result: ${valueStr}`,
        ),
      )
    }
  }

  const totalTime = performance.now() - startTime
  logs.push(
    createLog(
      "info",
      `Pipeline execution complete. Total time: ${totalTime.toFixed(1)}ms.`,
    ),
  )

  return { computedValues: computed, logs, totalTimeMs: totalTime }
}

/** Execute a single node and its upstream dependencies */
export function runSingleNode(
  nodeId: string,
  nodes: MathNode[],
  edges: MathEdge[],
  existingComputed: ComputedMap,
): ExecutionResult {
  const logs: LogEntry[] = []
  const computed = new Map(existingComputed)
  const startTime = performance.now()

  // Find upstream dependencies
  const sorted = topologicalSort(nodes, edges)
  if (!sorted) {
    return {
      computedValues: computed,
      logs: [createLog("error", "Cycle detected")],
      totalTimeMs: 0,
      error: "Cycle detected",
    }
  }

  const targetIdx = sorted.indexOf(nodeId)
  const nodesToRun = sorted.slice(0, targetIdx + 1)

  for (const id of nodesToRun) {
    const node = nodes.find((n) => n.id === id)
    if (!node) continue
    if (!node.data.dirty && computed.has(id) && id !== nodeId) continue

    const inputs = getInputValues(id, edges, computed, nodes)
    const result = evaluateSingleNode(node, inputs)
    computed.set(id, result)

    if (result.error) {
      logs.push(createLog("error", `${node.data.label}: ${result.error}`))
    } else {
      logs.push(createLog("success", `${node.data.label} evaluated.`))
    }
  }

  return {
    computedValues: computed,
    logs,
    totalTimeMs: performance.now() - startTime,
  }
}

function formatComputedValue(cv: ComputedValue): string {
  if (cv.value === undefined) return "undefined"
  if (typeof cv.value === "number") return cv.value.toString()
  if (typeof cv.value === "string") return cv.value
  if (typeof cv.value === "object" && cv.value !== null && "raw" in cv.value) {
    return (cv.value as { raw: string }).raw
  }
  if (Array.isArray(cv.value)) return `[${cv.value.length} points]`
  return JSON.stringify(cv.value)
}
