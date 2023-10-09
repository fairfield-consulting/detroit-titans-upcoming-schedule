import { asc, gte } from 'drizzle-orm'
import { DateTime } from 'luxon'
import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/db/client'
import { profile } from '@/logger'

export async function GET(req: NextRequest) {
  const after =
    req.nextUrl.searchParams.get('after') ??
    DateTime.now().startOf('day').toISODate()!

  const games = await profile('find upcoming games', () =>
    db.query.games.findMany({
      where: (games) => gte(games.date, after),
      orderBy: (games) => [asc(games.date)],
    })
  )

  return NextResponse.json({ data: games })
}
