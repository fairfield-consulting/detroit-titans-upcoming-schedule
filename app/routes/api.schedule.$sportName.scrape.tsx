import type { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { DateTime } from 'luxon'
import { z } from 'zod'

import { prisma } from '~/db'
import { env } from '~/env'
import { parseSchedule } from '~/schedule-parser'
import { SportNameSchema } from '~/sport'
import { fetchSportScheduleHtml } from '~/titans-api'

const ParamsSchema = z.object({
  sportName: SportNameSchema,
})

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    throw new Response(null, { status: 405 })
  }

  if (request.headers.get('x-cron-auth') !== env.CRON_SECRET) {
    throw new Response(null, { status: 401 })
  }

  const { sportName } = ParamsSchema.parse(params)

  const html = await fetchSportScheduleHtml(sportName)
  const parser = parseSchedule(html)

  const homeGames = parser.homeGames.map((game) => game.toJSON())

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

  return json({ homeGames })
}
