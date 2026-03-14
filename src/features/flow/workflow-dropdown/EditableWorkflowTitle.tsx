import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Input } from "@/components/ui/input"

interface EditableWorkflowTitleProps {
  value: string
  onCommit: (value: string) => void
}

export default function EditableWorkflowTitle({
  value,
  onCommit,
}: EditableWorkflowTitleProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftValue, setDraftValue] = useState(value)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isEditing) return
    const input = inputRef.current
    if (!input) return
    input.focus()
    const length = input.value.length
    input.setSelectionRange(length, length)
  }, [isEditing])

  useEffect(() => {
    if (!isEditing) return

    const handlePointerDownOutside = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (!target) return
      if (wrapperRef.current?.contains(target)) return

      const trimmed = draftValue.trim()
      onCommit(trimmed.length > 0 ? trimmed : "Untitled")
      setIsEditing(false)
    }

    window.addEventListener("pointerdown", handlePointerDownOutside)
    return () => {
      window.removeEventListener("pointerdown", handlePointerDownOutside)
    }
  }, [draftValue, isEditing, onCommit])

  const commit = () => {
    const trimmed = draftValue.trim()
    onCommit(trimmed.length > 0 ? trimmed : "Untitled")
    setIsEditing(false)
  }

  const cancel = () => {
    setDraftValue(value)
    setIsEditing(false)
  }

  const startEditing = () => {
    setDraftValue(value)
    setIsEditing(true)
  }

  return (
    <div ref={wrapperRef} className="flex items-center">
      <AnimatePresence initial={false} mode="wait">
        {isEditing ? (
          <motion.div
            key="workflow-input"
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className="flex h-full w-full items-center"
          >
            <Input
              ref={inputRef}
              value={draftValue}
              onPointerDown={(event) => event.stopPropagation()}
              onChange={(event) => setDraftValue(event.target.value)}
              onBlur={commit}
              onKeyUp={(event) => event.stopPropagation()}
              onKeyDown={(event) => {
                event.stopPropagation()

                if (event.key === "Enter") {
                  event.preventDefault()
                  commit()
                }
                if (event.key === "Escape") {
                  event.preventDefault()
                  cancel()
                }
              }}
              className="h-8 min-w-6 w-fit max-w-36 rounded-none bg-transparent px-2 text-sm font-semibold border-x-0 border-t-0 border-b truncate"
              aria-label="Edit workflow name"
            />
          </motion.div>
        ) : (
          <motion.div
            key="workflow-label"
            role="button"
            tabIndex={0}
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            onClick={(event) => {
              event.stopPropagation()
              startEditing()
            }}
            onPointerDown={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                event.stopPropagation()
                startEditing()
              }
            }}
            className="h-full w-fit truncate text-left text-sm font-semibold text-(--text-primary)"
            title="Click to rename workflow"
          >
            {value}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
