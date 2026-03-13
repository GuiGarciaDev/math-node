import React, { memo } from "react"
import { Search } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
}

function SearchBarComponent({ value, onChange }: SearchBarProps) {
  const [isOpened, setIsOpened] = React.useState(false)

  return (
    <InputGroup className="w-auto border border-border rounded-sm overflow-hidden hover:brightness-125 transition-all duration-200">
      <AnimatePresence initial={false}>
        {isOpened && (
          <motion.div
            key="search-input"
            className="overflow-hidden"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 224, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <InputGroupInput
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder="Search..."
              className="w-56 px-4 pl-1"
              autoFocus
            />
          </motion.div>
        )}
      </AnimatePresence>
      <InputGroupAddon
        className={cn("w-8 shrink-0 cursor-pointer pr-2")}
        role="button"
        onClick={() => setIsOpened((prev) => !prev)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            setIsOpened((prev) => !prev)
          }
        }}
        tabIndex={0}
      >
        <Search />
      </InputGroupAddon>
    </InputGroup>
  )
}

export const SearchBar = memo(SearchBarComponent)
