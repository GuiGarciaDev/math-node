import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
  LuArrowRight,
  LuEllipsisVertical,
  LuFolderKanban,
  LuLayoutTemplate,
  LuLayers2,
  LuPlus,
  LuSearch,
  LuTrash2,
} from "react-icons/lu"
import { useFlowStore } from "../../features/flow/store/flowStore"
import {
  createWorkflowId,
  deleteWorkflow,
  listWorkflows,
  loadWorkflow,
  saveWorkflow,
  type WorkflowSummary,
} from "../../storage/workflowRepository"
import {
  cloneTemplateGraph,
  workflowTemplates,
} from "../../storage/workflowTemplates"
import { ScrollArea } from "@/components/ui/scroll-area"
import ToggleThemeButton from "@/components/toggle-theme"
import { Routes } from "@/types/routes-types"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

type LandingTab = "projects" | "templates"
type SortMode =
  | "most-recent"
  | "last-viewed"
  | "oldest"
  | "name-asc"
  | "name-desc"

interface LandingPageProps {
  currentRoute: Routes
  setRoute: (route: Routes) => void
}

function formatRelativeTime(timestamp: number): string {
  const deltaMs = Date.now() - timestamp
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const month = 30 * day

  if (deltaMs < minute) return "Edited just now"
  if (deltaMs < hour) return `Edited ${Math.floor(deltaMs / minute)} min ago`
  if (deltaMs < day) return `Edited ${Math.floor(deltaMs / hour)} h ago`
  if (deltaMs < month) return `Edited ${Math.floor(deltaMs / day)} days ago`
  return `Edited ${Math.floor(deltaMs / month)} months ago`
}

function matchesSearch(value: string, searchText: string): boolean {
  return value.toLowerCase().includes(searchText.trim().toLowerCase())
}

function sortByMode<
  T extends { name: string; createdAt?: number; updatedAt?: number },
>(items: T[], mode: SortMode): T[] {
  const next = [...items]

  switch (mode) {
    case "oldest":
      return next.sort((a, b) => (a.updatedAt ?? 0) - (b.updatedAt ?? 0))
    case "name-asc":
      return next.sort((a, b) => a.name.localeCompare(b.name))
    case "name-desc":
      return next.sort((a, b) => b.name.localeCompare(a.name))
    case "last-viewed":
      return next.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))
    case "most-recent":
    default:
      return next.sort((a, b) => {
        const aTime = a.createdAt ?? a.updatedAt ?? 0
        const bTime = b.createdAt ?? b.updatedAt ?? 0
        return bTime - aTime
      })
  }
}

