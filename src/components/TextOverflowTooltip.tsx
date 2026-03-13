import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip"

interface TextOverflowTooltipProps {
  children: React.ReactNode
  text: string
}

export default function TextOverflowTooltip({
  children,
  text,
}: TextOverflowTooltipProps) {
  return (
    <TooltipProvider delayDuration={1300}>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent align="start" className="px-2 py-1 rounded-sm max-w-md">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
