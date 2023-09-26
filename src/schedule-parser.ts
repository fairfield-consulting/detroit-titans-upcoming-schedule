import type { Element, ElementContent, Root, Text } from 'hast'
import { fromHtml } from 'hast-util-from-html'
import { select, selectAll } from 'hast-util-select'
import { z } from 'zod'

import { parseDateForYear } from '@/date'

function isTextElement(element: ElementContent): element is Text {
  return element.type === 'text'
}

const GameSchema = z.object({
  gameId: z.string().transform(Number),
  sportId: z.string().transform(Number),
  opponentId: z.string().transform(Number),
  opponentName: z.string(),
  opponentLogoUrl: z.string().optional(),
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

  private get gameId() {
    return this.element.properties.dataGameId
  }

  private get opponentId() {
    return this.element.properties.dataGameOpponentId
  }

  private get sportId() {
    return this.element.properties.dataSportId
  }

  private get opponentName() {
    const node = select('.sidearm-schedule-game-opponent-name a', this.element)
    return node?.children?.find(isTextElement)?.value?.trim()
  }

  private get date() {
    const node = select(
      '.sidearm-schedule-game-opponent-date span',
      this.element
    )
    const value = node?.children?.find(isTextElement)?.value?.trim()

    if (!value) {
      return
    }

    const dateStringWithoutDay = value.replace(/\((.*)\)/g, '').trim()
    const date = parseDateForYear(dateStringWithoutDay)

    if (date.isValid) {
      return date.toISODate()!
    }
  }

  private get time() {
    const node = select('.sidearm-schedule-game-time span', this.element)
    return node?.children?.find(isTextElement)?.value?.trim()
  }

  private get opponentLogoUrl() {
    const node = select(
      '.sidearm-schedule-game-opponent-logo img',
      this.element
    )

    const logoUrl = node?.properties?.dataSrc
    if (logoUrl) {
      return `https://detroittitans.com${logoUrl}`
    }
  }

  toJSON(): z.infer<typeof GameSchema> {
    const gameProperties = {
      gameId: this.gameId,
      sportId: this.sportId,
      opponentId: this.opponentId,
      opponentName: this.opponentName,
      opponentLogoUrl: this.opponentLogoUrl,
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

export function parseSchedule(html: string) {
  return new ScheduleParser(html)
}
