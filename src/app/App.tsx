import React, { useEffect } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { Header } from "./layout/Header";
import { LandingPage } from "./layout/LandingPage";
import { Sidebar } from "../features/sidebar/Sidebar";
import { FlowCanvas } from "../features/flow/FlowCanvas";
import { Inspector } from "../features/inspector/Inspector";
import { Console } from "../features/console/Console";
import { useFlowStore } from "../features/flow/flowStore";

const App: React.FC = () => {
  const appStarted = useFlowStore((s) => s.appStarted);
  const inspectorOpen = useFlowStore((s) => s.inspectorOpen);
  const toggleInspector = useFlowStore((s) => s.toggleInspector);
  const theme = useFlowStore((s) => s.theme);

  // Sync theme attribute on mount and changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>
      {!appStarted && <LandingPage />}

      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          opacity: appStarted ? 1 : 0,
          pointerEvents: appStarted ? "auto" : "none",
          transition: "opacity 0.5s ease-out",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <Header />

        <div
          style={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Sidebar />

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
              <ReactFlowProvider>
                <FlowCanvas />
              </ReactFlowProvider>

              {/* Inspector Toggle Button — synced transition with panel */}
              <button
                onClick={toggleInspector}
                title={inspectorOpen ? "Hide Inspector" : "Show Inspector"}
                style={{
                  position: "absolute",
                  right: inspectorOpen ? 0 : 0,
                  top: 12,
                  zIndex: 10,
                  width: 24,
                  height: 40,
                  background: "var(--bg-secondary)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid var(--border)",
                  borderRight: inspectorOpen
                    ? "none"
                    : "1px solid var(--border)",
                  borderTopLeftRadius: 6,
                  borderBottomLeftRadius: 6,
                  borderTopRightRadius: inspectorOpen ? 0 : 6,
                  borderBottomRightRadius: inspectorOpen ? 0 : 6,
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  padding: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-muted)";
                }}
              >
                {inspectorOpen ? "▶" : "◀"}
              </button>
            </div>
            <Console />
          </div>

          {/* Inspector Panel — single transition on width, no inner transform */}
          <div
            style={{
              width: inspectorOpen ? 288 : 0,
              minHeight: "100%",
              overflow: "hidden",
              transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 288,
                height: "100%",
                minHeight: "100%",
              }}
            >
              <Inspector />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
