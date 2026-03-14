import { useFlowStore } from "@/features/flow/store/flowStore"
import { MdUndo, MdRedo } from "react-icons/md"

export default function UndoRedoComponent() {
  const undo = useFlowStore((s) => s.undo)
  const redo = useFlowStore((s) => s.redo)
  const canUndo = useFlowStore((s) => s.historyPast.length > 0)
  const canRedo = useFlowStore((s) => s.historyFuture.length > 0)

  return (
    <div className="flex items-center gap-2 border border-border bg-card p-1.5 rounded-md">
      <button
        onClick={undo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
        className="button-pop flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-(--text-secondary) transition-all duration-150 hover:border-border hover:bg-(--bg-tertiary) hover:text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-35"
      >
        <MdUndo />
      </button>

      <button
        onClick={redo}
        disabled={!canRedo}
        title="Redo (Ctrl+Y)"
        className="button-pop flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-(--text-secondary) transition-all duration-150 hover:border-border hover:bg-(--bg-tertiary) hover:text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-35"
      >
        <MdRedo />
      </button>
    </div>
  )
}
