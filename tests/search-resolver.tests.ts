import { Movies } from './assets/utils'
import { instantMeiliSearch } from '../src'
import { MeiliSearch } from 'meilisearch'
import { mocked } from 'ts-jest/utils'

jest.mock('meilisearch')

export const searchResponse = {
  hits: [],
  query: '',
  offset: 0,
  limit: 0,
  processingTimeMs: 0,
  nbHits: 0,
  exhaustiveNbHits: false,
}

// Mocking of MeiliSearch package
const mockedMeilisearch = mocked(MeiliSearch, true)
const mockedSearch = jest.fn(() => searchResponse)
const mockedIndex = jest.fn(() => {
  return {
    search: mockedSearch,
  }
})

mockedMeilisearch.mockReturnValue({
  // @ts-ignore
  index: mockedIndex,
})

describe('Pagination browser test', () => {
  test('Test 1 hitsPerPage', async () => {
    const searchClient = instantMeiliSearch('http://localhost:7700')
    await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: '',
          hitsPerPage: 1,
        },
      },
    ])

    await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: '',
          hitsPerPage: 1,
        },
      },
    ])

    await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: '122',
          hitsPerPage: 1,
        },
      },
    ])

    expect(mockedMeilisearch).toHaveBeenCalledWith({
      host: 'http://localhost:7700',
      apiKey: '',
    })
    expect(mockedSearch).toHaveBeenCalledTimes(1)
  })
})
