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
  estimatedTotalHits: 0,
  exhaustiveNbHits: false,
}

// Mocking of Meilisearch package
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
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Test the same search parameters twice', async () => {
    const searchParameters = {
      indexName: 'movies',
      params: {
        query: '',
      },
    }
    const searchClient = instantMeiliSearch('http://localhost:7700')
    await searchClient.search<Movies>([searchParameters])
    await searchClient.search<Movies>([searchParameters])

    expect(mockedMeilisearch).toHaveBeenCalledWith({
      host: 'http://localhost:7700',
      apiKey: '',
    })
    expect(mockedSearch).toHaveBeenCalledTimes(1)
  })

  test('Test two different search parameters', async () => {
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
    const searchClient = instantMeiliSearch('http://localhost:7700')
    await searchClient.search<Movies>([searchParameters1])
    await searchClient.search<Movies>([searchParameters2])

    expect(mockedMeilisearch).toHaveBeenCalledWith({
      host: 'http://localhost:7700',
      apiKey: '',
    })
    expect(mockedSearch).toHaveBeenCalledTimes(2)
  })

  test('Test two identical and one different search parameters', async () => {
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
    const searchClient = instantMeiliSearch('http://localhost:7700')
    await searchClient.search<Movies>([searchParameters1])
    await searchClient.search<Movies>([searchParameters2])
    await searchClient.search<Movies>([searchParameters1])

    expect(mockedMeilisearch).toHaveBeenCalledWith({
      host: 'http://localhost:7700',
      apiKey: '',
    })
    expect(mockedSearch).toHaveBeenCalledTimes(2)
  })

  test('Test two same and two different search parameter', async () => {
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
    const searchClient = instantMeiliSearch('http://localhost:7700')
    await searchClient.search<Movies>([searchParameters1])
    await searchClient.search<Movies>([searchParameters2])
    await searchClient.search<Movies>([searchParameters1])
    await searchClient.search<Movies>([searchParameters2])

    expect(mockedMeilisearch).toHaveBeenCalledWith({
      host: 'http://localhost:7700',
      apiKey: '',
    })
    expect(mockedSearch).toHaveBeenCalledTimes(2)
  })
})
