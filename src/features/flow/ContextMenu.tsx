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

  useEffect(() => {
    if (!menuRef.current) return
    menuRef.current.style.left = `${x}px`
    menuRef.current.style.top = `${y}px`
  }, [x, y])

  return (
    <div
      ref={menuRef}
      className="fixed z-[60] w-44 rounded-[10px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-secondary)_92%,transparent)] p-1.5 shadow-[0_14px_28px_rgba(0,0,0,0.28)] backdrop-blur-md"
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => dispatchContextAction(item.id, contextMenu.nodeId)}
          className="h-[30px] w-full rounded-lg px-2.5 text-left text-xs text-[var(--text-secondary)] transition-colors duration-100 hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
        >
          {item.label}
        </button>
      ))}
    </div>
  )
})

ContextMenu.displayName = "ContextMenu"
