import { EventSchemas, Inngest } from 'inngest'

import type { SportId } from '@/sport'

type Events = {
  'schedule/scrape-sport': {
    data: {
      sportId: SportId
    }
  }
}

export const inngest = new Inngest({
  id: 'detroit-titans',
  schemas: new EventSchemas().fromRecord<Events>(),
  fetch: fetch,
})
