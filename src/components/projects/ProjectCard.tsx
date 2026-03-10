import { memo } from "react"
import { Clock, Ellipsis } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type ProjectItem = {
  id: string
  name: string
  tag: string
  updatedAt: string
  gradient: string
  tone: string
  preview: "panel" | "orbit" | "bars" | "lattice"
  description?: string
}

type ProjectCardProps = {
  item: ProjectItem
  onOpen?: () => void
  onDelete?: () => void
}

function ProjectCardComponent({ item, onOpen, onDelete }: ProjectCardProps) {
  return (
    <article className="projects-card-hover group flex h-72 flex-col overflow-hidden rounded-3xl border border-border bg-card/90 shadow-md">
      <div
        className={cn(
          "h-1 w-full opacity-60 transition-opacity group-hover:opacity-100",
          item.gradient,
        )}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            onOpen?.()
          }
        }}
        className="projects-noise-bg relative flex flex-1 items-center justify-center overflow-hidden p-6 text-left"
      >
        <div className={cn("absolute inset-0 mix-blend-overlay", item.tone)} />

        {item.preview === "panel" && (
          <div className="relative flex h-20 w-32 flex-col gap-2 rounded-xl border border-rose-400/20 bg-black/60 p-3 shadow-2xl transition-transform duration-300 group-hover:scale-105">
            <div className="flex items-center justify-between">
              <div className="h-2 w-16 rounded bg-white/20" />
              <div className="h-4 w-4 rounded-full border-2 border-rose-400" />
            </div>
            <div className="flex flex-1 gap-2">
              <div className="w-1/3 rounded border border-white/5 bg-white/5" />
              <div className="w-2/3 rounded border border-rose-400/30 bg-rose-400/20" />
            </div>
          </div>
        )}

        {item.preview === "orbit" && (
          <div className="relative h-24 w-24">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/40 animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-2 rounded-full border border-emerald-300/20 animate-[spin_15s_linear_infinite_reverse]" />
            <div className="absolute inset-6 rounded-full border border-emerald-200/30" />
          </div>
        )}

        {item.preview === "bars" && (
          <div className="flex h-20 items-end gap-2">
            <div className="h-1/3 w-5 rounded-t-sm bg-gradient-to-t from-amber-400/30 to-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.3)] transition-all duration-500 group-hover:h-2/3" />
            <div className="h-2/3 w-5 rounded-t-sm bg-gradient-to-t from-amber-400/30 to-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.3)] transition-all delay-75 duration-500 group-hover:h-full" />
            <div className="h-1/2 w-5 rounded-t-sm bg-gradient-to-t from-amber-400/30 to-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.3)] transition-all delay-150 duration-500 group-hover:h-3/4" />
            <div className="h-full w-5 rounded-t-sm bg-gradient-to-t from-amber-400/30 to-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.3)] transition-all delay-200 duration-500 group-hover:h-1/3" />
          </div>
        )}

        {item.preview === "lattice" && (
          <div className="grid h-20 w-28 grid-cols-4 gap-2 rounded-xl border border-amber-300/20 bg-black/45 p-3">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={`lattice-cell-${item.id}-${idx}`}
                className={cn(
                  "rounded-sm border border-emerald-400/20",
                  idx % 2 === 0 ? "bg-emerald-500/30" : "bg-rose-400/25",
                )}
              />
            ))}
          </div>
        )}

        {onDelete && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                onClick={(event) => event.stopPropagation()}
                className="projects-glass-panel absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                aria-label={`Open options for ${item.name}`}
              >
                <Ellipsis className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={6}
              className="rounded-xl border-border bg-popover"
              onClick={(event) => event.stopPropagation()}
            >
              <DropdownMenuItem
                className="cursor-pointer text-destructive"
                onSelect={(event) => {
                  event.preventDefault()
                  onDelete()
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="projects-glass-panel border-t border-border p-5">
        <h3 className="mb-2 text-lg font-bold text-foreground">{item.name}</h3>
        {item.description && (
          <p className="mb-2 line-clamp-1 text-xs text-muted-foreground">
            {item.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "rounded-md border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
              item.tag === "Physics" &&
                "border-rose-400/30 bg-rose-400/10 text-rose-400",
              item.tag === "Logic" &&
                "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
              item.tag === "Data" &&
                "border-amber-300/30 bg-amber-300/10 text-amber-300",
            )}
          >
            {item.tag}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" /> {item.updatedAt}
          </span>
        </div>
      </div>
    </article>
  )
}

export const ProjectCard = memo(ProjectCardComponent)
