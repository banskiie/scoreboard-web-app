import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { FIREBASE_AUTH } from "@/utils/firebase"

type AuthStore = {
  user: any | null
  setUser: (user: any | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: any) => set(() => ({ user })),
      logout: async () => {
        await FIREBASE_AUTH.signOut()
        localStorage.clear()
        set({ user: null })
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
