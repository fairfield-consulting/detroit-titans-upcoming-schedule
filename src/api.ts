import { z } from 'zod'

import { SelectGamesSchema } from './db/schema'

function url(path: string) {
  return new URL(
    path,
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT || 3000}`
  )
}

export async function fetchUpcomingGames() {
  const json = await fetch(url('/api/games'), {
    next: { tags: ['games'] },
  }).then((res) => res.json())

  return z.object({ data: z.array(SelectGamesSchema) }).parse(json)
}
