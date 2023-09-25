import { describe, expect, test } from 'bun:test'
import { DateTime, Info } from 'luxon'

import { parseDateForYear } from './date'

describe('parseDateForYear', () => {
  // @ts-expect-error bun's test.each types are incorrect
  test.each(Info.months('short').slice(0, 8))(
    'parses date with month %s in next year for winter sports than span 2 years',
    (month: string) => {
      expect(parseDateForYear(`${month} 15`, 2023)).toEqual(
        DateTime.fromFormat(`2024-${month}-15`, 'yyyy-MMM-d').startOf('day')
      )
    }
  )

  // @ts-expect-error bun's test.each types are incorrect
  test.each(Info.months('short').slice(8))(
    'parses date with month %s in current year',
    (month: string) => {
      expect(parseDateForYear(`${month} 15`, 2023)).toEqual(
        DateTime.fromFormat(`2023-${month}-15`, 'yyyy-MMM-d').startOf('day')
      )
    }
  )

  test('parses date with single digit day in current year', () => {
    expect(parseDateForYear('Sep 9', 2023)).toEqual(
      DateTime.fromISO('2023-09-09')
    )
  })
})
