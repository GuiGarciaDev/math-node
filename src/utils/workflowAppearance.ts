export type WorkflowPreview = "panel" | "orbit" | "bars" | "lattice"

export type WorkflowAppearance = {
  tag: string
  gradient: string
  tone: string
  preview: WorkflowPreview
}

export type AppearancePreset = {
  id: string
  gradient: string
  tone: string
}

export const WORKFLOW_TAG_DEFAULT = "NODE PIPELINE"

export const WORKFLOW_PREVIEW_OPTIONS: WorkflowPreview[] = [
  "lattice",
  "panel",
  "orbit",
  "bars",
]

export const WORKFLOW_PRESET_OPTIONS: AppearancePreset[] = [
  {
    id: "rose",
    gradient: "bg-gradient-to-r from-rose-400 to-rose-500",
    tone: "bg-gradient-to-br from-rose-400/10 to-transparent",
  },
  {
    id: "emerald",
    gradient: "bg-gradient-to-r from-emerald-500 to-emerald-400",
    tone: "bg-gradient-to-br from-emerald-500/10 to-transparent",
  },
  {
    id: "gold",
    gradient: "bg-gradient-to-r from-amber-300 to-amber-500",
    tone: "bg-gradient-to-br from-amber-300/10 to-transparent",
  },
  {
    id: "sunset",
    gradient: "bg-gradient-to-r from-amber-300 to-rose-400",
    tone: "bg-gradient-to-br from-amber-200/15 to-rose-300/10",
  },
  {
    id: "forest",
    gradient: "bg-gradient-to-r from-emerald-600 to-amber-400",
    tone: "bg-gradient-to-br from-emerald-400/15 to-amber-200/10",
  },
  {
    id: "orchid",
    gradient: "bg-gradient-to-r from-rose-500 to-emerald-400",
    tone: "bg-gradient-to-br from-rose-300/15 to-emerald-300/10",
  },
]

export function getRandomAppearancePreset(): AppearancePreset {
  const index = Math.floor(Math.random() * WORKFLOW_PRESET_OPTIONS.length)
  return WORKFLOW_PRESET_OPTIONS[index]
}

export function createDefaultWorkflowAppearance(): WorkflowAppearance {
  const preset = getRandomAppearancePreset()
  return {
    tag: WORKFLOW_TAG_DEFAULT,
    gradient: preset.gradient,
    tone: preset.tone,
    preview: WORKFLOW_PREVIEW_OPTIONS[0],
  }
}

export function normalizeWorkflowAppearance(
  appearance?: Partial<WorkflowAppearance> | null,
): WorkflowAppearance {
  const fallback = createDefaultWorkflowAppearance()

  return {
    tag: appearance?.tag?.trim() || WORKFLOW_TAG_DEFAULT,
    gradient: appearance?.gradient || fallback.gradient,
    tone: appearance?.tone || fallback.tone,
    preview: appearance?.preview || fallback.preview,
  }
}
