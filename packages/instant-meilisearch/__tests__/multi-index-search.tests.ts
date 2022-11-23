import { instantMeiliSearch } from '../src'
import { Movies, meilisearchClient } from './assets/utils'
import movies from './assets/movies.json'
import games from './assets/games.json'

describe('Multi-index search test', () => {
  beforeAll(async () => {
    const moviesIndex = meilisearchClient.index('movies')
    const gamesIndex = meilisearchClient.index('games')

    await moviesIndex.delete()
    await gamesIndex.delete()

    await moviesIndex.updateSettings({
      filterableAttributes: ['genres', 'color', 'platforms'],
    })
    await gamesIndex.updateSettings({
      filterableAttributes: ['genres', 'color', 'platforms'],
    })

    await moviesIndex.addDocuments(movies)
    const response = await gamesIndex.addDocuments(games)

    await meilisearchClient.waitForTask(response.taskUid)
  })

  test('searching on two indexes', async () => {
    const customClient = instantMeiliSearch(
      'http://localhost:7700',
      'masterKey'
    )

    const response = await customClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'c',
        },
      },
      {
        indexName: 'games',
        params: {
          query: 'c',
        },
      },
    ])

    const movieHits = response.results[0].hits
    const gameHits = response.results[1].hits

    expect(movieHits.length).toBe(1)
    expect(gameHits.length).toBe(14)
  })

  test('searching on two indexes with scroll pagination', async () => {
    const customClient = instantMeiliSearch(
      'http://localhost:7700',
      'masterKey'
    )

    const response = await customClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          hitsPerPage: 1,
          page: 1,
        },
      },
      {
        indexName: 'games',
        params: {
          hitsPerPage: 1,
          page: 1,
        },
      },
    ])

    const movies = response.results[0]
    const games = response.results[1]

    expect(movies.hits.length).toBe(1)
    expect(movies.page).toBe(1)
    expect(movies.nbPages).toBe(3)

    expect(games.hits.length).toBe(1)
    expect(games.page).toBe(1)
    expect(games.nbPages).toBe(3)
  })

  test('searching on two indexes with page selection pagination', async () => {
    const customClient = instantMeiliSearch(
      'http://localhost:7700',
      'masterKey',
      {
        finitePagination: true,
      }
    )

    const response = await customClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          hitsPerPage: 1,
          page: 1,
        },
      },
      {
        indexName: 'games',
        params: {
          hitsPerPage: 1,
          page: 1,
        },
      },
    ])

    const movies = response.results[0]
    const games = response.results[1]

    expect(movies.hits.length).toBe(1)
    expect(movies.page).toBe(1)
    expect(movies.nbPages).toBe(6)

    expect(games.hits.length).toBe(1)
    expect(games.page).toBe(1)
    expect(games.nbPages).toBe(15)
  })

  test('searching on two indexes with facet filtering', async () => {
    const customClient = instantMeiliSearch(
      'http://localhost:7700',
      'masterKey'
    )

    const response = await customClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          facetFilters: [['genres:Adventure', 'genres:Action'], ['color:blue']],
          facets: ['genres', 'color', 'platforms'],
        },
      },
      {
        indexName: 'movies',
        params: {
          page: 0,
          hitsPerPage: 1,
          // @ts-ignore considered a read-only type in instantsearch
          facets: 'genres',
          facetFilters: [['color:blue']],
        },
      },
      {
        indexName: 'movies',
        params: {
          page: 0,
          hitsPerPage: 1,
          // @ts-ignore considered a read-only type in instantsearch
          facets: 'color',
          facetFilters: [['genres:Adventure', 'genres:Action']],
        },
      },
      {
        indexName: 'games',
        params: {
          facets: ['genres', 'color', 'platforms'],
        },
      },
    ])

    const moviesMainRes = response.results[0]
    const moviesColorRes = response.results[1]
    const moviesGenresRes = response.results[2]
    const games = response.results[3]

    expect(moviesMainRes.hits.length).toBe(1)

    expect(moviesMainRes.facets).toEqual({
      color: {
        blue: 1,
      },
      genres: {
        Adventure: 1,
        Drama: 1,
      },
      platforms: {
        Windows: 1,
      },
    })

    expect(moviesGenresRes.facets).toEqual({
      color: {
        blue: 1,
        green: 1,
        red: 2,
      },
    })
    expect(moviesColorRes.facets).toEqual({
      genres: {
        Adventure: 1,
        Drama: 2,
      },
    })
    expect(games.facets).toEqual({
      color: {
        blue: 5,
        green: 1,
        red: 5,
        yellow: 4,
      },
      genres: {
        Action: 5,
        Adventure: 7,
        Drama: 4,
        Fantasy: 3,
        Romance: 3,
        'Science Fiction': 5,
      },
      platforms: {
        Linux: 15,
        MacOS: 15,
        Windows: 15,
      },
    })
  })

  test('searching on two indexes with no placeholder search', async () => {
    const customClient = instantMeiliSearch(
      'http://localhost:7700',
      'masterKey',
      {
        placeholderSearch: false,
      }
    )

    const emptyResponse = await customClient.search<Movies>([
      {
        indexName: 'movies',
      },
      {
        indexName: 'games',
      },
    ])

    const emptyMovies = emptyResponse.results[0]
    const emptyGames = emptyResponse.results[1]

    expect(emptyMovies.hits.length).toBe(0)
    expect(emptyGames.hits.length).toBe(0)

    const response = await customClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'a',
        },
      },
      {
        indexName: 'games',
        params: {
          query: 'a',
        },
      },
    ])
    const movies = response.results[0]
    const games = response.results[1]

    expect(movies.hits.length).toBe(4)
    expect(games.hits.length).toBe(15)
  })
})
