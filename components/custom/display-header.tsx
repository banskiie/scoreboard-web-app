"use client"

import { useAuthStore } from "@/store/auth"
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/utils/firebase"
import { ReactNode, useEffect, useState } from "react"
import Image from "next/image"
import logo from "@/assets/images/logo.png"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  QuerySnapshot,
} from "firebase/firestore"

type HeaderSliceProps = {
  position: string
  children?: ReactNode
}

const HeaderSlice = ({ position, children }: HeaderSliceProps) => {
  const justifiedPosition = `justify-${position}`
  return (
    <div className={`w-1/3 h-full flex items-center ${justifiedPosition}`}>
      {children}
    </div>
  )
}

const Header = () => {
  const router = useRouter()
  const { user, setUser } = useAuthStore()
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    if (!user) {
      setData(null)
      return
    }

    const ref = collection(FIRESTORE_DB, "games")
    const q = query(
      ref,
      where("details.court", "==", user.displayName),
      where("statuses.active", "==", true),
      orderBy("statuses.focus", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0]
        setData({ id: doc.id, ...doc.data() })
      } else {
        setData(null)
      }
    })

    return () => unsubscribe()
  }, [user, setData])

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
    <div className="h-full w-full flex items-center p-2.5 gap-2.5 bg-slate-100">
      <HeaderSlice position="start">
        <span className="text-3xl font-bold uppercase">
          {user?.displayName}
          {!!(!data?.details.game_winner && data) &&
            `  (Set ${data?.details.playing_set} of
            ${data?.details.no_of_sets})`}
        </span>
      </HeaderSlice>
      <HeaderSlice position="center">
        {!!(!data?.details.game_winner && data) && (
          <span className="text-3xl text-center font-bold uppercase">
            {`${data?.details.category.split(".")[0]} - ${
              data?.details.category.split(".")[1]
            }`}
          </span>
        )}
      </HeaderSlice>
      <HeaderSlice position="end">
        <Button
          variant="link"
          onClick={signOut}
          className="pr-2 flex absolute right-0"
        >
          <Image
            priority
            src={logo}
            alt="System Logo"
            className="object-contain w-32"
          />
        </Button>
      </HeaderSlice>
    </div>
  )
}

export default Header
