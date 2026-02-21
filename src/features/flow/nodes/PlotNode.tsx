import React, { useMemo, useCallback } from "react";
import type { NodeProps } from "@xyflow/react";
import type { MathNodeData } from "../../../types";
import { NodeShell } from "./NodeShell";
import { useFlowStore } from "../flowStore";

export const PlotNode: React.FC<NodeProps> = React.memo(
  ({ id, data, selected }) => {
    const nodeData = data as unknown as MathNodeData;
    const computed = useFlowStore((s) => s.computedValues.get(id));
    const updateNodeParam = useFlowStore((s) => s.updateNodeParam);

    const domain = (nodeData.params.domain as [number, number]) ?? [-10, 10];

    const points = useMemo(() => {
      if (!computed?.value || !Array.isArray(computed.value)) return [];
      return computed.value as Array<{ x: number; y: number }>;
    }, [computed]);

    const svgPath = useMemo(() => {
      if (points.length === 0) return "";

      const width = 240;
      const height = 120;
      const padding = 8;

      const xs = points.map((p) => p.x);
      const ys = points.map((p) => p.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const rangeX = maxX - minX || 1;
      const rangeY = maxY - minY || 1;

      const scaleX = (x: number) =>
        padding + ((x - minX) / rangeX) * (width - padding * 2);
      const scaleY = (y: number) =>
        height - padding - ((y - minY) / rangeY) * (height - padding * 2);

      let d = `M ${scaleX(points[0].x)} ${scaleY(points[0].y)}`;
      for (let i = 1; i < points.length; i++) {
        d += ` L ${scaleX(points[i].x)} ${scaleY(points[i].y)}`;
      }
      return d;
    }, [points]);

    const zeroLineY = useMemo(() => {
      if (points.length === 0) return null;
      const ys = points.map((p) => p.y);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const rangeY = maxY - minY || 1;
      if (minY > 0 || maxY < 0) return null;
      return 120 - 8 - ((0 - minY) / rangeY) * (120 - 16);
    }, [points]);

    const handleZoomIn = useCallback(() => {
      const range = domain[1] - domain[0];
      const mid = (domain[0] + domain[1]) / 2;
      const newHalf = range * 0.4;
      updateNodeParam(id, "domain", [mid - newHalf, mid + newHalf]);
    }, [id, domain, updateNodeParam]);

    const handleZoomOut = useCallback(() => {
      const range = domain[1] - domain[0];
      const mid = (domain[0] + domain[1]) / 2;
      const newHalf = range * 0.6;
      updateNodeParam(id, "domain", [mid - newHalf, mid + newHalf]);
    }, [id, domain, updateNodeParam]);

    return (
      <NodeShell data={nodeData} selected={selected}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            minWidth: 240,
          }}
        >
          {/* Graph Area */}
          <div
            style={{
              width: "100%",
              height: 120,
              background: "#0f1117",
              border: "1px solid #262830",
              borderRadius: 8,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Grid lines */}
            <svg
              width="100%"
              height="100%"
              style={{ position: "absolute", top: 0, left: 0, opacity: 0.15 }}
            >
              {[0.25, 0.5, 0.75].map((f) => (
                <React.Fragment key={f}>
                  <line
                    x1="0"
                    y1={`${f * 100}%`}
                    x2="100%"
                    y2={`${f * 100}%`}
                    stroke="#6b7280"
                    strokeWidth="0.5"
                  />
                  <line
                    x1={`${f * 100}%`}
                    y1="0"
                    x2={`${f * 100}%`}
                    y2="100%"
                    stroke="#6b7280"
                    strokeWidth="0.5"
                  />
                </React.Fragment>
              ))}
            </svg>

            {/* Zero line */}
            {zeroLineY !== null && (
              <div
                style={{
                  position: "absolute",
                  top: zeroLineY,
                  left: 0,
                  width: "100%",
                  height: 1,
                  background: "#525252",
                }}
              />
            )}

            {/* Center vertical line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                width: 1,
                height: "100%",
                background: "#525252",
              }}
            />

            {/* Graph Curve */}
            {svgPath && (
              <svg
                width="240"
                height="120"
                viewBox="0 0 240 120"
                style={{ position: "absolute", top: 0, left: 0 }}
                preserveAspectRatio="none"
              >
                <path
                  d={svgPath}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  style={{
                    filter: "drop-shadow(0 0 4px rgba(16, 185, 129, 0.5))",
                  }}
                />
              </svg>
            )}

            {points.length === 0 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  color: "#525252",
                }}
              >
                No data
              </div>
            )}
          </div>

          {/* Controls */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 10, color: "#6b7280" }}>
              Domain: [{domain[0].toFixed(0)}, {domain[1].toFixed(0)}]
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                onClick={handleZoomOut}
                style={{
                  width: 20,
                  height: 20,
                  background: "#1c1e26",
                  border: "1px solid #262830",
                  borderRadius: 4,
                  color: "#9ca3af",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                }}
              >
                −
              </button>
              <button
                onClick={handleZoomIn}
                style={{
                  width: 20,
                  height: 20,
                  background: "#1c1e26",
                  border: "1px solid #262830",
                  borderRadius: 4,
                  color: "#9ca3af",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </NodeShell>
    );
  },
);

PlotNode.displayName = "PlotNode";
