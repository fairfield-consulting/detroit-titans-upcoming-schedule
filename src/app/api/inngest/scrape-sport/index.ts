import { sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

import { db } from '@/db/client'
import { games, gameUpdates } from '@/db/schema'
import { logger, profile } from '@/logger'
import { sportIdToSlug } from '@/sport'

import { inngest } from '../client'
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
        await profile('upsert home games', () =>
          db.transaction(async (tx) => {
            await tx
              .insert(games)
              .values(homeGames)
              .onConflictDoUpdate({
                target: games.gameId,
                set: {
                  date: sql`EXCLUDED.date`,
                  time: sql`EXCLUDED.time`,
                  opponentName: sql`EXCLUDED.opponent_name`,
                  opponentLogoUrl: sql`EXCLUDED.opponent_logo_url`,
                },
              })
            await tx.insert(gameUpdates).values({ sportId })
          })
        )
        revalidatePath('/', 'page')
      }
    )
  }
)
