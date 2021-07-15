import { searchClient, dataset } from './assets/utils'

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
    const response = await searchClient.search([
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
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: '',
          attributesToHighlight: ['title'],
        },
      },
    ])

    const resKeys = Object.keys(response.results[0]?.hits[0]?._highlightResult)
    expect(resKeys).toEqual(expect.arrayContaining(Object.keys(dataset[0])))
  })

  test('Test no attributesToHighlight on placeholder', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: '',
          attributesToHighlight: [],
        },
      },
    ])
    const resKeys = response.results[0]?.hits[0]?._highlightResult
    expect(resKeys).toEqual(undefined)
  })

  test('Test one attributesToHighlight on specific query', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: 'Ar',
          attributesToHighlight: ['title'],
        },
      },
    ])

    const highlightedResults = response.results[0].hits[0]._highlightResult
    const resKeys = Object.keys(highlightedResults)
    expect(resKeys).toEqual(expect.arrayContaining(Object.keys(dataset[0])))
    expect(highlightedResults.title?.value).toEqual(
      '__ais-highlight__Ar__/ais-highlight__iel'
    )
  })

  test('Test two attributesToHighlight on specific query', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: 'S',
          attributesToHighlight: ['title', 'overview'],
        },
      },
    ])

    const highlightedResults = response.results[0].hits[0]._highlightResult
    const resKeys = Object.keys(highlightedResults)
    expect(resKeys).toEqual(expect.arrayContaining(Object.keys(dataset[0])))
    expect(highlightedResults.title?.value).toEqual(
      '__ais-highlight__S__/ais-highlight__tar Wars'
    )
    expect(highlightedResults.overview?.value).toEqual(
      expect.stringMatching('__ais-highlight__S__/ais-highlight__kywalker')
    )
  })

  test('Test two attributesToHighlight on specific query with empty string value', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: 'Magnetic',
          attributesToHighlight: ['title', 'overview'],
        },
      },
    ])

    const highlightedResults = response.results[0].hits[0]._highlightResult
    const resKeys = Object.keys(highlightedResults)
    expect(resKeys).toEqual(expect.arrayContaining(Object.keys(dataset[0])))
    expect(highlightedResults.title?.value).toEqual(
      '__ais-highlight__Magnetic__/ais-highlight__ Rose'
    )
    expect(highlightedResults.overview?.value).toEqual(
      expect.not.stringMatching('__ais-highlight__Magnetic__/ais-highlight__')
    )
  })

  test('Test two attributesToHighlight on specific query with null value', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: 'Magnetic',
          attributesToHighlight: ['title', 'overview'],
        },
      },
    ])
    const highlightedResults = response.results[0].hits[0]._highlightResult
    const resKeys = Object.keys(highlightedResults)
    expect(resKeys).toEqual(expect.arrayContaining(Object.keys(dataset[0])))
    expect(highlightedResults.title?.value).toEqual(
      '__ais-highlight__Magnetic__/ais-highlight__ Rose'
    )
    expect(highlightedResults.overview?.value).toEqual(
      expect.not.stringMatching('__ais-highlight__Magnetic__/ais-highlight__')
    )
  })

  test('Test two attributesToHighlight on specific query with null value', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: 'Magnetic',
          attributesToHighlight: ['title', 'overview'],
        },
      },
    ])
    const highlightedResults = response.results[0].hits[0]._highlightResult
    const resKeys = Object.keys(highlightedResults)
    expect(resKeys).toEqual(expect.arrayContaining(Object.keys(dataset[0])))
    expect(highlightedResults.title?.value).toEqual(
      '__ais-highlight__Magnetic__/ais-highlight__ Rose'
    )
    expect(highlightedResults.overview?.value).toEqual(
      expect.not.stringMatching('__ais-highlight__Magnetic__/ais-highlight__')
    )
  })

  test('Test two attributesToHighlight on wild card', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: 'S',
          attributesToHighlight: ['title', 'overview'],
        },
      },
    ])

    const highlightedResults = response.results[0].hits[0]._highlightResult
    const resKeys = Object.keys(highlightedResults)
    expect(resKeys).toEqual(expect.arrayContaining(Object.keys(dataset[0])))
    expect(highlightedResults.title?.value).toEqual(
      '__ais-highlight__S__/ais-highlight__tar Wars'
    )
    expect(highlightedResults.overview?.value).toEqual(
      expect.stringMatching('__ais-highlight__S__/ais-highlight__kywalker')
    )
  })

  test('Test two attributesToHighlight with different tags', async () => {
    const response = await searchClient.search([
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
    const resKeys = Object.keys(highlightedResults)
    expect(resKeys).toEqual(expect.arrayContaining(Object.keys(dataset[0])))
    expect(highlightedResults.title?.value).toEqual('<p>S</p>tar Wars')
    expect(highlightedResults.overview?.value).toEqual(
      expect.stringMatching('<p>S</p>olo')
    )
  })
})
