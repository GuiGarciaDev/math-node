import React, { useCallback } from "react"
import { useFlowStore } from "../../features/flow/flowStore"

export const Header: React.FC = React.memo(() => {
  const runPipeline = useFlowStore((s) => s.runPipeline)
  const stepExecute = useFlowStore((s) => s.stepExecute)
  const executionMode = useFlowStore((s) => s.executionMode)
  const setExecutionMode = useFlowStore((s) => s.setExecutionMode)
  const computeMode = useFlowStore((s) => s.computeMode)
  const setComputeMode = useFlowStore((s) => s.setComputeMode)
  const isRunning = useFlowStore((s) => s.isRunning)
  const theme = useFlowStore((s) => s.theme)
  const toggleTheme = useFlowStore((s) => s.toggleTheme)
  const showLanding = useFlowStore((s) => s.showLanding)

  const toggleAutoRun = useCallback(() => {
    setExecutionMode(executionMode === "auto" ? "manual" : "auto")
  }, [executionMode, setExecutionMode])

  const isDark = theme === "dark"

  return (
    <header className="relative z-50 flex h-14 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--bg-secondary)]/90 px-3 md:px-4 backdrop-blur-xl">
      <div className="absolute left-0 top-0 h-px w-full bg-[linear-gradient(90deg,transparent,var(--accent-glow),transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.06))]" />

      <div className="relative z-10 flex items-center gap-2 md:gap-4">
        <button
          onClick={showLanding}
          title="Return to landing page"
          className="group flex items-center gap-2.5 rounded-lg px-1.5 py-1 transition-colors duration-150 hover:bg-[var(--bg-tertiary)]/70"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[linear-gradient(135deg,var(--accent),var(--category-input))] text-sm text-[var(--text-primary)] shadow-[0_0_15px_var(--accent-glow)] transition-transform duration-150 group-hover:scale-105">
            Σ
          </div>
          <span className="hidden text-[13px] font-semibold tracking-[-0.02em] text-[var(--text-primary)] sm:inline">
            MATHFLOW
          </span>
        </button>

        <div className="hidden h-4 w-px bg-[var(--border)] md:block" />

        <div className="flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)]/60 p-1">
          <button
            onClick={runPipeline}
            disabled={isRunning}
            className="flex items-center gap-1.5 rounded-lg border border-[color-mix(in_srgb,var(--accent)_32%,transparent)] bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] px-2.5 py-1.5 text-xs font-medium text-[var(--accent)] shadow-[0_0_10px_var(--accent-glow)] transition-all duration-200 hover:bg-[var(--accent)] hover:text-[var(--text-primary)] disabled:cursor-wait disabled:opacity-70"
          >
            <span>▶</span>
            <span className="hidden md:inline">
              {isRunning ? "Running..." : "Run"}
            </span>
          </button>

          <button
            onClick={stepExecute}
            className="rounded-lg px-2 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
            title="Step execution"
          >
            ⏭
          </button>

          <button
            onClick={toggleAutoRun}
            className={`flex items-center gap-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition-all duration-150 ${
              executionMode === "auto"
                ? "border-[color-mix(in_srgb,var(--status-success)_24%,transparent)] bg-[color-mix(in_srgb,var(--status-success)_14%,transparent)] text-[var(--status-success)]"
                : "border-transparent text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)]"
            }`}
          >
            <span>⚡</span>
            <span className="hidden md:inline">Auto</span>
            {executionMode === "auto" && (
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--status-success)]" />
            )}
          </button>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-2 md:gap-3">
        <div className="flex rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] p-0.5">
          <button
            onClick={() => setComputeMode("numeric")}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-150 ${
              computeMode === "numeric"
                ? "bg-[var(--bg-input)] text-[var(--text-primary)] shadow-[0_1px_2px_var(--shadow)]"
                : "text-[var(--text-muted)]"
            }`}
          >
            Numeric
          </button>
          <button
            onClick={() => setComputeMode("symbolic")}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-150 ${
              computeMode === "symbolic"
                ? "bg-[var(--bg-input)] text-[var(--text-primary)] shadow-[0_1px_2px_var(--shadow)]"
                : "text-[var(--text-muted)]"
            }`}
          >
            Symbolic
          </button>
        </div>

        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to light theme" : "Switch to dark theme"}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] text-base text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--text-primary)] hover:shadow-[0_0_8px_var(--accent-glow)]"
        >
          {isDark ? "☀" : "🌙"}
        </button>
      </div>
    </header>
  )
})

Header.displayName = "Header"
