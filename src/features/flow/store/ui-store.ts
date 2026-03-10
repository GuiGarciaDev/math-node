import { Routes } from "@/types/routes-types"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UIStore {
  route: Routes
  setRoute: (route: Routes) => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      route: "LANDING_PAGE",
      setRoute: (route: Routes) => set({ route }),
    }),
    {
      name: "ui-store",
    },
  ),
)
