import type { ActionFunctionArgs } from '@remix-run/node'
import { DateTime } from 'luxon'
import { z } from 'zod'

import { prisma } from '~/db'
import { env } from '~/env'
import { methodNotAllowed, noContent, unauthorized } from '~/remix-utils'
import { SportNameSchema } from '~/sport'

import { parseHomeGames } from './schedule-parser'
import { fetchSportScheduleHtml } from './titans-api'

const ParamsSchema = z.object({
  sportName: SportNameSchema,
})

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    throw methodNotAllowed()
  }

  if (request.headers.get('x-cron-auth') !== env.CRON_SECRET) {
    throw unauthorized()
  }

  const { sportName } = ParamsSchema.parse(params)

  const html = await fetchSportScheduleHtml(sportName)
  const homeGames = await parseHomeGames(html)

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
    prisma.gameUpdate.create({ data: {} }),
  ])

  return noContent()
}
