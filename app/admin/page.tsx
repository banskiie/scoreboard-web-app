"use client"

import { usePageStore } from "@/store/page"
import Games from "./games"
import Courts from "./courts"
import Categories from "./categories"
import Officials from "./officials"

const Page = () => {
  const { page } = usePageStore()
  switch (page) {
    case "games":
      return <Games />
    case "courts":
      return <Courts />
    case "categories":
      return <Categories />
    case "officials":
      return <Officials />
    default:
      return <Games />
  }
}

export default Page
