import React, { useRef, useEffect } from "react"
import { useFlowStore } from "../flow/flowStore"

const levelColors: Record<string, string> = {
  info: "var(--category-input)",
  eval: "var(--category-calculus)",
  success: "var(--status-success)",
  error: "var(--status-error)",
  warn: "var(--status-warn)",
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

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current && consoleOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [consoleLogs.length, consoleOpen])

  return (
    <div
      style={{
        height: consoleOpen ? 180 : 32,
        minHeight: 32,
        background: "var(--bg-secondary)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        willChange: "height",
      }}
    >
      {/* Tab Bar */}
      <div
        style={{
          height: 32,
          minHeight: 32,
          borderBottom: consoleOpen ? "1px solid var(--border)" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          background: consoleOpen ? "var(--bg-tertiary)" : "transparent",
          transition: "background 0.3s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={toggleConsole}
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "var(--text-primary)",
              background: "none",
              border: "none",
              cursor: "pointer",
              borderBottom: "2px solid var(--accent)",
              height: 32,
              padding: "0 4px",
            }}
          >
            Console
          </button>
          {consoleOpen && (
            <button
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "var(--text-muted)",
                background: "none",
                border: "none",
                cursor: "pointer",
                height: 32,
                padding: "0 4px",
              }}
            >
              Errors{" "}
              <span
                style={{
                  background: "rgba(239, 68, 68, 0.2)",
                  color: "var(--status-error)",
                  padding: "1px 6px",
                  borderRadius: 10,
                  fontSize: 10,
                  marginLeft: 4,
                }}
              >
                {consoleLogs.filter((l) => l.level === "error").length}
              </span>
            </button>
          )}
          {!consoleOpen && (
            <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
              {consoleLogs.length} entries
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {consoleOpen && (
            <button
              onClick={clearConsole}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                fontSize: 14,
              }}
              title="Clear console"
            >
              🗑
            </button>
          )}
          <button
            onClick={toggleConsole}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: 14,
              transition: "transform 0.3s ease",
              transform: consoleOpen ? "rotate(0deg)" : "rotate(180deg)",
            }}
          >
            ▼
          </button>
        </div>
      </div>

      {/* Log Entries — always rendered, visibility controlled by parent height */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 12,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          opacity: consoleOpen ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      >
        {consoleLogs.length === 0 && (
          <span style={{ color: "var(--text-dim)" }}>
            No logs yet. Run the pipeline to see execution output.
          </span>
        )}
        {consoleLogs.map((log) => (
          <div
            key={log.id}
            style={{
              color:
                log.level === "error"
                  ? "var(--status-error)"
                  : log.level === "success"
                    ? "var(--status-success)"
                    : "var(--text-secondary)",
            }}
          >
            <span style={{ color: levelColors[log.level], fontWeight: 500 }}>
              [{levelLabels[log.level]}]
            </span>{" "}
            {log.message}
          </div>
        ))}
      </div>
    </div>
  )
})

Console.displayName = "Console"
