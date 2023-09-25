import type { Element, ElementContent, Root, Text } from 'hast'
import { fromHtml } from 'hast-util-from-html'
import { select, selectAll } from 'hast-util-select'
import { DateTime } from 'luxon'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { parseDateForYear } from '@/date'
import { prisma } from '@/db'
import { fetchSportScheduleHtml } from '@/titans-api'
import { SportNameSchema } from '@/types'

function isTextElement(element: ElementContent): element is Text {
  return element.type === 'text'
}

const GameSchema = z.object({
  gameId: z.string().transform(Number),
  opponentId: z.string().transform(Number),
  sportId: z.string().transform(Number),
  opponentName: z.string(),
  date: z.string(),
  time: z.string().optional(),
})

class ScheduleParser {
  private readonly root: Root

  constructor(html: string) {
    this.root = fromHtml(html)
  }

  get homeGames() {
    return selectAll('.sidearm-schedule-home-game', this.root).map(
      (element) => new GameParser(element)
    )
  }
}

class GameParser {
  constructor(private readonly element: Element) {}

  get gameId() {
    return this.element.properties.dataGameId
  }

  get opponentId() {
    return this.element.properties.dataGameOpponentId
  }

  get sportId() {
    return this.element.properties.dataSportId
  }

  get opponentName() {
    const node = select('.sidearm-schedule-game-opponent-name a', this.element)
    return node?.children?.find(isTextElement)?.value?.trim()
  }

  get date() {
    const node = select(
      '.sidearm-schedule-game-opponent-date span',
      this.element
    )
    const value = node?.children?.find(isTextElement)?.value?.trim()

    if (!value) {
      return
    }

    // TODO fix leap year
    const dateStringWithoutDay = value.replace(/\((.*)\)/g, '').trim()
    const date = parseDateForYear(dateStringWithoutDay)

    if (date.isValid) {
      return date.toISODate()!
    }
  }

  get time() {
    const node = select('.sidearm-schedule-game-time span', this.element)
    return node?.children?.find(isTextElement)?.value?.trim()
  }

  toJSON() {
    const gameProperties = {
      gameId: this.gameId,
      opponentId: this.opponentId,
      sportId: this.sportId,
      opponentName: this.opponentName,
      date: this.date,
      time: this.time,
    }
    const game = GameSchema.safeParse(gameProperties)

    if (game.success) {
      return game.data
    }

    console.warn('Unable to parse game: %o', gameProperties)
    throw game.error
  }
}

const ParamsSchema = z.object({
  sportName: SportNameSchema,
})

export async function POST(request: NextRequest, context: { params: unknown }) {
  const { sportName } = ParamsSchema.parse(context.params)

  const html = await fetchSportScheduleHtml(sportName)
  const parser = new ScheduleParser(html)

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
        },
      })
    ),
    prisma.gameUpdate.create({ data: {} }),
  ])

  return NextResponse.json({ homeGames })
}
