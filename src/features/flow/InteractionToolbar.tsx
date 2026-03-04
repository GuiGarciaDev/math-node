import React from "react"
import type { InteractionMode } from "../../types"
import { useFlowStore } from "./flowStore"
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
    <div
      style={{
        position: "absolute",
        left: 12,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 40,
        borderRadius: 14,
        border: "1px solid var(--border)",
        background: "color-mix(in srgb, var(--bg-secondary) 92%, transparent)",
        boxShadow: "0 10px 22px rgba(0,0,0,0.28)",
        backdropFilter: "blur(10px)",
        padding: 8,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
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
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              border: "1px solid transparent",
              background: active
                ? "color-mix(in srgb, var(--accent) 22%, transparent)"
                : "transparent",
              color: active ? "var(--text-primary)" : "var(--text-secondary)",
              cursor: "pointer",
              fontSize: 14,
              transform: active ? "scale(1.03)" : "scale(1)",
              transition:
                "transform 0.12s ease, background 0.12s ease, color 0.12s ease",
            }}
          >
            <item.icon />
          </button>
        )
      })}
    </div>
  )
})

InteractionToolbar.displayName = "InteractionToolbar"
