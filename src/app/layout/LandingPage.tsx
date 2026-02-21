import React, { useCallback } from "react";
import { useFlowStore } from "../../features/flow/flowStore";

export const LandingPage: React.FC = React.memo(() => {
  const appStarted = useFlowStore((s) => s.appStarted);
  const setAppStarted = useFlowStore((s) => s.setAppStarted);

  const handleStart = useCallback(() => {
    setAppStarted(true);
  }, [setAppStarted]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "#0f1117",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.7s ease-in-out",
        opacity: appStarted ? 0 : 1,
        pointerEvents: appStarted ? "none" : "auto",
        transform: appStarted ? "scale(1.05)" : "scale(1)",
      }}
    >
      {/* Dot Grid Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.4,
          backgroundImage:
            "radial-gradient(circle, rgba(139,92,246,0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, transparent, rgba(15,17,23,0.8), #0f1117)",
        }}
      />

      <div
        style={{
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: 640,
          padding: "0 24px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 28,
            boxShadow: "0 0 40px rgba(139, 92, 246, 0.4)",
            marginBottom: 32,
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          Σ
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 600,
            color: "#fff",
            marginBottom: 16,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Build Mathematics Visually
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: 18,
            color: "#9ca3af",
            marginBottom: 40,
            fontWeight: 300,
            lineHeight: 1.7,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Compose complex equations, connect ideas, and see results instantly in
          a powerful, professional-grade node environment.
        </p>

        {/* CTA */}
        <button
          onClick={handleStart}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            background: "#fff",
            color: "#0f1117",
            padding: "12px 32px",
            borderRadius: 40,
            fontWeight: 500,
            fontSize: 15,
            cursor: "pointer",
            border: "none",
            transition: "all 0.3s",
            fontFamily: "'Inter', sans-serif",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 0 30px rgba(255,255,255,0.3)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }}
        >
          Start Building
          <span style={{ fontSize: 18, transition: "transform 0.3s" }}>→</span>
        </button>
      </div>
    </div>
  );
});

LandingPage.displayName = "LandingPage";
