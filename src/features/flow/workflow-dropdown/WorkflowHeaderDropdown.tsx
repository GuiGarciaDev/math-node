import { useState } from "react"
import { motion } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Download, House, Upload } from "lucide-react"
import {
  dropdownContentVariants,
  dropdownItemVariants,
} from "@/animations/dropdownAnimations"
import EditableWorkflowTitle from "./EditableWorkflowTitle"
import { RiEdit2Line } from "react-icons/ri"
import { cn } from "@/lib/utils"
import { useUIStore } from "../store/ui-store"
import { IconType } from "react-icons"

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
  const setIsWorkflowSheetOpen = useUIStore((s) => s.setWorkflowSheetOpen)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div
          tabIndex={0}
          aria-label="Open workflow menu"
          className="group pointer-events-auto flex w-fit max-w-56 h-10 items-center rounded-md border border-border bg-card pr-3 transition-all duration-150 hover:border-accent"
        >
          <div
            className={cn(
              "flex h-9 items-center justify-center bg-card rounded-l-md text-sm font-semibold transition duration-150 hover:brightness-125",
              isOpen && "brightness-125",
            )}
          >
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
            />
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        forceMount
        align="start"
        sideOffset={8}
        className="w-56 rounded-md p-1.5 text-card-foreground data-[state=open]:animate-none data-[state=closed]:animate-none"
      >
        <motion.div
          variants={dropdownContentVariants}
          initial="initial"
          animate={isOpen ? "animate" : "exit"}
        >
          <CustomDropdownItem
            text="Back to home"
            Icon={House}
            onSelect={(event) => {
              event.preventDefault()
              onBackHome()
            }}
          />
          <CustomDropdownItem
            text="Edit workflow"
            Icon={RiEdit2Line}
            onSelect={() => {
              setIsWorkflowSheetOpen(true)
            }}
          />
          <CustomDropdownItem text="Import" Icon={Upload} disabled />
          <CustomDropdownItem text="Export" Icon={Download} disabled />
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface CustomDropdownItemProps extends React.ComponentPropsWithoutRef<
  typeof DropdownMenuItem
> {
  text: string
  Icon: IconType
}

function CustomDropdownItem({ text, Icon, ...rest }: CustomDropdownItemProps) {
  const { onSelect, disabled, ...motionProps } = rest as any

  return (
    <motion.div variants={dropdownItemVariants} {...(motionProps as any)}>
      <DropdownMenuItem
        className="rounded-sm px-3 py-2 font-base"
        onSelect={onSelect}
        disabled={disabled}
      >
        <Icon className="h-4 w-4" />
        {text}
      </DropdownMenuItem>
    </motion.div>
  )
}
