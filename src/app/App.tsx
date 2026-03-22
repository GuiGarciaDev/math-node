import React from "react"
import { useFlowStore } from "../features/flow/store/flowStore"
import { useUIStore } from "@/features/flow/store/ui-store"
import { Routes } from "@/types/routes-types"
import NodeFlowCanvas from "./routes/NodeFlowCanvas"
import ProjectsPage from "./routes/ProjectsPage"
import IntroductionModal from "../components/modals/IntroductionModal"

const App: React.FC = () => {
  const sidebarOpen = useFlowStore((s) => s.sidebarOpen)
  const currentRoute = useUIStore((s) => s.route)
  const hasHydrated = useUIStore((s) => s.hasHydrated)
  const hasSeenIntroModal = useUIStore((s) => s.hasSeenIntroModal)
  const isIntroModalOpen = useUIStore((s) => s.isIntroModalOpen)
  const openIntroModal = useUIStore((s) => s.openIntroModal)

  function handleRouteChange(route: Routes) {
    useUIStore.setState({ route })
  }

  React.useEffect(() => {
    if (!hasHydrated || hasSeenIntroModal || isIntroModalOpen) {
      return
    }

    openIntroModal()
  }, [hasHydrated, hasSeenIntroModal, isIntroModalOpen, openIntroModal])

  let page: React.ReactNode

  switch (currentRoute) {
    case "PROJECTS_PAGE":
      page = <ProjectsPage />
      break
    case "FLOW_CANVAS_PAGE":
      page = (
        <NodeFlowCanvas collapsed={sidebarOpen} setRoute={handleRouteChange} />
      )
      break
    case "SETTINGS":
      page = <div></div>
      break
    default:
      page = <div></div>
      break
  }

  return (
    <>
      {page}
      <IntroductionModal />
    </>
  )

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
