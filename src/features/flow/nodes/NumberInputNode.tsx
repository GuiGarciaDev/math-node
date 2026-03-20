import React, { useCallback, useMemo } from "react"
import type { NodeProps } from "@xyflow/react"
import type { MathNodeData } from "../../../types"
import { NodeShell } from "./NodeShell"
import { useFlowStore } from "../store/flowStore"
import { parseLocalizedNumberInput } from "../../../lib/math/numberInput"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const AVAILABLE_CONSTANTS = [
  { key: "pi", label: "π", value: Math.PI },
  { key: "e", label: "e", value: Math.E },
] as const

type SupportedConstant = (typeof AVAILABLE_CONSTANTS)[number]["key"]

export const NumberInputNode: React.FC<NodeProps> = React.memo(
  ({ id, data, selected }) => {
    const nodeData = data as unknown as MathNodeData
    const updateNodeParam = useFlowStore((s) => s.updateNodeParam)

    const rawValue = nodeData.params.value
    const inputValue =
      rawValue === undefined || rawValue === null ? "" : String(rawValue)
    const parsedValue = useMemo(
      () => parseLocalizedNumberInput(inputValue),
      [inputValue],
    )
    const showValidation = inputValue.trim().length > 0 && !parsedValue.isValid

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        updateNodeParam(id, "value", e.target.value)
      },
      [id, updateNodeParam],
    )

    return (
      <NodeShell data={nodeData} selected={selected}>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="e.g. 3.14 or -10"
          className={`node-input w-full rounded-md border bg-[var(--bg-input)] px-2 py-1.5 font-mono text-xs text-[var(--category-number)] outline-none ${
            showValidation
              ? "border-[var(--status-error)]"
              : "border-[var(--border)]"
          }`}
        />
        {showValidation && (
          <div className="mt-1.5 text-[10px] leading-[1.3] text-[var(--status-error)]">
            {parsedValue.reason}
          </div>
        )}
      </NodeShell>
    )
  },
)

NumberInputNode.displayName = "NumberInputNode"

export const ConstantNode: React.FC<NodeProps> = React.memo(
  ({ id, data, selected }) => {
    const nodeData = data as unknown as MathNodeData
    const updateNodeParam = useFlowStore((s) => s.updateNodeParam)

    const constantKey = String(
      nodeData.params.constantKey ?? "pi",
    ) as SupportedConstant
    const decimalPlacesRaw = Number(nodeData.params.decimalPlaces ?? 6)
    const decimalPlaces = Number.isFinite(decimalPlacesRaw)
      ? Math.max(0, Math.min(15, Math.round(decimalPlacesRaw)))
      : 6

    const handleConstantChange = useCallback(
      (value: string) => {
        updateNodeParam(id, "constantKey", value)
      },
      [id, updateNodeParam],
    )

    const handlePrecisionChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = Number(e.target.value)
        updateNodeParam(id, "decimalPlaces", Number.isFinite(next) ? next : 0)
      },
      [id, updateNodeParam],
    )

    const selectedConstant =
      AVAILABLE_CONSTANTS.find((entry) => entry.key === constantKey) ??
      AVAILABLE_CONSTANTS[0]

    return (
      <NodeShell data={nodeData} selected={selected}>
        <div className="flex flex-col gap-2">
          <label className="flex flex-col gap-1 text-[10px] uppercase tracking-[0.08em] text-[var(--text-dim)]">
            Constant
            <Select
              value={selectedConstant.key}
              onValueChange={handleConstantChange}
            >
              <SelectTrigger className="node-input h-8 border-[var(--border)] bg-[var(--bg-input)] px-2 py-1.5 text-xs text-[var(--text-primary)] ring-offset-0 focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_CONSTANTS.map((entry) => (
                  <SelectItem key={entry.key} value={entry.key}>
                    {entry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="flex flex-col gap-1 text-[10px] uppercase tracking-[0.08em] text-[var(--text-dim)]">
            Decimal Places
            <input
              type="number"
              min={0}
              max={15}
              step={1}
              value={decimalPlaces}
              onChange={handlePrecisionChange}
              className="node-input w-full rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-2 py-1.5 font-mono text-xs text-[var(--category-number)] outline-none"
            />
          </label>
        </div>
      </NodeShell>
    )
  },
)

ConstantNode.displayName = "ConstantNode"
