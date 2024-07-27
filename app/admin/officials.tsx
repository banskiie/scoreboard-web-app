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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DataTable from "@/components/custom/data-table"
import { Official } from "@/types"
import { FIRESTORE_DB } from "@/utils/firebase"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { useState, useEffect } from "react"
import Loading from "../loading"

export const columns: ColumnDef<Official>[] = [
  {
    accessorKey: "first_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("first_name")}</div>
    ),
  },
  {
    accessorKey: "last_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("last_name")}</div>
    ),
  },
  {
    accessorKey: "contact_no",
    header: "Contact No.",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("contact_no")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

const Officials = () => {
  const [data, setData] = useState<Official[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchOfficials = async () => {
      setLoading(true)
      try {
        const ref = collection(FIRESTORE_DB, "officials")
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
      } finally {
        setLoading(false)
      }
    }

    return () => {
      fetchOfficials()
    }
  }, [])

  if (!data.length) return <Loading />

  return <DataTable data={data} columns={columns} />
}

export default Officials
