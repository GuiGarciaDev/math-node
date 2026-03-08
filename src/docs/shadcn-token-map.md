# shadcn Token Migration Map

This project now exposes shadcn-style semantic tokens in `src/styles/index.css` and maps the older MathFlow variables onto them for compatibility.

| Legacy token              | New semantic token       |
| ------------------------- | ------------------------ |
| `--bg-primary`            | `--background`           |
| `--bg-secondary`          | `--card`                 |
| `--bg-tertiary`           | `--secondary`            |
| `--bg-input`              | `--muted` / `--input`    |
| `--text-primary`          | `--foreground`           |
| `--text-secondary`        | `--secondary-foreground` |
| `--text-muted`            | `--muted-foreground`     |
| `--accent`                | `--primary` / `--accent` |
| `--border`                | `--border`               |
| `--category-input`        | `--node-input`           |
| `--category-arithmetic`   | `--node-arithmetic`      |
| `--category-trigonometry` | `--node-trigonometry`    |
| `--category-logarithmic`  | `--node-logarithmic`     |
| `--category-logic`        | `--node-logic`           |
| `--category-calculus`     | `--node-calculus`        |
| `--category-display`      | `--node-display`         |
| `--category-advanced`     | `--node-advanced`        |

Sidebar-specific surfaces use these shadcn-style variables:

- `--sidebar-background`
- `--sidebar-foreground`
- `--sidebar-primary`
- `--sidebar-primary-foreground`
- `--sidebar-accent`
- `--sidebar-accent-foreground`
- `--sidebar-border`
- `--sidebar-ring`

New UI primitives live under `src/components/ui` and consume these semantic variables directly.
