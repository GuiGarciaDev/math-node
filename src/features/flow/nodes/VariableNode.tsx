import React, { useCallback } from "react";
import type { NodeProps } from "@xyflow/react";
import type { MathNodeData } from "../../../types";
import { NodeShell } from "./NodeShell";
import { useFlowStore } from "../flowStore";

export const VariableNode: React.FC<NodeProps> = React.memo(
  ({ id, data, selected }) => {
    const nodeData = data as unknown as MathNodeData;
    const updateNodeParam = useFlowStore((s) => s.updateNodeParam);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        updateNodeParam(id, "name", e.target.value);
      },
      [id, updateNodeParam],
    );

    return (
      <NodeShell data={nodeData} selected={selected}>
        <input
          type="text"
          value={String(nodeData.params.name ?? "x")}
          onChange={handleChange}
          className="node-input"
          style={{
            width: "100%",
            background: "#0f1117",
            border: "1px solid #262830",
            borderRadius: 6,
            padding: "6px 8px",
            fontSize: 12,
            color: "#c4b5fd",
            outline: "none",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        />
      </NodeShell>
    );
  },
);

VariableNode.displayName = "VariableNode";
