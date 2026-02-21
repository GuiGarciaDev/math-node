import React, { useRef, useEffect } from "react";
import { useFlowStore } from "../flow/flowStore";

const levelColors: Record<string, string> = {
  info: "#3b82f6",
  eval: "#8b5cf6",
  success: "#10b981",
  error: "#ef4444",
  warn: "#f59e0b",
};

const levelLabels: Record<string, string> = {
  info: "INFO",
  eval: "EVAL",
  success: "SUCCESS",
  error: "ERROR",
  warn: "WARN",
};

export const Console: React.FC = React.memo(() => {
  const consoleLogs = useFlowStore((s) => s.consoleLogs);
  const clearConsole = useFlowStore((s) => s.clearConsole);
  const consoleOpen = useFlowStore((s) => s.consoleOpen);
  const toggleConsole = useFlowStore((s) => s.toggleConsole);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom — one of the few valid useEffect usages (subscription)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [consoleLogs.length]);

  if (!consoleOpen) {
    return (
      <div
        style={{
          height: 32,
          background: "rgba(17, 19, 26, 0.95)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid #262830",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={toggleConsole}
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "#fff",
              background: "none",
              border: "none",
              cursor: "pointer",
              borderBottom: "2px solid #8b5cf6",
              height: 32,
              padding: "0 4px",
            }}
          >
            Console
          </button>
          <span style={{ fontSize: 11, color: "#525252" }}>
            {consoleLogs.length} entries
          </span>
        </div>
        <button
          onClick={toggleConsole}
          style={{
            background: "none",
            border: "none",
            color: "#6b7280",
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          ▲
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        height: 160,
        background: "rgba(17, 19, 26, 0.95)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid #262830",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Tab Bar */}
      <div
        style={{
          height: 32,
          borderBottom: "1px solid #262830",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          background: "rgba(28, 30, 38, 0.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "#fff",
              background: "none",
              border: "none",
              cursor: "pointer",
              borderBottom: "2px solid #8b5cf6",
              height: 32,
              padding: "0 4px",
            }}
          >
            Console
          </button>
          <button
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "#6b7280",
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
                color: "#f87171",
                padding: "1px 6px",
                borderRadius: 10,
                fontSize: 10,
                marginLeft: 4,
              }}
            >
              {consoleLogs.filter((l) => l.level === "error").length}
            </span>
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={clearConsole}
            style={{
              background: "none",
              border: "none",
              color: "#6b7280",
              cursor: "pointer",
              fontSize: 14,
            }}
            title="Clear console"
          >
            🗑
          </button>
          <button
            onClick={toggleConsole}
            style={{
              background: "none",
              border: "none",
              color: "#6b7280",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            ▼
          </button>
        </div>
      </div>

      {/* Log Entries */}
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
        }}
      >
        {consoleLogs.length === 0 && (
          <span style={{ color: "#525252" }}>
            No logs yet. Run the pipeline to see execution output.
          </span>
        )}
        {consoleLogs.map((log) => (
          <div
            key={log.id}
            style={{
              color:
                log.level === "error"
                  ? "#f87171"
                  : log.level === "success"
                    ? "#34d399"
                    : "#9ca3af",
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
  );
});

Console.displayName = "Console";
