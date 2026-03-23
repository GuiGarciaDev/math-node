import React from "react"
import { Handle, Position, useNodeId } from "@xyflow/react"
import type { MathNodeData, PortDefinition } from "../../../types"
import { useFlowStore } from "../store/flowStore"
import { getHandleTypeConfig } from "../../../config/handle-type-config"
import {
  categoryBorderTokens,
  defaultBorderToken,
  handleColorTokens,
  statusBorderTokens,
} from "../../../config/node-style-config"

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

const widthClassMap: Record<number, string> = {
  220: "w-[220px]",
  280: "w-[280px]",
}

export const NodeContainer: React.FC<NodeContainerProps> = React.memo(
  ({ width, borderClassName, children }) => (
    <div className={widthClassMap[width] ?? "w-[220px]"}>
      <div
        className={`rounded-xl border bg-card backdrop-blur-xl transition-colors duration-200 ${borderClassName}`}
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
    const config = getHandleTypeConfig(port.type)
    const handleColorClass =
      handleColorTokens[config.colorKey]?.bgClass ??
      handleColorTokens.muted.bgClass

    return (
      <div className="relative flex w-fit items-center justify-between">
        <span
          className={`truncate whitespace-nowrap font-mono text-[10px] text-[var(--text-secondary)] ${side === "left" ? "ml-3" : "mr-3"}`}
          title={`${port.label} • ${config.label}`}
        >
          {config.label}
        </span>
        <Handle
          type={side === "left" ? "target" : "source"}
          position={side === "left" ? Position.Left : Position.Right}
          id={port.name}
          className={`node-input top-1/2 h-2.5! w-2.5! rounded-full border-blue-300/80! shadow-none ${side === "left" ? "left-0" : "right-0!"} ${handleColorClass}`}
        />
      </div>
    )
  },
)

TypedHandle.displayName = "TypedHandle"

export const NodeHandlesSection: React.FC<NodeHandlesSectionProps> = React.memo(
  ({ inputs, outputs }) => {
    return (
      <div className="flex flex-col gap-1 py-2">
        <div className="flex justify-end min-w-0">
          {outputs.map((output, index) => {
            return <TypedHandle port={output} side="right" key={index} />
          })}
        </div>
        <div className="min-w-0">
          {inputs.map((input, index) => {
            return <TypedHandle port={input} side="left" key={index} />
          })}
        </div>
      </div>
    )
  },
)

NodeHandlesSection.displayName = "NodeHandlesSection"

export const NodeShell: React.FC<NodeShellProps> = React.memo(
  ({ data, selected, children, headerActions, width = 220 }) => {
    const nodeId = useNodeId()
    const runPipelineToNode = useFlowStore((s) => s.runPipelineToNode)
    const isRunning = useFlowStore((s) => s.isRunning)

    const categoryToken = categoryBorderTokens[data.category]
    const borderClassName =
      data.status === "error"
        ? statusBorderTokens.error.borderClass
        : data.status === "success"
          ? statusBorderTokens.success.borderClass
          : selected
            ? categoryToken.borderClass
            : defaultBorderToken.borderClass

    return (
      <div
        className={`relative overflow-visible ${selected ? "p-2 -m-2" : ""}`}
      >
        {selected && nodeId && (
          <button
            type="button"
            onClick={() => runPipelineToNode(nodeId)}
            disabled={isRunning}
            className={`absolute top-0 -left-12 origin-right z-20 -translate-x-1/2 rounded-md bg-accent px-2 py-2 text-[10px] font-semibold text-accent-foreground shadow-[0_6px_18px_rgba(0,0,0,0.24)] backdrop-blur-sm hover:scale-105 transition-transform disabled:cursor-wait disabled:opacity-60`}
          >
            Run Workflow
          </button>
        )}

        <NodeContainer width={width} borderClassName={borderClassName}>
          <NodeHeader title={data.label} headerActions={headerActions} />
          <NodeHandlesSection inputs={data.inputs} outputs={data.outputs} />
          <div className="px-3 py-2">{children}</div>
        </NodeContainer>
      </div>
    )
  },
)

NodeShell.displayName = "NodeShell"
