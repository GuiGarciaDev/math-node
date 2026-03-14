import type { ReactElement, ReactNode } from "react"
import { cn } from "@/lib/utils"
import {
  WORKFLOW_ILLUSTRATION_IDS,
  type WorkflowIllustrationId,
} from "@/utils/workflowAppearance"

export type TemplateIllustrationId =
  | "template-addition-flow"
  | "template-derivative-path"
  | "template-power-chain"

export type IllustrationId = WorkflowIllustrationId | TemplateIllustrationId

export type WorkflowIllustrationOption = {
  id: WorkflowIllustrationId
  label: string
}

export const WORKFLOW_ILLUSTRATION_OPTIONS: WorkflowIllustrationOption[] = [
  { id: WORKFLOW_ILLUSTRATION_IDS[0], label: "Harmonic Oscillation" },
  { id: WORKFLOW_ILLUSTRATION_IDS[1], label: "Orbital Mechanics" },
  { id: WORKFLOW_ILLUSTRATION_IDS[2], label: "Magnetic Dipole" },
  { id: WORKFLOW_ILLUSTRATION_IDS[3], label: "Hyperbolic Geometry" },
  {
    id: WORKFLOW_ILLUSTRATION_IDS[4],
    label: "Double-Slit Interference",
  },
  { id: WORKFLOW_ILLUSTRATION_IDS[5], label: "Fibonacci Spiral" },
  { id: WORKFLOW_ILLUSTRATION_IDS[6], label: "Spacetime Curvature" },
]

export const TEMPLATE_ILLUSTRATION_BY_TEMPLATE_ID: Record<
  string,
  TemplateIllustrationId
> = {
  template_quick_add: "template-addition-flow",
  template_derivative_plot: "template-derivative-path",
  template_power_chain: "template-power-chain",
}

type IllustrationProps = {
  className?: string
}

function IllustrationFrame({
  bgClass,
  children,
  className,
}: {
  bgClass: string
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden",
        bgClass,
        "bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[14px_14px]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-b from-transparent to-black/35" />
      {children}
    </div>
  )
}

export function HarmonicOscillationIllustration({
  className,
}: IllustrationProps) {
  return (
    <IllustrationFrame bgClass="bg-[#1b3440]" className={className}>
      <svg
        className="absolute inset-0 h-full w-full text-cyan-400/45 transition-all duration-700 group-hover:scale-105 group-hover:text-cyan-300/80"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 0 50 C 20 20, 30 20, 50 50 C 70 80, 80 80, 100 50"
          vectorEffect="non-scaling-stroke"
          stroke="currentColor"
          fill="none"
          strokeWidth="1.5"
        />
        <path
          d="M 0 50 C 20 30, 30 30, 50 50 C 70 70, 80 70, 100 50"
          vectorEffect="non-scaling-stroke"
          stroke="currentColor"
          fill="none"
          strokeWidth="1.5"
          className="opacity-60"
        />
        <path
          d="M 0 50 C 20 40, 30 40, 50 50 C 70 60, 80 60, 100 50"
          vectorEffect="non-scaling-stroke"
          stroke="currentColor"
          fill="none"
          strokeWidth="1.5"
          className="opacity-30"
        />
      </svg>
    </IllustrationFrame>
  )
}

export function OrbitalMechanicsIllustration({ className }: IllustrationProps) {
  return (
    <IllustrationFrame bgClass="bg-[#262140]" className={className}>
      <svg
        className="absolute -inset-[10%] h-[120%] w-[120%] text-violet-400/45 transition-all duration-700 group-hover:rotate-6 group-hover:scale-110 group-hover:text-violet-300/85"
        viewBox="0 0 100 100"
      >
        <ellipse
          cx="50"
          cy="50"
          rx="35"
          ry="12"
          transform="rotate(30 50 50)"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-50"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="35"
          ry="12"
          transform="rotate(90 50 50)"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="35"
          ry="12"
          transform="rotate(150 50 50)"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-50"
        />
        <circle
          cx="50"
          cy="50"
          r="3"
          fill="currentColor"
          className="text-violet-200 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]"
        />
        <circle cx="21" cy="67" r="1.5" fill="currentColor" />
      </svg>
    </IllustrationFrame>
  )
}

