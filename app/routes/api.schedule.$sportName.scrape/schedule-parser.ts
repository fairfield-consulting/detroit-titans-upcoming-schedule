import type { Element, ElementContent, Text } from 'hast'
import { fromHtml } from 'hast-util-from-html'
import { select, selectAll } from 'hast-util-select'
import { z } from 'zod'

import { parseDateForYear } from '~/date'

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

export function parseHomeGames(html: string) {
  const root = fromHtml(html)

  const scrapedGames = selectAll('.sidearm-schedule-home-game', root).map(
    parseGameFromElement
  )

  return z.array(GameSchema).parseAsync(scrapedGames)
}

function parseGameFromElement(element: Element) {
  return {
    gameId: element.properties.dataGameId,
    sportId: element.properties.dataSportId,
    opponentId: element.properties.dataGameOpponentId,
    opponentName: parseOpponentName(element),
    opponentLogoUrl: parseOpponentLogoUrl(element),
    date: parseDate(element),
    time: parseTime(element),
  }
}

function parseOpponentName(element: Element) {
  const node = select('.sidearm-schedule-game-opponent-name a', element)
  return node?.children
    ?.find(isTextElement)
    ?.value?.replace('(DH)', '')
    ?.replace('(Exh.)', '')
    ?.trim()
}

function parseDate(element: Element) {
  const node = select('.sidearm-schedule-game-opponent-date span', element)
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

function parseTime(element: Element) {
  const node = select('.sidearm-schedule-game-time span', element)
  return node?.children
    ?.find(isTextElement)
    ?.value?.replace(/(am|pm)/i, (value) => value.toLowerCase())
    ?.replace(':00', '')
    ?.replaceAll(/\s+/g, '')
    ?.trim()
}

function parseOpponentLogoUrl(element: Element) {
  const node = select('.sidearm-schedule-game-opponent-logo img', element)

  const logoUrl = node?.properties?.dataSrc
  if (logoUrl) {
    const url = new URL(`https://detroittitans.com${logoUrl}`)
    url.searchParams.delete('width')
    url.searchParams.delete('height')
    return url.toString()
  }
}
