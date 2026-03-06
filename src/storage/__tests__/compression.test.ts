import { describe, expect, it } from "vitest"
import { compressWorkflow, decompressWorkflow } from "../compression"

function createWorkflowFixture() {
  return {
    nodes: [
      {
        id: "n1",
        type: "numberInput",
        position: { x: 10, y: 20 },
        data: {
          label: "Number",
          category: "input",
          inputs: [],
          outputs: [{ name: "value", type: "number", label: "number" }],
          params: { value: "42" },
          dirty: true,
          status: "idle",
        },
      },
      {
        id: "n2",
        type: "expression",
        position: { x: 220, y: 120 },
        data: {
          label: "Expression",
          category: "input",
          inputs: [],
          outputs: [{ name: "value", type: "symbolic", label: "f(x)" }],
          params: {
            expression: "(x^2 + 3x + 1)^2",
            nested: {
              tags: ["poly", "nested", "test"],
              metadata: {
                author: "unit-test",
                factors: [1, 2, 3, 4, 5],
              },
            },
          },
          dirty: true,
          status: "idle",
        },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "n1",
        target: "n2",
        sourceHandle: "value",
        targetHandle: "input",
      },
    ],
  }
}

describe("compression", () => {
  it("compresses and decompresses a workflow to the original structure", () => {
    const workflow = createWorkflowFixture()

    const compressed = compressWorkflow(workflow)
    const decompressed = decompressWorkflow<typeof workflow>(compressed)

    expect(decompressed).toEqual(workflow)
  })

  it("reduces size for representative workflow payloads", () => {
    const workflow = {
      nodes: Array.from({ length: 120 }, (_, index) => ({
        id: `node_${index}`,
        type: "numberInput",
        position: { x: index * 12, y: index * 4 },
        data: {
          label: "Number",
          category: "input",
          inputs: [],
          outputs: [{ name: "value", type: "number", label: "number" }],
          params: { value: String(index % 9), repeated: "abcabcabcabcabcabc" },
          dirty: false,
          status: "idle",
        },
      })),
      edges: Array.from({ length: 220 }, (_, index) => ({
        id: `edge_${index}`,
        source: `node_${index % 120}`,
        target: `node_${(index + 3) % 120}`,
        sourceHandle: "value",
        targetHandle: "input",
      })),
    }

    const json = JSON.stringify(workflow)
    const compressed = compressWorkflow(workflow)

    expect(compressed.length).toBeLessThan(json.length)
  })

  it("throws descriptive errors on corrupted compressed data", () => {
    expect(() => decompressWorkflow("not-valid-compressed")).toThrowError(
      /corrupted or invalid/i,
    )
  })
})
