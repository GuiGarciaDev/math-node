import { useState } from "react"
import { motion } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  dropdownContentVariants,
  dropdownItemVariants,
} from "@/animations/dropdownAnimations"
import type { ExecutionMode } from "@/types"
import { ChevronDown, Loader2, Play, WandSparkles } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface RunNodesDropdownProps {
  isRunning: boolean
  executionMode: ExecutionMode
  onRunWorkflow: () => void
  onToggleAutoRun: () => void
}

export default function RunNodesDropdown({
  isRunning,
  executionMode,
  onRunWorkflow,
  onToggleAutoRun,
}: RunNodesDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const isAutoRun = executionMode === "auto"

  return (
    <div className="pointer-events-auto flex items-center rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-secondary)_92%,transparent)] text-[var(--text-primary)] shadow-[0_10px_24px_rgba(0,0,0,0.28)] backdrop-blur-md transition-all duration-200 hover:border-[var(--border-hover)] hover:bg-[var(--bg-tertiary)]">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onRunWorkflow}
              disabled={isRunning}
              title="Run workflow"
              className="flex h-10 items-center gap-2 rounded-l-xl px-2 text-sm font-medium text-[var(--accent)] transition-colors duration-200 hover:text-[var(--text-primary)] disabled:cursor-wait disabled:opacity-70"
            >
              <span className="grid h-4 w-4 shrink-0 place-items-center">
                {isRunning ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent align="center">
            {isRunning ? "Workflow is running..." : "Run workflow"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex h-10 items-center rounded-r-xl px-2 text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--text-primary)]"
            aria-label="Open run options"
          >
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          forceMount
          align="end"
          sideOffset={8}
          className="w-56 rounded-2xl border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-secondary)_96%,transparent)] p-1.5 text-[var(--text-primary)] shadow-[0_18px_40px_rgba(0,0,0,0.32)] backdrop-blur-xl data-[state=open]:animate-none data-[state=closed]:animate-none"
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
                  onRunWorkflow()
                }}
                disabled={isRunning}
                className="rounded-sm border border-[color-mix(in_srgb,var(--accent)_28%,transparent)] bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] px-3 py-2 font-medium text-[var(--accent)] focus:bg-[var(--accent)] focus:text-[var(--text-primary)]"
              >
                <Play className="h-4 w-4" />
                <span>Run workflow</span>
              </DropdownMenuItem>
            </motion.div>

            <motion.div variants={dropdownItemVariants}>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault()
                  onToggleAutoRun()
                }}
                className={`rounded-sm px-3 py-2 font-medium transition-all duration-150 ${
                  isAutoRun
                    ? "border border-[color-mix(in_srgb,var(--status-success)_24%,transparent)] bg-[color-mix(in_srgb,var(--status-success)_14%,transparent)] text-[var(--status-success)]"
                    : "border border-transparent bg-[var(--bg-tertiary)]/70 text-[var(--text-secondary)] focus:border-[var(--border)] focus:text-[var(--text-primary)]"
                }`}
              >
                <WandSparkles className="h-4 w-4" />
                <span>Auto run</span>
                <span className="ml-auto flex items-center gap-2">
                  {isAutoRun && (
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--status-success)]" />
                  )}
                  <span>{isAutoRun ? "On" : "Off"}</span>
                </span>
              </DropdownMenuItem>
            </motion.div>
          </motion.div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
