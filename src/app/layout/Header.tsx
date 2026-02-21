import React, { useCallback } from "react";
import { useFlowStore } from "../../features/flow/flowStore";

export const Header: React.FC = React.memo(() => {
  const runPipeline = useFlowStore((s) => s.runPipeline);
  const stepExecute = useFlowStore((s) => s.stepExecute);
  const executionMode = useFlowStore((s) => s.executionMode);
  const setExecutionMode = useFlowStore((s) => s.setExecutionMode);
  const computeMode = useFlowStore((s) => s.computeMode);
  const setComputeMode = useFlowStore((s) => s.setComputeMode);
  const isRunning = useFlowStore((s) => s.isRunning);

  const toggleAutoRun = useCallback(() => {
    setExecutionMode(executionMode === "auto" ? "manual" : "auto");
  }, [executionMode, setExecutionMode]);

  return (
    <header
      style={{
        height: 56,
        background: "rgba(17, 19, 26, 0.8)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid #262830",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        position: "relative",
        flexShrink: 0,
        zIndex: 50,
      }}
    >
      {/* Top glow line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.2), transparent)",
        }}
      />

      {/* Left section */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginRight: 16,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 14,
              boxShadow: "0 0 15px rgba(139, 92, 246, 0.3)",
            }}
          >
            Σ
          </div>
          <span
            style={{
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: "-0.02em",
              color: "#f5f5f5",
            }}
          >
            MATHFLOW
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 16, background: "#262830" }} />

        {/* Run Button */}
        <button
          onClick={runPipeline}
          disabled={isRunning}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: isRunning
              ? "rgba(139, 92, 246, 0.2)"
              : "rgba(139, 92, 246, 0.1)",
            color: "#a78bfa",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            padding: "6px 12px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 500,
            cursor: isRunning ? "wait" : "pointer",
            transition: "all 0.2s",
            boxShadow: "0 0 10px rgba(139, 92, 246, 0.1)",
            fontFamily: "'Inter', sans-serif",
          }}
          onMouseEnter={(e) => {
            if (!isRunning) {
              (e.currentTarget as HTMLElement).style.background = "#7c3aed";
              (e.currentTarget as HTMLElement).style.color = "#fff";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 20px rgba(139, 92, 246, 0.4)";
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(139, 92, 246, 0.1)";
            (e.currentTarget as HTMLElement).style.color = "#a78bfa";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 0 10px rgba(139, 92, 246, 0.1)";
          }}
        >
          ▶ {isRunning ? "Running..." : "Run Pipeline"}
        </button>

        {/* Step Mode */}
        <button
          onClick={stepExecute}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#9ca3af",
            background: "none",
            border: "none",
            padding: "6px 8px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s",
            fontFamily: "'Inter', sans-serif",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#e5e5e5";
            (e.currentTarget as HTMLElement).style.background = "#1c1e26";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#9ca3af";
            (e.currentTarget as HTMLElement).style.background = "none";
          }}
        >
          ⏭ Step
        </button>

        {/* Auto Run */}
        <button
          onClick={toggleAutoRun}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: executionMode === "auto" ? "#10b981" : "#6b7280",
            background:
              executionMode === "auto" ? "rgba(16, 185, 129, 0.1)" : "none",
            border:
              executionMode === "auto"
                ? "1px solid rgba(16, 185, 129, 0.2)"
                : "none",
            padding: "6px 8px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {executionMode === "auto" ? "⚡ Auto" : "⚡ Auto"}
        </button>
      </div>

      {/* Right section */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Compute Mode Toggle */}
        <div
          style={{
            display: "flex",
            background: "#1c1e26",
            borderRadius: 8,
            padding: 2,
            border: "1px solid #262830",
          }}
        >
          <button
            onClick={() => setComputeMode("numeric")}
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              border: "none",
              fontFamily: "'Inter', sans-serif",
              background: computeMode === "numeric" ? "#2d303b" : "transparent",
              color: computeMode === "numeric" ? "#e5e5e5" : "#6b7280",
              boxShadow:
                computeMode === "numeric"
                  ? "0 1px 2px rgba(0,0,0,0.2)"
                  : "none",
              transition: "all 0.15s",
            }}
          >
            Numeric
          </button>
          <button
            onClick={() => setComputeMode("symbolic")}
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              border: "none",
              fontFamily: "'Inter', sans-serif",
              background:
                computeMode === "symbolic" ? "#2d303b" : "transparent",
              color: computeMode === "symbolic" ? "#e5e5e5" : "#6b7280",
              boxShadow:
                computeMode === "symbolic"
                  ? "0 1px 2px rgba(0,0,0,0.2)"
                  : "none",
              transition: "all 0.15s",
            }}
          >
            Symbolic
          </button>
        </div>
      </div>
    </header>
  );
});

Header.displayName = "Header";
