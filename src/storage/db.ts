import Dexie, { type Table } from "dexie"

export interface WorkflowRecord {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  data: string
}

class WorkflowDB extends Dexie {
  workflows!: Table<WorkflowRecord, string>

  constructor() {
    super("workflowDB")
    this.version(1).stores({
      workflows: "id, name, updatedAt",
    })
  }
}

export const workflowDB = new WorkflowDB()
