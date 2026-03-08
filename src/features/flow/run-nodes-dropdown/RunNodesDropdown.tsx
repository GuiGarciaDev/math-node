import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react"

export default function RunNodesDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <UserIcon />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCardIcon />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SettingsIcon />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

{
  /* <div ref={runMenuRef} className="pointer-events-auto relative">
                <div className="flex h-10 items-center gap-2 rounded-xl border border-(--border) bg-[color-mix(in_srgb,var(--bg-secondary)_92%,transparent)] text-sm font-medium text-(--text-primary) shadow-[0_10px_24px_rgba(0,0,0,0.28)] backdrop-blur-md transition-all duration-150 hover:border-[var(--border-hover)] hover:bg-[var(--bg-tertiary)]">
                  <button
                    type="button"
                    className="flex h-10 items-center pl-4 pr-2"
                  >
                    <span className="text-base text-(--accent)">
                      <VscRunAll />
                    </span>
                    {isRunning && <FaSpinner />}
                  </button>
                  <button
                    className="flex items-center h-10 pr-2 pl-1"
                    onClick={() => setRunMenuOpen((open) => !open)}
                  >
                    <LuChevronDown
                      className={`text-(--text-muted) transition-transform duration-150 ${
                        runMenuOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>
                </div>

                {runMenuOpen && (
                  <div className="absolute right-0 top-[calc(100%+0.5rem)] w-56 rounded-2xl border border-(--border) bg-[color-mix(in_srgb,var(--bg-secondary)_96%,transparent)] p-2 shadow-[0_18px_40px_rgba(0,0,0,0.32)] backdrop-blur-xl">
                    <button
                      type="button"
                      onClick={() => {
                        runPipeline()
                        setRunMenuOpen(false)
                      }}
                      disabled={isRunning}
                      className="flex w-full items-center justify-between rounded-xl border border-[color-mix(in_srgb,var(--accent)_28%,transparent)] bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] px-3 py-2 text-left text-sm font-medium text-[var(--accent)] transition-all duration-150 hover:bg-[var(--accent)] hover:text-[var(--text-primary)] disabled:cursor-wait disabled:opacity-70"
                    >
                      <span>Run workflow</span>
                      <span>
                        <VscRunAll />
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={toggleAutoRun}
                      className={`mt-2 flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm font-medium transition-all duration-150 ${
                        executionMode === "auto"
                          ? "border-[color-mix(in_srgb,var(--status-success)_24%,transparent)] bg-[color-mix(in_srgb,var(--status-success)_14%,transparent)] text-(--status-success)"
                          : "border-transparent bg-(--bg-tertiary)/70 text-(--text-secondary) hover:border-(--border) hover:text-(--text-primary)"
                      }`}
                    >
                      <span>Auto run</span>
                      <span className="flex items-center gap-2">
                        {executionMode === "auto" && (
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-(--status-success)" />
                        )}
                        <span>{executionMode === "auto" ? "On" : "Off"}</span>
                      </span>
                    </button>
                  </div>
                )}
              </div> */
}
