import React, { useCallback } from "react"
import type { NodeProps } from "@xyflow/react"
import type { MathNodeData } from "../../../types"
import { NodeShell } from "./NodeShell"
import { useFlowStore } from "../store/flowStore"

export const MatrixNode: React.FC<NodeProps> = React.memo(
  ({ id, data, selected }) => {
    const nodeData = data as unknown as MathNodeData
    const updateNodeParam = useFlowStore((s) => s.updateNodeParam)

    const matrix = (nodeData.params.matrix as number[][]) ?? [[0]]
    const rows = matrix.length
    const cols = matrix[0]?.length ?? 1
    const colsClass =
      cols === 1
        ? "grid-cols-1"
        : cols === 2
          ? "grid-cols-2"
          : cols === 3
            ? "grid-cols-3"
            : cols === 4
              ? "grid-cols-4"
              : cols === 5
                ? "grid-cols-5"
                : "grid-cols-6"

    const handleCellChange = useCallback(
      (row: number, col: number, value: string) => {
        const newMatrix = matrix.map((r) => [...r])
        newMatrix[row][col] = Number(value) || 0
        updateNodeParam(id, "matrix", newMatrix)
      },
      [id, matrix, updateNodeParam],
    )

    const handleResize = useCallback(
      (newRows: number, newCols: number) => {
        const newMatrix: number[][] = []
        for (let r = 0; r < newRows; r++) {
          const row: number[] = []
          for (let c = 0; c < newCols; c++) {
            row.push(matrix[r]?.[c] ?? 0)
          }
          newMatrix.push(row)
        }
        updateNodeParam(id, "matrix", newMatrix)
        updateNodeParam(id, "rows", newRows)
        updateNodeParam(id, "cols", newCols)
      },
      [id, matrix, updateNodeParam],
    )

    return (
      <NodeShell data={nodeData} selected={selected}>
        <div className="flex flex-col gap-2">
          {/* Matrix Grid */}
          <div className={`grid gap-0.5 ${colsClass}`}>
            {matrix.map((row, ri) =>
              row.map((cell, ci) => (
                <input
                  key={`${ri}-${ci}`}
                  type="text"
                  value={cell}
                  onChange={(e) => handleCellChange(ri, ci, e.target.value)}
                  className="node-input w-9 rounded-[3px] border border-[var(--border)] bg-[var(--bg-input)] px-1 py-0.5 text-center font-mono text-[10px] text-[var(--category-matrix)] outline-none"
                />
              )),
            )}
          </div>

          {/* Resize Controls */}
          <div className="flex gap-2 text-[10px] text-[var(--text-muted)]">
            <span>
              {rows}×{cols}
            </span>
            <button
              onClick={() => handleResize(rows + 1, cols)}
              className="text-[10px] text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text-primary)]"
            >
              +row
            </button>
            <button
              onClick={() => handleResize(rows, cols + 1)}
              className="text-[10px] text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text-primary)]"
            >
              +col
            </button>
            {rows > 1 && (
              <button
                onClick={() => handleResize(rows - 1, cols)}
                className="text-[10px] text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text-primary)]"
              >
                -row
              </button>
            )}
            {cols > 1 && (
              <button
                onClick={() => handleResize(rows, cols - 1)}
                className="text-[10px] text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text-primary)]"
              >
                -col
              </button>
            )}
          </div>
        </div>
      </NodeShell>
    )
  },
)

MatrixNode.displayName = "MatrixNode"
