import { DateTime } from 'luxon'
import Image from 'next/image'

import type { SelectGamesSchema } from '@/db/schema'
import { Sport } from '@/sport'

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

export function GameCard({ game }: { game: SelectGamesSchema }) {
  const gameDate = DateTime.fromJSDate(game.date)
  return (
    <li className='relative col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow'>
      <span className='absolute p-2 text-2xl'>{sportEmoji(game.sportId)}</span>
      <div className='flex flex-1 flex-col p-8'>
        {game.opponentLogoUrl ? (
          <Image
            className='mx-auto h-32 w-32 flex-shrink-0'
            src={game.opponentLogoUrl}
            alt={`${game.opponentName} logo`}
            width={128}
            height={128}
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
