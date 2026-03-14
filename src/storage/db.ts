import Dexie, { type Table } from "dexie"
import type { WorkflowIllustrationId } from "@/utils/workflowAppearance"

export interface WorkflowRecord {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  data: string
  tag?: string
  gradient?: string
  tone?: string
  illustration?: WorkflowIllustrationId
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
    this.version(3).stores({
      workflows: "id, name, updatedAt, tag, preview, illustration",
    })
    this.version(4).stores({
      workflows: "id, name, updatedAt, tag, illustration",
    })
  }
}

export const workflowDB = new WorkflowDB()
