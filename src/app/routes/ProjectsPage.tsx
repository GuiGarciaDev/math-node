import { useMemo, useState } from "react"
import { HeroSection } from "@/components/projects/HeroSection"
import { ProjectsGrid } from "@/components/projects/ProjectsGrid"
import { SearchBar } from "@/components/projects/SearchBar"
import type { ProjectItem } from "@/components/projects/ProjectCard"
import "@/styles/projects-page.css"
import {
  cloneTemplateGraph,
  workflowTemplates,
} from "@/storage/workflowTemplates"
import {
  createWorkflowId,
  deleteWorkflow,
  listWorkflows,
  loadWorkflow,
  saveWorkflow,
  type WorkflowSummary,
} from "@/storage/workflowRepository"
import { useFlowStore } from "@/features/flow/store/flowStore"
import { useUIStore } from "@/features/flow/store/ui-store"
import { formatRelativeTime, matchesSearch } from "@/utils/helper"
import {
  createDefaultWorkflowAppearance,
  normalizeWorkflowAppearance,
  type WorkflowAppearance,
  WORKFLOW_PRESET_OPTIONS,
  WORKFLOW_PREVIEW_OPTIONS,
} from "@/utils/workflowAppearance"
import { Routes } from "@/types/routes-types"
import { useEffect, useCallback } from "react"

