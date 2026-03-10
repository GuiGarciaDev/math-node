import { useTheme } from "@/hooks/use-theme"
import { IoMoon, IoSunny } from "react-icons/io5"

export default function ToggleThemeButton() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-secondary)_92%,transparent)] text-base text-[var(--text-secondary)] shadow-[0_10px_24px_rgba(0,0,0,0.28)] backdrop-blur-md transition-all duration-150 hover:border-[var(--accent)] hover:text-[var(--text-primary)] hover:shadow-[0_0_18px_var(--accent-glow)]"
    >
      {isDark ? <IoSunny /> : <IoMoon />}
    </button>
  )
}
