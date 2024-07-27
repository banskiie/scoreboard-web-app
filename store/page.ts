import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { Page } from "@/types"

type PageStore = {
  page: Page
  setPage: (page: Page) => void
}

export const usePageStore = create<PageStore>()(
  persist(
    (set) => ({
      page: "games",
      setPage: (page: Page) => set(() => ({ page })),
    }),
    {
      name: "page-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