export const LandingPage: React.FC<LandingPageProps> = React.memo(
  ({ currentRoute, setRoute }) => {
    const openWorkflowSession = useFlowStore((s) => s.openWorkflowSession)
    const [workflows, setWorkflows] = useState<WorkflowSummary[]>([])
    const [activeTab, setActiveTab] = useState<LandingTab>("projects")
    const [searchText, setSearchText] = useState("")
    const [sortMode, setSortMode] = useState<SortMode>("most-recent")
    const [loading, setLoading] = useState(true)
    const [busy, setBusy] = useState(false)
    const [openProjectMenuId, setOpenProjectMenuId] = useState<string | null>(
      null,
    )

    const refreshWorkflows = useCallback(async () => {
      const items = await listWorkflows()
      setWorkflows(items)
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

    const visibleProjects = useMemo(() => {
      const filtered = workflows.filter((workflow) =>
        matchesSearch(workflow.name, searchText),
      )
      return sortByMode(filtered, sortMode)
    }, [searchText, sortMode, workflows])

    const visibleTemplates = useMemo(() => {
      const filtered = workflowTemplates.filter((template) =>
        matchesSearch(`${template.name} ${template.description}`, searchText),
      )

      if (sortMode === "name-asc" || sortMode === "name-desc") {
        return sortByMode(filtered, sortMode)
      }

      if (sortMode === "oldest") {
        return [...filtered].reverse()
      }

      return filtered
    }, [searchText, sortMode])

    const launchWorkflow = useCallback(
      (payload: {
        id: string
        name: string
        nodes: ReturnType<typeof cloneTemplateGraph>["nodes"]
        edges: ReturnType<typeof cloneTemplateGraph>["edges"]
      }) => {
        openWorkflowSession(payload)
        setRoute("FLOW_CANVAS_PAGE")
      },
      [setRoute, openWorkflowSession],
    )

    const isActive = currentRoute === "LANDING_PAGE"

    const handleCreateWorkflow = useCallback(async () => {
      if (busy) return
      setBusy(true)
      try {
        const id = createWorkflowId()
        const name = "Untitled"
        const nodes: ReturnType<typeof cloneTemplateGraph>["nodes"] = []
        const edges: ReturnType<typeof cloneTemplateGraph>["edges"] = []

        await saveWorkflow({ id, name, nodes, edges })
        await refreshWorkflows()
        launchWorkflow({ id, name, nodes, edges })
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
          await saveWorkflow({
            id,
            name,
            nodes: templateGraph.nodes,
            edges: templateGraph.edges,
          })
          await refreshWorkflows()
          launchWorkflow({
            id,
            name,
            nodes: templateGraph.nodes,
            edges: templateGraph.edges,
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
        setOpenProjectMenuId(null)

        try {
          await deleteWorkflow(id)
          await refreshWorkflows()
        } finally {
          setBusy(false)
        }
      },
      [busy, refreshWorkflows],
    )

    useEffect(() => {
      const onDocumentClick = () => {
        setOpenProjectMenuId(null)
      }

      document.addEventListener("click", onDocumentClick)
      return () => {
        document.removeEventListener("click", onDocumentClick)
      }
    }, [])

    const tabs: Array<{ key: LandingTab; label: string }> = [
      { key: "projects", label: "Projects" },
      { key: "templates", label: "Templates" },
    ]

    const showProjects = activeTab === "projects"
    const showTemplates = activeTab === "templates"
    const hasVisibleItems =
      (showProjects && visibleProjects.length > 0) ||
      (showTemplates && visibleTemplates.length > 0)

    return (
      <ScrollArea
        className={`flex min-h-screen flex-col overflow-y-auto bg-background transition-all duration-700 ${
          isActive
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-[1.03] opacity-0"
        }`}
      >
        <section className="relative w-full min-h-fit overflow-hidden border-b border-border bg-[radial-gradient(circle_at_10%_12%,rgba(190,24,93,0.12),transparent_34%),radial-gradient(circle_at_78%_18%,rgba(234,88,12,0.18),transparent_38%),linear-gradient(160deg,#fff7ed_8%,#fffbeb_40%,#fdf4ff_100%)] dark:bg-[radial-gradient(circle_at_10%_12%,rgba(236,72,153,0.16),transparent_34%),radial-gradient(circle_at_78%_18%,rgba(251,146,60,0.2),transparent_38%),linear-gradient(160deg,#141417_8%,#1b1a28_40%,#1d1322_100%)]">
          <div className="hero-mesh" />

          <div className="absolute right-6 top-6 z-30 md:right-12 md:top-8">
            <ToggleThemeButton />
          </div>

          <div className="pointer-events-none absolute inset-0 z-10 opacity-70 dark:opacity-45">
            <div className="glass-card absolute right-[10%] top-20 flex h-44 w-72 rotate-12 flex-col rounded-2xl border border-border/70 bg-card/85 p-4 shadow-2xl backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="text-[10px] text-muted-foreground">
                  Derivative Node
                </div>
              </div>
              <div className="flex-1 space-y-2 rounded-lg border border-border/60 bg-background/60 p-3 text-[11px] text-foreground">
                <div>f(x) = x^3 + 2x</div>
                <div className="h-px w-full bg-border" />
                <div>f&#39;(x) = 3x^2 + 2</div>
              </div>
            </div>
            <div className="glass-card absolute right-[36%] top-48 flex h-40 w-64 -rotate-6 flex-col rounded-2xl border border-border/70 bg-card/85 p-4 shadow-2xl backdrop-blur-sm">
              <div className="mb-2 flex items-center justify-between">
                <div className="h-3 w-3 rounded-full bg-fuchsia-400" />
                <div className="text-[10px] text-muted-foreground">
                  Matrix Node
                </div>
              </div>
              <div className="space-y-2 text-[10px] text-foreground">
                <div className="rounded border border-border/60 bg-background/60 p-1.5">
                  [1 2; 3 4]
                </div>
                <div className="rounded border border-border/60 bg-background/60 p-1.5">
                  det(A) = -2
                </div>
                <div className="rounded border border-border/60 bg-background/60 p-1.5">
                  A^-1 ready
                </div>
              </div>
            </div>
          </div>

          <div className="container relative z-20 mx-auto flex items-center px-6 py-20 md:px-12 md:py-28">
            <div className="max-w-2xl">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
                  <LuLayers2 className="text-2xl text-primary-foreground" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                  Math Node Studio
                </h1>
              </div>

              <p className="mb-10 text-xl leading-relaxed text-muted-foreground">
                Build symbolic and numeric workflows with calculus, matrix,
                algebra, and plotting nodes in one visual graph.
              </p>

              <button
                onClick={() => void handleCreateWorkflow()}
                disabled={busy}
                className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-3.5 text-lg font-semibold text-primary-foreground shadow-xl transition-all active:scale-95 hover:bg-primary/90 disabled:cursor-wait disabled:opacity-70"
              >
                New Workflow
                <LuArrowRight />
              </button>
            </div>
          </div>
        </section>

        <main className="bg-background px-6 pb-20 md:px-12">
          <div className="container mx-auto">
            <div className="flex flex-col justify-between gap-6 py-12 md:flex-row md:items-center">
              <nav className="flex items-center gap-2 p-1.5">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`rounded-lg px-5 py-2 text-sm font-medium transition-all ${
                      activeTab === tab.key
                        ? "nav-tab-active"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    type="text"
                    placeholder="Search projects or templates..."
                    className="w-[18rem] rounded-xl border border-border bg-card pl-12 pr-6 text-sm text-foreground transition-all focus:bg-accent/40 focus:outline-none"
                  />
                </div>

                <label className="sr-only" htmlFor="landing-sort-mode">
                  Sort results
                </label>
                <Select
                  value={sortMode}
                  onValueChange={(value) => setSortMode(value as SortMode)}
                >
                  <SelectTrigger className="w-48 px-4 rounded-xl h-11 bg-card">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="most-recent">Most recent</SelectItem>
                      <SelectItem value="last-viewed">Last viewed</SelectItem>
                      <SelectItem value="oldest">Oldest first</SelectItem>
                      <SelectItem value="name-asc">Name asc</SelectItem>
                      <SelectItem value="name-desc">Name desc</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <button
                onClick={() => void handleCreateWorkflow()}
                disabled={busy}
                className="group cursor-pointer text-left disabled:cursor-wait"
              >
                <div className="project-card flex aspect-video items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card transition-all group-hover:border-primary/50">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/60 transition-all group-hover:scale-110 group-hover:bg-primary">
                    <LuPlus className="text-2xl text-foreground group-hover:text-primary-foreground" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-medium text-foreground">New Workflow</h3>
                  <p className="text-xs text-transparent">spacer</p>
                </div>
              </button>

              {showProjects &&
                visibleProjects.map((workflow) => (
                  <div key={workflow.id} className="group text-left">
                    <div className="relative">
                      <button
                        onClick={() => void handleOpenWorkflow(workflow.id)}
                        disabled={busy}
                        className="w-full cursor-pointer text-left disabled:cursor-wait"
                      >
                        <div className="project-card node-preview-dots relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-border bg-card">
                          <div className="absolute inset-0 p-6">
                            <div className="grid h-full grid-cols-4 gap-3">
                              <div className="rounded bg-muted/80" />
                              <div className="rounded bg-muted/70" />
                              <div className="rounded bg-muted/90" />
                              <div className="rounded bg-muted/60" />
                            </div>
                          </div>
                          <LuFolderKanban className="relative z-10 text-3xl text-chart-1" />
                        </div>
                      </button>

                      <div className="absolute right-3 top-3 z-30">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            setOpenProjectMenuId((prev) =>
                              prev === workflow.id ? null : workflow.id,
                            )
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-card/85 text-muted-foreground transition hover:bg-accent hover:text-foreground"
                          aria-label={`Open options for ${workflow.name}`}
                        >
                          <LuEllipsisVertical className="text-sm" />
                        </button>

                        {openProjectMenuId === workflow.id && (
                          <div
                            className="absolute right-0 mt-2 w-36 rounded-lg border border-border bg-popover p-1 shadow-xl"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                void handleDeleteWorkflow(workflow.id)
                              }
                              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-destructive transition hover:bg-destructive/10 hover:text-destructive"
                            >
                              <LuTrash2 className="text-sm" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4">
                      <h3 className="truncate font-medium text-foreground">
                        {workflow.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(workflow.updatedAt)}
                      </p>
                    </div>
                  </div>
                ))}

              {showTemplates &&
                visibleTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => void handleCreateFromTemplate(template.id)}
                    disabled={busy}
                    className="group cursor-pointer text-left disabled:cursor-wait"
                  >
                    <div className="project-card relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-border bg-card">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,color-mix(in_oklab,var(--chart-1)_42%,transparent),transparent_52%),radial-gradient(circle_at_88%_75%,color-mix(in_oklab,var(--chart-2)_32%,transparent),transparent_54%)]" />
                      <LuLayoutTemplate className="relative z-10 text-3xl text-chart-2" />
                    </div>
                    <div className="mt-4">
                      <h3 className="truncate font-medium text-foreground">
                        {template.name}
                      </h3>
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {template.description}
                      </p>
                    </div>
                  </button>
                ))}

              {loading && (
                <div className="col-span-full rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
                  Loading workflows...
                </div>
              )}

              {!loading && !hasVisibleItems && (
                <div className="col-span-full rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
                  No {showProjects ? "projects" : "templates"} match your search
                  and filter.
                </div>
              )}
            </div>
          </div>
        </main>
      </ScrollArea>
    )
  },
)

LandingPage.displayName = "LandingPage"
