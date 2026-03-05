import React, { useRef, useEffect } from "react"
import { useFlowStore } from "../flow/store/flowStore"

const levelClassName: Record<string, string> = {
  info: "text-[var(--category-input)]",
  eval: "text-[var(--category-calculus)]",
  success: "text-[var(--status-success)]",
  error: "text-[var(--status-error)]",
  warn: "text-[var(--status-warn)]",
}

const levelLabels: Record<string, string> = {
  info: "INFO",
  eval: "EVAL",
  success: "SUCCESS",
  error: "ERROR",
  warn: "WARN",
}

export const Console: React.FC = React.memo(() => {
  const consoleLogs = useFlowStore((s) => s.consoleLogs)
  const clearConsole = useFlowStore((s) => s.clearConsole)
  const consoleOpen = useFlowStore((s) => s.consoleOpen)
  const toggleConsole = useFlowStore((s) => s.toggleConsole)

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current && consoleOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [consoleLogs.length, consoleOpen])

  return (
    <div
      className={`flex min-h-8 flex-col overflow-hidden border-t border-[var(--border)] bg-[var(--bg-secondary)] backdrop-blur-xl transition-[height] duration-300 ${
        consoleOpen ? "h-[180px]" : "h-8"
      }`}
    >
      <div
        className={`flex h-8 min-h-8 items-center justify-between px-3 transition-colors duration-300 ${
          consoleOpen
            ? "border-b border-[var(--border)] bg-[var(--bg-tertiary)]"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={toggleConsole}
            className="h-8 border-b-2 border-[var(--accent)] px-1 text-xs font-medium text-[var(--text-primary)]"
          >
            Console
          </button>
          {consoleOpen && (
            <button className="h-8 px-1 text-xs font-medium text-[var(--text-muted)]">
              Errors
              <span className="ml-1 rounded-full bg-red-500/20 px-1.5 py-[1px] text-[10px] text-[var(--status-error)]">
                {consoleLogs.filter((l) => l.level === "error").length}
              </span>
            </button>
          )}
          {!consoleOpen && (
            <span className="text-[11px] text-[var(--text-dim)]">
              {consoleLogs.length} entries
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {consoleOpen && (
            <button
              onClick={clearConsole}
              className="text-sm text-[var(--text-muted)] transition-colors duration-150 hover:text-[var(--text-primary)]"
              title="Clear console"
            >
              🗑
            </button>
          )}
          <button
            onClick={toggleConsole}
            className={`text-sm text-[var(--text-muted)] transition-transform duration-300 ${
              consoleOpen ? "rotate-0" : "rotate-180"
            }`}
          >
            ▼
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className={`flex flex-1 flex-col gap-1 overflow-y-auto p-3 font-mono text-xs transition-opacity duration-200 ${
          consoleOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        {consoleLogs.length === 0 && (
          <span className="text-[var(--text-dim)]">
            No logs yet. Run the pipeline to see execution output.
          </span>
        )}
        {consoleLogs.map((log) => {
          const messageClassName =
            log.level === "error"
              ? "text-[var(--status-error)]"
              : log.level === "success"
                ? "text-[var(--status-success)]"
                : "text-[var(--text-secondary)]"

          return (
            <div key={log.id} className={messageClassName}>
              <span className={`font-medium ${levelClassName[log.level]}`}>
                [{levelLabels[log.level]}]
              </span>{" "}
              {log.message}
            </div>
          )
        })}
      </div>
    </div>
  )
})

Console.displayName = "Console"
