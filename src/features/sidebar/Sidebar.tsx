import React, { useCallback, useMemo, useState } from "react"
import type {
  AppRouteName,
  MathNodeType,
  SidebarNodeItem,
  SidebarTone,
} from "../../types"
import { useFlowStore } from "../flow/store/flowStore"
import { categories } from "../content/node-categories"
import MathFlowIcon from "../../components/math-flow-icon"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { ScrollArea } from "../../components/ui/scroll-area"
import {
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from "../../components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip"
import { cn } from "../../lib/utils"
import { getSidebarToneClasses } from "../../lib/theme"
import { FiChevronDown, FiChevronRight, FiSearch } from "react-icons/fi"
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md"

interface SidebarProps {
  collapsed?: boolean
  onRouteChange?: (route: AppRouteName) => void
}

function SidebarNodeButton({
  item,
  collapsed,
  onDragStart,
}: {
  item: SidebarNodeItem
  collapsed: boolean
  onDragStart: (event: React.DragEvent, type: MathNodeType) => void
}) {
  const tone = getSidebarToneClasses(item.iconColor)

  const content = (
    <div
      draggable
      onDragStart={(event) => onDragStart(event, item.type)}
      className={cn(
        "group flex select-none items-center overflow-hidden border border-transparent transition-all duration-200 ease-out active:cursor-grabbing",
        collapsed
          ? "h-11 w-11 cursor-grab justify-center rounded-2xl bg-[color-mix(in_srgb,var(--sidebar-background)_88%,white_2%)] shadow-[0_10px_24px_rgba(0,0,0,0.14)] hover:-translate-y-0.5 hover:border-[var(--sidebar-ring)] hover:bg-[var(--sidebar-accent)]"
          : "cursor-grab gap-3 rounded-2xl px-3 py-1 hover:-translate-y-0.5 hover:border-[var(--sidebar-border)] hover:bg-[color-mix(in_srgb,var(--sidebar-accent)_82%,transparent)] hover:shadow-[0_16px_28px_rgba(0,0,0,0.16)]",
      )}
      title={collapsed ? item.label : (item.description ?? item.label)}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl font-semibold transition-transform duration-200 group-hover:scale-110",
          tone.text,
          collapsed
            ? "h-9 w-9 text-base"
            : "h-9 w-9 bg-[color-mix(in_srgb,var(--sidebar-background)_42%,transparent)] text-sm",
        )}
      >
        <item.icon />
      </span>

      {!collapsed && (
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-[var(--sidebar-foreground)]">
            {item.label}
          </span>
          {item.description && (
            <span className="block truncate text-[11px] text-[var(--muted-foreground)]">
              {item.description}
            </span>
          )}
        </span>
      )}
    </div>
  )

  if (!collapsed) {
    return content
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  )
}

function CategoryLabel({
  tone,
  children,
}: {
  tone: SidebarTone
  children: React.ReactNode
}) {
  const toneClasses = getSidebarToneClasses(tone)

  return (
    <span className="flex items-center gap-2">
      <span className={cn("h-2 w-2 rounded-full", toneClasses.bg)} />
      {children}
    </span>
  )
}

