import { z } from 'zod'

export const env = z
  .object({
    CRON_SECRET: z.string(),
  })
  .parse(process.env)
