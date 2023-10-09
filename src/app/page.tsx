import { fetchUpcomingGames } from '@/api'

import { GameCard } from './components/game-card'

export const revalidate = 60 * 60 * 6 // 6 hours

export default async function Home() {
  const { data: games } = await fetchUpcomingGames()

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
