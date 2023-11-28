import { z } from 'zod'

const schema = z.object({
  JWT_SECRET: z.string(),
  REPL_URL: z.string().url(),
})

export const env = schema.parse(process.env)
