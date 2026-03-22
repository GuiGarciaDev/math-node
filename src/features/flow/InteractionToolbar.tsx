import React, { useMemo, useState } from "react"
import type { InteractionMode } from "../../types"
import { useFlowStore } from "./store/flowStore"
import { MdPanTool } from "react-icons/md"
import { FaMousePointer } from "react-icons/fa"
import { HiScissors } from "react-icons/hi2"
import { IoGrid } from "react-icons/io5"
import { LuKeyboard } from "react-icons/lu"
import type { IconType } from "react-icons"
import { Button } from "../../components/ui/button"
import { cn } from "../../lib/utils"
import CTooltip from "@/components/CTooltip"
import ShortcutsModal from "@/components/modals/ShortcutsModal"

type ToolbarItem = {
  mode?: InteractionMode
  id: string
  label: string
  icon: IconType
  disabled?: boolean
}

const items: ToolbarItem[] = [
  { id: "select", mode: "select", label: "Select Mode", icon: FaMousePointer },
  { id: "pan", mode: "pan", label: "Pan Mode", icon: MdPanTool },
  { id: "cut", mode: "cut", label: "Cut Connections", icon: HiScissors },
  { id: "shortcuts", label: "Show Shortcuts", icon: LuKeyboard },
  { id: "presets", label: "Presets", icon: IoGrid, disabled: true },
]

export const InteractionToolbar: React.FC = React.memo(() => {
  const interactionMode = useFlowStore((s) => s.interactionMode)
  const setInteractionMode = useFlowStore((s) => s.setInteractionMode)
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false)

  const shortcutsLabel = useMemo(
    () => (isShortcutsModalOpen ? "Hide Shortcuts" : "Show Shortcuts"),
    [isShortcutsModalOpen],
  )

  return (
    <>
      <div className="absolute left-3 top-1/2 z-40 p-2 -translate-y-1/2 flex flex-col gap-1.5 rounded-lg bg-card border border-border ">
        {items.map((item) => {
          const isShortcutButton = item.id === "shortcuts"
          const active = isShortcutButton
            ? isShortcutsModalOpen
            : item.mode
              ? interactionMode === item.mode
              : false
          const tooltipLabel =
            item.id === "shortcuts"
              ? shortcutsLabel
              : item.disabled
                ? `${item.label} (Coming soon)`
                : item.label

          return (
            <CTooltip key={item.id} content={tooltipLabel} side="right">
              <span className="inline-flex">
                <Button
                  variant="icon"
                  size="icon"
                  title={tooltipLabel}
                  disabled={item.disabled}
                  onClick={() => {
                    if (item.mode) {
                      setInteractionMode(item.mode)
                    } else if (item.id === "shortcuts") {
                      setIsShortcutsModalOpen((prev) => !prev)
                    }
                  }}
                  className={cn(
                    "h-9 w-9 rounded-md border-transparent shadow-none",
                    active
                      ? "scale-[1.03] border-primary/60 bg-primary/30"
                      : "hover:brightness-125 hover:text-foreground",
                    item.disabled &&
                      "opacity-40 cursor-not-allowed hover:brightness-100 hover:text-muted-foreground",
                  )}
                >
                  <item.icon />
                </Button>
              </span>
            </CTooltip>
          )
        })}
      </div>

      <ShortcutsModal
        open={isShortcutsModalOpen}
        onOpenChange={setIsShortcutsModalOpen}
      />
    </>
  )
})

InteractionToolbar.displayName = "InteractionToolbar"
