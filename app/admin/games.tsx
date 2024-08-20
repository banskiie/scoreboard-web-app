"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Loader2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DataTable from "@/components/custom/data-table"
import { Game, Set } from "@/types"
import { FIRESTORE_DB } from "@/utils/firebase"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { useState, useEffect } from "react"
import GameForm from "./dialogs/game-form"
import { Badge } from "@/components/ui/badge"
import moment from "moment"
import Scoresheet from "./dialogs/scoresheet"
import UploadSchedule from "./dialogs/upload"
import DeleteGame from "./dialogs/delete-game"

const ActionCell = ({ actions }: any) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openView, setOpenView] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)

  return (
    <div className="w-10">
      <GameForm
        id={actions.id}
        dialogOpen={openEdit}
        dialogClose={() => setOpenEdit(false)}
      />
      <Scoresheet
        id={actions.id}
        dialogOpen={openView}
        dialogClose={() => setOpenView(false)}
      />
      <DeleteGame
        id={actions.id}
        dialogOpen={openDelete}
        dialogClose={() => setOpenDelete(false)}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setOpenView(true)}>
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setOpenDelete(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export const columns: ColumnDef<Game>[] = [
  {
    accessorKey: "time.slot",
    accessorFn: (data: Game) => {
      const { time } = data as any
      const { slot } = time
      // Return the Unix timestamp for sorting
      return slot ? slot : null
    },
    cell: ({ row }) => {
      const { slot } = row.original.time

      return (
        <div className="h-16 flex items-center w-full">
          {!!slot ? (
            <div className="w-full flex flex-col">
              <span className="capitalize font-bold">
                {moment.unix(slot).format("h:mm A")}
              </span>
              <span className="capitalize text-slate-500 text-[0.65rem]">
                {moment.unix(slot).format("MMMM D")}
              </span>
            </div>
          ) : (
            <p>TBA</p>
          )}
        </div>
      )
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Slot
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "details.category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const category_name = row.original.details.category.split(".")[0]
      const category_type = row.original.details.category.split(".")[1]

      return (
        <div className="capitalize w-52">
          {category_name} ({category_type})
        </div>
      )
    },
  },
  {
    accessorKey: "matchup",
    accessorFn: (data: Game) => {
      const { players } = data as any

      const fetchPlayerName = (player: string): string =>
        players[`team_${player[0]}`][`player_${player[1]}`].use_nickname
          ? players[`team_${player[0]}`][`player_${player[1]}`].nickname
          : `${
              players[`team_${player[0]}`][`player_${player[1]}`].first_name
            } ${players[`team_${player[0]}`][`player_${player[1]}`].last_name}`

      return `${fetchPlayerName("a1")} ${fetchPlayerName(
        "a2"
      )} ${fetchPlayerName("b1")} ${fetchPlayerName("b2")}`
    },
    header: "Matchup",
    cell: ({ row }) => {
      const { players, details } = row.original as any

      const fetchPlayerName = (player: string): string =>
        players[`team_${player[0]}`][`player_${player[1]}`].use_nickname
          ? players[`team_${player[0]}`][`player_${player[1]}`].nickname
          : `${
              players[`team_${player[0]}`][`player_${player[1]}`].first_name
            } ${players[`team_${player[0]}`][`player_${player[1]}`].last_name}`

      return (
        <div className="w-[24rem] flex flex-col items-center">
          <div className="capitalize flex flex-row items-center justify-between w-full">
            <div className="flex flex-col w-1/3">
              <span
                className={
                  details.game_winner === "a" ? "font-bold" : undefined
                }
              >
                {fetchPlayerName("a1")}
              </span>
              <span
                className={
                  details.game_winner === "a" ? "font-bold" : undefined
                }
              >
                {fetchPlayerName("a2")}
              </span>
            </div>
            <div className="flex flex-col w-1/3">
              <span className="text-center lowercase font-bold">vs.</span>
            </div>
            <div className="flex flex-col w-1/3 items-end">
              <span
                className={`text-end ${
                  details.game_winner === "b" ? "font-bold" : undefined
                }`}
              >
                {fetchPlayerName("b1")}
              </span>
              <span
                className={`text-end ${
                  details.game_winner === "b" ? "font-bold" : undefined
                }`}
              >
                {fetchPlayerName("b2")}
              </span>
            </div>
          </div>
          <div
            className={`flex w-full flex-row items-center ${
              details.game_winner === "a"
                ? "justify-start"
                : details.game_winner === "b"
                ? "justify-end"
                : "hidden"
            }`}
          >
            <Badge className="w-12 p-0 flex items-center justify-center bg-green-800">
              <span className="text-[0.65rem] text-center">Winner</span>
            </Badge>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "scores",
    header: "Scores",
    cell: ({ row }) => {
      const { sets } = row.original as any
      const filteredSets = Object.keys(sets)
        .sort()
        .map((key) => ({ name: key, ...(sets[key] as Set) }))
      const values = Object.values(sets)
      const a_set_score = values.filter(
        (value: any) => value.winner === "a"
      ).length
      const b_set_score = values.filter(
        (value: any) => value.winner === "b"
      ).length

      return (
        <div className="flex flex-col items-center justify-start w-12 gap-0.5">
          <div className="w-7 p-0 flex items-center justify-center gap-0.5">
            <span className={"text-center text-xs"}>{a_set_score}</span>
            <span className={"text-center text-xs"}>-</span>
            <span className={"text-center text-xs"}>{b_set_score}</span>
          </div>
          {filteredSets.map((set: any, index: number) => {
            if (!!set?.a_score && !!set?.b_score)
              return (
                <div
                  className="text-center w-full flex items-center justify-between gap-0.5"
                  key={index}
                >
                  <span
                    className={`w-1/3 text-center ${
                      set.winner === "a" ? "font-black" : undefined
                    }`}
                  >
                    {set.a_score}
                  </span>
                  <span className={`w-1/3 text-center `}>-</span>
                  <span
                    className={`w-1/3 text-center  ${
                      set.winner === "b" ? "font-black" : undefined
                    }`}
                  >
                    {set.b_score}
                  </span>
                </div>
              )
          })}
        </div>
      )
    },
  },
  {
    accessorKey: "details.no_of_sets",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Format
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const { no_of_sets } = row.original.details
      return <div className="w-16">Best of {no_of_sets}</div>
    },
  },
  {
    accessorKey: "details.court",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Court
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const { court } = row.original.details

      return <div className="w-14">{court}</div>
    },
  },
  {
    accessorKey: "statuses.current",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const { current } = row.original.statuses
      let color: string
      switch (current) {
        case "upcoming":
          color = "bg-slate-400"
          break
        case "current":
          color = "bg-blue-400"
          break
        case "forfeit":
          color = "bg-orange-500"
          break
        case "no match":
          color = "bg-red-400"
          break
        case "finished":
          color = "bg-green-800"
          break
        default:
          color = "bg-slate-400"
          break
      }
      return (
        <Badge
          className={`capitalize flex items-center justify-center w-20 ${color}`}
        >
          {current}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionCell actions={row.original} />,
  },
]

const Courts = () => {
  const [data, setData] = useState<any>([])

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const ref = collection(FIRESTORE_DB, "games")
        onSnapshot(
          query(
            ref,
            // orderBy("statuses.current", "desc"),
            orderBy("time.slot", "asc")
          ),
          {
            next: (snapshot) => {
              setData(
                snapshot.docs.map((doc: any) => ({
                  id: doc.id,
                  ...doc.data(),
                  actions: { id: doc.id },
                }))
              )
            },
          }
        )
      } catch (error: any) {
        console.error(error)
      }
    }

    fetchCourts()
  }, [])

  return (
    <DataTable
      data={data}
      columns={columns}
      add={
        <div className="space-x-2">
          <UploadSchedule />
          <GameForm />
        </div>
      }
    />
  )
}

export default Courts
