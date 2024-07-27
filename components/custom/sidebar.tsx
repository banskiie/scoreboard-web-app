"use client"

import React, { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Grid2X2, Medal, Users, Workflow } from "lucide-react"
import Image from "next/image"
import logo from "@/assets/images/logo.png"
import { usePageStore } from "@/store/page"
import { Page } from "@/types"

type SidebarItemProps = {
  icon: ReactNode
  label: Page
}

const sidebarProps = {
  className: "mr-2.5 h-4 w-4",
}

const SidebarItem = ({ icon, label }: SidebarItemProps) => {
  const { page, setPage } = usePageStore()
  return (
    <Button
      variant={page == label ? "default" : "ghost"}
      className="flex flex-row justify-start text py-5 text-lg hover:pl-6 transition-all ease-linear"
      onClick={() => setPage(label as Page)}
    >
      {icon}
      <span className="capitalize">{label}</span>
    </Button>
  )
}

const Sidebar = () => {
  return (
    <div className="h-full w-full p-4 flex flex-col items-center">
      <Image
        src={logo}
        alt="test"
        className="h-32 object-contain filter drop-shadow-lg pb-3 px-2"
      />
      <div className="w-full flex flex-col gap-2">
        <SidebarItem icon={<Medal {...sidebarProps} />} label="games" />
        <SidebarItem icon={<Grid2X2 {...sidebarProps} />} label="courts" />
        <SidebarItem icon={<Workflow {...sidebarProps} />} label="categories" />
        <SidebarItem icon={<Users {...sidebarProps} />} label="officials" />
      </div>
    </div>
  )
}

export default Sidebar
