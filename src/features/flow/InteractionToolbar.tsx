import React from "react"
import type { InteractionMode } from "../../types"
import { useFlowStore } from "./store/flowStore"
import { MdPanTool } from "react-icons/md"
import { FaMousePointer } from "react-icons/fa"
import { HiScissors } from "react-icons/hi2"
import { IoGrid } from "react-icons/io5"
import type { IconType } from "react-icons"

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
    <div className="absolute left-3 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-1.5 rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-secondary)_92%,transparent)] p-2 shadow-[0_10px_22px_rgba(0,0,0,0.28)] backdrop-blur-md">
      {items.map((item) => {
        const active = item.mode ? interactionMode === item.mode : false

        return (
          <button
            key={item.id}
            title={item.label}
            onClick={() => {
              if (item.mode) {
                setInteractionMode(item.mode)
              } else if (item.id === "presets") {
                togglePresets()
              }
            }}
            className={`flex h-8 w-8 items-center justify-center rounded-[10px] border border-transparent text-sm transition-all duration-150 ${
              active
                ? "scale-[1.03] bg-[color-mix(in_srgb,var(--accent)_22%,transparent)] text-[var(--text-primary)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <item.icon />
          </button>
        )
      })}
    </div>
  )
})

InteractionToolbar.displayName = "InteractionToolbar"
