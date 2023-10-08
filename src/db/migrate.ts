import { migrate } from 'drizzle-orm/node-postgres/migrator'

import { db } from './client'

async function main() {
  await migrate(db, { migrationsFolder: 'drizzle' })
}

main()
