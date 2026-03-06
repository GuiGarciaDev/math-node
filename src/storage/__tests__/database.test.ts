import { beforeEach, describe, expect, it } from "vitest"
import type { MathEdge, MathNode } from "../../types"
import {
  createWorkflowId,
  deleteWorkflow,
  listWorkflows,
  loadWorkflow,
  saveWorkflow,
} from "../workflowRepository"
import { workflowDB } from "../db"

function createSimpleGraph() {
  const nodes: MathNode[] = [
    {
      id: "n1",
      type: "numberInput",
      position: { x: 30, y: 50 },
      data: {
        label: "Number",
        category: "input",
        inputs: [],
        outputs: [{ name: "value", type: "number", label: "number" }],
        params: { value: "7" },
        dirty: true,
        status: "idle",
      },
    },
  ]

  const edges: MathEdge[] = []

  return {
    nodes,
    edges,
  }
}

describe("workflow database", () => {
  beforeEach(async () => {
    await workflowDB.workflows.clear()
  })

  it("saves workflow records", async () => {
    const id = createWorkflowId()
    const graph = createSimpleGraph()

    await saveWorkflow({ id, name: "My Workflow", ...graph })

    const stored = await workflowDB.workflows.get(id)
    expect(stored).toBeTruthy()
    expect(stored?.id).toBe(id)
    expect(stored?.name).toBe("My Workflow")
  })

  it("loads workflows and restores original structure", async () => {
    const id = createWorkflowId()
    const graph = createSimpleGraph()

    await saveWorkflow({ id, name: "Load Test", ...graph })

    const loaded = await loadWorkflow(id)
    expect(loaded).not.toBeNull()
    expect(loaded?.nodes).toEqual(graph.nodes)
    expect(loaded?.edges).toEqual(graph.edges)
  })

  it("deletes workflows", async () => {
    const id = createWorkflowId()
    const graph = createSimpleGraph()

    await saveWorkflow({ id, name: "Delete Test", ...graph })
    await deleteWorkflow(id)

    const loaded = await loadWorkflow(id)
    expect(loaded).toBeNull()
  })

  it("lists workflows", async () => {
    const graph = createSimpleGraph()

    await saveWorkflow({ id: createWorkflowId(), name: "A", ...graph })
    await saveWorkflow({ id: createWorkflowId(), name: "B", ...graph })

    const list = await listWorkflows()
    expect(list.length).toBe(2)
  })

  it("saves large workflows (1000 nodes / 2000 edges)", async () => {
    const id = createWorkflowId()

    const nodes: MathNode[] = Array.from({ length: 1000 }, (_, index) => ({
      id: `node_${index}`,
      type: "numberInput",
      position: { x: (index % 50) * 120, y: Math.floor(index / 50) * 80 },
      data: {
        label: "Number",
        category: "input",
        inputs: [],
        outputs: [{ name: "value", type: "number", label: "number" }],
        params: { value: String(index) },
        dirty: false,
        status: "idle",
      },
    }))

    const edges: MathEdge[] = Array.from({ length: 2000 }, (_, index) => ({
      id: `edge_${index}`,
      source: `node_${index % 1000}`,
      target: `node_${(index + 7) % 1000}`,
      sourceHandle: "value",
      targetHandle: "input",
    }))

    await saveWorkflow({ id, name: "Large Graph", nodes, edges })

    const loaded = await loadWorkflow(id)
    expect(loaded).not.toBeNull()
    expect(loaded?.nodes).toHaveLength(1000)
    expect(loaded?.edges).toHaveLength(2000)
  })
})
