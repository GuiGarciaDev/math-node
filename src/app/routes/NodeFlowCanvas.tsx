import { SidebarProvider } from "@/components/ui/sidebar"
import { Console } from "@/features/console/Console"
import { FlowCanvas } from "@/features/flow/FlowCanvas"
import { FlowShortcuts } from "@/features/flow/FlowShortcuts"
import { useFlowStore } from "@/features/flow/store/flowStore"
import { Inspector } from "@/features/inspector/Inspector"
import { Sidebar } from "@/features/sidebar/Sidebar"
import { Routes } from "@/types/routes-types"
import { ReactFlowProvider } from "@xyflow/react"

interface NodeFlowCanvasProps {
  collapsed: boolean
  setRoute: (route: Routes) => void
}

export default function NodeFlowCanvas({
  setRoute,
  collapsed,
}: NodeFlowCanvasProps) {
  const inspectorOpen = useFlowStore((s) => s.inspectorOpen)
  const toggleInspector = useFlowStore((s) => s.toggleInspector)
  return (
    <div className="flex h-screen w-full flex-col transition-opacity duration-500">
      <SidebarProvider className="relative flex flex-1 overflow-hidden">
        <Sidebar collapsed={collapsed} onRouteChange={setRoute} />
        <main className="relative flex flex-1 flex-col overflow-hidden">
          <div className="relative flex-1 overflow-hidden">
            <ReactFlowProvider>
              <FlowCanvas onRouteChange={setRoute} />
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
          {/* <Console /> */}

          {/* <div
            className={`min-h-full shrink-0 overflow-hidden transition-[width] duration-300 ${
              inspectorOpen ? "w-72" : "w-0"
            }`}
          >
            <div className="h-full min-h-full w-72">
              <Inspector />
            </div>
          </div> */}
        </main>
      </SidebarProvider>

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
  )
}
