import { sql } from 'drizzle-orm'
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'
import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

const primaryKey = () => ({
  id: integer('id').primaryKey(),
})

const timestamps = () => ({
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(
    sql`CURRENT_TIMESTAMP`
  ),
})

export const games = sqliteTable(
  'games',
  {
    ...primaryKey(),
    ...timestamps(),
    gameId: integer('game_id').notNull().unique(),
    sportId: integer('sport_id').notNull(),
    opponentId: integer('opponent_id').notNull(),
    opponentName: text('opponent_name').notNull(),
    opponentLogoUrl: text('opponent_logo_url'),
    date: integer('date', { mode: 'timestamp' }).notNull(),
    time: text('time'),
  },
  (table) => ({
    gameIdIdx: uniqueIndex('game_id_idx').on(table.gameId),
  })
)

export const SelectGamesSchema = createSelectSchema(games)
export type SelectGamesSchema = z.infer<typeof SelectGamesSchema>

export const gameUpdates = sqliteTable('game_updates', {
  ...primaryKey(),
  ...timestamps(),
  sportId: integer('sport_id').notNull(),
})
