import { searchClient, dataset } from './assets/utils'

describe('Snippet Browser test', () => {
  beforeAll(async () => {
    try {
      await searchClient.MeiliSearchClient.deleteIndex('movies')
    } catch (e) {
      // movies does not exist
    }
    await searchClient.MeiliSearchClient.index(
      'movies'
    ).updateFilterableAttributes(['genres'])
    const moviesUpdate = await searchClient.MeiliSearchClient.index(
      'movies'
    ).addDocuments(dataset)
    await searchClient.MeiliSearchClient.index('movies').waitForPendingUpdate(
      moviesUpdate.updateId
    )
  })

  test('Test one attributesToSnippet on placeholder', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: '',
          attributesToSnippet: ['overview:2'],
        },
      },
    ])
    const snippeted = response.results[0].hits[0]._highlightResult
    expect(snippeted.overview.value).toEqual('Princess')
    const resKeys = Object.keys(snippeted)
    expect(resKeys).toEqual(expect.arrayContaining(Object.keys(dataset[0])))
  })

  test('Test one attributesToSnippet on specific query', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: 'judg',
          attributesToSnippet: ['overview:2'],
          snippetEllipsisText: '...',
        },
      },
    ])
    const highlighted = response.results[0].hits[0]._highlightResult
    const snippeted = response.results[0].hits[0]._snippetResult
    expect(highlighted.overview.value).toEqual('While')
    expect(snippeted.overview.value).toEqual('While...')
    const resKeys = Object.keys(response.results[0].hits[0]._highlightResult)

    expect(resKeys).toEqual(expect.arrayContaining(Object.keys(dataset[0])))
  })

  test('Test two attributesToSnippet on specific query with one hit empty string', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: 'r',
          attributesToSnippet: ['overview:2', 'title:2'],
          highlightPreTag: '<p>',
          highlightPostTag: '</p>',
          snippetEllipsisText: '...',
        },
      },
    ])
    const firstHitHighlight = response.results[0].hits[0]._highlightResult
    const firstHitSnippet = response.results[0].hits[0]._snippetResult

    expect(firstHitHighlight.title.value).toEqual('<p>R</p>ooms')
    expect(firstHitHighlight.overview.value).toEqual('s <p>r</p>oom')
    expect(firstHitSnippet.title.value).toEqual('<p>R</p>ooms...')
    expect(firstHitSnippet.overview.value).toEqual('...s <p>r</p>oom...')

    const secondHitHighlight = response.results[0].hits[1]._highlightResult
    const secondHitSnippet = response.results[0].hits[1]._snippetResult
    expect(secondHitHighlight.title.value).toEqual('<p>R</p>ose')
    expect(secondHitHighlight.overview.value).toEqual('')
    expect(secondHitSnippet.title.value).toEqual('<p>R</p>ose...')
    expect(secondHitSnippet.overview.value).toEqual('')

    const resKeys = Object.keys(response.results[0].hits[0]._highlightResult)
    expect(resKeys).toEqual(expect.arrayContaining(Object.keys(dataset[0])))
  })

  test('Test attributesToSnippet on a null attribute', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: 'Kill',
          attributesToSnippet: ['overview:2'],
        },
      },
    ])

    const firstHit = response.results[0].hits[0]._highlightResult
    expect(firstHit.overview.value).toEqual('null')

    const resKeys = Object.keys(response.results[0].hits[0]._highlightResult)
    expect(resKeys).toEqual(expect.arrayContaining(Object.keys(dataset[0])))
  })

  test('Test one attributesToSnippet on placeholder w/ snippetEllipsisText', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: '',
          attributesToSnippet: ['overview:2'],
        },
      },
    ])
    const snippeted = response.results[0].hits[0]._highlightResult
    expect(snippeted.overview.value).toEqual('Princess')
    const resKeys = Object.keys(snippeted)
    expect(resKeys).toEqual(expect.arrayContaining(Object.keys(dataset[0])))
  })

  test('Test one attributesToSnippet on specific query w/ snippetEllipsisText', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: 'judg',
          attributesToSnippet: ['overview:2'],
        },
      },
    ])
    const snippeted = response.results[0].hits[0]._highlightResult?.overview
    expect(snippeted.value).toEqual('While')
    const resKeys = Object.keys(response.results[0].hits[0]._highlightResult)
    expect(resKeys).toEqual(expect.arrayContaining(Object.keys(dataset[0])))
  })

  test('Test two attributesToSnippet on specific query with one hit empty string w/ snippetEllipsisText', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: 'r',
          attributesToSnippet: ['overview:2', 'title:2'],
        },
      },
    ])
    const firstHit = response.results[0].hits[0]._highlightResult

    expect(firstHit.title.value).toEqual(
      '__ais-highlight__R__/ais-highlight__ooms'
    )
    expect(firstHit.overview.value).toEqual(
      's __ais-highlight__r__/ais-highlight__oom'
    )
    const secondHit = response.results[0].hits[1]._highlightResult
    expect(secondHit.title.value).toEqual(
      '__ais-highlight__R__/ais-highlight__ose'
    )
    expect(secondHit.overview.value).toEqual('')

    const resKeys = Object.keys(response.results[0].hits[0]._highlightResult)
    expect(resKeys).toEqual(expect.arrayContaining(Object.keys(dataset[0])))
  })

  test('Test attributesToSnippet on a null attribute w/ snippetEllipsisText', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: 'Kill',
          attributesToSnippet: ['overview:2'],
        },
      },
    ])

    const firstHit = response.results[0].hits[0]._highlightResult
    expect(firstHit.overview.value).toEqual('null')
    const resKeys = Object.keys(response.results[0].hits[0]._highlightResult)
    expect(resKeys).toEqual(expect.arrayContaining(Object.keys(dataset[0])))
  })
})
