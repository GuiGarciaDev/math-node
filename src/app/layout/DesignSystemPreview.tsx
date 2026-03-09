import React from "react"

const colorTokens = [
  "--bg-primary",
  "--bg-secondary",
  "--bg-tertiary",
  "--bg-input",
  "--border",
  "--text-primary",
  "--text-secondary",
  "--text-muted",
  "--accent",
  "--status-success",
  "--status-error",
  "--status-warn",
  "--category-number",
  "--category-arithmetic",
  "--category-expression",
  "--category-matrix",
  "--category-advanced",
]

const tokenToBgClass: Record<string, string> = {
  "--bg-primary": "bg-[var(--bg-primary)]",
  "--bg-secondary": "bg-[var(--bg-secondary)]",
  "--bg-tertiary": "bg-[var(--bg-tertiary)]",
  "--bg-input": "bg-[var(--bg-input)]",
  "--border": "bg-[var(--border)]",
  "--text-primary": "bg-[var(--text-primary)]",
  "--text-secondary": "bg-[var(--text-secondary)]",
  "--text-muted": "bg-[var(--text-muted)]",
  "--accent": "bg-[var(--accent)]",
  "--status-success": "bg-[var(--status-success)]",
  "--status-error": "bg-[var(--status-error)]",
  "--status-warn": "bg-[var(--status-warn)]",
  "--category-number": "bg-[var(--category-number)]",
  "--category-arithmetic": "bg-[var(--category-arithmetic)]",
  "--category-expression": "bg-[var(--category-expression)]",
  "--category-matrix": "bg-[var(--category-matrix)]",
  "--category-advanced": "bg-[var(--category-advanced)]",
}

const typography = [
  { label: "Display", className: "text-2xl font-semibold tracking-tight" },
  { label: "Heading", className: "text-lg font-semibold" },
  { label: "Body", className: "text-sm font-normal" },
  {
    label: "Caption",
    className: "text-xs font-medium uppercase tracking-[0.08em]",
  },
  { label: "Mono", className: "font-mono text-sm" },
]

export const DesignSystemPreview: React.FC = React.memo(() => {
  return (
    <div className="space-y-5">
      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
          Colors
        </h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {colorTokens.map((token) => (
            <div
              key={token}
              className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)]/60 p-2"
            >
              <div
                className={`h-8 w-8 rounded-md border border-[var(--border)] ${tokenToBgClass[token] ?? "bg-[var(--text-muted)]"}`}
              />
              <div>
                <div className="text-xs font-medium text-[var(--text-primary)]">
                  {token}
                </div>
                <div className="text-[11px] text-[var(--text-muted)]">
                  var({token})
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
          Typography
        </h3>
        <div className="space-y-2 rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)]/50 p-3">
          {typography.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-3"
            >
              <span className="text-[11px] text-[var(--text-muted)]">
                {item.label}
              </span>
              <span className={`${item.className} text-[var(--text-primary)]`}>
                The quick brown fox jumps over 42
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
})

DesignSystemPreview.displayName = "DesignSystemPreview"
