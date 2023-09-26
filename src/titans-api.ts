import { SportName } from './sport'

export function fetchSportScheduleHtml(sportName: SportName): Promise<string> {
  return fetch(`https://detroittitans.com/sports/${sportName}/schedule`).then(
    (res) => res.text()
  )
}
