import { type MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { DateTime } from 'luxon'

import { prisma } from '~/db'
import { Sport } from '~/sport'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export async function loader() {
  const games = await prisma.game.findMany({
    where: {
      date: {
        gte: DateTime.now().startOf('day').toJSDate(),
      },
    },
    orderBy: {
      date: 'asc',
    },
    select: {
      id: true,
      sportId: true,
      gameId: true,
      opponentName: true,
      opponentLogoUrl: true,
      date: true,
      time: true,
    },
  })

  return {
    games: games.map((game) => ({
      ...game,
      date: DateTime.fromJSDate(game.date).toISODate(),
    })),
  }
}

type SerializedGame = Awaited<ReturnType<typeof loader>>['games'][number]

function displaySportName(sportId: number) {
  switch (sportId) {
    case Sport.MensSoccer:
      return "Men's Soccer"
    case Sport.WomensSoccer:
      return "Women's Soccer"
    case Sport.MensBasketball:
      return "Men's Basketball"
    case Sport.WomensBasketball:
      return "Women's Basketball"
    default:
      return null
  }
}

function sportEmoji(sportId: number) {
  switch (sportId) {
    case Sport.MensSoccer:
    case Sport.WomensSoccer:
      return '⚽️'
    case Sport.MensBasketball:
    case Sport.WomensBasketball:
      return '🏀'
    default:
      return null
  }
}

export default function Home() {
  const { games } = useLoaderData<typeof loader>()

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

function GameCard({ game }: { game: SerializedGame }) {
  const gameDate = DateTime.fromISO(game.date!)
  return (
    <li className='relative col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow'>
      <span className='top-0p-4 absolute p-2 text-2xl'>
        {sportEmoji(game.sportId)}
      </span>
      <div className='flex flex-1 flex-col p-8'>
        {game.opponentLogoUrl ? (
          <img
            className='mx-auto h-32 w-32 flex-shrink-0'
            src={game.opponentLogoUrl}
            alt={`${game.opponentName} logo`}
          />
        ) : null}
        <h3 className='mt-6 text-sm font-medium text-gray-900'>
          {game.opponentName}
        </h3>
        <dl className='mt-1 flex flex-grow flex-col justify-between'>
          <dt className='sr-only'>Sport</dt>
          <dd className='text-sm text-gray-500'>
            {displaySportName(game.sportId)}
          </dd>
          <dt className='sr-only'>Date and Time</dt>
          <dd className='text-sm text-gray-500'>
            {gameDate.toLocaleString({
              weekday: 'short',
              month: 'long',
              day: 'numeric',
              year:
                gameDate.year > new Date().getFullYear()
                  ? 'numeric'
                  : undefined,
            })}{' '}
            @ {game.time || 'TBD'}
          </dd>
        </dl>
      </div>
    </li>
  )
}
