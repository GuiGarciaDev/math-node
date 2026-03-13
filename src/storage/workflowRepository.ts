import type { MathEdge, MathNode } from "../types"
import { compressWorkflow, decompressWorkflow } from "./compression"
import { workflowDB, type WorkflowRecord } from "./db"
import {
  type WorkflowAppearance,
  normalizeWorkflowAppearance,
} from "@/utils/workflowAppearance"

export interface WorkflowGraph {
  nodes: MathNode[]
  edges: MathEdge[]
}

export interface WorkflowInput extends WorkflowGraph {
  id: string
  name: string
  createdAt?: number
  updatedAt?: number
  tag?: string
  gradient?: string
  tone?: string
  preview?: WorkflowAppearance["preview"]
}

export interface Workflow extends WorkflowGraph, WorkflowAppearance {
  id: string
  type: "workflow"
  name: string
  createdAt: number
  updatedAt: number
}

export interface WorkflowSummary extends WorkflowAppearance {
  id: string
  type: "workflow"
  name: string
  createdAt: number
  updatedAt: number
}

function toSummary(record: WorkflowRecord): WorkflowSummary {
  const appearance = normalizeWorkflowAppearance(record)

  return {
    id: record.id,
    type: "workflow",
    name: record.name,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    tag: appearance.tag,
    gradient: appearance.gradient,
    tone: appearance.tone,
    preview: appearance.preview,
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
  const appearance = normalizeWorkflowAppearance({
    ...(existing
      ? {
          tag: existing.tag,
          gradient: existing.gradient,
          tone: existing.tone,
          preview: existing.preview,
        }
      : {}),
    ...workflow,
  })

  const record: WorkflowRecord = {
    id: workflow.id,
    name: workflow.name,
    createdAt,
    updatedAt: now,
    tag: appearance.tag,
    gradient: appearance.gradient,
    tone: appearance.tone,
    preview: appearance.preview,
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

  const appearance = normalizeWorkflowAppearance({
    tag: workflow.tag ?? existing.tag,
    gradient: workflow.gradient ?? existing.gradient,
    tone: workflow.tone ?? existing.tone,
    preview: workflow.preview ?? existing.preview,
  })

  const record: WorkflowRecord = {
    id: workflow.id,
    name: workflow.name,
    createdAt: existing.createdAt,
    updatedAt: nextUpdatedAt,
    tag: appearance.tag,
    gradient: appearance.gradient,
    tone: appearance.tone,
    preview: appearance.preview,
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

  const appearance = normalizeWorkflowAppearance(record)

  return {
    id: record.id,
    type: "workflow",
    name: record.name,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    tag: appearance.tag,
    gradient: appearance.gradient,
    tone: appearance.tone,
    preview: appearance.preview,
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
