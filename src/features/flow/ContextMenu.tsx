import React, { useCallback, useEffect, useMemo, useRef } from "react"
import type { ContextMenuState } from "../../types"

type MenuItem = {
  id: string
  label: string
}

interface ContextMenuProps {
  contextMenu: ContextMenuState
  onClose: () => void
  onAction: (action: string, nodeId?: string) => void
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

export const ContextMenu: React.FC<ContextMenuProps> = React.memo(
  ({ contextMenu, onClose, onAction }) => {
    const menuRef = useRef<HTMLDivElement | null>(null)

    const items = useMemo(
      () => menuByTarget[contextMenu.target] ?? [],
      [contextMenu.target],
    )

    const menuPosition = useMemo(() => {
      if (!contextMenu.visible || items.length === 0) {
        return { x: 0, y: 0 }
      }

      const menuWidth = 176
      const menuHeight = items.length * 32 + 12

      return {
        x: Math.min(contextMenu.x, window.innerWidth - menuWidth - 8),
        y: Math.min(contextMenu.y, window.innerHeight - menuHeight - 8),
      }
    }, [contextMenu.visible, contextMenu.x, contextMenu.y, items.length])

    const handleAction = useCallback(
      (actionId: string) => {
        onAction(actionId, contextMenu.nodeId)
      },
      [contextMenu.nodeId, onAction],
    )

    useEffect(() => {
      if (!contextMenu.visible) return

      const onPointerDown = (event: MouseEvent) => {
        if (menuRef.current?.contains(event.target as Node)) {
          return
        }
        onClose()
      }

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose()
        }
      }

      window.addEventListener("mousedown", onPointerDown)
      window.addEventListener("keydown", onKeyDown)
      return () => {
        window.removeEventListener("mousedown", onPointerDown)
        window.removeEventListener("keydown", onKeyDown)
      }
    }, [contextMenu.visible, onClose])

    useEffect(() => {
      if (!contextMenu.visible || !menuRef.current) return
      menuRef.current.style.left = `${menuPosition.x}px`
      menuRef.current.style.top = `${menuPosition.y}px`
    }, [contextMenu.visible, menuPosition.x, menuPosition.y])

    if (!contextMenu.visible || items.length === 0) {
      return null
    }

    return (
      <div
        ref={menuRef}
        className="fixed z-[60] w-44 rounded-[10px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-secondary)_92%,transparent)] p-1.5 shadow-[0_14px_28px_rgba(0,0,0,0.28)] backdrop-blur-md"
      >
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleAction(item.id)}
            className="h-[30px] w-full rounded-lg px-2.5 text-left text-xs text-[var(--text-secondary)] transition-colors duration-100 hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
          >
            {item.label}
          </button>
        ))}
      </div>
    )
  },
)

ContextMenu.displayName = "ContextMenu"
