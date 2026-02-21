import React, { useMemo } from "react";
import { useFlowStore } from "../flow/flowStore";

export const Inspector: React.FC = React.memo(() => {
  const selectedNodeId = useFlowStore((s) => s.selectedNodeId);
  const nodes = useFlowStore((s) => s.nodes);
  const computedValues = useFlowStore((s) => s.computedValues);
  const updateNodeParam = useFlowStore((s) => s.updateNodeParam);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId),
    [nodes, selectedNodeId],
  );

  const computed = useMemo(
    () => (selectedNodeId ? computedValues.get(selectedNodeId) : undefined),
    [computedValues, selectedNodeId],
  );

  if (!selectedNode) {
    return (
      <aside
        style={{
          width: 288,
          background: "rgba(17, 19, 26, 0.95)",
          backdropFilter: "blur(12px)",
          borderLeft: "1px solid #262830",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          boxShadow: "-10px 0 30px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            padding: 12,
            borderBottom: "1px solid #262830",
            background: "rgba(28, 30, 38, 0.3)",
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: "#e5e5e5" }}>
            Properties
          </span>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <p style={{ fontSize: 12, color: "#525252", textAlign: "center" }}>
            Select a node to view its properties
          </p>
        </div>
      </aside>
    );
  }

  const { data } = selectedNode;

  const categoryColors: Record<string, string> = {
    input: "#3b82f6",
    arithmetic: "#3b82f6",
    calculus: "#8b5cf6",
    display: "#10b981",
    advanced: "#f59e0b",
  };

  const accentColor = categoryColors[data.category] ?? "#6b7280";

  const formatValue = (val: unknown): string => {
    if (val === undefined || val === null) return "—";
    if (typeof val === "number") return val.toFixed(4);
    if (typeof val === "string") return val;
    if (typeof val === "object" && "raw" in (val as Record<string, unknown>))
      return (val as { raw: string }).raw;
    if (Array.isArray(val)) return `[${val.length} items]`;
    return JSON.stringify(val);
  };

  return (
    <aside
      style={{
        width: 288,
        background: "rgba(17, 19, 26, 0.95)",
        backdropFilter: "blur(12px)",
        borderLeft: "1px solid #262830",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        boxShadow: "-10px 0 30px rgba(0,0,0,0.5)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 12,
          borderBottom: "1px solid #262830",
          background: "rgba(28, 30, 38, 0.3)",
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 600, color: "#e5e5e5" }}>
          Properties
        </span>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Node Info */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 4,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: `${accentColor}15`,
                border: `1px solid ${accentColor}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              {data.category === "calculus"
                ? "∂"
                : data.category === "display"
                  ? "📊"
                  : "🔢"}
            </div>
            <div>
              <h2
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#fff",
                  margin: 0,
                }}
              >
                {data.label}
              </h2>
              <p
                style={{
                  fontSize: 10,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "#6b7280",
                  margin: 0,
                }}
              >
                ID: {selectedNode.id}
              </p>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "#262830" }} />

        {/* Parameters */}
        {Object.keys(data.params).length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h3
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#6b7280",
                fontWeight: 500,
                margin: 0,
              }}
            >
              Parameters
            </h3>
            {Object.entries(data.params).map(([key, value]) => {
              // Skip complex params from display editing
              if (
                typeof value === "object" &&
                value !== null &&
                !Array.isArray(value)
              )
                return null;
              if (Array.isArray(value) && Array.isArray(value[0])) return null; // matrix

              return (
                <div
                  key={key}
                  style={{ display: "flex", flexDirection: "column", gap: 4 }}
                >
                  <label
                    style={{
                      fontSize: 11,
                      color: "#9ca3af",
                      textTransform: "capitalize",
                    }}
                  >
                    {key}
                  </label>
                  <input
                    type="text"
                    value={
                      Array.isArray(value)
                        ? value.join(", ")
                        : String(value ?? "")
                    }
                    onChange={(e) => {
                      const raw = e.target.value;
                      // Try to parse as number
                      const asNum = Number(raw);
                      updateNodeParam(
                        selectedNode.id,
                        key,
                        isNaN(asNum) ? raw : asNum,
                      );
                    }}
                    style={{
                      width: "100%",
                      background: "#0f1117",
                      border: "1px solid #262830",
                      borderRadius: 6,
                      padding: "6px 8px",
                      fontSize: 12,
                      color: "#e5e5e5",
                      fontFamily: "'JetBrains Mono', monospace",
                      outline: "none",
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}

        <div style={{ height: 1, background: "#262830" }} />

        {/* Ports */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <h3
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#6b7280",
              fontWeight: 500,
              margin: 0,
            }}
          >
            Ports
          </h3>
          {data.inputs.length > 0 && (
            <div>
              <span style={{ fontSize: 10, color: "#525252" }}>Inputs</span>
              {data.inputs.map((port) => (
                <div
                  key={port.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 11,
                    padding: "4px 0",
                  }}
                >
                  <span style={{ color: "#9ca3af" }}>{port.label}</span>
                  <span
                    style={{
                      fontSize: 10,
                      color: "#6b7280",
                      background: "#1c1e26",
                      padding: "1px 6px",
                      borderRadius: 4,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {port.type}
                  </span>
                </div>
              ))}
            </div>
          )}
          {data.outputs.length > 0 && (
            <div>
              <span style={{ fontSize: 10, color: "#525252" }}>Outputs</span>
              {data.outputs.map((port) => (
                <div
                  key={port.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 11,
                    padding: "4px 0",
                  }}
                >
                  <span style={{ color: "#9ca3af" }}>{port.label}</span>
                  <span
                    style={{
                      fontSize: 10,
                      color: "#6b7280",
                      background: "#1c1e26",
                      padding: "1px 6px",
                      borderRadius: 4,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {port.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ height: 1, background: "#262830" }} />

        {/* Computed Result */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <h3
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#6b7280",
              fontWeight: 500,
              margin: 0,
            }}
          >
            Execution
          </h3>
          <div
            style={{
              background: "#0f1117",
              border: "1px solid #262830",
              borderRadius: 8,
              padding: 12,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 11,
              }}
            >
              <span style={{ color: "#6b7280" }}>Status</span>
              <span
                style={{
                  color:
                    data.status === "success"
                      ? "#10b981"
                      : data.status === "error"
                        ? "#ef4444"
                        : data.status === "running"
                          ? "#f59e0b"
                          : "#6b7280",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background:
                      data.status === "success"
                        ? "#10b981"
                        : data.status === "error"
                          ? "#ef4444"
                          : data.status === "running"
                            ? "#f59e0b"
                            : "#525252",
                  }}
                />
                {data.status === "idle"
                  ? "Idle"
                  : data.status === "success"
                    ? "Success"
                    : data.status === "error"
                      ? "Error"
                      : "Running"}
              </span>
            </div>
            {computed && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 11,
                }}
              >
                <span style={{ color: "#6b7280" }}>Value</span>
                <span
                  style={{
                    color: computed.error ? "#ef4444" : "#e5e5e5",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    maxWidth: 150,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {computed.error ?? formatValue(computed.value)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
});

Inspector.displayName = "Inspector";
