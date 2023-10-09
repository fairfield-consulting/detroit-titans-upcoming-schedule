import 'server-only'

import winston from 'winston'

import { env } from './env'

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.json(),
    winston.format.uncolorize()
  ),
  transports: [new winston.transports.Console()],
})

export async function profile<T>(label: string, fn: () => Promise<T>) {
  logger.profile(label)
  const result = await fn()
  logger.profile(label)
  return result
}
