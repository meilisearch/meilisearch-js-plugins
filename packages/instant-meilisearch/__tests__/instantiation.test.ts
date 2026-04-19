import { describe, test, expect } from 'vitest'
import { instantMeilisearch } from '../src/index.js'

describe('InstantMeilisearch instantiation', () => {
  test('instantiation with required params returns InstantMeilisearchInstance', () => {
    const searchClient = instantMeilisearch(
      'http://localhost:7700',
      'masterKey'
    )

    expect(searchClient).toBeTruthy()
  })

  test('instantiation with function as apiKey returns InstantMeilisearchInstance', () => {
    const searchClient = instantMeilisearch('http://localhost:7700', () => {
      return 'masterKey'
    })

    expect(searchClient).toBeTruthy()
  })

  test('instantiation without hostUrl throws error', () => {
    expect(() => {
      // @ts-expect-error
      instantMeilisearch(undefined, 'masterKey')
    }).toThrow(TypeError)
  })

  test('instantiation without apiKey as function or string throws error', () => {
    expect(() => {
      // @ts-expect-error
      instantMeilisearch('http://localhost:7700', 123)
    }).toThrow(TypeError)
  })

  test('instantiation with function that does not return string as apiKey throws error', () => {
    expect(() => {
      // @ts-expect-error
      instantMeilisearch('http://localhost:7700', () => {
        return 123
      })
    }).toThrow(TypeError)
  })

  test('instantiation with custom request config with correct type', () => {
    const searchClient = instantMeilisearch('http://localhost:7700', '', {
      requestInit: {},
    })

    expect(searchClient).toBeTruthy()
  })

  test('instantiation with custom request config set to undefined', () => {
    const searchClient = instantMeilisearch('http://localhost:7700', '', {
      requestInit: undefined,
    })

    expect(searchClient).toBeTruthy()
  })

  test('instantiation with custom request config set to a string', () => {
    expect(() => {
      instantMeilisearch('http://localhost:7700', '', {
        // @ts-expect-error
        requestInit: '',
      })
    }).toThrow('Provided requestInit should be an object')
  })

  test('instantiation with custom HTTP client with correct type', () => {
    const searchClient = instantMeilisearch('http://localhost:7700', '', {
      httpClient: async () => {
        return new Promise((resolve) => {
          resolve({})
        })
      },
    })

    expect(searchClient).toBeTruthy()
  })

  test('instantiation with custom HTTP client set to undefined', () => {
    const searchClient = instantMeilisearch('http://localhost:7700', '', {
      httpClient: undefined,
    })

    expect(searchClient).toBeTruthy()
  })

  test('instantiation with custom HTTP client set to a string', () => {
    expect(() => {
      instantMeilisearch('http://localhost:7700', '', {
        // @ts-expect-error
        httpClient: 'wrong type',
      })
    }).toThrow('Provided custom httpClient should be a function')
  })
})
