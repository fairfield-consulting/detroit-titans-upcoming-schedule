import {
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const games = pgTable(
  'games',
  {
    id: serial('id').primaryKey(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    gameId: integer('game_id').notNull().unique(),
    sportId: integer('sport_id').notNull(),
    opponentId: integer('opponent_id').notNull(),
    opponentName: text('opponent_name').notNull(),
    opponentLogoUrl: text('opponent_logo_url'),
    date: date('date', { mode: 'string' }).notNull(),
    time: text('time'),
  },
  (table) => ({
    gameIdIdx: uniqueIndex('game_id_idx').on(table.gameId),
  })
)

export const SelectGamesSchema = createSelectSchema(games, {
  date: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const gameUpdates = pgTable('game_updates', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  sportId: integer('sport_id').notNull(),
})
