import React, { useCallback } from "react"
import type { NodeProps } from "@xyflow/react"
import type { MathNodeData } from "../../../types"
import { NodeShell } from "./NodeShell"
import { useFlowStore } from "../flowStore"

// ─── Derivative Node ──────────────────────────────────────

export const DerivativeNode: React.FC<NodeProps> = React.memo(
  ({ id, data, selected }) => {
    const nodeData = data as unknown as MathNodeData
    const computed = useFlowStore((s) => s.computedValues.get(id))
    const updateNodeParam = useFlowStore((s) => s.updateNodeParam)

    const handleVarChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        updateNodeParam(id, "variable", e.target.value)
      },
      [id, updateNodeParam],
    )

    const resultStr =
      computed?.value &&
      typeof computed.value === "object" &&
      "raw" in (computed.value as Record<string, unknown>)
        ? (computed.value as { raw: string }).raw
        : computed?.error
          ? `Error: ${computed.error}`
          : "—"

    return (
      <NodeShell data={nodeData} selected={selected}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
                fontWeight: 500,
              }}
            >
              Respect to
            </span>
            <input
              type="text"
              value={String(nodeData.params.variable ?? "x")}
              onChange={handleVarChange}
              style={{
                width: 40,
                background: "var(--bg-input)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                padding: "2px 6px",
                fontSize: 12,
                color: "var(--category-calculus)",
                fontFamily: "'JetBrains Mono', monospace",
                outline: "none",
                textAlign: "center",
              }}
            />
          </div>

          <div
            style={{ height: 1, background: "var(--border)", margin: "2px 0" }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
                fontWeight: 500,
              }}
            >
              Result d/dx
            </span>
            <div
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                padding: "6px 8px",
                fontSize: 12,
                color: computed?.error
                  ? "var(--status-error)"
                  : "var(--text-primary)",
                fontFamily: "'JetBrains Mono', monospace",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)",
                minWidth: 120,
              }}
            >
              {resultStr}
            </div>
          </div>
        </div>
      </NodeShell>
    )
  },
)

DerivativeNode.displayName = "DerivativeNode"

// ─── Integral Node ────────────────────────────────────────

export const IntegralNode: React.FC<NodeProps> = React.memo(
  ({ id, data, selected }) => {
    const nodeData = data as unknown as MathNodeData
    const computed = useFlowStore((s) => s.computedValues.get(id))
    const updateNodeParam = useFlowStore((s) => s.updateNodeParam)

    const handleVarChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        updateNodeParam(id, "variable", e.target.value)
      },
      [id, updateNodeParam],
    )

    const resultStr =
      computed?.value &&
      typeof computed.value === "object" &&
      "raw" in (computed.value as Record<string, unknown>)
        ? (computed.value as { raw: string }).raw
        : computed?.error
          ? `Error: ${computed.error}`
          : "—"

    return (
      <NodeShell data={nodeData} selected={selected}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
                fontWeight: 500,
              }}
            >
              Respect to
            </span>
            <input
              type="text"
              value={String(nodeData.params.variable ?? "x")}
              onChange={handleVarChange}
              style={{
                width: 40,
                background: "var(--bg-input)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                padding: "2px 6px",
                fontSize: 12,
                color: "var(--category-calculus)",
                fontFamily: "'JetBrains Mono', monospace",
                outline: "none",
                textAlign: "center",
              }}
            />
          </div>

          <div
            style={{ height: 1, background: "var(--border)", margin: "2px 0" }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
                fontWeight: 500,
              }}
            >
              Result ∫dx
            </span>
            <div
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                padding: "6px 8px",
                fontSize: 12,
                color: computed?.error
                  ? "var(--status-error)"
                  : "var(--text-primary)",
                fontFamily: "'JetBrains Mono', monospace",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)",
                minWidth: 120,
              }}
            >
              {resultStr}
            </div>
          </div>
        </div>
      </NodeShell>
    )
  },
)

IntegralNode.displayName = "IntegralNode"
