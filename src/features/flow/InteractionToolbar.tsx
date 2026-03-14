import React from "react"
import type { InteractionMode } from "../../types"
import { useFlowStore } from "./store/flowStore"
import { MdPanTool } from "react-icons/md"
import { FaMousePointer } from "react-icons/fa"
import { HiScissors } from "react-icons/hi2"
import { IoGrid } from "react-icons/io5"
import type { IconType } from "react-icons"
import { Button } from "../../components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip"
import { cn } from "../../lib/utils"

type ToolbarItem = {
  mode?: InteractionMode
  id: string
  label: string
  icon: IconType
}

const items: ToolbarItem[] = [
  { id: "select", mode: "select", label: "Select Mode", icon: FaMousePointer },
  { id: "pan", mode: "pan", label: "Pan Mode", icon: MdPanTool },
  { id: "cut", mode: "cut", label: "Cut Connections", icon: HiScissors },
  { id: "presets", label: "Presets", icon: IoGrid },
]

export const InteractionToolbar: React.FC = React.memo(() => {
  const interactionMode = useFlowStore((s) => s.interactionMode)
  const setInteractionMode = useFlowStore((s) => s.setInteractionMode)
  const togglePresets = useFlowStore((s) => s.togglePresets)

  return (
    <TooltipProvider>
      <div className="absolute left-3 top-1/2 z-40 p-2 -translate-y-1/2 flex flex-col gap-1.5 rounded-lg bg-card border border-border ">
        {items.map((item) => {
          const active = item.mode ? interactionMode === item.mode : false

          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="icon"
                  size="icon"
                  title={item.label}
                  onClick={() => {
                    if (item.mode) {
                      setInteractionMode(item.mode)
                    } else if (item.id === "presets") {
                      togglePresets()
                    }
                  }}
                  className={cn(
                    "h-9 w-9 rounded-md border-transparent shadow-none",
                    active
                      ? "scale-[1.03] border-primary/60 bg-primary/30"
                      : "hover:brightness-125 hover:text-foreground",
                  )}
                >
                  <item.icon />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
})

InteractionToolbar.displayName = "InteractionToolbar"
