import { useState } from "react"
import { useTheme } from "@/hooks/use-theme"
import { IoMoon, IoSunny } from "react-icons/io5"
import { cn } from "@/lib/utils"

export default function ToggleThemeButton() {
  const { theme, setTheme } = useTheme()
  const [isAnimating, setIsAnimating] = useState(false)
  const isDark = theme === "dark"

  return (
    <button
      type="button"
      onClick={() => {
        setTheme(isDark ? "light" : "dark")
      }}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "pointer-events-auto relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-base text-card-foreground shadow-[0_10px_24px_rgba(0,0,0,0.28)] backdrop-blur-md hover:border-accent",
        isAnimating && "animate-[theme-toggle-pop_0.35s_ease-out]",
      )}
    >
      <span
        className={cn(
          "absolute inset-0 rounded-xl border border-accent opacity-0",
          isAnimating && "animate-[theme-toggle-ring_0.45s_ease-out]",
        )}
        aria-hidden
      />
      {isDark ? (
        <IoMoon className="h-4 w-4 text-emerald-400" />
      ) : (
        <IoSunny className="h-4 w-4 text-amber-400" />
      )}
    </button>
  )
}
