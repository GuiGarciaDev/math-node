import React, { useEffect, useMemo, useRef } from "react"
import { useFlowStore } from "./flowStore"

type MenuItem = {
  id: string
  label: string
}

const menuByTarget: Record<string, MenuItem[]> = {
  node: [
    { id: "copy", label: "Copy" },
    { id: "duplicate", label: "Duplicate" },
    { id: "delete", label: "Delete" },
    { id: "group", label: "Group" },
  ],
  multi: [
    { id: "copy_all", label: "Copy All" },
    { id: "duplicate_all", label: "Duplicate All" },
    { id: "delete_all", label: "Delete All" },
    { id: "group", label: "Group Selected" },
  ],
  group: [
    { id: "ungroup", label: "Ungroup" },
    { id: "copy_group", label: "Copy Group" },
    { id: "delete_group", label: "Delete Group" },
  ],
  canvas: [],
}

export const ContextMenu: React.FC = React.memo(() => {
  const contextMenu = useFlowStore((s) => s.contextMenu)
  const closeContextMenu = useFlowStore((s) => s.closeContextMenu)
  const dispatchContextAction = useFlowStore((s) => s.dispatchContextAction)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!contextMenu.visible) return

    const onPointerDown = (event: MouseEvent) => {
      if (menuRef.current?.contains(event.target as Node)) {
        return
      }
      closeContextMenu()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeContextMenu()
      }
    }

    window.addEventListener("mousedown", onPointerDown)
    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("mousedown", onPointerDown)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [closeContextMenu, contextMenu.visible])

  const items = useMemo(
    () => menuByTarget[contextMenu.target] ?? [],
    [contextMenu.target],
  )

  if (!contextMenu.visible || items.length === 0) {
    return null
  }

  const menuWidth = 176
  const menuHeight = items.length * 32 + 12
  const x = Math.min(contextMenu.x, window.innerWidth - menuWidth - 8)
  const y = Math.min(contextMenu.y, window.innerHeight - menuHeight - 8)

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        left: x,
        top: y,
        zIndex: 60,
        width: menuWidth,
        padding: 6,
        borderRadius: 10,
        background: "color-mix(in srgb, var(--bg-secondary) 92%, transparent)",
        border: "1px solid var(--border)",
        boxShadow: "0 14px 28px rgba(0, 0, 0, 0.28)",
        backdropFilter: "blur(10px)",
      }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => dispatchContextAction(item.id, contextMenu.nodeId)}
          style={{
            width: "100%",
            height: 30,
            borderRadius: 8,
            border: "none",
            background: "transparent",
            color: "var(--text-secondary)",
            fontSize: 12,
            textAlign: "left",
            padding: "0 10px",
            cursor: "pointer",
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.background = "var(--bg-tertiary)"
            event.currentTarget.style.color = "var(--text-primary)"
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.background = "transparent"
            event.currentTarget.style.color = "var(--text-secondary)"
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
})

ContextMenu.displayName = "ContextMenu"
