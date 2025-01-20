import { describe, test, expect } from 'vitest'
import { instantMeiliSearch } from '../src'

describe('InstantMeiliSearch instantiation', () => {
  test('instantiation with required params returns InstantMeiliSearchInstance', () => {
    const searchClient = instantMeiliSearch(
      'http://localhost:7700',
      'masterKey'
    )

    expect(searchClient).toBeTruthy()
  })

  test('instantiation with function as apiKey returns InstantMeiliSearchInstance', () => {
    const searchClient = instantMeiliSearch('http://localhost:7700', () => {
      return 'masterKey'
    })

    expect(searchClient).toBeTruthy()
  })

  test('instantiation without hostUrl throws error', () => {
    expect(() => {
      // @ts-expect-error
      instantMeiliSearch(undefined, 'masterKey')
    }).toThrow(TypeError)
  })

  test('instantiation without apiKey as function or string throws error', () => {
    expect(() => {
      // @ts-expect-error
      instantMeiliSearch('http://localhost:7700', 123)
    }).toThrow(TypeError)
  })

  test('instantiation with function that does not return string as apiKey throws error', () => {
    expect(() => {
      // @ts-expect-error
      instantMeiliSearch('http://localhost:7700', () => {
        return 123
      })
    }).toThrow(TypeError)
  })

  test('instantiation with custom request config with correct type', () => {
    const searchClient = instantMeiliSearch('http://localhost:7700', '', {
      requestConfig: {},
    })

    expect(searchClient).toBeTruthy()
  })

  test('instantiation with custom request config set to undefined', () => {
    const searchClient = instantMeiliSearch('http://localhost:7700', '', {
      requestConfig: undefined,
    })

    expect(searchClient).toBeTruthy()
  })

  test('instantiation with custom request config set to a string', () => {
    expect(() => {
      instantMeiliSearch('http://localhost:7700', '', {
        // @ts-expect-error
        requestConfig: '',
      })
    }).toThrow('Provided requestConfig should be an object')
  })

  test('instantiation with custom HTTP client with correct type', () => {
    const searchClient = instantMeiliSearch('http://localhost:7700', '', {
      httpClient: async () => {
        return new Promise((resolve) => {
          resolve({})
        })
      },
    })

    expect(searchClient).toBeTruthy()
  })

  test('instantiation with custom HTTP client set to undefined', () => {
    const searchClient = instantMeiliSearch('http://localhost:7700', '', {
      httpClient: undefined,
    })

    expect(searchClient).toBeTruthy()
  })

  test('instantiation with custom HTTP client set to a string', () => {
    expect(() => {
      instantMeiliSearch('http://localhost:7700', '', {
        // @ts-expect-error
        httpClient: 'wrong type',
      })
    }).toThrow('Provided custom httpClient should be a function')
  })
})
