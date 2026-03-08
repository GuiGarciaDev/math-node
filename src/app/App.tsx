import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ReactFlowProvider } from "@xyflow/react"
import { LandingPage } from "./routes/LandingPage"
import { Sidebar } from "../features/sidebar/Sidebar"
import { FlowCanvas } from "../features/flow/FlowCanvas"
import { GraphModal } from "../features/flow/GraphModal"
import { FlowShortcuts } from "../features/flow/FlowShortcuts"
import { Inspector } from "../features/inspector/Inspector"
import { Console } from "../features/console/Console"
import { DesignSystemPreview } from "./layout/DesignSystemPreview"
import { useFlowStore } from "../features/flow/store/flowStore"
import type { AppRouteName } from "../types"

const FLOW_ROUTE: AppRouteName = "FlowCanvasPage"
const LANDING_ROUTE: AppRouteName = "landingPage"

const routeTitles: Record<AppRouteName, string> = {
  landingPage: "Landing",
  FlowCanvasPage: "Flow Canvas",
  Settings: "Settings",
}

const App: React.FC = () => {
  const currentWorkflowId = useFlowStore((s) => s.currentWorkflowId)
  const inspectorOpen = useFlowStore((s) => s.inspectorOpen)
  const toggleInspector = useFlowStore((s) => s.toggleInspector)
  const sidebarOpen = useFlowStore((s) => s.sidebarOpen)
  const presetsOpen = useFlowStore((s) => s.presetsOpen)
  const togglePresets = useFlowStore((s) => s.togglePresets)
  const lastAutoRoutedWorkflowId = useRef<string | null>(null)
  const [currentRoute, setCurrentRoute] = useState<AppRouteName>(() =>
    useFlowStore.getState().currentWorkflowId ? FLOW_ROUTE : LANDING_ROUTE,
  )

  const handleRouteChange = useCallback((route: AppRouteName) => {
    setCurrentRoute(route)
  }, [])

  useEffect(() => {
    if (!currentWorkflowId) {
      lastAutoRoutedWorkflowId.current = null
      return
    }

    // Auto-route only when a workflow id appears/changes (rehydration/open).
    if (lastAutoRoutedWorkflowId.current === currentWorkflowId) {
      return
    }

    lastAutoRoutedWorkflowId.current = currentWorkflowId
    if (currentRoute === LANDING_ROUTE) {
      setCurrentRoute(FLOW_ROUTE)
    }
  }, [currentRoute, currentWorkflowId])

  const isFlowRoute = currentRoute === FLOW_ROUTE
  const isSettingsRoute = currentRoute === "Settings"
  const settingsTitle = useMemo(() => routeTitles.Settings, [])

  return (
    <>
      <LandingPage
        currentRoute={currentRoute}
        onRouteChange={handleRouteChange}
      />

      <div
        className={`flex h-screen w-full flex-col transition-opacity duration-500 ${
          isFlowRoute
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="relative flex flex-1 overflow-hidden">
          <Sidebar collapsed={!sidebarOpen} onRouteChange={handleRouteChange} />

          <div className="relative flex flex-1 flex-col overflow-hidden">
            <div className="relative flex-1 overflow-hidden">
              <ReactFlowProvider>
                <FlowCanvas />
                <FlowShortcuts />
              </ReactFlowProvider>

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

      {isSettingsRoute && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/45 p-4">
          <div className="w-[min(720px,96vw)] rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 text-[var(--text-primary)] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <div className="mb-2 text-lg font-semibold">{settingsTitle}</div>
            <p className="mb-5 text-sm text-[var(--text-muted)]">
              Route controller is active in App.tsx. Add your settings panels
              here when ready.
            </p>
            <button
              type="button"
              onClick={() => handleRouteChange(FLOW_ROUTE)}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-tertiary)]"
            >
              Back to Canvas
            </button>
          </div>
        </div>
      )}

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
