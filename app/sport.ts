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

export const SportIdSchema = z.nativeEnum(Sport)
export type SportId = z.infer<typeof SportIdSchema>

export const sportIdToSlug = {
  [Sport.MensBasketball]: 'mens-basketball',
  [Sport.WomensBasketball]: 'womens-basketball',
  [Sport.MensSoccer]: 'mens-soccer',
  [Sport.WomensSoccer]: 'womens-soccer',
} as const
