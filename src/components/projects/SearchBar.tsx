import { memo } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  filterValue: string
  onFilterChange: (value: string) => void
}

function SearchBarComponent({
  value,
  onChange,
  filterValue,
  onFilterChange,
}: SearchBarProps) {
  return (
    <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
      <div className="group relative w-full sm:w-80">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-300 to-rose-400 opacity-0 blur transition-opacity duration-300 group-focus-within:opacity-15" />
        <div className="relative flex items-center">
          <Search className="pointer-events-none absolute left-4 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-amber-300" />
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Search elegant graphs..."
            className="h-11 w-full rounded-xl border border-border bg-card/90 pl-11 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-amber-300"
          />
        </div>
      </div>

      <div className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-card/90 px-2 text-sm font-medium text-muted-foreground transition-colors hover:border-amber-300/50 hover:text-foreground">
        <SlidersHorizontal className="ml-2 h-4 w-4" />
        <Select value={filterValue} onValueChange={onFilterChange}>
          <SelectTrigger className="h-9 w-[142px] border-0 bg-transparent px-2 shadow-none focus:ring-0">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="panel">Panel</SelectItem>
              <SelectItem value="orbit">Orbit</SelectItem>
              <SelectItem value="bars">Bars</SelectItem>
              <SelectItem value="lattice">Lattice</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export const SearchBar = memo(SearchBarComponent)
