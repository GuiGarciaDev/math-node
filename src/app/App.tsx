import React, { useCallback, useMemo, useRef, useState } from "react"
import { LandingPage } from "./routes/LandingPage"
import { useFlowStore } from "../features/flow/store/flowStore"
import type { AppRouteName } from "../types"
import { useUIStore } from "@/features/flow/store/ui-store"
import { Routes } from "@/types/routes-types"
import NodeFlowCanvas from "./routes/NodeFlowCanvas"

const App: React.FC = () => {
  const currentWorkflowId = useFlowStore((s) => s.currentWorkflowId)
  const sidebarOpen = useFlowStore((s) => s.sidebarOpen)
  const presetsOpen = useFlowStore((s) => s.presetsOpen)
  const togglePresets = useFlowStore((s) => s.togglePresets)
  const lastAutoRoutedWorkflowId = useRef<string | null>(null)
  const [currentRoute, setCurrentRoute] = useState<Routes>(
    () => (useUIStore.getState().route as Routes) || "LANDING_PAGE",
  )
  const setRoute = useCallback((route: Routes) => {
    useUIStore.setState({ route })
  }, [])

  function handleRouteChange(route: Routes) {
    setRoute(route)
    setCurrentRoute(route)
  }

  switch (currentRoute) {
    case "LANDING_PAGE":
      return (
        <LandingPage currentRoute={currentRoute} setRoute={handleRouteChange} />
      )
    case "FLOW_CANVAS_PAGE":
      return (
        <NodeFlowCanvas collapsed={sidebarOpen} setRoute={handleRouteChange} />
      )
    case "SETTINGS":
      return <div></div>
    default:
      return <div></div>
  }

  // return (
  //   //   {isSettingsRoute && (
  //   //     <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/45 p-4">
  //   //       <div className="w-[min(720px,96vw)] rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 text-[var(--text-primary)] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
  //   //         <div className="mb-2 text-lg font-semibold">{settingsTitle}</div>
  //   //         <p className="mb-5 text-sm text-[var(--text-muted)]">
  //   //           Route controller is active in App.tsx. Add your settings panels
  //   //           here when ready.
  //   //         </p>
  //   //         <button
  //   //           type="button"
  //   //           onClick={() => handleRouteChange(FLOW_ROUTE)}
  //   //           className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-tertiary)]"
  //   //         >
  //   //           Back to Canvas
  //   //         </button>
  //   //       </div>
  //   //     </div>
  //   //   )}

  //   //   {presetsOpen && (
  //   //     <div
  //   //       onClick={togglePresets}
  //   //       className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45"
  //   //     >
  //   //       <div
  //   //         onClick={(event) => event.stopPropagation()}
  //   //         className="w-[min(760px,92vw)] max-h-[88vh] overflow-auto rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-[var(--text-primary)]"
  //   //       >
  //   //         <div className="mb-3 text-sm font-semibold">
  //   //           Design System Preview
  //   //         </div>
  //   //         <DesignSystemPreview />
  //   //       </div>
  //   //     </div>
  //   //   )}

  //   //   <GraphModal />
  //   // </>
  // )
}

export default App
