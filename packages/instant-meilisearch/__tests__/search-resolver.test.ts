import { Movies } from './assets/utils.js'
import { instantMeiliSearch } from '../src/index.js'
import { MeiliSearch, MultiSearchParams } from 'meilisearch'
import { MeiliSearchMultiSearchParams } from '../src/types/index.js'
import { jest } from '@jest/globals'

export const searchResponse = {
  hits: [],
  query: '',
  offset: 0,
  limit: 0,
  processingTimeMs: 0,
  estimatedTotalHits: 0,
  exhaustiveNbHits: false,
}

const mockedMultiSearch = jest
  .spyOn(MeiliSearch.prototype, 'multiSearch')
  .mockImplementation((request: MultiSearchParams) => {
    const response = request.queries.map(
      (req: MeiliSearchMultiSearchParams) => ({
        ...searchResponse,
        indexUid: req.indexUid,
      })
    )
    return Promise.resolve({
      results: response,
    })
  })

describe('Cached search tests', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('the same search parameters twice', async () => {
    const searchParameters = {
      indexName: 'movies',
      params: {
        query: '',
      },
    }
    const { searchClient } = instantMeiliSearch('http://localhost:7700')
    await searchClient.search<Movies>([searchParameters])
    await searchClient.search<Movies>([searchParameters])

    expect(mockedMultiSearch).toHaveBeenCalledTimes(2)
  })

  test('two different search parameters', async () => {
    const searchParameters1 = {
      indexName: 'movies',
      params: {
        query: '',
      },
    }

    const searchParameters2 = {
      indexName: 'movies',
      params: {
        query: 'other query',
      },
    }
    const { searchClient } = instantMeiliSearch('http://localhost:7700')
    await searchClient.search<Movies>([searchParameters1])
    await searchClient.search<Movies>([searchParameters2])

    expect(mockedMultiSearch).toHaveBeenCalledTimes(3)
  })

  test('two identical and one different search parameters', async () => {
    const searchParameters1 = {
      indexName: 'movies',
      params: {
        query: '',
      },
    }

    const searchParameters2 = {
      indexName: 'movies',
      params: {
        query: 'other query',
      },
    }
    const { searchClient } = instantMeiliSearch('http://localhost:7700')
    await searchClient.search<Movies>([searchParameters1])
    await searchClient.search<Movies>([searchParameters2])
    await searchClient.search<Movies>([searchParameters1])

    expect(mockedMultiSearch).toHaveBeenCalledTimes(3)
  })

  test('two same and two different search parameter', async () => {
    const searchParameters1 = {
      indexName: 'movies',
      params: {
        query: '',
      },
    }

    const searchParameters2 = {
      indexName: 'movies',
      params: {
        query: 'other query',
      },
    }
    const { searchClient } = instantMeiliSearch('http://localhost:7700')
    await searchClient.search<Movies>([searchParameters1])
    await searchClient.search<Movies>([searchParameters2])
    await searchClient.search<Movies>([searchParameters1])
    await searchClient.search<Movies>([searchParameters2])

    expect(mockedMultiSearch).toHaveBeenCalledTimes(3)
  })

  test('Multiple search parameters on different index uids', async () => {
    const searchParameters1 = [
      {
        indexName: 'movies',
        params: {
          query: '',
        },
      },
      {
        indexName: 'game',
        params: {
          query: '',
        },
      },
    ]

    const searchParameters2 = {
      indexName: 'movies',
      params: {
        query: 'other query',
      },
    }
    const { searchClient } = instantMeiliSearch('http://localhost:7700')
    await searchClient.search<Movies>(searchParameters1)
    await searchClient.search<Movies>([searchParameters2])
    await searchClient.search<Movies>(searchParameters1)
    await searchClient.search<Movies>([searchParameters2])

    expect(mockedMultiSearch).toHaveBeenCalledTimes(3)
  })
})
