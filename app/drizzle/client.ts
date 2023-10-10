import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'

import { env } from '~/env'

import * as schema from './schema'

const sql = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN,
})

export const db = drizzle(sql, { schema })

migrate(db, { migrationsFolder: 'drizzle' })
