import type { Config } from 'drizzle-kit'

export default {
  schema: './app/drizzle/schema.ts',
  out: './drizzle',
} satisfies Config
