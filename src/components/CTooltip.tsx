import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"

interface CTooltipProps {
  children: React.ReactNode
  content: string
  align?: "start" | "center" | "end"
  side?: "top" | "right" | "bottom" | "left"
}

export default function CTooltip({
  content,
  children,
  align,
  side,
}: CTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent align={align} side={side}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
