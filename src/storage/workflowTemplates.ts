import type { MathEdge, MathNode } from "../types"

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  nodes: MathNode[]
  edges: MathEdge[]
}

function createNodeData(
  label: string,
  category: "input" | "arithmetic" | "calculus" | "display",
  inputs: Array<{ name: string; type: "number" | "symbolic"; label: string }>,
  outputs: Array<{ name: string; type: "number" | "symbolic"; label: string }>,
  params: Record<string, unknown>,
) {
  return {
    label,
    category,
    inputs,
    outputs,
    params,
    dirty: true,
    status: "idle" as const,
  }
}

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: "template_quick_add",
    name: "Quick Add",
    description: "Two numeric inputs flowing into an addition node.",
    nodes: [
      {
        id: "template_num_a",
        type: "numberInput",
        position: { x: 80, y: 180 },
        data: createNodeData(
          "Number",
          "input",
          [],
          [{ name: "value", type: "number", label: "number" }],
          { value: "12" },
        ),
      },
      {
        id: "template_num_b",
        type: "numberInput",
        position: { x: 80, y: 320 },
        data: createNodeData(
          "Number",
          "input",
          [],
          [{ name: "value", type: "number", label: "number" }],
          { value: "30" },
        ),
      },
      {
        id: "template_add",
        type: "add",
        position: { x: 360, y: 250 },
        data: createNodeData(
          "Addition",
          "arithmetic",
          [
            { name: "a", type: "number", label: "Input A" },
            { name: "b", type: "number", label: "Input B" },
          ],
          [{ name: "result", type: "number", label: "number" }],
          {},
        ),
      },
    ],
    edges: [
      {
        id: "te_num_a_add",
        source: "template_num_a",
        target: "template_add",
        sourceHandle: "value",
        targetHandle: "a",
      },
      {
        id: "te_num_b_add",
        source: "template_num_b",
        target: "template_add",
        sourceHandle: "value",
        targetHandle: "b",
      },
    ],
  },
  {
    id: "template_derivative_plot",
    name: "Derivative Plot",
    description: "Differentiate a symbolic function and send it to a plot.",
    nodes: [
      {
        id: "template_var",
        type: "variable",
        position: { x: 80, y: 420 },
        data: createNodeData(
          "Variable",
          "input",
          [],
          [{ name: "value", type: "symbolic", label: "Value" }],
          { name: "x" },
        ),
      },
      {
        id: "template_expr",
        type: "expression",
        position: { x: 80, y: 560 },
        data: createNodeData(
          "Expression",
          "input",
          [],
          [{ name: "value", type: "symbolic", label: "f(x)" }],
          { expression: "x^3 - 4x + 1" },
        ),
      },
      {
        id: "template_deriv",
        type: "derivative",
        position: { x: 380, y: 500 },
        data: createNodeData(
          "Derivative",
          "calculus",
          [
            { name: "fn", type: "symbolic", label: "Function" },
            { name: "var", type: "symbolic", label: "Variable" },
          ],
          [{ name: "result", type: "symbolic", label: "f'(x)" }],
          { variable: "x" },
        ),
      },
      {
        id: "template_plot",
        type: "plot",
        position: { x: 700, y: 500 },
        data: createNodeData(
          "Plot",
          "display",
          [{ name: "fn", type: "symbolic", label: "Function" }],
          [],
          { domain: [-10, 10], variable: "x" },
        ),
      },
    ],
    edges: [
      {
        id: "te_var_deriv",
        source: "template_var",
        target: "template_deriv",
        sourceHandle: "value",
        targetHandle: "var",
      },
      {
        id: "te_expr_deriv",
        source: "template_expr",
        target: "template_deriv",
        sourceHandle: "value",
        targetHandle: "fn",
      },
      {
        id: "te_deriv_plot",
        source: "template_deriv",
        target: "template_plot",
        sourceHandle: "result",
        targetHandle: "fn",
      },
    ],
  },
  {
    id: "template_power_chain",
    name: "Power Chain",
    description: "Multiply two numbers and raise the result to a power.",
    nodes: [
      {
        id: "template_mul_a",
        type: "numberInput",
        position: { x: 60, y: 180 },
        data: createNodeData(
          "Number",
          "input",
          [],
          [{ name: "value", type: "number", label: "number" }],
          { value: "3" },
        ),
      },
      {
        id: "template_mul_b",
        type: "numberInput",
        position: { x: 60, y: 320 },
        data: createNodeData(
          "Number",
          "input",
          [],
          [{ name: "value", type: "number", label: "number" }],
          { value: "5" },
        ),
      },
      {
        id: "template_multiply",
        type: "multiply",
        position: { x: 300, y: 250 },
        data: createNodeData(
          "Multiply",
          "arithmetic",
          [
            { name: "a", type: "number", label: "A" },
            { name: "b", type: "number", label: "B" },
          ],
          [{ name: "result", type: "number", label: "Result" }],
          {},
        ),
      },
      {
        id: "template_exp",
        type: "numberInput",
        position: { x: 300, y: 420 },
        data: createNodeData(
          "Number",
          "input",
          [],
          [{ name: "value", type: "number", label: "number" }],
          { value: "2" },
        ),
      },
      {
        id: "template_power",
        type: "power",
        position: { x: 560, y: 280 },
        data: createNodeData(
          "Power",
          "arithmetic",
          [
            { name: "base", type: "number", label: "Base" },
            { name: "exp", type: "number", label: "Exponent" },
          ],
          [{ name: "result", type: "number", label: "Result" }],
          {},
        ),
      },
    ],
    edges: [
      {
        id: "te_mul_a",
        source: "template_mul_a",
        target: "template_multiply",
        sourceHandle: "value",
        targetHandle: "a",
      },
      {
        id: "te_mul_b",
        source: "template_mul_b",
        target: "template_multiply",
        sourceHandle: "value",
        targetHandle: "b",
      },
      {
        id: "te_mul_power",
        source: "template_multiply",
        target: "template_power",
        sourceHandle: "result",
        targetHandle: "base",
      },
      {
        id: "te_exp_power",
        source: "template_exp",
        target: "template_power",
        sourceHandle: "value",
        targetHandle: "exp",
      },
    ],
  },
]

export function cloneTemplateGraph(templateId: string): {
  nodes: MathNode[]
  edges: MathEdge[]
  name: string
} {
  const template = workflowTemplates.find((item) => item.id === templateId)
  if (!template) {
    throw new Error(`Unknown template: ${templateId}`)
  }

  return {
    name: template.name,
    nodes: JSON.parse(JSON.stringify(template.nodes)),
    edges: JSON.parse(JSON.stringify(template.edges)),
  }
}
