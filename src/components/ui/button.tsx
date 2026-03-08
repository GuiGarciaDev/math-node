import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium outline-none ring-offset-transparent transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[0_12px_24px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:scale-[0.98]",
        secondary:
          "border border-[var(--border)] bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:border-[var(--border-hover)] hover:bg-[color-mix(in_srgb,var(--secondary)_82%,white)] active:scale-[0.98]",
        ghost:
          "text-[var(--muted-foreground)] hover:bg-[var(--accent)]/10 hover:text-[var(--foreground)] active:scale-[0.98]",
        icon: "h-9 w-9 rounded-2xl border border-[var(--sidebar-border)] bg-[color-mix(in_srgb,var(--sidebar-background)_92%,white_2%)] p-0 text-[var(--sidebar-foreground)] shadow-[0_10px_22px_rgba(0,0,0,0.14)] hover:-translate-y-0.5 hover:border-[var(--sidebar-ring)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--foreground)] active:translate-y-0 active:scale-95",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-xl px-3",
        lg: "h-11 rounded-2xl px-5",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  },
)

Button.displayName = "Button"

export { Button, buttonVariants }
