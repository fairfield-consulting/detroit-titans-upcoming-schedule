import { gte } from 'drizzle-orm'
import { DateTime } from 'luxon'

import { db } from '@/db/client'
import * as schema from '@/db/schema'

import { GameCard } from './components/game-card'

export default async function Home() {
  const games = await db.query.games.findMany({
    where: gte(schema.games.date, DateTime.now().startOf('day').toISO()!),
    orderBy: (games, { asc }) => [asc(games.date)],
  })

  return (
    <main className='container mx-auto flex min-h-screen flex-col space-y-8 px-4 py-24'>
      <h2 className='text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>
        Upcoming Titans Home Games
      </h2>
      <ul className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </ul>
    </main>
  )
}
