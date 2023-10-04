import { z } from 'zod'

export const env = z
  .object({
    LOG_LEVEL: z.string().default('info'),
    INNGEST_EVENT_KEY: z.string(),
    INNGEST_SIGNING_KEY: z.string(),
  })
  .parse(process.env)
