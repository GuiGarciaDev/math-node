import React, { useCallback } from "react"
import { useFlowStore } from "../../features/flow/flowStore"

export const LandingPage: React.FC = React.memo(() => {
  const appStarted = useFlowStore((s) => s.appStarted)
  const setAppStarted = useFlowStore((s) => s.setAppStarted)

  const handleStart = useCallback(() => {
    setAppStarted(true)
  }, [setAppStarted])

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0f1117] transition-all duration-700 ${
        appStarted
          ? "pointer-events-none scale-105 opacity-0"
          : "pointer-events-auto scale-100 opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(139,92,246,0.15)_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(15,17,23,0.8),#0f1117)]" />

      <div className="relative z-10 flex w-full max-w-[640px] flex-col items-center px-6 text-center">
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,#7c3aed,#3b82f6)] text-[28px] text-white shadow-[0_0_40px_rgba(139,92,246,0.4)]">
          Σ
        </div>

        <h1 className="mb-4 text-[clamp(32px,5vw,48px)] font-semibold leading-[1.2] tracking-[-0.02em] text-white">
          Build Mathematics Visually
        </h1>

        <p className="mb-10 text-lg font-light leading-[1.7] text-[#9ca3af]">
          Compose complex equations, connect ideas, and see results instantly in
          a powerful, professional-grade node environment.
        </p>

        <button
          onClick={handleStart}
          className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-3 text-[15px] font-medium text-[#0f1117] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
        >
          Start Building
          <span className="text-lg transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </button>
      </div>
    </div>
  )
})

LandingPage.displayName = "LandingPage"
