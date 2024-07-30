import Sidebar from "@/components/custom/sidebar"
import Header from "@/components/custom/admin-header"
import { ReactNode } from "react"
import type { Metadata } from "next/types"
import { Inter } from "next/font/google"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Administrator",
}

const AdminLayout = ({
  children,
}: Readonly<{
  children: ReactNode
}>) => {
  return (
    <div
      className={cn(
        "h-screen w-full font-sans antialiased flex flex-row",
        inter.className
      )}
    >
      <div className="w-72">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col bg-slate-50">
        <div className="h-12">
          <Header />
        </div>
        <div className="flex-1 p-2">{children}</div>
      </div>
    </div>
  )
}

export default AdminLayout
