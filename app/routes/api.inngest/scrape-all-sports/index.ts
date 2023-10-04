import { logger } from '~/logger.server'
import { inngest } from '~/routes/api.inngest/client'
import { Sport } from '~/sport'

export default inngest.createFunction(
  { name: 'Scrape Detroit Titans home schedules' },
  { cron: 'TZ=America/New_York 0 8 * * *' },
  async ({ step }) => {
    logger.info('Scraping all sports')

    const events = Object.values(Sport).map((sportId) => ({
      name: 'schedule/scrape-sport' as const,
      data: { sportId },
    }))

    await step.sendEvent(events)
  }
)
