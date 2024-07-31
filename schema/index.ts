import { z } from "zod"

const DEFAULT_REQUIRED_MESSAGE = {
  message: "This field is required.",
}

export const LOGIN_FORM_SCHEMA = z.object({
  user: z.string().min(1, {
    message: "Please select a user.",
  }),
  password: z.string().min(6, DEFAULT_REQUIRED_MESSAGE),
})

export const COURT_FORM_SCHEMA = z.object({
  court_name: z.string().min(1, DEFAULT_REQUIRED_MESSAGE),
  court_email: z
    .string()
    .min(1, DEFAULT_REQUIRED_MESSAGE)
    .email("This is not a valid email."),
  court_in_use: z.boolean(),
})

export const CATEGORY_FORM = z.object({
  category_gender: z.enum(["mixed", "men", "women"]),
  category_name: z.string().min(1, DEFAULT_REQUIRED_MESSAGE),
  category_type: z.enum(["singles", "doubles"]),
})

export const OFFICIAL_FORM = z.object({
  contact_no: z.string().optional(),
  first_name: z.string().min(1, DEFAULT_REQUIRED_MESSAGE),
  last_name: z.string().min(1, DEFAULT_REQUIRED_MESSAGE),
})

// GAME FORM

const ROUND_SCHEMA = z.object({
  current_a_score: z.number(),
  current_b_score: z.number(),
  scorer: z.string().optional(),
  team_scored: z.string().optional(),
  scored_at: z.string().optional(),
  to_serve: z.string(),
  next_serve: z.string(),
  a_switch: z.boolean(),
  b_switch: z.boolean(),
})

const SET_SCHEMA = z.object({
  a_score: z.number(),
  b_score: z.number(),
  current_round: z.number(),
  last_team_scored: z.string(),
  winner: z.string(),
  scoresheet: z.any(),
  switch: z.boolean(),
})

const SETS_SCHEMA = z.object({
  set_1: SET_SCHEMA,
  set_2: SET_SCHEMA.optional(),
  set_3: SET_SCHEMA.optional(),
})

const DETAILS_SCHEMA = z.object({
  created_date: z.any(),
  game_no: z.string().optional(),
  court: z.string().min(1, DEFAULT_REQUIRED_MESSAGE),
  category: z.any(),
  group_no: z.string(),
  no_of_sets: z.union([z.literal(1), z.literal(3)]),
  max_score: z.number().min(1),
  game_winner: z.string(),
  shuttles_used: z.number(),
  playing_set: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  plus_two_rule: z.boolean(),
  plus_two_score: z.number(),
})

const TIME_SCHEMA = z.object({
  slot: z.any(),
  start: z.any(),
  end: z.any(),
})

const PLAYER_SCHEMA = z.object({
  first_name: z.string(),
  last_name: z.string(),
  nickname: z.string().optional(),
  use_nickname: z.boolean(),
})

const TEAM_SCHEMA = z.object({
  team_name: z.string().optional(),
  player_1: PLAYER_SCHEMA,
  player_2: PLAYER_SCHEMA,
})

const PLAYERS_SCHEMA = z.object({
  team_a: TEAM_SCHEMA,
  team_b: TEAM_SCHEMA,
})

const OFFICIALS_SCHEMA = z.object({
  umpire: z.string(),
  referee: z.string(),
  service_judge: z.string().optional(),
})

const STATUSES_SCHEMA = z.object({
  current: z.enum(["upcoming", "current", "forfeit", "no match", "finished"]),
  active: z.boolean(),
  focus: z.any().optional(),
})

export const GAME_FORM_SCHEMA = z.object({
  details: DETAILS_SCHEMA,
  sets: SETS_SCHEMA,
  time: TIME_SCHEMA,
  players: PLAYERS_SCHEMA,
  officials: OFFICIALS_SCHEMA,
  statuses: STATUSES_SCHEMA,
})

export const InitialGameState = {
  details: {
    created_date: Date.now(),
    game_no: "",
    court: "",
    category: "",
    group_no: "",
    no_of_sets: 1,
    max_score: 31,
    game_winner: "",
    shuttles_used: 0,
    playing_set: 1,
    plus_two_rule: false,
    plus_two_score: 40,
  },
  sets: {
    set_1: {
      a_score: 0,
      b_score: 0,
      current_round: 1,
      last_team_scored: "",
      winner: "",
      scoresheet: [
        {
          team_scored: "",
          scored_at: "",
          a_switch: true,
          b_switch: true,
          current_a_score: 0,
          current_b_score: 0,
          scorer: "",
          to_serve: "",
          next_serve: "",
        },
      ],
      switch: false,
    },
  },
  time: {
    slot: "",
    start: "",
    end: "",
  },
  players: {
    team_a: {
      team_name: "",
      player_1: {
        first_name: "",
        last_name: "",
        nickname: "",
        use_nickname: true,
      },
      player_2: {
        first_name: "",
        last_name: "",
        nickname: "",
        use_nickname: true,
      },
    },
    team_b: {
      team_name: "",
      player_1: {
        first_name: "",
        last_name: "",
        nickname: "",
        use_nickname: true,
      },
      player_2: {
        first_name: "",
        last_name: "",
        nickname: "",
        use_nickname: true,
      },
    },
  },
  officials: {
    umpire: "",
    service_judge: "",
    referee: "",
  },
  statuses: {
    current: "upcoming",
    active: false,
    focus: Date.now(),
  },
}
