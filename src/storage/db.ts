import Dexie, { type Table } from "dexie"

export interface WorkflowRecord {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  data: string
  tag?: string
  gradient?: string
  tone?: string
  preview?: "panel" | "orbit" | "bars" | "lattice"
}

class WorkflowDB extends Dexie {
  workflows!: Table<WorkflowRecord, string>

  constructor() {
    super("workflowDB")
    this.version(1).stores({
      workflows: "id, name, updatedAt",
    })
    this.version(2).stores({
      workflows: "id, name, updatedAt, tag, preview",
    })
  }
}

export const workflowDB = new WorkflowDB()
