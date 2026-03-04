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
          className="node-input"
          style={{
            width: "100%",
            background: "var(--bg-input)",
            border: `1px solid ${showValidation ? "var(--status-error)" : "var(--border)"}`,
            borderRadius: 6,
            padding: "6px 8px",
            fontSize: 12,
            color: "var(--category-input)",
            outline: "none",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        />
        {showValidation && (
          <div
            style={{
              marginTop: 6,
              fontSize: 10,
              color: "var(--status-error)",
              lineHeight: 1.3,
            }}
          >
            {parsedValue.reason}
          </div>
        )}
      </NodeShell>
    )
  },
)

NumberInputNode.displayName = "NumberInputNode"
