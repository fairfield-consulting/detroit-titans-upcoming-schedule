import { z } from 'zod'

export const SportNameSchema = z.enum([
  'mens-soccer',
  'womens-soccer',
  'mens-basketball',
  'womens-basketball',
])

export type SportName = z.infer<typeof SportNameSchema>
