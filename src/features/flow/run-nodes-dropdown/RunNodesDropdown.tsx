import { useState } from "react"
import { motion } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  dropdownContentVariants,
  dropdownItemVariants,
} from "@/animations/dropdownAnimations"
import type { ExecutionMode } from "@/types"
import { ChevronDown, Loader2, Play, WandSparkles } from "lucide-react"
import { FaMoon } from "react-icons/fa"
import { IoSunny } from "react-icons/io5"
import { GrPowerReset } from "react-icons/gr"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { IconType } from "react-icons"
import { cn } from "@/lib/utils"
import { useTheme } from "@/hooks/use-theme"

interface RunNodesDropdownProps {
  isRunning: boolean
  executionMode: ExecutionMode
  onRunWorkflow: () => void
  onToggleAutoRun: () => void
  onResetNodeStats: () => void
}

export default function RunNodesDropdown({
  isRunning,
  executionMode,
  onRunWorkflow,
  onToggleAutoRun,
  onResetNodeStats,
}: RunNodesDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const isAutoRun = executionMode === "auto"

  return (
    <div className="mr-30 pointer-events-auto flex items-center rounded-md border border-border bg-card text-card-foreground transition-all duration-200 hover:border-accent">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onRunWorkflow}
              disabled={isRunning}
              title="Run workflow"
              className="flex h-10 items-center gap-2 rounded-l-md px-2 text-sm font-medium text-primary transition-colors duration-200 hover:text-card-foreground disabled:cursor-wait disabled:opacity-70"
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
            className={cn(
              "flex h-10 items-center rounded-r-md px-2 bg-card text-(--text-muted) transition-colors duration-200 hover:brightness-125",
              isOpen && "brightness-125",
            )}
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
          className="w-56 rounded-md bg-card p-1.5 text-card-foreground data-[state=open]:animate-none data-[state=closed]:animate-none"
        >
          <motion.div
            variants={dropdownContentVariants}
            initial="initial"
            animate={isOpen ? "animate" : "exit"}
          >
            <CustomDropdownItem
              text="Run workflow"
              Icon={Play}
              disabled={isRunning}
              onSelect={(event) => {
                event.preventDefault()
                onRunWorkflow()
              }}
            />

            <CustomDropdownItem
              text="Auto run"
              Icon={WandSparkles}
              onSelect={(event) => {
                event.preventDefault()
                onToggleAutoRun()
              }}
              sufix={
                <span className="self-end font-semibold">
                  {isAutoRun ? "On" : "Off"}
                </span>
              }
            />

            <CustomDropdownItem
              text="Reset node stats"
              Icon={GrPowerReset}
              onSelect={(event) => {
                event.preventDefault()
                onResetNodeStats()
              }}
            />
            <CustomDropdownItem
              text="Toggle theme"
              Icon={theme === "light" ? IoSunny : FaMoon}
              onSelect={(event) => {
                event.preventDefault()
                setTheme(theme === "light" ? "dark" : "light")
              }}
            />
          </motion.div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

interface CustomDropdownItemProps extends React.ComponentPropsWithoutRef<
  typeof DropdownMenuItem
> {
  text: string
  Icon: IconType
  sufix?: React.ReactNode
}

function CustomDropdownItem({
  text,
  Icon,
  sufix,
  ...rest
}: CustomDropdownItemProps) {
  const { onSelect, disabled, ...motionProps } = rest as any

  return (
    <motion.div variants={dropdownItemVariants} {...(motionProps as any)}>
      <DropdownMenuItem
        className="flex justify-between rounded-sm px-3 py-2 font-base transition-colors"
        onSelect={onSelect}
        disabled={disabled}
      >
        <div className="flex gap-2.5 items-center">
          <Icon className="h-4 w-4" />
          {text}
        </div>

        {sufix}
      </DropdownMenuItem>
    </motion.div>
  )
}
