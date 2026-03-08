import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Sidebar } from "@/features/sidebar/Sidebar"

interface FlowCanvasRouteProps {
  children: React.ReactNode
}

export default function FlowCanvasRoute({ children }: FlowCanvasRouteProps) {
  return (
    <SidebarProvider>
      <Sidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
