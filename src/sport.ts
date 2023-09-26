import { z } from 'zod'

export const SportNameSchema = z.enum([
  'mens-soccer',
  'womens-soccer',
  'mens-basketball',
  'womens-basketball',
])

export type SportName = z.infer<typeof SportNameSchema>

export const Sport = {
  MensSoccer: 9,
  WomensSoccer: 10,
  MensBasketball: 1,
  WomensBasketball: 2,
} as const
