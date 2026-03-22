import { SidebarProvider } from "@/components/ui/sidebar"
import { FlowCanvas } from "@/features/flow/FlowCanvas"
import { FlowShortcuts } from "@/features/flow/FlowShortcuts"
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
  return (
    <div className="flex h-screen w-full transition-opacity duration-500 overflow-hidden">
      <SidebarProvider className="relative flex flex-1 overflow-hidden">
        <Sidebar collapsed={collapsed} onRouteChange={setRoute} />
        <main className="relative flex flex-1 flex-col overflow-hidden">
          <div className="relative flex-1 overflow-hidden">
            <ReactFlowProvider>
              <FlowCanvas onRouteChange={setRoute} />
              <FlowShortcuts />
            </ReactFlowProvider>
          </div>
          {/* <Console /> */}
        </main>
      </SidebarProvider>

      <Inspector />
    </div>
  )
}
