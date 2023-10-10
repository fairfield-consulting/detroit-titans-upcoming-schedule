import { sql } from 'drizzle-orm'
import { DateTime } from 'luxon'
import { revalidatePath } from 'next/cache'

import { db } from '@/db/client'
import { games, gameUpdates } from '@/db/schema'
import { sportIdToSlug } from '@/sport'

import { inngest } from '../client'
import { parseHomeGames } from './schedule-parser'
import { fetchSportScheduleHtml } from './titans-api'

export const runtime = 'edge'

export default inngest.createFunction(
  { id: 'scrape-sport', name: 'Scrape Detroit Titans schedule for a sport' },
  { event: 'schedule/scrape-sport' },
  async ({ event, step }) => {
    const { sportId } = event.data
    const sportName = sportIdToSlug[sportId]

    const homeGames = await step.run(
      { id: 'scrape-home-games', name: `Scraping ${sportName} schedule` },
      async () => {
        console.log(`Scraping ${sportName} schedule`)
        const html = await fetchSportScheduleHtml(sportName)
        const homeGames = await parseHomeGames(html)
        console.log(`Found ${homeGames.length} home game(s) for ${sportName}`)
        return homeGames
      }
    )

    await step.run(
      { id: 'upsert-home-games', name: 'Upserting games' },
      async () => {
        console.time('Upsert home games')
        await db.transaction(async (tx) => {
          await tx
            .insert(games)
            .values(
              homeGames.map((game) => ({
                ...game,
                date: DateTime.fromISO(game.date).toJSDate(),
              }))
            )
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
        console.timeEnd('Upsert home games')

        revalidatePath('/')
      }
    )
  }
)
