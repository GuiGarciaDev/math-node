import React from "react"
import { Handle, Position } from "@xyflow/react"
import type { MathNodeData, PortDefinition } from "../../../types"
import { getHandleTypeConfig } from "./handleTypeConfig"

interface NodeShellProps {
  data: MathNodeData
  selected?: boolean
  children?: React.ReactNode
  headerActions?: React.ReactNode
  width?: number
}

interface NodeContainerProps {
  width: number
  borderColor: string
  children: React.ReactNode
}

interface NodeHeaderProps {
  title: string
  headerActions?: React.ReactNode
}

interface TypedHandleProps {
  port: PortDefinition
  side: "left" | "right"
}

interface NodeHandlesSectionProps {
  inputs: PortDefinition[]
  outputs: PortDefinition[]
}

const categoryColors: Record<string, string> = {
  input: "var(--category-input)",
  arithmetic: "var(--category-arithmetic)",
  calculus: "var(--category-calculus)",
  display: "var(--category-display)",
  advanced: "var(--category-advanced)",
}

export const NodeContainer: React.FC<NodeContainerProps> = React.memo(
  ({ width, borderColor, children }) => (
    <div style={{ width }}>
      <div
        style={{
          background: "var(--bg-secondary)",
          backdropFilter: "blur(12px)",
          borderRadius: 12,
          border: `1px solid ${borderColor}`,
          transition: "border-color 0.2s ease",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  ),
)

NodeContainer.displayName = "NodeContainer"

export const NodeHeader: React.FC<NodeHeaderProps> = React.memo(
  ({ title, headerActions }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 12px",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "var(--text-primary)",
          letterSpacing: "0.01em",
        }}
      >
        {title}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {headerActions}
      </div>
    </div>
  ),
)

NodeHeader.displayName = "NodeHeader"

export const TypedHandle: React.FC<TypedHandleProps> = React.memo(
  ({ port, side }) => {
    const isInput = side === "left"
    const config = getHandleTypeConfig(port.type)

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: isInput ? "flex-start" : "flex-end",
          gap: 2,
          position: "relative",
          minWidth: 0,
        }}
      >
        {isInput ? (
          <>
            <Handle
              type="target"
              position={Position.Left}
              id={port.name}
              style={{
                position: "relative",
                left: -8,
                top: "auto",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: config.color,
                border: "none",
                boxShadow: "none",
                transform: "none",
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: "var(--text-secondary)",
                fontFamily: "'JetBrains Mono', monospace",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={`${port.label} • ${config.label}`}
            >
              {config.label}
            </span>
          </>
        ) : (
          <>
            <span
              style={{
                fontSize: 10,
                color: "var(--text-secondary)",
                fontFamily: "'JetBrains Mono', monospace",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={`${port.label} • ${config.label}`}
            >
              {config.label}
            </span>
            <Handle
              type="source"
              position={Position.Right}
              id={port.name}
              style={{
                position: "relative",
                right: -8,
                top: "auto",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: config.color,
                border: "none",
                boxShadow: "none",
                transform: "none",
              }}
            />
          </>
        )}
      </div>
    )
  },
)

TypedHandle.displayName = "TypedHandle"

export const NodeHandlesSection: React.FC<NodeHandlesSectionProps> = React.memo(
  ({ inputs, outputs }) => {
    const rows = Math.max(inputs.length, outputs.length)

    if (rows === 0) {
      return null
    }

    return (
      <div
        style={{
          padding: "8px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {outputs.map((output, index) => (
          <div key={`output-${index}`} style={{ minWidth: 0 }}>
            <TypedHandle port={output} side="right" />
          </div>
        ))}
        {inputs.map((input, index) => (
          <div key={`input-${index}`} style={{ minWidth: 0 }}>
            <TypedHandle port={input} side="left" />
          </div>
        ))}
      </div>
    )
  },
)

NodeHandlesSection.displayName = "NodeHandlesSection"

export const NodeShell: React.FC<NodeShellProps> = React.memo(
  ({ data, selected, children, headerActions, width = 220 }) => {
    const accentColor = categoryColors[data.category] ?? "#6b7280"
    const borderColor =
      data.status === "error"
        ? "var(--status-error)"
        : data.status === "success"
          ? "var(--status-success)"
          : selected
            ? accentColor
            : "var(--border)"

    return (
      <NodeContainer width={width} borderColor={borderColor}>
        <NodeHeader title={data.label} headerActions={headerActions} />
        <NodeHandlesSection inputs={data.inputs} outputs={data.outputs} />
        <div style={{ padding: "8px 12px" }}>{children}</div>
      </NodeContainer>
    )
  },
)

NodeShell.displayName = "NodeShell"
