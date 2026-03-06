import debounce from "lodash.debounce"
import { saveWorkflow, type WorkflowInput } from "./workflowRepository"

const AUTOSAVE_DELAY_MS = 2000

let activeWorkflowId: string | null = null
let activeWorkflowName = "Untitled"
let debouncedSave: ReturnType<
  typeof debounce<(workflow: Omit<WorkflowInput, "id">) => void>
> | null = null

export function createAutosave(
  workflowId: string,
  workflowName = "Untitled",
): void {
  activeWorkflowId = workflowId
  activeWorkflowName = workflowName

  debouncedSave?.cancel()
  debouncedSave = debounce(async (workflow) => {
    if (!activeWorkflowId) return

    await saveWorkflow({
      id: activeWorkflowId,
      name: workflow.name || activeWorkflowName,
      nodes: workflow.nodes,
      edges: workflow.edges,
    })
  }, AUTOSAVE_DELAY_MS)
}

export function triggerAutosave(workflow: Omit<WorkflowInput, "id">): void {
  if (!debouncedSave) {
    throw new Error(
      "Autosave has not been initialized. Call createAutosave first.",
    )
  }

  if (workflow.name) {
    activeWorkflowName = workflow.name
  }

  debouncedSave(workflow)
}

export function cancelAutosave(): void {
  debouncedSave?.cancel()
}

export const autosaveDelayMs = AUTOSAVE_DELAY_MS
