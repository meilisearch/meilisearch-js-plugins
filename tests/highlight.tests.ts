import { searchClient, dataset, Movies } from './assets/utils'

describe('Highlight Browser test', () => {
  beforeAll(async () => {
    try {
      await searchClient.MeiliSearchClient.deleteIndex('movies')
    } catch (e) {
      // movies does not exist
    }
    const moviesUpdate = await searchClient.MeiliSearchClient.index(
      'movies'
    ).addDocuments(dataset)
    const settingsUpdate = await searchClient.MeiliSearchClient.index(
      'movies'
    ).updateFilterableAttributes(['genres']) // if settings update is put before document addition relevancy is impacted

    await searchClient.MeiliSearchClient.index('movies').waitForPendingUpdate(
      moviesUpdate.updateId
    )
    await searchClient.MeiliSearchClient.index('movies').waitForPendingUpdate(
      settingsUpdate.updateId
    )
  })

  test('Test one attributesToHighlight on wrong attribute placeholder', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: '',
          attributesToHighlight: ['name'],
        },
      },
    ])
    const resKeys = response.results[0]?.hits[0]?._highlightResult
    expect(resKeys).toEqual(undefined)
  })

  test('Test one attributesToHighlight on placeholder search', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: '',
          attributesToHighlight: ['title'],
        },
      },
    ])

    expect(response.results[0]?.hits[0]?._highlightResult).toHaveProperty('id')
    expect(response.results[0]?.hits[0]?._highlightResult).toHaveProperty(
      'title'
    )
    expect(response.results[0]?.hits[0]?._highlightResult).toHaveProperty(
      'overview'
    )
    expect(response.results[0]?.hits[0]?._highlightResult).toHaveProperty(
      'genres'
    )
    expect(response.results[0]?.hits[0]?._highlightResult).toHaveProperty(
      'poster'
    )
    expect(response.results[0]?.hits[0]?._highlightResult).toHaveProperty(
      'release_date'
    )
  })

  test('Test no attributesToHighlight on placeholder', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: '',
          attributesToHighlight: [],
        },
      },
    ])
    expect(response.results[0]?.hits[0]).not.toHaveProperty('_highlightResult')
  })

  test('Test no attributesToHighlight on placeholder', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          attributesToHighlight: ['genres'],
        },
      },
    ])

    const highlightedHit = response.results[0].hits[0]._highlightResult
    if (highlightedHit?.genres) {
      expect(highlightedHit?.genres[0]?.value).toEqual('Adventure')
      expect(highlightedHit?.genres[1]?.value).toEqual('Action')
    }
  })

  test('Test one attributesToHighlight on specific query', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'Ar',
          attributesToHighlight: ['title'],
        },
      },
    ])

    const highlightedResults = response.results[0].hits[0]._highlightResult
    expect(highlightedResults?.title?.value).toEqual(
      '__ais-highlight__Ar__/ais-highlight__iel'
    )
  })

  test('Test two attributesToHighlight on specific query', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'S',
          attributesToHighlight: ['title', 'overview'],
        },
      },
    ])

    const highlightedResults = response.results[0].hits[0]._highlightResult
    expect(highlightedResults?.title?.value).toEqual(
      '__ais-highlight__S__/ais-highlight__tar Wars'
    )
    expect(highlightedResults?.overview?.value).toEqual(
      expect.stringMatching('__ais-highlight__S__/ais-highlight__kywalker')
    )
  })

  test('Test two attributesToHighlight on specific query with empty string value', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'Magnetic',
          attributesToHighlight: ['title', 'overview'],
        },
      },
    ])

    const highlightedResults = response.results[0].hits[0]._highlightResult
    expect(highlightedResults?.title?.value).toEqual(
      '__ais-highlight__Magnetic__/ais-highlight__ Rose'
    )
    expect(highlightedResults?.overview?.value).toEqual(
      expect.not.stringMatching('__ais-highlight__Magnetic__/ais-highlight__')
    )
  })

  test('Test two attributesToHighlight on specific query with null value', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'Magnetic',
          attributesToHighlight: ['title', 'overview'],
        },
      },
    ])
    const highlightedResults = response.results[0].hits[0]._highlightResult
    expect(highlightedResults?.title?.value).toEqual(
      '__ais-highlight__Magnetic__/ais-highlight__ Rose'
    )
    expect(highlightedResults?.overview?.value).toEqual(
      expect.not.stringMatching('__ais-highlight__Magnetic__/ais-highlight__')
    )
  })

  test('Test two attributesToHighlight on specific query with null value', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'Magnetic',
          attributesToHighlight: ['title', 'overview'],
        },
      },
    ])
    const highlightedResults = response.results[0].hits[0]._highlightResult
    expect(highlightedResults?.title?.value).toEqual(
      '__ais-highlight__Magnetic__/ais-highlight__ Rose'
    )
    expect(highlightedResults?.overview?.value).toEqual(
      expect.not.stringMatching('__ais-highlight__Magnetic__/ais-highlight__')
    )
  })

  test('Test two attributesToHighlight on wild card', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'S',
          attributesToHighlight: ['title', 'overview'],
        },
      },
    ])

    const highlightedResults = response.results[0].hits[0]._highlightResult
    expect(highlightedResults?.title?.value).toEqual(
      '__ais-highlight__S__/ais-highlight__tar Wars'
    )
    expect(highlightedResults?.overview?.value).toEqual(
      expect.stringMatching('__ais-highlight__S__/ais-highlight__kywalker')
    )
  })

  test('Test two attributesToHighlight with different tags', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'S',
          attributesToHighlight: ['title', 'overview'],
          highlightPreTag: '<p>',
          highlightPostTag: '</p>',
        },
      },
    ])

    const highlightedResults = response.results[0].hits[0]._highlightResult
    expect(highlightedResults?.title?.value).toEqual('<p>S</p>tar Wars')
    expect(highlightedResults?.overview?.value).toEqual(
      expect.stringMatching('<p>S</p>olo')
    )
  })

  test('Test attributes to highlight on non-string-types', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'Ariel',
          attributesToHighlight: ['*'],
        },
      },
    ])
    const hit = response.results[0].hits[0]._highlightResult

    if (hit?.genres) {
      expect(hit?.genres[0]?.value).toEqual('Drama')
      expect(hit?.genres[1]?.value).toEqual('Crime')
    }
    if (hit?.id) {
      expect(hit?.id.value).toEqual('2')
    }
    if (hit?.undefinedArray) {
      // @ts-ignore
      expect(hit?.undefinedArray[0]?.value).toEqual('null')
      // @ts-ignore
      expect(hit?.undefinedArray[1]?.value).toEqual('null')
    }

    if (hit?.nullArray) {
      // @ts-ignore
      expect(hit?.nullArray[0]?.value).toEqual('null')
      // @ts-ignore
      expect(hit?.nullArray[1]?.value).toEqual('null')
    }

    if (hit?.objectArray) {
      // @ts-ignore
      expect(hit?.objectArray[0]?.value).toEqual('{"name":"charlotte"}')
      // @ts-ignore
      expect(hit?.objectArray[1]?.value).toEqual('{"name":"charlotte"}')
    }

    if (hit?.object) {
      // @ts-ignore
      expect(hit?.object?.value).toEqual('{"id":"1","name":"Nader"}')
    }

    if (hit?.nullField) {
      // @ts-ignore
      expect(hit?.nullField?.value).toEqual('null')
    }
  })
})
