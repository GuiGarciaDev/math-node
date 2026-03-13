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
        className="group flex h-72 flex-col items-center justify-center gap-5 rounded-3xl border-2 border-dashed border-border text-muted-foreground transition-all hover:scale-102 hover:-translate-y-2 hover:cursor-pointer"
      >
        <div className="relative">
          <div className="bg-card/80 border border-border relative flex h-16 w-16 items-center justify-center rounded-2xl transition-all group-hover:scale-110 group-hover:border-transparent group-hover:bg-linear-to-br group-hover:from-green-300 group-hover:to-cyan-600 group-hover:text-white">
            <Plus className="h-7 w-7" />
          </div>
        </div>
        <div className="text-center">
          <span className="block font-bold text-foreground">Blank Canvas</span>
          <span className="mt-1 block text-xs">Start from scratch</span>
        </div>
      </button>

      {projects.map((item, index) => (
        <div
          key={item.id}
          className="animate-projects-fade-in opacity-0"
          style={{ animationDelay: `${0.2 + index * 0.08}s` }}
        >
          <ProjectCard
            item={item}
            onOpen={onOpenProject ? () => onOpenProject(item.id) : () => {}}
            onDelete={
              onDeleteProject ? () => onDeleteProject(item.id) : () => {}
            }
          />
        </div>
      ))}
    </div>
  )
}

export const ProjectsGrid = memo(ProjectsGridComponent)
