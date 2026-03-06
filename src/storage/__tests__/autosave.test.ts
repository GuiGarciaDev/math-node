import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("../workflowRepository", () => ({
  saveWorkflow: vi.fn(async () => ({
    id: "workflow_1",
    name: "Autosave",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })),
}))

import { saveWorkflow } from "../workflowRepository"
import {
  autosaveDelayMs,
  cancelAutosave,
  createAutosave,
  triggerAutosave,
} from "../autosave"

describe("autosave", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.mocked(saveWorkflow).mockClear()
    cancelAutosave()
  })

  it("debounces repeated trigger calls into a single save", async () => {
    createAutosave("workflow_1", "Debounce Test")

    triggerAutosave({ name: "Debounce Test", nodes: [], edges: [] })
    triggerAutosave({ name: "Debounce Test", nodes: [], edges: [] })
    triggerAutosave({ name: "Debounce Test", nodes: [], edges: [] })

    await vi.advanceTimersByTimeAsync(autosaveDelayMs - 1)
    expect(saveWorkflow).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)
    expect(saveWorkflow).toHaveBeenCalledTimes(1)
  })

  it("saves only after the debounce delay", async () => {
    createAutosave("workflow_1", "Delay Test")
    triggerAutosave({ name: "Delay Test", nodes: [], edges: [] })

    await vi.advanceTimersByTimeAsync(1500)
    expect(saveWorkflow).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(500)
    expect(saveWorkflow).toHaveBeenCalledTimes(1)
  })

  it("cancels pending autosave writes", async () => {
    createAutosave("workflow_1", "Cancel Test")
    triggerAutosave({ name: "Cancel Test", nodes: [], edges: [] })
    cancelAutosave()

    await vi.advanceTimersByTimeAsync(autosaveDelayMs)
    expect(saveWorkflow).not.toHaveBeenCalled()
  })
})
