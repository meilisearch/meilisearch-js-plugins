import { describe, expect, test } from 'vitest'
import { adaptFilters } from './filter-adapter.js'

describe('facet filter exclusions', () => {
  test.each([
    ['owner.id:-7', '"owner.id"!="7"'],
    ['genre:-Comedy', '"genre"!="Comedy"'],
    ['temperature:--5', '"temperature"!="-5"'],
    ['temperature:\\-5', '"temperature"="-5"'],
    ['genre:Comedy', '"genre"="Comedy"'],
    ['title:-a:b', '"title"!="a:b"'],
    ['title:-a"b', '"title"!="a\\"b"'],
  ])('adapts %s', (input, expected) => {
    expect(adaptFilters(undefined, undefined, input)).toEqual([expected])
  })

  test('preserves AND and OR groups when mixing exclusions and values', () => {
    expect(
      adaptFilters(undefined, undefined, [
        'genre:-Comedy',
        ['owner.id:-7', 'owner.id:8'],
      ])
    ).toEqual(['"genre"!="Comedy"', ['"owner.id"!="7"', '"owner.id"="8"']])
  })
})
