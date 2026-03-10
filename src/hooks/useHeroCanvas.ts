import { RefObject, useEffect } from "react"

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  life: number
  decay: number
  interactive: boolean
  history: Array<{ x: number; y: number }>
  maxHistory: number
}

const COLORS = ["#10b981", "#fbbf24", "#fb7185", "#fef08a", "#ffffff"]

const random = (min: number, max: number) => Math.random() * (max - min) + min

export function useHeroCanvas(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  interactionRef?: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    const interactionNode = interactionRef?.current ?? canvas.parentElement
    if (!interactionNode) return

    let rafId = 0
    let width = 0
    let height = 0
    let time = 0
    const particles: Particle[] = []

    const mouse = { x: width / 2, y: height / 2, active: false }

    const createParticle = (
      x = Math.random() * width,
      y = Math.random() * height,
      interactive = false,
    ): Particle => {
      const angle = Math.random() * Math.PI * 2
      const speed = interactive ? random(1, 2.8) : random(0.08, 0.45)

      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: random(0.6, 2.8),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: interactive ? 1 : random(0.45, 0.85),
        decay: interactive ? random(0.012, 0.026) : 0,
        interactive,
        history: [],
        maxHistory: interactive ? 12 : 0,
      }
    }

    const isLightTheme = () =>
      window.document.documentElement.classList.contains("light")

    const seedAmbientParticles = () => {
      particles.length = 0
      const density = Math.max(
        45,
        Math.min(90, Math.floor((width * height) / 26000)),
      )

      for (let i = 0; i < density; i += 1) {
        particles.push(createParticle())
      }
    }

    const resize = () => {
      const bounds = interactionNode.getBoundingClientRect()
      width = Math.max(1, Math.floor(bounds.width))
      height = Math.max(1, Math.floor(bounds.height))

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      seedAmbientParticles()
    }

    const drawWave = () => {
      context.beginPath()
      context.lineWidth = 1
      context.strokeStyle = isLightTheme()
        ? "rgba(251, 191, 36, 0.09)"
        : "rgba(251, 191, 36, 0.1)"

      for (let x = 0; x < width; x += 8) {
        const y =
          height * 0.52 +
          height * 0.08 +
          Math.sin(x * 0.008 + time * 0.8) *
            80 *
            Math.cos(x * 0.004 + time * 0.4)

        if (x === 0) {
          context.moveTo(x, y)
        } else {
          context.lineTo(x, y)
        }
      }

      context.stroke()
    }

    const step = () => {
      context.clearRect(0, 0, width, height)
      drawWave()

      const baseAlpha = isLightTheme() ? 0.3 : 0.7

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i]

        particle.x += particle.vx
        particle.y += particle.vy

        if (!particle.interactive) {
          if (particle.x <= 0 || particle.x >= width) particle.vx *= -1
          if (particle.y <= 0 || particle.y >= height) particle.vy *= -1

          if (mouse.active) {
            const dx = mouse.x - particle.x
            const dy = mouse.y - particle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 120 && distance > 0) {
              particle.vx -= (dx / distance) * 0.006
              particle.vy -= (dy / distance) * 0.006
            }
          }
        } else {
          particle.life -= particle.decay
          particle.history.push({ x: particle.x, y: particle.y })
          if (particle.history.length > particle.maxHistory) {
            particle.history.shift()
          }
        }

        context.beginPath()
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        context.globalAlpha = particle.interactive
          ? Math.max(0, particle.life)
          : baseAlpha
        context.fillStyle = particle.color
        context.fill()

        if (particle.interactive && particle.history.length > 1) {
          context.beginPath()
          context.moveTo(particle.history[0].x, particle.history[0].y)
          for (let h = 1; h < particle.history.length; h += 1) {
            context.lineTo(particle.history[h].x, particle.history[h].y)
          }
          context.globalAlpha = Math.max(0, particle.life * 0.45)
          context.strokeStyle = particle.color
          context.lineWidth = Math.max(0.6, particle.size * 0.8)
          context.stroke()
        }

        if (particle.interactive && particle.life <= 0) {
          particles.splice(i, 1)
        }
      }

      context.globalAlpha = 1

      if (particles.length < 50) {
        particles.push(createParticle())
      }

      time += 0.01
      rafId = window.requestAnimationFrame(step)
    }

    const onPointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect()
      mouse.x = event.clientX - bounds.left
      mouse.y = event.clientY - bounds.top
      mouse.active = true

      if (Math.random() > 0.6) {
        particles.push(createParticle(mouse.x, mouse.y, true))
      }
    }

    const onPointerLeave = () => {
      mouse.active = false
    }

    resize()
    step()

    window.addEventListener("resize", resize)
    interactionNode.addEventListener("pointermove", onPointerMove)
    interactionNode.addEventListener("pointerleave", onPointerLeave)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener("resize", resize)
      interactionNode.removeEventListener("pointermove", onPointerMove)
      interactionNode.removeEventListener("pointerleave", onPointerLeave)
    }
  }, [canvasRef, interactionRef])
}
