import { memo, useRef } from "react"
import { useHeroCanvas } from "@/hooks/useHeroCanvas"

type HeroCanvasProps = {
  interactionRef: React.RefObject<HTMLElement | null>
}

function HeroCanvasComponent({ interactionRef }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  useHeroCanvas(canvasRef, interactionRef)

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 h-full w-full pointer-events-none"
      aria-hidden="true"
    />
  )
}

export const HeroCanvas = memo(HeroCanvasComponent)