export const Sidebar: React.FC<SidebarProps> = React.memo(
  ({ collapsed, onRouteChange }) => {
    const toggleSidebar = useFlowStore((s) => s.toggleSidebar)
    const [searchQuery, setSearchQuery] = useState("")
    const [expandedCategories, setExpandedCategories] = useState<
      Record<string, boolean>
    >(() =>
      Object.fromEntries(categories.map((category) => [category.name, true])),
    )

    const onDragStart = useCallback(
      (e: React.DragEvent, nodeType: MathNodeType) => {
        e.dataTransfer.setData("application/mathflow-node", nodeType)
        e.dataTransfer.effectAllowed = "move"
      },
      [],
    )

    const filteredCategories = useMemo(() => {
      if (!searchQuery) {
        return categories
      }

      const normalizedQuery = searchQuery.toLowerCase()

      return categories
        .map((category) => ({
          ...category,
          items: category.items.filter((item) => {
            return [item.label, item.description, item.type]
              .filter(Boolean)
              .some((value) => value!.toLowerCase().includes(normalizedQuery))
          }),
        }))
        .filter((category) => category.items.length > 0)
    }, [searchQuery])

    const toggleCategory = useCallback((categoryName: string) => {
      setExpandedCategories((prev) => ({
        ...prev,
        [categoryName]: !prev[categoryName],
      }))
    }, [])

    const collapsedGroups = useMemo(
      () => filteredCategories.map((category) => ({ ...category })),
      [filteredCategories],
    )

    return (
      <TooltipProvider>
        <aside
          className={cn(
            "flex h-full min-h-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-300 ease-out",
            collapsed ? "w-[88px]" : "w-[320px]",
          )}
          data-collapsible={collapsed ? "icon" : ""}
        >
          <SidebarHeader
            className={cn(
              "flex-row items-center justify-between gap-2 px-2 py-2",
              collapsed && "flex-col gap-3 px-2.5 py-3",
            )}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onRouteChange?.("landingPage")}
                  className={cn(
                    "group flex min-w-0 items-center gap-3 rounded-[1.35rem] border border-transparent px-2 py-1.5 text-left transition-all duration-200 hover:bg-[var(--sidebar-accent)]",
                    collapsed ? "w-full justify-center px-0" : "flex-1",
                  )}
                  title="Return to landing page"
                >
                  <MathFlowIcon />
                  {!collapsed && (
                    <div className="min-w-0">
                      <div className="truncate text-base font-semibold tracking-[-0.03em] text-[var(--sidebar-foreground)]">
                        MathFlow
                      </div>
                      <div className="truncate text-[11px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                        Node Studio
                      </div>
                    </div>
                  )}
                </button>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">MathFlow home</TooltipContent>
              )}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="icon"
                  size="icon"
                  onClick={toggleSidebar}
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                  className={cn(collapsed && "h-10 w-10")}
                >
                  {collapsed ? (
                    <MdKeyboardDoubleArrowRight />
                  ) : (
                    <MdKeyboardDoubleArrowLeft />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side={collapsed ? "right" : "bottom"}>
                {collapsed ? "Expand sidebar" : "Collapse sidebar"}
              </TooltipContent>
            </Tooltip>
          </SidebarHeader>

          {!collapsed && (
            <div className="border-b border-[var(--sidebar-border)] px-3 pb-3">
              <div className="relative">
                <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[var(--muted-foreground)]" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search nodes, formulas, and actions"
                  className="pr-14 pl-11 text-[13px]"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-lg border border-[var(--border)] bg-[var(--sidebar-background)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  /
                </span>
              </div>
            </div>
          )}

          <SidebarContent className="min-h-0 overflow-hidden">
            {!collapsed ? (
              <ScrollArea className="h-full">
                <div className="space-y-5 px-3 py-4">
                  {filteredCategories.map((category) => (
                    <SidebarGroup key={category.name} className="p-0">
                      <button
                        type="button"
                        onClick={() => toggleCategory(category.name)}
                        className="flex items-center justify-between rounded-xl px-1 py-1 text-left transition-colors duration-200 hover:text-[var(--sidebar-foreground)]"
                      >
                        <div>
                          <SidebarGroupLabel className="mb-1 h-auto px-0 text-[12px] group-data-[collapsible=icon]:mt-0 group-data-[collapsible=icon]:opacity-100">
                            <CategoryLabel tone={category.color}>
                              {category.name}
                            </CategoryLabel>
                          </SidebarGroupLabel>
                          <p className="text-[11px] text-[var(--muted-foreground)] ml-4">
                            {category.items.length} node
                            {category.items.length === 1 ? "" : "s"}
                          </p>
                        </div>
                        <span className="flex h-7 w-7 items-center justify-center rounded-xl border border-[var(--sidebar-border)] bg-[color-mix(in_srgb,var(--sidebar-background)_80%,white_2%)] text-[var(--muted-foreground)]">
                          {expandedCategories[category.name] ? (
                            <FiChevronDown />
                          ) : (
                            <FiChevronRight />
                          )}
                        </span>
                      </button>

                      {expandedCategories[category.name] && (
                        <div className="space-y-1.5 rounded-[1.4rem]">
                          {category.items.map((item) => (
                            <SidebarNodeButton
                              key={item.type}
                              item={item}
                              collapsed={false}
                              onDragStart={onDragStart}
                            />
                          ))}
                        </div>
                      )}
                    </SidebarGroup>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <ScrollArea className="h-full">
                <div className="px-2 pb-3 pt-2">
                  <div className="flex flex-col items-center gap-2">
                    {collapsedGroups.map((category, index) => (
                      <React.Fragment key={category.name}>
                        {index > 0 && (
                          <SidebarSeparator className="my-1 w-10" />
                        )}
                        {category.items.map((item) => (
                          <SidebarNodeButton
                            key={`collapsed-${item.type}`}
                            item={item}
                            collapsed
                            onDragStart={onDragStart}
                          />
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            )}
          </SidebarContent>
        </aside>
      </TooltipProvider>
    )
  },
)

Sidebar.displayName = "Sidebar"
