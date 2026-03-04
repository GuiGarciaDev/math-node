import React, { useEffect } from "react"
import { useFlowStore } from "./flowStore.ts"
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
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.62)",
        backdropFilter: "blur(4px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "min(980px, 94vw)",
          maxHeight: "88vh",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.45)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: "1px solid var(--border)",
            background: "var(--bg-tertiary)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--category-display)",
                boxShadow: "0 0 10px rgba(20, 174, 92, 0.4)",
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              {graphModal.title}
            </span>
          </div>

          <button
            onClick={closeGraphModal}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--bg-input)",
              color: "var(--text-secondary)",
              cursor: "pointer",
              fontSize: 13,
            }}
            title="Close"
          >
            ✕
          </button>
        </div>

        <div
          style={{
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <PlotChart points={graphModal.points} height={460} />
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
            Domain: [{graphModal.domain[0].toFixed(2)},{" "}
            {graphModal.domain[1].toFixed(2)}]
          </div>
        </div>
      </div>
    </div>
  )
})

GraphModal.displayName = "GraphModal"
