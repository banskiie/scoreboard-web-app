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
import Ads from "@/components/custom/ads"

type TeamProps = {
  data: any
  team: "a" | "b"
  doubles: boolean
}

type PlayerContainerProps = {
  name: string
  server: boolean
  team: string
}

const PlayerContainer = ({ name, server, team }: PlayerContainerProps) => {
  return (
    <div
      className={`${
        server
          ? "bg-gradient-to-r " +
            (team === "a" ? "from-orange-400" : "from-green-600")
          : undefined
      } flex items-center h-full p-5`}
    >
      <span className="text-white uppercase text-9xl font-semibold">
        {name}
      </span>
    </div>
  )
}

const TeamRow = ({ data, team, doubles }: TeamProps) => {
  if (!data) {
    return null
  }
  const { sets, details, players } = data
  const currentSet = sets[`set_${details.playing_set}`]

  const getPlayerName = (player: string): string =>
    players[`team_${player[0]}`][`player_${player[1]}`].use_nickname
      ? data?.players[`team_${player[0]}`][`player_${player[1]}`].nickname
      : `${players[`team_${player[0]}`][`player_${player[1]}`].first_name} ${
          players[`team_${player[0]}`][`player_${player[1]}`].last_name
        }`

  return (
    <div
      className={`h-1/2 flex flex-row ${
        team == "a" ? "border-b-[0.5px]" : "border-t-[0.5px]"
      }`}
    >
      <div className="flex flex-col h-full justify-around w-4/5">
        <PlayerContainer
          name={getPlayerName(`${team}1`)}
          server={
            currentSet.scoresheet[currentSet.scoresheet.length - 1]
              ?.to_serve === `${team}1`
          }
          team={team}
        />
        {doubles && (
          <PlayerContainer
            name={getPlayerName(`${team}2`)}
            server={
              currentSet.scoresheet[currentSet.scoresheet.length - 1]
                ?.to_serve === `${team}2`
            }
            team={team}
          />
        )}
        <div
          className={`absolute right-[21%] flex items-center justify-center w-20 ${
            team == "a" ? "top-[35%]" : "bottom-[28%]"
          }`}
        >
          <span className="text-white font-bold text-8xl">
            {
              Object.values(data?.sets).filter(
                (set: any) => set.winner === team
              ).length
            }
          </span>
        </div>
      </div>
      <div
        className={`w-1/5 flex items-center justify-center ${
          currentSet.last_team_scored === team
            ? team === "a"
              ? "bg-orange-400"
              : "bg-green-600"
            : "text-primary"
        }`}
      >
        <span
          className={`text-[12rem] font-bold  ${
            currentSet.last_team_scored === team
              ? "text-primary"
              : team === "a"
              ? "text-orange-400"
              : "text-green-600"
          }`}
        >
          {currentSet[`${team}_score`]}
        </span>
      </div>
    </div>
  )
}

const Page = () => {
  const { user } = useAuthStore()
  const [data, setData] = useState<any>(null)
  const [doubles, setDoubles] = useState<boolean>(false)

  useEffect(() => {
    if (!user) {
      setData(null)
      return
    }

    const fetchGameData = () => {
      const ref = collection(FIRESTORE_DB, "games")
      const q = query(
        ref,
        where("details.court", "==", user.displayName),
        where("statuses.active", "==", true),
        orderBy("statuses.focus", "desc")
      )

      return onSnapshot(q, (snapshot: QuerySnapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0]
          const { details, sets } = doc.data()
          setDoubles(details.category.split(".")[1] === "doubles")
          setData({ id: doc.id, ...doc.data() })
        } else {
          setData(null)
        }
      })
    }

    const unsubscribe = fetchGameData()

    return () => unsubscribe()
  }, [user, setData])

  if (data?.details.game_winner || !data?.statuses.active) {
    return <Ads />
  }

  return (
    <div className="bg-primary h-full w-full">
      <TeamRow data={data} team="a" doubles={doubles} />
      <TeamRow data={data} team="b" doubles={doubles} />
    </div>
  )
}

export default Page
