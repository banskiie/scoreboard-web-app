import { z } from "zod"

export const LOGIN_FORM_SCHEMA = z.object({
  user: z.string().min(1, {
    message: "Please select a user.",
  }),
  password: z.string().min(6, {
    message: "Password is required.",
  }),
})
