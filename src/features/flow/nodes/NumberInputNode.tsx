import React, { useCallback, useMemo } from "react"
import type { NodeProps } from "@xyflow/react"
import type { MathNodeData } from "../../../types"
import { NodeShell } from "./NodeShell"
import { useFlowStore } from "../flowStore.ts"
import { parseLocalizedNumberInput } from "../../../lib/math/numberInput"

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
          placeholder="e.g. 3.14 or 3,14"
          className={`node-input w-full rounded-md border bg-[var(--bg-input)] px-2 py-1.5 font-mono text-xs text-[var(--category-input)] outline-none ${
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
