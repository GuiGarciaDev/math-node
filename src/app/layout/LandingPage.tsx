import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
  LuArrowRight,
  LuChevronDown,
  LuEyeOff,
  LuFolderKanban,
  LuLayoutTemplate,
  LuLayers2,
  LuPlus,
  LuSearch,
} from "react-icons/lu"
import { useFlowStore } from "../../features/flow/store/flowStore"
import {
  createWorkflowId,
  listWorkflows,
  loadWorkflow,
  saveWorkflow,
  type WorkflowSummary,
} from "../../storage/workflowRepository"
import {
  cloneTemplateGraph,
  workflowTemplates,
} from "../../storage/workflowTemplates"

type LandingTab = "projects" | "apps" | "examples" | "templates"

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

export const LandingPage: React.FC = React.memo(() => {
  const appStarted = useFlowStore((s) => s.appStarted)
  const openWorkflowSession = useFlowStore((s) => s.openWorkflowSession)
  const [workflows, setWorkflows] = useState<WorkflowSummary[]>([])
  const [activeTab, setActiveTab] = useState<LandingTab>("projects")
  const [searchText, setSearchText] = useState("")
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

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
    return filtered.sort((a, b) => b.updatedAt - a.updatedAt)
  }, [searchText, workflows])

  const visibleTemplates = useMemo(
    () =>
      workflowTemplates.filter((template) =>
        matchesSearch(`${template.name} ${template.description}`, searchText),
      ),
    [searchText],
  )

  const launchWorkflow = useCallback(
    (payload: {
      id: string
      name: string
      nodes: ReturnType<typeof cloneTemplateGraph>["nodes"]
      edges: ReturnType<typeof cloneTemplateGraph>["edges"]
    }) => {
      openWorkflowSession(payload)
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

  const tabs: Array<{ key: LandingTab; label: string }> = [
    { key: "projects", label: "Projects" },
    { key: "apps", label: "Apps" },
    { key: "examples", label: "Examples" },
    { key: "templates", label: "Templates" },
  ]

  const showProjects = activeTab === "projects" || activeTab === "apps"
  const showTemplates = activeTab === "templates" || activeTab === "examples"

  return (
    <div
      className={`fixed inset-0 z-[100] flex min-h-screen flex-col overflow-y-auto bg-[#121316] transition-all duration-700 ${
        appStarted
          ? "pointer-events-none scale-[1.03] opacity-0"
          : "pointer-events-auto scale-100 opacity-100"
      }`}
    >
      <section className="relative h-[500px] w-full overflow-hidden">
        <div className="hero-mesh" />

        <div className="pointer-events-none absolute inset-0 z-10 opacity-45">
          <div className="glass-card absolute right-[15%] top-20 flex h-40 w-64 rotate-[12deg] flex-col rounded-2xl p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <div className="text-[10px] text-gray-400">Image Generation</div>
            </div>
            <div className="flex-1 overflow-hidden rounded-lg bg-black/20" />
          </div>
          <div className="glass-card absolute right-[35%] top-48 flex h-36 w-56 -rotate-6 flex-col rounded-2xl p-4 shadow-2xl">
            <div className="mb-2 flex items-center justify-between">
              <div className="h-3 w-3 rounded-full bg-teal-500" />
              <div className="text-[10px] text-gray-400">Style Transfer</div>
            </div>
            <div className="space-y-2">
              <div className="h-1.5 w-full rounded bg-white/5" />
              <div className="h-1.5 w-3/4 rounded bg-white/5" />
              <div className="h-1.5 w-1/2 rounded bg-white/5" />
            </div>
          </div>
        </div>

        <div className="container relative z-20 mx-auto flex h-full items-center px-6 md:px-12">
          <div className="max-w-2xl">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30">
                <LuLayers2 className="text-2xl text-white" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white">
                Node Editor
              </h1>
            </div>

            <p className="mb-10 text-xl leading-relaxed text-gray-300">
              Nodes is the most powerful way to operate. Connect every tool and
              model into complex automated pipelines.
            </p>

            <button
              onClick={() => void handleCreateWorkflow()}
              disabled={busy}
              className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-3.5 text-lg font-semibold text-black shadow-xl transition-all active:scale-95 hover:bg-gray-100 disabled:cursor-wait disabled:opacity-70"
            >
              New Workflow
              <LuArrowRight />
            </button>
          </div>
        </div>
      </section>

      <main className="min-h-[calc(100vh-500px)] flex-1 bg-[#1A1A1A] px-6 pb-20 md:px-12">
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
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  type="text"
                  placeholder="Search projects or templates..."
                  className="w-[18rem] rounded-xl border border-transparent bg-[#232323] py-2.5 pl-12 pr-6 text-sm text-white transition-all focus:bg-[#2A2A2A] focus:outline-none"
                />
              </div>

              <button className="flex items-center gap-2 rounded-xl border border-transparent bg-[#232323] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#2A2A2A]">
                Last viewed
                <LuChevronDown className="text-gray-500" />
              </button>

              <button className="rounded-xl p-2.5 text-gray-400 transition-all hover:text-white">
                <LuEyeOff className="text-xl" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <button
              onClick={() => void handleCreateWorkflow()}
              disabled={busy}
              className="group cursor-pointer text-left disabled:cursor-wait"
            >
              <div className="project-card flex aspect-video items-center justify-center rounded-2xl border-2 border-dashed border-gray-700 bg-[#2A2A2A] transition-all group-hover:border-blue-500/50">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 transition-all group-hover:scale-110 group-hover:bg-blue-600">
                  <LuPlus className="text-2xl text-white" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-medium text-white">New Workflow</h3>
                <p className="text-xs text-transparent">spacer</p>
              </div>
            </button>

            {showProjects &&
              visibleProjects.map((workflow) => (
                <button
                  key={workflow.id}
                  onClick={() => void handleOpenWorkflow(workflow.id)}
                  disabled={busy}
                  className="group cursor-pointer text-left disabled:cursor-wait"
                >
                  <div className="project-card node-preview-dots relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-transparent bg-[#2A2A2A]">
                    <div className="absolute inset-0 p-6">
                      <div className="grid h-full grid-cols-4 gap-3">
                        <div className="rounded bg-gray-700/50" />
                        <div className="rounded bg-gray-700/40" />
                        <div className="rounded bg-gray-700/60" />
                        <div className="rounded bg-gray-700/30" />
                      </div>
                    </div>
                    <LuFolderKanban className="relative z-10 text-3xl text-blue-300/90" />
                  </div>
                  <div className="mt-4">
                    <h3 className="truncate font-medium text-white">
                      {workflow.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {formatRelativeTime(workflow.updatedAt)}
                    </p>
                  </div>
                </button>
              ))}

            {showTemplates &&
              visibleTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => void handleCreateFromTemplate(template.id)}
                  disabled={busy}
                  className="group cursor-pointer text-left disabled:cursor-wait"
                >
                  <div className="project-card relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-transparent bg-[#2A2A2A]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(29,78,216,0.3),transparent_52%),radial-gradient(circle_at_88%_75%,rgba(13,148,136,0.22),transparent_54%)]" />
                    <LuLayoutTemplate className="relative z-10 text-3xl text-teal-200" />
                  </div>
                  <div className="mt-4">
                    <h3 className="truncate font-medium text-white">
                      {template.name}
                    </h3>
                    <p className="line-clamp-2 text-xs text-gray-500">
                      {template.description}
                    </p>
                  </div>
                </button>
              ))}

            {loading && (
              <div className="col-span-full rounded-2xl border border-[#2f3138] bg-[#202226] p-5 text-sm text-gray-300">
                Loading workflows...
              </div>
            )}

            {!loading &&
              visibleProjects.length === 0 &&
              visibleTemplates.length === 0 && (
                <div className="col-span-full rounded-2xl border border-[#2f3138] bg-[#202226] p-5 text-sm text-gray-300">
                  No workflows or templates match your search.
                </div>
              )}
          </div>
        </div>
      </main>
    </div>
  )
})

LandingPage.displayName = "LandingPage"
