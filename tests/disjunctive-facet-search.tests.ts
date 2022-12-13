import { instantMeiliSearch } from '../src'
import { Movies, meilisearchClient } from './assets/utils'
import movies from './assets/movies.json'
import games from './assets/games.json'

// TODO: re-read for review

describe('Keep zero facets tests', () => {
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

  test('searching on one index with facet filtering', async () => {
    const customClient = instantMeiliSearch(
      'http://localhost:7700',
      'masterKey',
      {
        keepZeroFacets: false,
      }
    )

    const response = await customClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          facetFilters: [['genres:Fantasy', 'genres:Action'], ['color:green']],
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
          facetFilters: [['color:green']],
        },
      },
      {
        indexName: 'movies',
        params: {
          page: 0,
          hitsPerPage: 1,
          // @ts-ignore considered a read-only type in instantsearch
          facets: 'color',
          facetFilters: [['genres:Fantasy', 'genres:Action']],
        },
      },
    ])

    const moviesMainRes = response.results[0]
    const moviesColorRes = response.results[1]
    const moviesGenresRes = response.results[2]

    expect(moviesMainRes.hits.length).toBe(1)
    expect(moviesMainRes.facets).toEqual({
      color: {
        green: 1,
      },
      genres: {
        Action: 1,
        Adventure: 1,
      },
      platforms: {
        MacOS: 1,
      },
    })
    expect(moviesGenresRes.facets).toEqual({
      color: {
        green: 1,
        red: 1,
      },
    })
    expect(moviesColorRes.facets).toEqual({
      genres: {
        Adventure: 1,
        Action: 1,
      },
    })
  })

  test('searching on two indexes with facet filtering', async () => {
    const customClient = instantMeiliSearch(
      'http://localhost:7700',
      'masterKey',
      {
        keepZeroFacets: false,
      }
    )

    const response = await customClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          facetFilters: [['genres:Action'], ['color:green']],
          facets: ['genres', 'color', 'platforms'],
        },
      },
      {
        indexName: 'movies',
        params: {
          page: 0,
          hitsPerPage: 1,
          // @ts-ignore considered a read-only type in instantsearch
          facets: 'color',
          facetFilters: [['genres:Action']],
        },
      },
      {
        indexName: 'movies',
        params: {
          page: 0,
          hitsPerPage: 1,
          // @ts-ignore considered a read-only type in instantsearch
          facets: 'genres',
          facetFilters: [['color:green']],
        },
      },
      {
        indexName: 'games',
        params: {
          facets: ['genres', 'color', 'platforms'],
          facetFilters: [
            ['genres:Fantasy'],
            ['color:red'],
            ['platforms:Linux'],
          ],
        },
      },
      {
        indexName: 'games',
        params: {
          page: 0,
          hitsPerPage: 1,
          // @ts-ignore considered a read-only type in instantsearch
          facets: 'genres',
          facetFilters: [['color:red'], ['platforms:Linux']],
        },
      },
      {
        indexName: 'games',
        params: {
          page: 0,
          hitsPerPage: 1,
          // @ts-ignore considered a read-only type in instantsearch
          facets: 'color',
          facetFilters: [['genres:Fantasy'], ['platforms:Linux']],
        },
      },
      {
        indexName: 'games',
        params: {
          page: 0,
          hitsPerPage: 1,
          // @ts-ignore considered a read-only type in instantsearch
          facets: 'platforms',
          facetFilters: [['genres:Fantasy'], ['color:red']],
        },
      },
    ])

    const moviesMainRes = response.results[0]
    const moviesGenresRes = response.results[1]
    const moviesColorRes = response.results[2]

    expect(moviesMainRes.facets).toEqual({
      genres: {
        Action: 1,
        Adventure: 1,
      },
      color: {
        green: 1,
      },
      platforms: {
        MacOS: 1,
      },
    })
    expect(moviesGenresRes.facets).toEqual({
      color: {
        green: 1,
        red: 1,
      },
    })
    expect(moviesColorRes.facets).toEqual({
      genres: {
        Adventure: 1,
        Action: 1,
      },
    })

    const gamesMainRes = response.results[3]
    const gamesGenresRes = response.results[4]
    const gamesColorRes = response.results[5]
    const gamesPlatformRes = response.results[6]

    expect(gamesMainRes.facets).toEqual({
      genres: {
        Fantasy: 1,
        Drama: 1,
      },
      color: {
        red: 1,
      },
      platforms: {
        MacOS: 1,
        Windows: 1,
        Linux: 1,
      },
    })
    expect(gamesGenresRes.facets).toEqual({
      genres: {
        Adventure: 1,
        Drama: 3,
        Fantasy: 1,
        Romance: 1,
        'Science Fiction': 2,
      },
    })
    expect(gamesColorRes.facets).toEqual({
      color: {
        green: 1,
        red: 1,
        yellow: 1,
      },
    })
    expect(gamesPlatformRes.facets).toEqual({
      platforms: {
        Linux: 1,
        MacOS: 1,
        Windows: 1,
      },
    })
  })

  test('searching on two indexes with facet filtering and keep zero facets', async () => {
    const customClient = instantMeiliSearch(
      'http://localhost:7700',
      'masterKey',
      {
        keepZeroFacets: true,
      }
    )

    const response = await customClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          facetFilters: [['genres:Action'], ['color:green']],
          facets: ['genres', 'color', 'platforms'],
        },
      },
      {
        indexName: 'movies',
        params: {
          page: 0,
          hitsPerPage: 1,
          // @ts-ignore considered a read-only type in instantsearch
          facets: 'color',
          facetFilters: [['genres:Action']],
        },
      },
      {
        indexName: 'movies',
        params: {
          page: 0,
          hitsPerPage: 1,
          // @ts-ignore considered a read-only type in instantsearch
          facets: 'genres',
          facetFilters: [['color:green']],
        },
      },
      {
        indexName: 'games',
        params: {
          facets: ['genres', 'color', 'platforms'],
          facetFilters: [
            ['genres:Fantasy'],
            ['color:red'],
            ['platforms:Linux'],
          ],
        },
      },
      {
        indexName: 'games',
        params: {
          page: 0,
          hitsPerPage: 1,
          // @ts-ignore considered a read-only type in instantsearch
          facets: 'genres',
          facetFilters: [['color:red'], ['platforms:Linux']],
        },
      },
      {
        indexName: 'games',
        params: {
          page: 0,
          hitsPerPage: 1,
          // @ts-ignore considered a read-only type in instantsearch
          facets: 'color',
          facetFilters: [['genres:Fantasy'], ['platforms:Linux']],
        },
      },
      {
        indexName: 'games',
        params: {
          page: 0,
          hitsPerPage: 1,
          // @ts-ignore considered a read-only type in instantsearch
          facets: 'platforms',
          facetFilters: [['genres:Fantasy'], ['color:red']],
        },
      },
    ])

    const moviesMainRes = response.results[0]
    const moviesGenresRes = response.results[1]
    const moviesColorRes = response.results[2]

    expect(moviesMainRes.facets).toEqual({
      genres: {
        Action: 1,
        Adventure: 1,
        Drama: 0,
        Fantasy: 0,
        Romance: 0,
        'Science Fiction': 0,
      },
      color: {
        green: 1,
        blue: 0,
        red: 0,
      },
      platforms: {
        Linux: 0,
        Windows: 0,
        MacOS: 1,
      },
    })
    expect(moviesGenresRes.facets).toEqual({
      color: {
        green: 1,
        red: 1,
        blue: 0,
      },
    })
    expect(moviesColorRes.facets).toEqual({
      genres: {
        Adventure: 1,
        Action: 1,
        Drama: 0,
        Fantasy: 0,
        Romance: 0,
        'Science Fiction': 0,
      },
    })

    const gamesMainRes = response.results[3]
    const gamesGenresRes = response.results[4]
    const gamesColorRes = response.results[5]
    const gamesPlatformRes = response.results[6]

    expect(gamesMainRes.facets).toEqual({
      genres: {
        Fantasy: 1,
        Drama: 1,
        Adventure: 0,
        Action: 0,
        Romance: 0,
        'Science Fiction': 0,
      },
      color: {
        red: 1,
        blue: 0,
        green: 0,
        yellow: 0,
      },
      platforms: {
        MacOS: 1,
        Windows: 1,
        Linux: 1,
      },
    })
    expect(gamesGenresRes.facets).toEqual({
      genres: {
        Action: 0,
        Adventure: 1,
        Drama: 3,
        Fantasy: 1,
        Romance: 1,
        'Science Fiction': 2,
      },
    })
    expect(gamesColorRes.facets).toEqual({
      color: {
        green: 1,
        red: 1,
        yellow: 1,
        blue: 0,
      },
    })
    expect(gamesPlatformRes.facets).toEqual({
      platforms: {
        Linux: 1,
        MacOS: 1,
        Windows: 1,
      },
    })
  })

  test('searching on an index with facet filtering with some and operators', async () => {
    const customClient = instantMeiliSearch(
      'http://localhost:7700',
      'masterKey',
      {
        keepZeroFacets: false,
      }
    )

    const response = await customClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          facetFilters: ['color:green', ['genres:Action']],
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
          facetFilters: ['color:green'],
        },
      },
    ])

    const moviesMainRes = response.results[0]
    const moviesGenresRes = response.results[1]

    expect(moviesMainRes.facets).toEqual({
      genres: {
        Action: 1,
        Adventure: 1,
      },
      color: {
        green: 1,
      },
      platforms: {
        MacOS: 1,
      },
    })
    expect(moviesGenresRes.facets).toEqual({
      genres: {
        Action: 1,
        Adventure: 1,
      },
    })
  })

  test('searching on an index with facet filtering with some and operators with keep zero facets', async () => {
    const customClient = instantMeiliSearch(
      'http://localhost:7700',
      'masterKey',
      {
        keepZeroFacets: true,
      }
    )

    const response = await customClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          facetFilters: ['color:green', ['genres:Action']],
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
          facetFilters: ['color:green'],
        },
      },
    ])

    const moviesMainRes = response.results[0]
    const moviesGenresRes = response.results[1]

    expect(moviesMainRes.facets).toEqual({
      genres: {
        Action: 1,
        Adventure: 1,
        Drama: 0,
        Fantasy: 0,
        Romance: 0,
        'Science Fiction': 0,
      },
      color: {
        green: 1,
        blue: 0,
        red: 0,
      },
      platforms: {
        Linux: 0,
        Windows: 0,
        MacOS: 1,
      },
    })
    expect(moviesGenresRes.facets).toEqual({
      genres: {
        Action: 1,
        Adventure: 1,
        Drama: 0,
        Fantasy: 0,
        Romance: 0,
        'Science Fiction': 0,
      },
    })
  })
})
