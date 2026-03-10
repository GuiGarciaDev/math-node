import { RefObject, useEffect, useRef } from "react"

export function useParallax(ref: RefObject<HTMLElement | null>, speed = 0.05) {
  const rafRef = useRef<number | null>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const update = () => {
      rafRef.current = null
      const x = mouseRef.current.x * speed
      const y = mouseRef.current.y * speed
      element.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }

    const onMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = event.clientX - window.innerWidth / 2
      mouseRef.current.y = event.clientY - window.innerHeight / 2

      if (rafRef.current === null) {
        rafRef.current = window.requestAnimationFrame(update)
      }
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true })

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
      }
    }
  }, [ref, speed])
}
