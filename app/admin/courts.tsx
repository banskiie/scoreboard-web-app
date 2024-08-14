"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import DataTable from "@/components/custom/data-table"
import { Court } from "@/types"
import { FIRESTORE_DB } from "@/utils/firebase"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { useState, useEffect } from "react"
import CourtForm from "./dialogs/court-form"

const ActionCell = ({ actions }: any) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false)

  return (
    <>
      <CourtForm
        id={actions.id}
        dialogOpen={openEdit}
        dialogClose={() => setOpenEdit(false)}
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
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export const columns: ColumnDef<Court>[] = [
  {
    accessorKey: "court_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Court No.
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("court_name")}</div>
    ),
  },
  {
    accessorKey: "court_email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("court_email")}</div>
    ),
  },
  {
    accessorKey: "court_in_use",
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
      const status = row.getValue("court_in_use")
      return (
        <Badge
          variant="default"
          className={`w-16 flex items-center justify-center pointer-events-none ${
            status ? "bg-red-500" : "bg-green-700"
          }`}
        >
          {status ? "In Use" : "Available"}
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
  const [data, setData] = useState<Court[]>([])

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const ref = collection(FIRESTORE_DB, "courts")
        onSnapshot(query(ref, orderBy("created_date", "asc")), {
          next: (snapshot) => {
            setData(
              snapshot.docs.map((doc: any) => ({
                id: doc.id,
                ...doc.data(),
                actions: { id: doc.id, name: doc.data().court_name },
              }))
            )
          },
        })
      } catch (error: any) {
        console.error(error)
      }
    }

    fetchCourts()
  }, [])

  return <DataTable data={data} columns={columns} add={<CourtForm />} />
}

export default Courts
