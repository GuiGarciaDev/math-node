import { memo } from "react"
import { Plus } from "lucide-react"
import { ProjectCard, type ProjectItem } from "./ProjectCard"

interface ProjectsGridProps {
  projects: ProjectItem[]
  onCreateNew?: () => void
  onOpenProject?: (projectId: string) => void
  onDeleteProject?: (projectId: string) => void
}

function ProjectsGridComponent({
  projects,
  onCreateNew,
  onOpenProject,
  onDeleteProject,
}: ProjectsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <button
        type="button"
        onClick={onCreateNew}
        className="projects-card-hover group flex h-72 flex-col items-center justify-center gap-5 rounded-3xl border-2 border-dashed border-border text-muted-foreground transition-all hover:border-amber-300/50 hover:bg-rose-400/5"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-amber-300 opacity-0 blur-xl transition-opacity group-hover:opacity-20" />
          <div className="projects-glass-panel relative flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-300/30 transition-all group-hover:scale-110 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-amber-300 group-hover:to-rose-400 group-hover:text-white">
            <Plus className="h-7 w-7" />
          </div>
        </div>
        <div className="text-center">
          <span className="block font-bold text-foreground transition-colors group-hover:text-rose-400">
            Blank Canvas
          </span>
          <span className="mt-1 block text-xs">Start from scratch</span>
        </div>
      </button>

      {projects.map((item, index) => (
        <div
          key={item.id}
          className="projects-fade-in"
          style={{ animationDelay: `${0.45 + index * 0.08}s` }}
        >
          <ProjectCard
            item={item}
            onOpen={onOpenProject ? () => onOpenProject(item.id) : undefined}
            onDelete={
              onDeleteProject ? () => onDeleteProject(item.id) : undefined
            }
          />
        </div>
      ))}
    </div>
  )
}

export const ProjectsGrid = memo(ProjectsGridComponent)
