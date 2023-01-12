import { SearchCache } from '../search-cache'
import { searchResponse } from './assets/utils'

describe('Entries in the cache', () => {
  test('to getEntry on empty cache', () => {
    const cache = SearchCache()
    const key = cache.getEntry('')

    expect(key).toBeUndefined()
  })

  test('to getEntry on invalid json', () => {
    const cache = SearchCache({ myKey: 'myValue' })
    const key = cache.getEntry('myKey')

    expect(key).toEqual('myValue')
  })

  test('to getEntry on valid json string', () => {
    const cache = SearchCache({ myKey: '"myValue"' })
    const key = cache.getEntry('myKey')

    expect(key).toEqual('myValue')
  })

  test('to getEntry on valid json object', () => {
    const cache = SearchCache({ myKey: '{ "id": 1 }' })
    const key = cache.getEntry('myKey')

    expect(key).toHaveProperty('id', 1)
  })

  test('to getEntry on invalid json object', () => {
    const cache = SearchCache({ myKey: '{ id: 1 }' })
    const key = cache.getEntry('myKey')

    expect(key).toEqual('{ id: 1 }')
  })
})

describe('Key formating in the cache', () => {
  test('to format an empty string', () => {
    const cache = SearchCache()
    const key = cache.formatKey([''])

    expect(key).toEqual('""')
  })

  test('to format a number', () => {
    const cache = SearchCache()
    const key = cache.formatKey([1])

    expect(key).toEqual('1')
  })

  test('to format multiple empty strings', () => {
    const cache = SearchCache()
    const key = cache.formatKey(['', '', ''])

    expect(key).toEqual('""""""')
  })
  test('to format empty string', () => {
    const cache = SearchCache()
    const key = cache.formatKey([])

    expect(key).toEqual('')
  })

  test('to format undefined', () => {
    const cache = SearchCache()
    const key = cache.formatKey([undefined])

    expect(key).toEqual('undefined')
  })
})

describe('Setting entries in the cache', () => {
  test('Set a response on a key', () => {
    const cache = SearchCache()
    const key = 'test'
    const formattedKey = cache.formatKey([key])
    cache.setEntry(formattedKey, searchResponse)
    const cached = cache.getEntry(formattedKey)

    expect(JSON.stringify(cached)).toEqual(JSON.stringify(searchResponse))
  })

  test('Set a response on an empty key', () => {
    const cache = SearchCache()
    const key = ''
    const formattedKey = cache.formatKey([key])
    cache.setEntry(formattedKey, searchResponse)
    const cached = cache.getEntry(formattedKey)

    expect(JSON.stringify(cached)).toEqual(JSON.stringify(searchResponse))
  })

  test('Set a response on an existing key', () => {
    const cache = SearchCache()
    const key = 'test'
    const formattedKey = cache.formatKey([key])
    cache.setEntry(formattedKey, searchResponse)
    cache.setEntry(formattedKey, searchResponse)
    const cached = cache.getEntry(formattedKey)

    expect(JSON.stringify(cached)).toEqual(JSON.stringify(searchResponse))
  })
})
