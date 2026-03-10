import { memo, useRef } from "react"
import { Activity, ArrowRight, BookOpen, InfinityIcon, Zap } from "lucide-react"
import ToggleThemeButton from "@/components/toggle-theme"
import { HeroCanvas } from "./HeroCanvas"
import { FloatingCard } from "./FloatingCard"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type HeroSectionProps = {
  onLaunchStudio?: () => void
}

function HeroSectionComponent({ onLaunchStudio }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement | null>(null)

  return (
    <section
      ref={heroRef}
      className="relative flex h-[650px] w-full flex-col items-center justify-center overflow-hidden border-b border-border"
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#020503] via-[#060e0a] to-[#040806] transition-colors duration-1000 dark:from-[#020503] dark:via-[#060e0a] dark:to-[#040806]" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#fdfbf7]/75 via-white/80 to-[#f8fafc]/70 opacity-0 transition-opacity duration-700 dark:opacity-0 light:opacity-100" />

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="projects-blob projects-blob-1" />
        <div className="projects-blob projects-blob-2" />
        <div className="projects-blob projects-blob-3" />
      </div>

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="projects-light-beam" />
        <div className="projects-light-beam" />
      </div>

      <HeroCanvas interactionRef={heroRef} />

      <svg
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-25"
        preserveAspectRatio="none"
      >
        <path
          className="projects-math-path"
          d="M0,300 Q150,100 300,300 T600,300 T900,300 T1200,300 T1500,300"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="1.5"
        />
        <path
          className="projects-math-path"
          d="M0,400 Q200,600 400,400 T800,400 T1200,400 T1600,400"
          fill="none"
          stroke="#fb7185"
          strokeWidth="1"
          style={{ animationDelay: "-6s" }}
        />
        <circle
          cx="80%"
          cy="30%"
          r="220"
          fill="none"
          stroke="#10b981"
          strokeWidth="1"
          strokeDasharray="4 12"
          className="animate-[spin_45s_linear_infinite] opacity-40"
        />
        <circle
          cx="20%"
          cy="70%"
          r="320"
          fill="none"
          stroke="rgba(251, 191, 36, 0.4)"
          strokeWidth="0.5"
          strokeDasharray="2 8"
          className="animate-[spin_70s_linear_infinite_reverse] opacity-30"
        />
      </svg>

      <div className="absolute right-8 top-6 z-50">
        <ToggleThemeButton />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10">
        <FloatingCard speed={0.05} className="right-[12%] top-24 w-72 h-48">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300/80">
                Integration Node
              </span>
            </div>
            <Activity className="h-5 w-5 text-amber-300/70" />
          </div>
          <div className="space-y-3">
            <div className="relative flex h-12 w-full items-center justify-center overflow-hidden rounded-lg border border-amber-300/20 bg-black/50">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_40%)] opacity-30" />
              <span className="font-mono text-lg tracking-wider text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                ∫ f(x) dx
              </span>
            </div>
            <div className="flex gap-2">
              <div className="h-2 w-1/3 rounded-full bg-emerald-500/30" />
              <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-amber-300/60 to-transparent" />
            </div>
          </div>
        </FloatingCard>

        <FloatingCard
          speed={-0.03}
          className="bottom-16 left-[10%] w-64 h-52"
          innerClassName="[animation-delay:-3.5s]"
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-rose-400 shadow-[0_0_12px_#fb7185]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300/80">
              Neural Layer
            </span>
          </div>
          <div className="relative flex h-24 items-center justify-center">
            <svg className="h-full w-full" viewBox="0 0 100 50">
              <path
                d="M10,25 L40,10 M10,25 L40,40 M40,10 L70,25 M40,40 L70,25 M70,25 L90,25"
                stroke="rgba(251,191,36,0.3)"
                strokeWidth="1"
                fill="none"
              />
              <circle cx="10" cy="25" r="4" fill="#10b981" />
              <circle cx="40" cy="10" r="4" fill="#fbbf24" />
              <circle cx="40" cy="40" r="4" fill="#fbbf24" />
              <circle cx="70" cy="25" r="4" fill="#fb7185" />
              <circle cx="90" cy="25" r="3" fill="#ffffff" opacity="0.6" />
            </svg>
          </div>
        </FloatingCard>
      </div>

      <div className="relative z-20 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <div className="projects-fade-in projects-glass-panel mb-8 inline-flex items-center gap-3 rounded-full border border-amber-300/30 px-5 py-2 shadow-[0_0_20px_rgba(251,191,36,0.1)]">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
            Premium Edition Live
          </span>
        </div>

        <div className="projects-fade-in projects-stagger-1 mb-6 flex items-center justify-center gap-4">
          <div className="projects-glass-panel group relative cursor-pointer rounded-2xl border border-amber-300/30 p-3 text-white shadow-2xl transition-transform hover:rotate-12">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-300 opacity-0 blur-md transition-opacity group-hover:opacity-20" />
            <InfinityIcon className="relative h-12 w-12 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-colors group-hover:text-amber-300" />
          </div>
          <h1 className="text-5xl font-black tracking-tight text-transparent bg-gradient-to-r from-white via-amber-100 to-white/80 bg-clip-text drop-shadow-lg md:text-7xl dark:from-white dark:via-amber-100 dark:to-white/80 light:from-slate-900 light:via-amber-600 light:to-slate-700">
            Math Node
          </h1>
        </div>

        <p className="projects-fade-in projects-stagger-2 mb-10 max-w-2xl text-lg font-medium leading-relaxed text-muted-foreground drop-shadow-md md:text-2xl">
          Design infinite possibilities. Build complex symbolic and numeric
          workflows in a mesmerizing visual graph environment.
        </p>

        <div className="projects-fade-in projects-stagger-3 flex flex-wrap items-center justify-center gap-6">
          <button
            type="button"
            onClick={onLaunchStudio}
            className="projects-glow-button group relative inline-flex items-center gap-3 rounded-full bg-white px-9 py-4 font-bold text-black shadow-[0_15px_35px_rgba(0,0,0,0.4)] transition-all hover:pr-11 active:scale-95"
          >
            <Zap className="h-5 w-5 text-emerald-500 transition-colors group-hover:text-amber-300" />
            <span className="text-[15px] uppercase tracking-wider">
              Launch Studio
            </span>
            <ArrowRight className="absolute right-5 h-4 w-4 text-amber-300 opacity-0 transition-all group-hover:opacity-100" />
          </button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  disabled
                  className="projects-glass-panel inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-amber-300/20 px-9 py-4 font-medium text-white opacity-65 transition-all dark:text-white light:text-slate-800"
                >
                  <BookOpen className="h-4 w-4 text-amber-300" />
                  Explore Docs
                </button>
              </TooltipTrigger>
              <TooltipContent>In development</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </section>
  )
}

export const HeroSection = memo(HeroSectionComponent)
