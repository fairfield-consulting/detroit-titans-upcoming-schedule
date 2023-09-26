import { DateTime } from 'luxon'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/db'
import { parseSchedule } from '@/schedule-parser'
import { SportNameSchema } from '@/sport'
import { fetchSportScheduleHtml } from '@/titans-api'

const ParamsSchema = z.object({
  sportName: SportNameSchema,
})

export async function GET(_request: NextRequest, context: { params: unknown }) {
  // TODO validate request headers for cron auth

  const { sportName } = ParamsSchema.parse(context.params)

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

  return NextResponse.json({ homeGames })
}
