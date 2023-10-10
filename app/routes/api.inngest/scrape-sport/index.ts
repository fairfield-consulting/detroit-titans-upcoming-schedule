import { sql } from 'drizzle-orm'
import { DateTime } from 'luxon'

import { db } from '~/drizzle/client'
import * as schema from '~/drizzle/schema'
import { logger } from '~/logger.server'
import { inngest } from '~/routes/api.inngest/client'
import { sportIdToSlug } from '~/sport'

import { parseHomeGames } from './schedule-parser'
import { fetchSportScheduleHtml } from './titans-api'

export default inngest.createFunction(
  { id: 'scrape-sport', name: 'Scrape Detroit Titans schedule for a sport' },
  { event: 'schedule/scrape-sport' },
  async ({ event, step }) => {
    const { sportId } = event.data
    const sportName = sportIdToSlug[sportId]

    const homeGames = await step.run(
      { id: 'scrape-home-games', name: `Scraping ${sportName} schedule` },
      async () => {
        logger.info(`Scraping ${sportName} schedule`)
        const html = await fetchSportScheduleHtml(sportName)
        const homeGames = await parseHomeGames(html)
        logger.info(`Found ${homeGames.length} home game(s) for ${sportName}`)
        return homeGames
      }
    )

    await step.run(
      { id: 'upsert-home-games', name: 'Upserting games' },
      async () => {
        logger.profile('Upserting home games')
        await db.transaction(async (tx) => {
          await tx
            .insert(schema.games)
            .values(
              homeGames.map((game) => ({
                ...game,
                date: DateTime.fromISO(game.date).toJSDate(),
              }))
            )
            .onConflictDoUpdate({
              target: schema.games.gameId,
              set: {
                date: sql`excluded.date`,
                time: sql`excluded.time`,
                opponentName: sql`excluded.opponent_name`,
                opponentId: sql`excluded.opponent_id`,
                opponentLogoUrl: sql`excluded.opponent_logo_url`,
              },
            })
          await tx.insert(schema.gameUpdates).values({ sportId })
        })
        logger.profile('Upserting home games')
      }
    )
  }
)
