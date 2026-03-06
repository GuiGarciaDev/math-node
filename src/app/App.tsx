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
import { DesignSystemPreview } from "./layout/DesignSystemPreview"
import { useFlowStore } from "../features/flow/store/flowStore"

const App: React.FC = () => {
  const appStarted = useFlowStore((s) => s.appStarted)
  const inspectorOpen = useFlowStore((s) => s.inspectorOpen)
  const toggleInspector = useFlowStore((s) => s.toggleInspector)
  const sidebarOpen = useFlowStore((s) => s.sidebarOpen)
  const toggleSidebar = useFlowStore((s) => s.toggleSidebar)
  const presetsOpen = useFlowStore((s) => s.presetsOpen)
  const togglePresets = useFlowStore((s) => s.togglePresets)
  const theme = useFlowStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  return (
    <>
      {!appStarted && <LandingPage />}

      <div
        className={`flex h-screen w-full flex-col transition-opacity duration-500 ${
          appStarted
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <Header />

        <div className="relative flex flex-1 overflow-hidden">
          <Sidebar collapsed={!sidebarOpen} />

          <div className="relative flex flex-1 flex-col overflow-hidden">
            <div className="relative flex-1 overflow-hidden">
              <ReactFlowProvider>
                <FlowCanvas />
                <FlowShortcuts />
              </ReactFlowProvider>

              <button
                onClick={toggleSidebar}
                title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                className="absolute left-1.5 top-3 z-40 h-8 w-6 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-xs text-[var(--text-muted)] transition-colors duration-150 hover:text-[var(--text-primary)]"
              >
                {sidebarOpen ? "◁" : "▷"}
              </button>

              <button
                onClick={toggleInspector}
                title={inspectorOpen ? "Hide Inspector" : "Show Inspector"}
                className={`absolute right-0 top-3 z-10 flex h-10 w-6 items-center justify-center border border-[var(--border)] bg-[var(--bg-secondary)] text-xs text-[var(--text-muted)] transition-all duration-300 hover:text-[var(--text-primary)] ${
                  inspectorOpen
                    ? "rounded-bl-md rounded-tl-md border-r-0"
                    : "rounded-md"
                }`}
              >
                {inspectorOpen ? "▶" : "◀"}
              </button>
            </div>
            <Console />
          </div>

          <div
            className={`min-h-full shrink-0 overflow-hidden transition-[width] duration-300 ${
              inspectorOpen ? "w-72" : "w-0"
            }`}
          >
            <div className="h-full min-h-full w-72">
              <Inspector />
            </div>
          </div>
        </div>
      </div>

      {presetsOpen && (
        <div
          onClick={togglePresets}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-[min(760px,92vw)] max-h-[88vh] overflow-auto rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-[var(--text-primary)]"
          >
            <div className="mb-3 text-sm font-semibold">
              Design System Preview
            </div>
            <DesignSystemPreview />
          </div>
        </div>
      )}

      <GraphModal />
    </>
  )
}

export default App
