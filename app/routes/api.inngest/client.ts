import { EventSchemas, Inngest } from 'inngest'
import { z } from 'zod'

import { SportIdSchema } from '~/sport'

export const inngest = new Inngest({
  name: 'Detroit Titans',
  schemas: new EventSchemas().fromZod({
    'schedule/scrape-sport': {
      data: z.object({
        sportId: SportIdSchema,
      }),
    },
  }),
})
