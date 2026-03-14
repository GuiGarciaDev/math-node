import { Routes } from "@/types/routes-types"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UIStore {
  route: Routes
  setRoute: (route: Routes) => void
  isWorkflowSheetOpen: boolean
  setWorkflowSheetOpen: (open: boolean) => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      route: "PROJECTS_PAGE",
      setRoute: (route: Routes) => set({ route }),
      isWorkflowSheetOpen: false,
      setWorkflowSheetOpen: (open: boolean) =>
        set({ isWorkflowSheetOpen: open }),
    }),
    {
      name: "ui-store",
    },
  ),
)
