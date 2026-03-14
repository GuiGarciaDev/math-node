import { useMemo, useState } from "react"
import { HeroSection } from "@/components/projects/HeroSection"
import { ProjectsGrid } from "@/components/projects/ProjectsGrid"
import { SearchBar } from "@/components/projects/SearchBar"
import type { ProjectItem } from "@/components/projects/ProjectCard"
import { TEMPLATE_ILLUSTRATION_BY_TEMPLATE_ID } from "@/components/projects/WorkflowIllustrations"
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
} from "@/utils/workflowAppearance"
import { Routes } from "@/types/routes-types"
import { useEffect, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ProjectsSort,
  type ProjectsSortValue,
} from "@/components/projects/ProjectsSort"

type TabsValues = "RECENT" | "TEMPLATES"

function compareAlphabetical(a: string, b: string): number {
  return a.localeCompare(b, undefined, { sensitivity: "base" })
}

export default function ProjectsPage() {
  const openWorkflowSession = useFlowStore((s) => s.openWorkflowSession)
  const [searchText, setSearchText] = useState("")
  const [tab, setTab] = useState<TabsValues>("RECENT")
  const [sortOrder, setSortOrder] =
    useState<ProjectsSortValue>("mostRecentFirst")
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
    const filteredWorkflows = workflows.filter((workflow) =>
      matchesSearch(`${workflow.name} ${workflow.tag}`, searchText),
    )
    const sortedWorkflows = [...filteredWorkflows].sort((a, b) => {
      switch (sortOrder) {
        case "alphabeticalAscending":
          return compareAlphabetical(a.name, b.name)
        case "alphabeticalDescending":
          return compareAlphabetical(b.name, a.name)
        case "leastRecentFirst":
          return a.updatedAt - b.updatedAt
        case "mostRecentFirst":
        default:
          return b.updatedAt - a.updatedAt
      }
    })

    return sortedWorkflows.map((workflow) => ({
      id: workflow.id,
      type: workflow.type,
      name: workflow.name,
      tag: workflow.tag,
      updatedAt: formatRelativeTime(workflow.updatedAt).replace("Edited ", ""),
      illustration: workflow.illustration,
    }))
  }, [searchText, sortOrder, workflows])

  const visibleTemplates = useMemo<ProjectItem[]>(() => {
    const filteredTemplates = workflowTemplates.filter((template) =>
      matchesSearch(`${template.name} ${template.description}`, searchText),
    )
    const templateOrder = new Map(
      workflowTemplates.map((template, index) => [template.id, index]),
    )
    const sortedTemplates = [...filteredTemplates].sort((a, b) => {
      switch (sortOrder) {
        case "alphabeticalAscending":
          return compareAlphabetical(a.name, b.name)
        case "alphabeticalDescending":
          return compareAlphabetical(b.name, a.name)
        case "leastRecentFirst":
          return (templateOrder.get(a.id) ?? 0) - (templateOrder.get(b.id) ?? 0)
        case "mostRecentFirst":
        default:
          return (templateOrder.get(b.id) ?? 0) - (templateOrder.get(a.id) ?? 0)
      }
    })

    return sortedTemplates.map((template) => {
      return {
        id: template.id,
        type: template.type,
        name: template.name,
        tag: "TEMPLATE",
        updatedAt: "Ready",
        illustration:
          TEMPLATE_ILLUSTRATION_BY_TEMPLATE_ID[template.id] ??
          "template-addition-flow",
        description: template.description,
      }
    })
  }, [searchText, sortOrder])

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* <HeroSection onLaunchStudio={() => void handleCreateWorkflow()} /> */}

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as TabsValues)}
        className="relative flex flex-col z-10 mx-auto w-full max-w-7xl px-6 py-10"
      >
        <TabsList
          variant={"line"}
          className="projects-fade-in projects-stagger-4 mb-12 w-full flex flex-col justify-between gap-6 md:flex-row md:items-center"
        >
          <div>
            <TabsTrigger value="RECENT">Recent projects</TabsTrigger>
            <TabsTrigger value="TEMPLATES">Templates</TabsTrigger>
          </div>

          <div className="flex gap-3">
            <SearchBar value={searchText} onChange={setSearchText} />
            <ProjectsSort value={sortOrder} onChange={setSortOrder} />
          </div>
        </TabsList>
        <TabsContent value="RECENT" className="mt-6">
          <ProjectsGrid
            projects={visibleProjects}
            onCreateNew={() => void handleCreateWorkflow()}
            onOpenProject={(id) => {
              if (tab === "RECENT") {
                void handleOpenWorkflow(id)
                return
              }

              void handleCreateFromTemplate(id)
            }}
            onDeleteProject={
              tab === "RECENT"
                ? (id) => {
                    void handleDeleteWorkflow(id)
                  }
                : undefined
            }
          />
        </TabsContent>
        <TabsContent value="TEMPLATES" className="mt-6">
          <ProjectsGrid
            projects={visibleTemplates}
            onCreateNew={() => void handleCreateWorkflow()}
            onOpenProject={(id) => {
              if (tab === "RECENT") {
                void handleOpenWorkflow(id)
                return
              }

              void handleCreateFromTemplate(id)
            }}
            onDeleteProject={
              tab === "RECENT"
                ? (id) => {
                    void handleDeleteWorkflow(id)
                  }
                : undefined
            }
          />
        </TabsContent>
      </Tabs>

      <main className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16"></main>
    </div>
  )
}
