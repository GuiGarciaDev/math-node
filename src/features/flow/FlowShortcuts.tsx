import React, { useEffect, useRef } from "react"
import { useFlowStore } from "./store/flowStore"

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
  const undo = useFlowStore((s) => s.undo)
  const redo = useFlowStore((s) => s.redo)
  const interactionMode = useFlowStore((s) => s.interactionMode)
  const setInteractionMode = useFlowStore((s) => s.setInteractionMode)

  const previousInteractionModeRef = useRef(interactionMode)
  const temporaryPanActiveRef = useRef(false)

  useEffect(() => {
    if (!temporaryPanActiveRef.current) {
      previousInteractionModeRef.current = interactionMode
    }
  }, [interactionMode])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTextInputFocused()) return

      if (event.code === "Space") {
        if (event.repeat || temporaryPanActiveRef.current) return
        event.preventDefault()
        previousInteractionModeRef.current = interactionMode
        temporaryPanActiveRef.current = true
        setInteractionMode("pan")
        return
      }

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

      if (key === "z") {
        event.preventDefault()
        undo()
      } else if (key === "y") {
        event.preventDefault()
        redo()
      } else if (key === "c") {
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

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code !== "Space") return
      if (!temporaryPanActiveRef.current) return

      event.preventDefault()
      temporaryPanActiveRef.current = false
      setInteractionMode(previousInteractionModeRef.current)
    }

    const onWindowBlur = () => {
      if (!temporaryPanActiveRef.current) return
      temporaryPanActiveRef.current = false
      setInteractionMode(previousInteractionModeRef.current)
    }

    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    window.addEventListener("blur", onWindowBlur)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
      window.removeEventListener("blur", onWindowBlur)
    }
  }, [
    copySelection,
    deleteSelectedNodes,
    groupSelectedNodes,
    interactionMode,
    pasteClipboard,
    redo,
    selectedNodeIds,
    setInteractionMode,
    undo,
    ungroupNode,
  ])

  return null
})

FlowShortcuts.displayName = "FlowShortcuts"
