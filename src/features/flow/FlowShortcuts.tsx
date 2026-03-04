import React, { useEffect } from "react"
import { useFlowStore } from "./flowStore"

function isTextInputFocused() {
  const active = document.activeElement as HTMLElement | null
  if (!active) return false
  const tag = active.tagName.toLowerCase()
  if (tag === "input" || tag === "textarea") return true
  return active.isContentEditable
}

export const FlowShortcuts: React.FC = React.memo(() => {
  const deleteSelectedNodes = useFlowStore((s) => s.deleteSelectedNodes)
  const copySelection = useFlowStore((s) => s.copySelection)
  const pasteClipboard = useFlowStore((s) => s.pasteClipboard)
  const groupSelectedNodes = useFlowStore((s) => s.groupSelectedNodes)
  const selectedNodeIds = useFlowStore((s) => s.selectedNodeIds)
  const ungroupNode = useFlowStore((s) => s.ungroupNode)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTextInputFocused()) return

      const hasSelection = selectedNodeIds.length > 0

      if (event.key === "Delete") {
        if (!hasSelection) return
        event.preventDefault()
        deleteSelectedNodes()
        return
      }

      const ctrl = event.ctrlKey || event.metaKey
      if (!ctrl) return

      const key = event.key.toLowerCase()

      if (key === "c") {
        if (!hasSelection) return
        event.preventDefault()
        copySelection()
      } else if (key === "v") {
        event.preventDefault()
        pasteClipboard()
      } else if (key === "g" && event.shiftKey) {
        event.preventDefault()
        if (selectedNodeIds.length === 1) {
          ungroupNode(selectedNodeIds[0])
        }
      } else if (key === "g") {
        event.preventDefault()
        groupSelectedNodes()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [
    copySelection,
    deleteSelectedNodes,
    groupSelectedNodes,
    pasteClipboard,
    selectedNodeIds,
    ungroupNode,
  ])

  return null
})

FlowShortcuts.displayName = "FlowShortcuts"
