import { Loader2 } from "lucide-react"
import React from "react"

type Props = {}

const loading = (props: Props) => {
  return (
    <div className="grid h-screen w-full place-items-center">
      <Loader2 className="animate-spin h-52 w-52" />
    </div>
  )
}

export default loading
