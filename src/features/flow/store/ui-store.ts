import { Routes } from "@/types/routes-types"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UIStore {
  route: Routes
  setRoute: (route: Routes) => void
  isWorkflowSheetOpen: boolean
  setWorkflowSheetOpen: (open: boolean) => void
  hasHydrated: boolean
  isIntroModalOpen: boolean
  hasSeenIntroModal: boolean
  setHasHydrated: (hydrated: boolean) => void
  openIntroModal: () => void
  dismissIntroModal: () => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      route: "PROJECTS_PAGE",
      setRoute: (route: Routes) => set({ route }),
      isWorkflowSheetOpen: false,
      setWorkflowSheetOpen: (open: boolean) =>
        set({ isWorkflowSheetOpen: open }),
      hasHydrated: false,
      isIntroModalOpen: false,
      hasSeenIntroModal: false,
      setHasHydrated: (hydrated: boolean) => set({ hasHydrated: hydrated }),
      openIntroModal: () => set({ isIntroModalOpen: true }),
      dismissIntroModal: () =>
        set({
          isIntroModalOpen: false,
          hasSeenIntroModal: true,
        }),
    }),
    {
      name: "ui-store",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)