export function MagneticDipoleIllustration({ className }: IllustrationProps) {
  return (
    <IllustrationFrame bgClass="bg-[#3d2e1b]" className={className}>
      <svg
        className="absolute inset-0 h-full w-full text-amber-500/45 transition-all duration-700 group-hover:scale-105 group-hover:text-amber-300/80"
        viewBox="0 0 100 100"
      >
        <path
          d="M 50 15 C 85 15, 85 85, 50 85"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M 50 15 C 105 5, 105 95, 50 85"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-50"
        />
        <path
          d="M 50 15 C 15 15, 15 85, 50 85"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M 50 15 C -5 5, -5 95, 50 85"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-50"
        />
        <line
          x1="50"
          y1="10"
          x2="50"
          y2="90"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="2 4"
        />
      </svg>
    </IllustrationFrame>
  )
}

export function HyperbolicGeometryIllustration({
  className,
}: IllustrationProps) {
  return (
    <IllustrationFrame bgClass="bg-[#401b2a]" className={className}>
      <svg
        className="absolute inset-[5%] h-[90%] w-[90%] text-rose-400/45 transition-all duration-700 group-hover:rotate-15 group-hover:scale-110 group-hover:text-rose-300/85"
        viewBox="0 0 100 100"
      >
        <path
          d="M 10 50 Q 50 10 90 50 Q 50 90 10 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M 20 50 Q 50 20 80 50 Q 50 80 20 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-80"
        />
        <path
          d="M 30 50 Q 50 30 70 50 Q 50 70 30 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-50"
        />
        <path
          d="M 40 50 Q 50 40 60 50 Q 50 60 40 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-30"
        />
        <line
          x1="50"
          y1="10"
          x2="50"
          y2="90"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-20"
        />
        <line
          x1="10"
          y1="50"
          x2="90"
          y2="50"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-20"
        />
      </svg>
    </IllustrationFrame>
  )
}

export function DoubleSlitInterferenceIllustration({
  className,
}: IllustrationProps) {
  return (
    <IllustrationFrame bgClass="bg-[#1b2b40]" className={className}>
      <svg
        className="absolute -inset-[5%] h-[110%] w-[110%] text-blue-400/45 transition-all duration-700 group-hover:scale-105 group-hover:text-blue-300/80"
        viewBox="0 0 100 100"
      >
        <circle
          cx="35"
          cy="50"
          r="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          cx="35"
          cy="50"
          r="25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-70"
        />
        <circle
          cx="35"
          cy="50"
          r="35"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-40"
        />
        <circle
          cx="35"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-20"
        />
        <circle
          cx="65"
          cy="50"
          r="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          cx="65"
          cy="50"
          r="25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-70"
        />
        <circle
          cx="65"
          cy="50"
          r="35"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-40"
        />
        <circle
          cx="65"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-20"
        />
      </svg>
    </IllustrationFrame>
  )
}

export function FibonacciSpiralIllustration({ className }: IllustrationProps) {
  return (
    <IllustrationFrame bgClass="bg-[#1b402e]" className={className}>
      <svg
        className="absolute inset-[10%] h-[80%] w-[80%] text-emerald-400/45 transition-all duration-700 group-hover:scale-110 group-hover:text-emerald-300/85"
        viewBox="0 0 100 100"
      >
        <rect
          x="20"
          y="20"
          width="45"
          height="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-40"
        />
        <rect
          x="65"
          y="20"
          width="28"
          height="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-50"
        />
        <rect
          x="65"
          y="48"
          width="17"
          height="17"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-60"
        />
        <rect
          x="82"
          y="48"
          width="11"
          height="11"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-80"
        />
        <path
          d="M 20 65 A 45 45 0 0 1 65 20 A 28 28 0 0 1 93 48 A 17 17 0 0 1 76 65 A 11 11 0 0 1 65 54"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="drop-shadow-[0_0_4px_rgba(52,211,153,0.3)]"
        />
      </svg>
    </IllustrationFrame>
  )
}

