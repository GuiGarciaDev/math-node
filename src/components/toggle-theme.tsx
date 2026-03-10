import { useState } from "react"
import { useTheme } from "@/hooks/use-theme"
import { IoMoon, IoSunny } from "react-icons/io5"
import { cn } from "@/lib/utils"

export default function ToggleThemeButton() {
  const { theme, setTheme } = useTheme()
  const [isAnimating, setIsAnimating] = useState(false)
  const isDark = theme === "dark"

  const handleToggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark"
    setIsAnimating(true)

    const root = document.documentElement
    root.classList.add("theme-transition-active")

    const docWithTransition = document as Document & {
      startViewTransition?: (update: () => void) => {
        finished: Promise<void>
      }
    }

    if (docWithTransition.startViewTransition) {
      docWithTransition
        .startViewTransition(() => {
          setTheme(nextTheme)
        })
        .finished.finally(() => {
          root.classList.remove("theme-transition-active")
          setIsAnimating(false)
        })
      return
    }

    setTheme(nextTheme)
    window.setTimeout(() => {
      root.classList.remove("theme-transition-active")
      setIsAnimating(false)
    }, 420)
  }

  return (
    <button
      type="button"
      onClick={handleToggleTheme}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "pointer-events-auto relative flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-secondary)_92%,transparent)] text-base text-[var(--text-secondary)] shadow-[0_10px_24px_rgba(0,0,0,0.28)] backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-[var(--accent)] hover:text-[var(--text-primary)] hover:shadow-[0_0_20px_var(--accent)]",
        isAnimating && "animate-[theme-toggle-pop_0.35s_ease-out]",
      )}
    >
      <span
        className={cn(
          "absolute inset-0 rounded-xl border border-[var(--accent)] opacity-0",
          isAnimating && "animate-[theme-toggle-ring_0.45s_ease-out]",
        )}
        aria-hidden
      />
      {isDark ? (
        <IoSunny className="h-4 w-4 text-amber-300" />
      ) : (
        <IoMoon className="h-4 w-4 text-emerald-400" />
      )}
    </button>
  )
}
