import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

type ShortcutItem = {
  keys: string[]
  action: string
}

const shortcutItems: ShortcutItem[] = [
  { keys: ["Space", "hold"], action: "Temporary pan mode" },
  { keys: ["Delete"], action: "Delete selected node(s)" },
  { keys: ["Ctrl/Cmd", "C"], action: "Copy selected node(s)" },
  { keys: ["Ctrl/Cmd", "V"], action: "Paste copied node(s)" },
  { keys: ["Ctrl/Cmd", "Z"], action: "Undo" },
  { keys: ["Ctrl/Cmd", "Y"], action: "Redo" },
  { keys: ["Ctrl/Cmd", "G"], action: "Group selected nodes" },
  { keys: ["Ctrl/Cmd", "Shift", "G"], action: "Ungroup selected node" },
]

interface ShortcutsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ShortcutsModal({
  open,
  onOpenChange,
}: ShortcutsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-135 p-5 gap-6">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Quickly navigate and create with these shortcuts.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col">
          {shortcutItems.map((shortcut) => (
            <div
              key={shortcut.action}
              className="flex items-center justify-between px-3 mb-2"
            >
              <span className="text-sm text-muted-foreground">
                {shortcut.action}
              </span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, index) => (
                  <React.Fragment key={`${shortcut.action}-${key}-${index}`}>
                    <span className="rounded border bg-popover px-2 py-1 font-mono text-xs text-foreground">
                      {key}
                    </span>
                    {index < shortcut.keys.length - 1 ? (
                      <span className="text-xs text-muted-foreground">+</span>
                    ) : null}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
