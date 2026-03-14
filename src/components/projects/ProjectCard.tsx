import { memo, useState } from "react"
import { Clock, EllipsisVertical, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  ProjectIllustrationPreview,
  type IllustrationId,
} from "./WorkflowIllustrations"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipTrigger } from "../ui/tooltip"
import TextOverflowTooltip from "../TextOverflowTooltip"

export type ProjectItem = {
  id: string
  type: "template" | "workflow"
  name: string
  tag: string
  updatedAt: string
  illustration?: IllustrationId
  description?: string
}

type ProjectCardProps = {
  item: ProjectItem
  onOpen: () => void
  onDelete: () => void
}

function ProjectCardComponent({ item, onOpen, onDelete }: ProjectCardProps) {
  const [isCardDropDownOpen, setIsCardDropdownOpen] = useState(false)

  const handleDropdownOpenChange = (open: boolean) => {
    setIsCardDropdownOpen(open)
  }

  console.log(item)

  return (
    <article
      className={cn(
        "group flex h-72 flex-col gap-2 overflow-hidden rounded-lg hover:bg-card/60 transition-colors",
        isCardDropDownOpen && "bg-card/60",
      )}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            onOpen()
          }
        }}
        className="group/img bg-gray-500/20 flex flex-1 n hover:cursor-pointer rounded-t-lg overflow-hidden"
      >
        <div className="group relative flex flex-1 items-center justify-center overflow-hidden p-0 transition-transform group-hover/img:scale-110">
          {item.illustration ? (
            <ProjectIllustrationPreview
              illustration={item.illustration}
              className="h-full w-full"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-cyan-800/60 p-6 text-xs text-muted-foreground">
              Nodes Preview
            </div>
          )}
        </div>
      </div>

      <div className="px-4 h-14 relative">
        {item.type !== "template" && (
          <DropdownMenu
            open={isCardDropDownOpen}
            onOpenChange={handleDropdownOpenChange}
          >
            <DropdownMenuTrigger asChild>
              <div
                className={cn(
                  "absolute p-1 right-2 top-0.5 hover:bg-popover transition-colors hover:cursor-pointer rounded-sm",
                  isCardDropDownOpen && "bg-popover",
                )}
              >
                <EllipsisVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={6}
              className="border-none"
              onClick={(event) => event.stopPropagation()}
            >
              <DropdownMenuItem
                className="cursor-pointer text-destructive hover:text-destructive! hover:bg-destructive/10!"
                onSelect={(event) => {
                  event.preventDefault()
                  onDelete()
                }}
              >
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <h3 className="mb-2 text-sm">{item.name}</h3>

        {item.description && (
          <TextOverflowTooltip text={item.description || ""}>
            <p className="mb-2 line-clamp-1 text-xs text-muted-foreground">
              {item.description}
            </p>
          </TextOverflowTooltip>
        )}

        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" /> {item.updatedAt}
          </span>
        </div>
      </div>
    </article>
  )
}

export const ProjectCard = memo(ProjectCardComponent)
