import { serve } from 'inngest/remix'

import { inngest } from './client'
import scrapeAllSports from './scrape-all-sports'
import scrapeSport from './scrape-sport'

const handler = serve(inngest, [scrapeSport, scrapeAllSports])

export { handler as action, handler as loader }