export default function ProjectsPage() {
  const openWorkflowSession = useFlowStore((s) => s.openWorkflowSession)
  const [tab, setTab] = useState<"recent" | "templates">("recent")
  const [searchText, setSearchText] = useState("")
  const [previewFilter, setPreviewFilter] = useState<
    "all" | "panel" | "orbit" | "bars" | "lattice"
  >("all")
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [workflows, setWorkflows] = useState<WorkflowSummary[]>([])

  const refreshWorkflows = useCallback(async () => {
    const items = await listWorkflows()
    setWorkflows(items)
  }, [])

  useEffect(() => {
    useUIStore.setState({ route: "PROJECTS_PAGE" })
  }, [])

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true)
        await refreshWorkflows()
      } finally {
        setLoading(false)
      }
    })()
  }, [refreshWorkflows])

  const launchWorkflow = useCallback(
    (payload: {
      id: string
      name: string
      nodes: ReturnType<typeof cloneTemplateGraph>["nodes"]
      edges: ReturnType<typeof cloneTemplateGraph>["edges"]
      appearance: WorkflowAppearance
    }) => {
      openWorkflowSession({
        id: payload.id,
        name: payload.name,
        nodes: payload.nodes,
        edges: payload.edges,
        ...payload.appearance,
      })
      useUIStore.setState({ route: "FLOW_CANVAS_PAGE" as Routes })
    },
    [openWorkflowSession],
  )

  const handleCreateWorkflow = useCallback(async () => {
    if (busy) return
    setBusy(true)

    try {
      const id = createWorkflowId()
      const name = "Untitled"
      const nodes: ReturnType<typeof cloneTemplateGraph>["nodes"] = []
      const edges: ReturnType<typeof cloneTemplateGraph>["edges"] = []
      const appearance = createDefaultWorkflowAppearance()

      await saveWorkflow({ id, name, nodes, edges, ...appearance })
      await refreshWorkflows()
      launchWorkflow({ id, name, nodes, edges, appearance })
    } finally {
      setBusy(false)
    }
  }, [busy, launchWorkflow, refreshWorkflows])

  const handleOpenWorkflow = useCallback(
    async (id: string) => {
      if (busy) return
      setBusy(true)

      try {
        const workflow = await loadWorkflow(id)
        if (!workflow) return

        launchWorkflow({
          id: workflow.id,
          name: workflow.name,
          nodes: workflow.nodes,
          edges: workflow.edges,
          appearance: normalizeWorkflowAppearance(workflow),
        })
      } finally {
        setBusy(false)
      }
    },
    [busy, launchWorkflow],
  )

  const handleCreateFromTemplate = useCallback(
    async (templateId: string) => {
      if (busy) return
      setBusy(true)

      try {
        const templateGraph = cloneTemplateGraph(templateId)
        const id = createWorkflowId()
        const name = `${templateGraph.name} - Copy`
        const appearance = createDefaultWorkflowAppearance()

        await saveWorkflow({
          id,
          name,
          nodes: templateGraph.nodes,
          edges: templateGraph.edges,
          ...appearance,
        })
        await refreshWorkflows()
        launchWorkflow({
          id,
          name,
          nodes: templateGraph.nodes,
          edges: templateGraph.edges,
          appearance,
        })
      } finally {
        setBusy(false)
      }
    },
    [busy, launchWorkflow, refreshWorkflows],
  )

  const handleDeleteWorkflow = useCallback(
    async (id: string) => {
      if (busy) return
      setBusy(true)

      try {
        await deleteWorkflow(id)
        await refreshWorkflows()
      } finally {
        setBusy(false)
      }
    },
    [busy, refreshWorkflows],
  )

  const visibleProjects = useMemo<ProjectItem[]>(() => {
    return workflows
      .filter((workflow) =>
        matchesSearch(`${workflow.name} ${workflow.tag}`, searchText),
      )
      .filter(
        (workflow) =>
          previewFilter === "all" || workflow.preview === previewFilter,
      )
      .map((workflow) => ({
        id: workflow.id,
        name: workflow.name,
        tag: workflow.tag,
        updatedAt: formatRelativeTime(workflow.updatedAt).replace(
          "Edited ",
          "",
        ),
        gradient: workflow.gradient,
        tone: workflow.tone,
        preview: workflow.preview,
      }))
  }, [previewFilter, searchText, workflows])

  const visibleTemplates = useMemo<ProjectItem[]>(() => {
    return workflowTemplates
      .filter((template) =>
        matchesSearch(`${template.name} ${template.description}`, searchText),
      )
      .map((template, index) => {
        const preset =
          WORKFLOW_PRESET_OPTIONS[index % WORKFLOW_PRESET_OPTIONS.length]
        const preview =
          WORKFLOW_PREVIEW_OPTIONS[index % WORKFLOW_PREVIEW_OPTIONS.length]
        return {
          id: template.id,
          name: template.name,
          tag: "TEMPLATE",
          updatedAt: "Ready",
          gradient: preset.gradient,
          tone: preset.tone,
          preview,
          description: template.description,
        }
      })
      .filter(
        (template) =>
          previewFilter === "all" || template.preview === previewFilter,
      )
  }, [previewFilter, searchText])

  const activeItems = tab === "recent" ? visibleProjects : visibleTemplates

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <HeroSection onLaunchStudio={() => void handleCreateWorkflow()} />

      <main className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16">
        <div className="projects-fade-in projects-stagger-4 mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-8 border-b border-border md:border-none">
            <button
              type="button"
              onClick={() => setTab("recent")}
              className="group relative pb-4 text-lg font-bold text-foreground transition-colors md:pb-0"
            >
              <span className="relative z-10">Recent Workflows</span>
              {tab === "recent" && (
                <span className="absolute bottom-0 left-0 h-1 w-full rounded-t-full bg-gradient-to-r from-emerald-500 to-amber-300 shadow-[0_-2px_10px_rgba(251,191,36,0.3)]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setTab("templates")}
              className=" relative pb-4 text-lg font-medium text-muted-foreground transition-colors hover:text-amber-300 md:pb-0"
            >
              <span className="relative z-10">Templates</span>
              {tab === "templates" && (
                <span className="absolute bottom-0 left-0 h-1 w-full rounded-t-full bg-gradient-to-r from-emerald-500 to-amber-300 shadow-[0_-2px_10px_rgba(251,191,36,0.3)]" />
              )}
            </button>
          </div>

          <SearchBar
            value={searchText}
            onChange={setSearchText}
            filterValue={previewFilter}
            onFilterChange={(value) =>
              setPreviewFilter(
                value as "all" | "panel" | "orbit" | "bars" | "lattice",
              )
            }
          />
        </div>

        {loading ? (
          <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
            Loading workflows...
          </div>
        ) : (
          <ProjectsGrid
            projects={activeItems}
            onCreateNew={() => void handleCreateWorkflow()}
            onOpenProject={(id) => {
              if (tab === "recent") {
                void handleOpenWorkflow(id)
                return
              }

              void handleCreateFromTemplate(id)
            }}
            onDeleteProject={
              tab === "recent"
                ? (id) => {
                    void handleDeleteWorkflow(id)
                  }
                : undefined
            }
          />
        )}
      </main>
    </div>
  )
}
