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
})
