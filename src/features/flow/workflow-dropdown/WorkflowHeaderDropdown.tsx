import { useState } from "react"
import { motion } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Download, House, Upload } from "lucide-react"
import {
  dropdownContentVariants,
  dropdownItemVariants,
} from "@/animations/dropdownAnimations"
import EditableWorkflowTitle from "./EditableWorkflowTitle"

interface WorkflowHeaderDropdownProps {
  workflowName: string
  onRenameWorkflow: (name: string) => void
  onBackHome: () => void
}

export default function WorkflowHeaderDropdown({
  workflowName,
  onRenameWorkflow,
  onBackHome,
}: WorkflowHeaderDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isTitleEditing, setIsTitleEditing] = useState(false)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div
          tabIndex={0}
          aria-label="Open workflow menu"
          className="group pointer-events-auto flex w-fit max-w-56 h-10 items-center rounded-xl border border-border bg-card pr-3 transition-all duration-150 hover:border-accent"
        >
          <div className="flex h-9 items-center justify-center rounded-l-2xl bg-transparent text-sm font-semibold transition duration-150 hover:brightness-150">
            <span className="shrink-0 pl-3 pr-0.5 text-lg">Σ</span>
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="mr-1 inline-flex shrink-0 text-(--text-muted)"
              aria-hidden
            >
              <ChevronDown className="h-4 w-4" />
            </motion.span>
          </div>

          <div className="ml-2 max-w-40 w-fit">
            <EditableWorkflowTitle
              value={workflowName}
              onCommit={onRenameWorkflow}
              onEditingChange={setIsTitleEditing}
            />
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        forceMount
        align="start"
        sideOffset={8}
        className="w-56 rounded-2xl bg-card p-1.5 text-card-foreground shadow-[0_18px_40px_rgba(0,0,0,0.32)] backdrop-blur-xl data-[state=open]:animate-none data-[state=closed]:animate-none"
      >
        <motion.div
          variants={dropdownContentVariants}
          initial="initial"
          animate={isOpen ? "animate" : "exit"}
        >
          <motion.div variants={dropdownItemVariants}>
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault()
                onBackHome()
              }}
              className="rounded-xl px-3 py-2 font-medium"
            >
              <House className="h-4 w-4" />
              Back to home
            </DropdownMenuItem>
          </motion.div>

          <DropdownMenuSeparator className="my-1 bg-muted" />

          <motion.div variants={dropdownItemVariants}>
            <DropdownMenuItem
              disabled
              className="rounded-xl px-3 py-2 font-medium"
            >
              <Upload className="h-4 w-4" />
              Import (soon)
            </DropdownMenuItem>
          </motion.div>

          <motion.div variants={dropdownItemVariants}>
            <DropdownMenuItem
              disabled
              className="rounded-xl px-3 py-2 font-medium"
            >
              <Download className="h-4 w-4" />
              Export (soon)
            </DropdownMenuItem>
          </motion.div>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
