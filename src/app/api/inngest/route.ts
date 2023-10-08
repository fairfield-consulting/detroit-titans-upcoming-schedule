import { serve } from 'inngest/next'

import { inngest } from './client'
import scrapeAllSports from './scrape-all-sports'
import scrapeSport from './scrape-sport'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [scrapeAllSports, scrapeSport],
})
