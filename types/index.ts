export type Page = "games" | "courts" | "categories" | "officials"

export type Option = {
  label: string
  value: string | number
}

// Tables
export type Court = {
  id: string
  court_email: string
  court_in_use: boolean
  court_name: string
  created_date?: number
}

export type Category = {
  id: string
  category_gender: string
  category_name: string
  category_type: string
  created_date: number
}

export type Official = {
  id: string
  contact_no: string
  first_name: string
  last_name: string
  created_date: number
}
