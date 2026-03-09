import React, { useEffect } from "react"
import { useFlowStore } from "./store/flowStore.ts"
import { PlotChart } from "./nodes/PlotChart"

export const GraphModal: React.FC = React.memo(() => {
  const graphModal = useFlowStore((s) => s.graphModal)
  const closeGraphModal = useFlowStore((s) => s.closeGraphModal)

  useEffect(() => {
    if (!graphModal) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeGraphModal()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [closeGraphModal, graphModal])

  if (!graphModal) {
    return null
  }

  return (
    <div
      onClick={closeGraphModal}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-5 backdrop-blur-[4px]"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[88vh] w-[min(980px,94vw)] flex-col overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--bg-secondary)] shadow-[0_24px_64px_rgba(0,0,0,0.45)]"
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-tertiary)] px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-[var(--category-matrix)] shadow-[0_0_10px_rgba(20,174,92,0.4)]" />
            <span className="text-[13px] font-semibold text-[var(--text-primary)]">
              {graphModal.title}
            </span>
          </div>

          <button
            onClick={closeGraphModal}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-input)] text-[13px] text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text-primary)]"
            title="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-2.5 p-4">
          <PlotChart points={graphModal.points} heightClassName="h-[460px]" />
          <div className="text-[11px] text-[var(--text-muted)]">
            Domain: [{graphModal.domain[0].toFixed(2)},{" "}
            {graphModal.domain[1].toFixed(2)}]
          </div>
        </div>
      </div>
    </div>
  )
})

GraphModal.displayName = "GraphModal"
