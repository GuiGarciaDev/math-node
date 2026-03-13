import React, { memo } from "react"
import { ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

export type ProjectsSortValue =
  | "alphabeticalAscending"
  | "alphabeticalDescending"
  | "mostRecentFirst"
  | "leastRecentFirst"

type ProjectsSortProps = {
  value: ProjectsSortValue
  onChange: (value: ProjectsSortValue) => void
}

function ProjectsSortComponent({ value, onChange }: ProjectsSortProps) {
  const [isOpened, setIsOpened] = React.useState(false)

  return (
    <Select
      value={value}
      onValueChange={(next) => onChange(next as ProjectsSortValue)}
      open={isOpened}
      onOpenChange={setIsOpened}
    >
      <SelectTrigger
        className={cn(
          "w-56 h-8 border border-border bg-input rounded-sm px-2 shadow-none focus:ring-0 hover:brightness-125",
          isOpened && "brightness-125",
        )}
      >
        <div className="flex gap-2 items-center mr-3">
          <ArrowUpDown className="h-4 w-4" />
          <SelectValue placeholder="Sort by" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="alphabeticalAscending">
            Alphabetical (Ascending)
          </SelectItem>
          <SelectItem value="alphabeticalDescending">
            Alphabetical (Descending)
          </SelectItem>
          <SelectItem value="mostRecentFirst">Most Recent First</SelectItem>
          <SelectItem value="leastRecentFirst">Least Recent First</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export const ProjectsSort = memo(ProjectsSortComponent)
