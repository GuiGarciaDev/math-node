import React, { useCallback } from "react";
import type { NodeProps } from "@xyflow/react";
import type { MathNodeData } from "../../../types";
import { NodeShell } from "./NodeShell";
import { useFlowStore } from "../flowStore";

export const MatrixNode: React.FC<NodeProps> = React.memo(
  ({ id, data, selected }) => {
    const nodeData = data as unknown as MathNodeData;
    const updateNodeParam = useFlowStore((s) => s.updateNodeParam);

    const matrix = (nodeData.params.matrix as number[][]) ?? [[0]];
    const rows = matrix.length;
    const cols = matrix[0]?.length ?? 1;

    const handleCellChange = useCallback(
      (row: number, col: number, value: string) => {
        const newMatrix = matrix.map((r) => [...r]);
        newMatrix[row][col] = Number(value) || 0;
        updateNodeParam(id, "matrix", newMatrix);
      },
      [id, matrix, updateNodeParam],
    );

    const handleResize = useCallback(
      (newRows: number, newCols: number) => {
        const newMatrix: number[][] = [];
        for (let r = 0; r < newRows; r++) {
          const row: number[] = [];
          for (let c = 0; c < newCols; c++) {
            row.push(matrix[r]?.[c] ?? 0);
          }
          newMatrix.push(row);
        }
        updateNodeParam(id, "matrix", newMatrix);
        updateNodeParam(id, "rows", newRows);
        updateNodeParam(id, "cols", newCols);
      },
      [id, matrix, updateNodeParam],
    );

    return (
      <NodeShell data={nodeData} selected={selected}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Matrix Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: 2,
            }}
          >
            {matrix.map((row, ri) =>
              row.map((cell, ci) => (
                <input
                  key={`${ri}-${ci}`}
                  type="text"
                  value={cell}
                  onChange={(e) => handleCellChange(ri, ci, e.target.value)}
                  style={{
                    width: 36,
                    background: "#0f1117",
                    border: "1px solid #262830",
                    borderRadius: 3,
                    padding: "2px 4px",
                    fontSize: 10,
                    color: "#fbbf24",
                    fontFamily: "'JetBrains Mono', monospace",
                    outline: "none",
                    textAlign: "center",
                  }}
                />
              )),
            )}
          </div>

          {/* Resize Controls */}
          <div
            style={{ display: "flex", gap: 8, fontSize: 10, color: "#6b7280" }}
          >
            <span>
              {rows}×{cols}
            </span>
            <button
              onClick={() => handleResize(rows + 1, cols)}
              style={{
                color: "#9ca3af",
                cursor: "pointer",
                background: "none",
                border: "none",
                fontSize: 10,
              }}
            >
              +row
            </button>
            <button
              onClick={() => handleResize(rows, cols + 1)}
              style={{
                color: "#9ca3af",
                cursor: "pointer",
                background: "none",
                border: "none",
                fontSize: 10,
              }}
            >
              +col
            </button>
            {rows > 1 && (
              <button
                onClick={() => handleResize(rows - 1, cols)}
                style={{
                  color: "#9ca3af",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  fontSize: 10,
                }}
              >
                -row
              </button>
            )}
            {cols > 1 && (
              <button
                onClick={() => handleResize(rows, cols - 1)}
                style={{
                  color: "#9ca3af",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  fontSize: 10,
                }}
              >
                -col
              </button>
            )}
          </div>
        </div>
      </NodeShell>
    );
  },
);

MatrixNode.displayName = "MatrixNode";
