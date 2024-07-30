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

// Game Table

type Round = {
  current_a_score: number
  current_b_score: number
  scorer?: string
  team_scored?: string
  scored_at?: string
  to_serve: string
  next_serve: string
  a_switch: boolean
  b_switch: boolean
}

export type Set = {
  a_score: number
  b_score: number
  current_round: number
  last_team_scored: string
  winner: string
  scoresheet: Round[]
  switch: boolean
}

export type Sets = {
  set_1: Set
  set_2?: Set
  set_3?: Set
}

type Details = {
  created_date: any
  game_no: string
  court: string
  category: any
  group_no: string
  no_of_sets: 1 | 3
  max_score: number
  game_winner: string
  shuttles_used: number
  playing_set: 1 | 2 | 3
  plus_two_rule: boolean
  plus_two_score: number
}

type Time = {
  slot: any
  start: any
  end: any
}

export type Player = {
  first_name: string
  last_name: string
  nickname?: string
  use_nickname: boolean
}

export type Team = {
  team_name: string
  player_1: Player
  player_2?: Player
}

export type Players = {
  team_a: Team
  team_b: Team
}

type Officials = {
  umpire: string
  referee: string
  service_judge?: string
}

type Statuses = {
  current: "upcoming" | "current" | "forfeit" | "no match" | "finished"
  active: boolean
  focus?: any
}

export type Game = {
  id: string
  sets: Sets
  details: Details
  time: Time
  players: Players
  officials: Officials
  statuses: Statuses
}
