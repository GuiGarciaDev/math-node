export function matchesSearch(value: string, searchText: string): boolean {
  return value.toLowerCase().includes(searchText.trim().toLowerCase())
}

export function formatRelativeTime(timestamp: number): string {
  const deltaMs = Date.now() - timestamp
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const month = 30 * day

  if (deltaMs < minute) return "Edited just now"
  if (deltaMs < hour) return `Edited ${Math.floor(deltaMs / minute)} min ago`
  if (deltaMs < day) return `Edited ${Math.floor(deltaMs / hour)} h ago`
  if (deltaMs < month) return `Edited ${Math.floor(deltaMs / day)} days ago`
  return `Edited ${Math.floor(deltaMs / month)} months ago`
}

export type SortMode =
  | "most-recent"
  | "last-viewed"
  | "oldest"
  | "name-asc"
  | "name-desc"

export function sortByMode<
  T extends { name: string; createdAt?: number; updatedAt?: number },
>(items: T[], mode: SortMode): T[] {
  const next = [...items]

  switch (mode) {
    case "oldest":
      return next.sort((a, b) => (a.updatedAt ?? 0) - (b.updatedAt ?? 0))
    case "name-asc":
      return next.sort((a, b) => a.name.localeCompare(b.name))
    case "name-desc":
      return next.sort((a, b) => b.name.localeCompare(a.name))
    case "last-viewed":
      return next.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))
    case "most-recent":
    default:
      return next.sort((a, b) => {
        const aTime = a.createdAt ?? a.updatedAt ?? 0
        const bTime = b.createdAt ?? b.updatedAt ?? 0
        return bTime - aTime
      })
  }
}
