import winston from 'winston'

import { env } from './env'

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: winston.format.json(),
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
      ),
    })
  )
}
