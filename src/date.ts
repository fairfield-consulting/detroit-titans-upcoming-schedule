import { DateTime, Info } from 'luxon'

export function parseDateForYear(
  date: string,
  year: number = DateTime.now().year
): DateTime {
  const match = /^(\w{3}) (\d{1,2})$/.exec(date)
  if (!match) {
    throw new Error(`Invalid date: ${date}`)
  }

  const month = match[1]
  const day = match[2]
  const resolvedYear = Info.months('short').indexOf(month) < 7 ? year + 1 : year

  return DateTime.fromFormat(
    `${resolvedYear}-${month}-${day}`,
    'yyyy-MMM-d'
  ).startOf('day')
}
