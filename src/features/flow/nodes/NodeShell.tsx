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
  borderClassName: string
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

const widthClassMap: Record<number, string> = {
  220: "w-[220px]",
  280: "w-[280px]",
}

const borderClassMap: Record<string, string> = {
  "var(--status-error)": "border-[var(--status-error)]",
  "var(--status-success)": "border-[var(--status-success)]",
  "var(--category-input)": "border-[var(--category-input)]",
  "var(--category-arithmetic)": "border-[var(--category-arithmetic)]",
  "var(--category-calculus)": "border-[var(--category-calculus)]",
  "var(--category-display)": "border-[var(--category-display)]",
  "var(--category-advanced)": "border-[var(--category-advanced)]",
  "var(--border)": "border-[var(--border)]",
}

const handleColorClassMap: Record<string, string> = {
  "var(--category-input)": "bg-[var(--category-input)]",
  "var(--status-success)": "bg-[var(--status-success)]",
  "var(--category-calculus)": "bg-[var(--category-calculus)]",
  "var(--category-display)": "bg-[var(--category-display)]",
  "var(--text-muted)": "bg-[var(--text-muted)]",
}

export const NodeContainer: React.FC<NodeContainerProps> = React.memo(
  ({ width, borderClassName, children }) => (
    <div className={widthClassMap[width] ?? "w-[220px]"}>
      <div
        className={`overflow-hidden rounded-xl border bg-[var(--bg-secondary)] backdrop-blur-xl transition-colors duration-200 ${borderClassName}`}
      >
        {children}
      </div>
    </div>
  ),
)

NodeContainer.displayName = "NodeContainer"

export const NodeHeader: React.FC<NodeHeaderProps> = React.memo(
  ({ title, headerActions }) => (
    <div className="flex items-center justify-between border-b border-[var(--border)] px-3 py-2">
      <span className="text-[11px] font-semibold tracking-[0.01em] text-[var(--text-primary)]">
        {title}
      </span>
      <div className="flex items-center gap-2">{headerActions}</div>
    </div>
  ),
)

NodeHeader.displayName = "NodeHeader"

export const TypedHandle: React.FC<TypedHandleProps> = React.memo(
  ({ port, side }) => {
    const isInput = side === "left"
    const config = getHandleTypeConfig(port.type)
    const handleColorClass =
      handleColorClassMap[config.color] ?? "bg-[var(--text-muted)]"

    return (
      <div
        className={`relative flex min-w-0 items-center gap-0.5 ${isInput ? "justify-start" : "justify-end"}`}
      >
        {isInput ? (
          <>
            <Handle
              type="target"
              position={Position.Left}
              id={port.name}
              className={`left-[-8px] h-2.5 w-2.5 rounded-full border-none shadow-none ${handleColorClass}`}
            />
            <span
              className="truncate whitespace-nowrap font-mono text-[10px] text-[var(--text-secondary)]"
              title={`${port.label} • ${config.label}`}
            >
              {config.label}
            </span>
          </>
        ) : (
          <>
            <span
              className="truncate whitespace-nowrap font-mono text-[10px] text-[var(--text-secondary)]"
              title={`${port.label} • ${config.label}`}
            >
              {config.label}
            </span>
            <Handle
              type="source"
              position={Position.Right}
              id={port.name}
              className={`right-[-8px] h-2.5 w-2.5 rounded-full border-none shadow-none ${handleColorClass}`}
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
      <div className="flex flex-col gap-2 px-3 py-2">
        {outputs.map((output, index) => (
          <div key={`output-${index}`} className="min-w-0">
            <TypedHandle port={output} side="right" />
          </div>
        ))}
        {inputs.map((input, index) => (
          <div key={`input-${index}`} className="min-w-0">
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

    const borderClassName =
      borderClassMap[borderColor] ?? "border-[var(--border)]"

    return (
      <NodeContainer width={width} borderClassName={borderClassName}>
        <NodeHeader title={data.label} headerActions={headerActions} />
        <NodeHandlesSection inputs={data.inputs} outputs={data.outputs} />
        <div className="px-3 py-2">{children}</div>
      </NodeContainer>
    )
  },
)

NodeShell.displayName = "NodeShell"