export function SpacetimeCurvatureIllustration({
  className,
}: IllustrationProps) {
  return (
    <IllustrationFrame bgClass="bg-[#202024]" className={className}>
      <svg
        className="absolute inset-0 h-full w-full text-zinc-400/35 transition-all duration-700 group-hover:scale-[1.03] group-hover:text-zinc-300/70"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 0 20 Q 50 22 100 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <path
          d="M 0 40 Q 50 48 100 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M 0 60 Q 50 85 100 60"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-zinc-300 transition-colors group-hover:text-zinc-100"
        />
        <path
          d="M 0 80 Q 50 92 100 80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M 10 0 Q 15 50 10 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <path
          d="M 30 0 Q 40 50 30 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M 50 0 Q 50 50 50 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M 70 0 Q 60 50 70 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M 90 0 Q 85 50 90 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <circle
          cx="50"
          cy="72"
          r="4"
          fill="currentColor"
          className="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]"
        />
      </svg>
    </IllustrationFrame>
  )
}

export function TemplateAdditionFlowIllustration({
  className,
}: IllustrationProps) {
  return (
    <IllustrationFrame bgClass="bg-[#1d2d44]" className={className}>
      <svg
        className="absolute inset-0 h-full w-full text-cyan-300/70"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <circle
          cx="18"
          cy="30"
          r="7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          cx="18"
          cy="70"
          r="7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="58"
          y="43"
          width="14"
          height="14"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line
          x1="25"
          y1="30"
          x2="58"
          y2="47"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />
        <line
          x1="25"
          y1="70"
          x2="58"
          y2="53"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />
        <line
          x1="64"
          y1="46"
          x2="64"
          y2="54"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line
          x1="60"
          y1="50"
          x2="68"
          y2="50"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </IllustrationFrame>
  )
}

export function TemplateDerivativePathIllustration({
  className,
}: IllustrationProps) {
  return (
    <IllustrationFrame bgClass="bg-[#2f233c]" className={className}>
      <svg
        className="absolute inset-0 h-full w-full text-violet-300/70"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 10 68 C 24 20, 45 78, 65 35"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M 10 78 C 24 28, 45 88, 65 45"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-50"
        />
        <rect
          x="68"
          y="28"
          width="22"
          height="22"
          rx="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line
          x1="72"
          y1="45"
          x2="86"
          y2="33"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />
      </svg>
    </IllustrationFrame>
  )
}

export function TemplatePowerChainIllustration({
  className,
}: IllustrationProps) {
  return (
    <IllustrationFrame bgClass="bg-[#233428]" className={className}>
      <svg
        className="absolute inset-0 h-full w-full text-emerald-300/70"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <rect
          x="14"
          y="22"
          width="14"
          height="14"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="14"
          y="62"
          width="14"
          height="14"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="42"
          y="42"
          width="16"
          height="16"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="72"
          y="34"
          width="16"
          height="16"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line
          x1="28"
          y1="29"
          x2="42"
          y2="48"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />
        <line
          x1="28"
          y1="69"
          x2="42"
          y2="52"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />
        <line
          x1="58"
          y1="50"
          x2="72"
          y2="42"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />
        <text
          x="79"
          y="31"
          fill="currentColor"
          fontSize="8"
          className="font-medium"
        >
          2
        </text>
      </svg>
    </IllustrationFrame>
  )
}

const ILLUSTRATION_COMPONENTS: Record<
  IllustrationId,
  (props: IllustrationProps) => ReactElement
> = {
  "harmonic-oscillation": HarmonicOscillationIllustration,
  "orbital-mechanics": OrbitalMechanicsIllustration,
  "magnetic-dipole": MagneticDipoleIllustration,
  "hyperbolic-geometry": HyperbolicGeometryIllustration,
  "double-slit-interference": DoubleSlitInterferenceIllustration,
  "fibonacci-spiral": FibonacciSpiralIllustration,
  "spacetime-curvature": SpacetimeCurvatureIllustration,
  "template-addition-flow": TemplateAdditionFlowIllustration,
  "template-derivative-path": TemplateDerivativePathIllustration,
  "template-power-chain": TemplatePowerChainIllustration,
}

export function isValidWorkflowIllustrationId(
  value: string | null | undefined,
): value is WorkflowIllustrationId {
  return WORKFLOW_ILLUSTRATION_IDS.includes(value as WorkflowIllustrationId)
}

export function ProjectIllustrationPreview({
  illustration,
  className,
}: {
  illustration: IllustrationId
  className?: string
}) {
  const Component = ILLUSTRATION_COMPONENTS[illustration]
  return <Component className={className} />
}
