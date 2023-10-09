import type { SportName } from '@/sport'

export function fetchSportScheduleHtml(sportName: SportName): Promise<string> {
  return fetch(`https://detroittitans.com/sports/${sportName}/schedule`, {
    signal: AbortSignal.timeout(10000),
  }).then((res) => res.text())
}
