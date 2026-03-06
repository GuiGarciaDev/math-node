import { beforeEach, describe, expect, it } from "vitest"
import type { MathEdge, MathNode } from "../../types"
import { workflowDB } from "../db"
import { createWorkflowId, saveWorkflow } from "../workflowRepository"

describe("workflow repository integration", () => {
  beforeEach(async () => {
    await workflowDB.workflows.clear()
  })

  it("stores compressed data in IndexedDB records", async () => {
    const id = createWorkflowId()
    const nodes: MathNode[] = [
      {
        id: "node_1",
        type: "numberInput",
        position: { x: 10, y: 20 },
        data: {
          label: "Number",
          category: "input",
          inputs: [],
          outputs: [{ name: "value", type: "number", label: "number" }],
          params: { value: "10" },
          dirty: true,
          status: "idle",
        },
      },
    ]

    const edges: MathEdge[] = []

    const workflow = {
      id,
      name: "Compression Integration",
      nodes,
      edges,
    }

    await saveWorkflow(workflow)

    const stored = await workflowDB.workflows.get(id)
    expect(stored).toBeTruthy()
    expect(stored?.data).not.toBe(
      JSON.stringify({
        nodes: workflow.nodes,
        edges: workflow.edges,
      }),
    )
  })
})
