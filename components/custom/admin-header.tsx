"use client"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth"
import { FIREBASE_AUTH } from "@/utils/firebase"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

const Header = () => {
  const { setUser } = useAuthStore()
  const router = useRouter()
  const signOut = async () => {
    try {
      setUser(null)
      await FIREBASE_AUTH.signOut()
      router.push("/")
    } catch (error: any) {
      console.error(error)
    }
  }
  return (
    <div className="w-full h-full flex items-center justify-end px-2">
      <Button size="icon" onClick={signOut}>
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default Header
