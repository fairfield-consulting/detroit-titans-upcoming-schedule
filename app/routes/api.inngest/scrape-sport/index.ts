import { DateTime } from 'luxon'

import { prisma } from '~/db.server'
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
        await prisma.$transaction([
          ...homeGames.map((game) =>
            prisma.game.upsert({
              where: { gameId: game.gameId },
              create: {
                ...game,
                date: DateTime.fromISO(game.date).toUTC().toJSDate(),
              },
              update: {
                date: DateTime.fromISO(game.date).toUTC().toJSDate(),
                time: game.time,
                opponentName: game.opponentName,
                opponentLogoUrl: game.opponentLogoUrl,
              },
            })
          ),
          prisma.gameUpdate.create({ data: { sportId } }),
        ])
        logger.profile('Upserting home games')
      }
    )
  }
)
