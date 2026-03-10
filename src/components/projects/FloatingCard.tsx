import { memo, useRef } from "react"
import { useParallax } from "@/hooks/useParallax"
import { cn } from "@/lib/utils"

type FloatingCardProps = {
  speed: number
  className?: string
  innerClassName?: string
  children: React.ReactNode
}

function FloatingCardComponent({
  speed,
  className,
  innerClassName,
  children,
}: FloatingCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null)
  useParallax(cardRef, speed)

  return (
    <div
      ref={cardRef}
      className={cn("absolute will-change-transform", className)}
    >
      <div
        className={cn(
          "projects-floating-node projects-glass-panel rounded-2xl border border-white/10 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
}

export const FloatingCard = memo(FloatingCardComponent)
