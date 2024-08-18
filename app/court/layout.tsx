import Header from "@/components/custom/display-header"
import { ReactNode } from "react"
import type { Metadata } from "next/types"
import { Roboto_Condensed } from "next/font/google"
import { cn } from "@/lib/utils"
const roboto = Roboto_Condensed({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Display",
}

const DisplayLayout = ({
  children,
}: Readonly<{
  children: ReactNode
}>) => {
  return (
    <div
      className={cn("h-screen w-full font-sans antialiased bg-slate-400", roboto.className)}
    >
      <div className="h-[7%]">
        <Header />
      </div>
      <div className="h-[93%]">{children}</div>
    </div>
  )
}

export default DisplayLayout
