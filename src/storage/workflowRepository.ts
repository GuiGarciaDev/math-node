import type { MathEdge, MathNode } from "../types"
import { compressWorkflow, decompressWorkflow } from "./compression"
import { workflowDB, type WorkflowRecord } from "./db"

export interface WorkflowGraph {
  nodes: MathNode[]
  edges: MathEdge[]
}

export interface WorkflowInput extends WorkflowGraph {
  id: string
  name: string
  createdAt?: number
  updatedAt?: number
}

export interface Workflow extends WorkflowGraph {
  id: string
  name: string
  createdAt: number
  updatedAt: number
}

export interface WorkflowSummary {
  id: string
  name: string
  createdAt: number
  updatedAt: number
}

function toSummary(record: WorkflowRecord): WorkflowSummary {
  return {
    id: record.id,
    name: record.name,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  }
}

export function createWorkflowId(): string {
  const randomPart = Math.random().toString(36).slice(2, 10)
  const timePart = Date.now().toString(36)
  return `workflow_${timePart}_${randomPart}`
}

export async function saveWorkflow(
  workflow: WorkflowInput,
): Promise<WorkflowSummary> {
  const now = workflow.updatedAt ?? Date.now()
  const existing = await workflowDB.workflows.get(workflow.id)
  const createdAt = existing?.createdAt ?? workflow.createdAt ?? now

  const record: WorkflowRecord = {
    id: workflow.id,
    name: workflow.name,
    createdAt,
    updatedAt: now,
    data: compressWorkflow({
      nodes: workflow.nodes,
      edges: workflow.edges,
    }),
  }

  await workflowDB.workflows.put(record)
  return toSummary(record)
}

export async function updateWorkflow(
  workflow: WorkflowInput,
): Promise<WorkflowSummary> {
  const existing = await workflowDB.workflows.get(workflow.id)
  if (!existing) {
    throw new Error(`Workflow ${workflow.id} does not exist.`)
  }

  const nextUpdatedAt = workflow.updatedAt ?? Date.now()

  const record: WorkflowRecord = {
    id: workflow.id,
    name: workflow.name,
    createdAt: existing.createdAt,
    updatedAt: nextUpdatedAt,
    data: compressWorkflow({
      nodes: workflow.nodes,
      edges: workflow.edges,
    }),
  }

  await workflowDB.workflows.put(record)
  return toSummary(record)
}

export async function loadWorkflow(id: string): Promise<Workflow | null> {
  const record = await workflowDB.workflows.get(id)
  if (!record) {
    return null
  }

  const graph = decompressWorkflow<WorkflowGraph>(record.data)

  return {
    id: record.id,
    name: record.name,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    nodes: graph.nodes,
    edges: graph.edges,
  }
}

export async function deleteWorkflow(id: string): Promise<void> {
  await workflowDB.workflows.delete(id)
}

export async function listWorkflows(): Promise<WorkflowSummary[]> {
  const records = await workflowDB.workflows
    .orderBy("updatedAt")
    .reverse()
    .toArray()

  return records.map(toSummary)
}
