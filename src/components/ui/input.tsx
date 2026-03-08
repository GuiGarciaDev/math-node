import * as React from "react"
import { cn } from "../../lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "node-input flex h-11 w-full rounded-2xl border border-[var(--input)] bg-[color-mix(in_srgb,var(--muted)_84%,transparent)] px-4 py-2 text-sm text-[var(--foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition-all duration-200 placeholder:text-[var(--muted-foreground)] hover:border-[var(--border-hover)] focus-visible:border-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    )
  },
)

Input.displayName = "Input"

export { Input }
