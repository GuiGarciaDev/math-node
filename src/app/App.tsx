import React from "react";
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

  return (
    <>
      <LandingPage />

      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          opacity: appStarted ? 1 : 0,
          transform: appStarted ? "scale(1)" : "scale(0.95)",
          transition: "all 0.7s ease-out 0.1s",
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
            }}
          >
            <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
              <ReactFlowProvider>
                <FlowCanvas />
              </ReactFlowProvider>
            </div>
            <Console />
          </div>

          <Inspector />
        </div>
      </div>
    </>
  );
};

export default App;
