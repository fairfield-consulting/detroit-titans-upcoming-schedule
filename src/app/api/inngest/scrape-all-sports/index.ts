import { logger } from '@/logger'
import { Sport } from '@/sport'

import { inngest } from '../client'

export default inngest.createFunction(
  { id: 'scrape-all-sports', name: 'Scrape Detroit Titans home schedules' },
  { cron: 'TZ=America/New_York 0 8 * * *' },
  async ({ step }) => {
    logger.info('Scraping all sports')

    const events = Object.values(Sport).map((sportId) => ({
      name: 'schedule/scrape-sport' as const,
      data: { sportId },
    }))

    await step.sendEvent('schedule/scrape-sport', events)
  }
)
