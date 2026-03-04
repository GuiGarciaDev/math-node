import React, { useEffect } from "react"
import { ReactFlowProvider } from "@xyflow/react"
import { Header } from "./layout/Header"
import { LandingPage } from "./layout/LandingPage"
import { Sidebar } from "../features/sidebar/Sidebar"
import { FlowCanvas } from "../features/flow/FlowCanvas"
import { GraphModal } from "../features/flow/GraphModal"
import { FlowShortcuts } from "../features/flow/FlowShortcuts"
import { Inspector } from "../features/inspector/Inspector"
import { Console } from "../features/console/Console"
import { useFlowStore } from "../features/flow/flowStore"

const App: React.FC = () => {
  const appStarted = useFlowStore((s) => s.appStarted)
  const inspectorOpen = useFlowStore((s) => s.inspectorOpen)
  const toggleInspector = useFlowStore((s) => s.toggleInspector)
  const sidebarOpen = useFlowStore((s) => s.sidebarOpen)
  const toggleSidebar = useFlowStore((s) => s.toggleSidebar)
  const presetsOpen = useFlowStore((s) => s.presetsOpen)
  const togglePresets = useFlowStore((s) => s.togglePresets)
  const theme = useFlowStore((s) => s.theme)

  // Sync theme attribute on mount and changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  return (
    <>
      {!appStarted && <LandingPage />}

      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          opacity: appStarted ? 1 : 0,
          pointerEvents: appStarted ? "auto" : "none",
          transition: "opacity 0.5s ease-out",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <Header />

        <div
          style={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Sidebar collapsed={!sidebarOpen} />

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
              <ReactFlowProvider>
                <FlowCanvas />
                <FlowShortcuts />
              </ReactFlowProvider>

              <button
                onClick={toggleSidebar}
                title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                style={{
                  position: "absolute",
                  left: 6,
                  top: 12,
                  zIndex: 40,
                  width: 24,
                  height: 32,
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                }}
              >
                {sidebarOpen ? "◁" : "▷"}
              </button>

              {/* Inspector Toggle Button — synced transition with panel */}
              <button
                onClick={toggleInspector}
                title={inspectorOpen ? "Hide Inspector" : "Show Inspector"}
                style={{
                  position: "absolute",
                  right: inspectorOpen ? 0 : 0,
                  top: 12,
                  zIndex: 10,
                  width: 24,
                  height: 40,
                  background: "var(--bg-secondary)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid var(--border)",
                  borderRight: inspectorOpen
                    ? "none"
                    : "1px solid var(--border)",
                  borderTopLeftRadius: 6,
                  borderBottomLeftRadius: 6,
                  borderTopRightRadius: inspectorOpen ? 0 : 6,
                  borderBottomRightRadius: inspectorOpen ? 0 : 6,
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  padding: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--text-primary)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-muted)"
                }}
              >
                {inspectorOpen ? "▶" : "◀"}
              </button>
            </div>
            <Console />
          </div>

          {/* Inspector Panel — single transition on width, no inner transform */}
          <div
            style={{
              width: inspectorOpen ? 288 : 0,
              minHeight: "100%",
              overflow: "hidden",
              transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 288,
                height: "100%",
                minHeight: "100%",
              }}
            >
              <Inspector />
            </div>
          </div>
        </div>
      </div>

      {presetsOpen && (
        <div
          onClick={togglePresets}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.45)",
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "min(420px, 92vw)",
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--bg-secondary)",
              padding: 16,
              color: "var(--text-primary)",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              Presets
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Presets panel placeholder. Ready for reusable template flows.
            </div>
          </div>
        </div>
      )}

      <GraphModal />
    </>
  )
}

export default App
