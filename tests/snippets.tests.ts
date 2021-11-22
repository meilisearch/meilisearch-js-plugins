import { searchClient, dataset, Movies } from './assets/utils'

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
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: '',
          attributesToSnippet: ['overview:2'],
        },
      },
    ])
    const snippeted = response.results[0]?.hits[0]?._highlightResult
    expect(snippeted?.overview?.value).toEqual('Princess')
  })

  test('Test one attributesToSnippet on specific query', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'judg',
          attributesToSnippet: ['overview:2'],
          snippetEllipsisText: '...',
        },
      },
    ])
    const highlighted = response.results[0]?.hits[0]?._highlightResult
    const snippeted = response.results[0].hits[0]._snippetResult
    expect(highlighted?.overview?.value).toEqual('While')
    expect(snippeted?.overview?.value).toEqual('While...')
  })

  test('Test * attributesToSnippet on specific query', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'judg',
          attributesToSnippet: ['*:2'],
          snippetEllipsisText: '...',
        },
      },
    ])
    const highlighted = response.results[0]?.hits[0]?._highlightResult
    const snippeted = response.results[0].hits[0]._snippetResult
    expect(highlighted?.id?.value).toEqual('6')
    expect(highlighted?.title?.value).toEqual(
      '__ais-highlight__Judg__/ais-highlight__ment Night'
    )
    expect(highlighted?.overview?.value).toEqual('While')
    expect(highlighted?.genres).toBeTruthy()
    if (highlighted?.genres) {
      expect(highlighted?.genres[0].value).toEqual('Action')
      expect(highlighted?.genres[1].value).toEqual('Thriller')
      expect(highlighted?.genres[2].value).toEqual('Crime')
    }
    expect(highlighted?.release_date?.value).toEqual('750643200')
    expect(snippeted?.id?.value).toEqual('6')
    expect(snippeted?.title?.value).toEqual(
      '__ais-highlight__Judg__/ais-highlight__ment Night...'
    )
    expect(snippeted?.overview?.value).toEqual('While...')
    expect(snippeted?.genres).toBeTruthy()
    if (snippeted?.genres) {
      expect(snippeted?.genres[0].value).toEqual('Action...')
      expect(snippeted?.genres[1].value).toEqual('Thriller...')
      expect(snippeted?.genres[2].value).toEqual('Crime...')
    }
    expect(snippeted?.release_date?.value).toEqual('750643200')
  })

  test('Test two attributesToSnippet on specific query with one hit empty string', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 's',
          attributesToSnippet: ['overview:2', 'title:2'],
          highlightPreTag: '<p>',
          highlightPostTag: '</p>',
          snippetEllipsisText: '...',
        },
      },
    ])

    const firstHitHighlight = response.results[0]?.hits[0]?._highlightResult
    const firstHitSnippet = response.results[0].hits[0]._snippetResult

    expect(firstHitHighlight?.title?.value).toEqual('<p>S</p>tar Wars')
    expect(firstHitHighlight?.overview?.value).toEqual(
      'Luke <p>S</p>kywalker and'
    )
    expect(firstHitSnippet?.title?.value).toEqual('<p>S</p>tar Wars...')
    expect(firstHitSnippet?.overview?.value).toEqual(
      'Luke <p>S</p>kywalker and...'
    )

    const secondHitHighlight = response.results[0]?.hits[1]?._highlightResult
    const secondHitSnippet = response.results[0]?.hits[1]?._snippetResult
    expect(secondHitHighlight?.title?.value).toEqual('Four')
    expect(secondHitHighlight?.overview?.value).toEqual("It'<p>s</p> Ted")
    expect(secondHitSnippet?.title?.value).toEqual('Four...')
    expect(secondHitSnippet?.overview?.value).toEqual("It'<p>s</p> Ted...")
  })

  test('Test attributesToSnippet on a null attribute', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'Kill',
          attributesToSnippet: ['overview:2'],
        },
      },
    ])

    const firstHit = response.results[0]?.hits[0]?._highlightResult
    expect(firstHit?.overview?.value).toEqual('null')
  })

  test('Test one attributesToSnippet on placeholder w/ snippetEllipsisText', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: '',
          attributesToSnippet: ['overview:2'],
        },
      },
    ])
    const snippeted = response.results[0]?.hits[0]?._highlightResult
    expect(snippeted?.overview?.value).toEqual('Princess')
  })

  test('Test one attributesToSnippet on specific query w/ snippetEllipsisText', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'judg',
          attributesToSnippet: ['overview:2'],
        },
      },
    ])
    const snippeted = response.results[0]?.hits[0]?._highlightResult?.overview
    expect(snippeted?.value).toEqual('While')
  })

  test('Test two attributesToSnippet on specific query with one hit empty string w/ snippetEllipsisText', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 's',
          attributesToSnippet: ['overview:2', 'title:2'],
        },
      },
    ])
    const firstHit = response.results[0]?.hits[0]?._highlightResult

    expect(firstHit?.title?.value).toEqual(
      '__ais-highlight__S__/ais-highlight__tar Wars'
    )
    expect(firstHit?.overview?.value).toEqual(
      'Luke __ais-highlight__S__/ais-highlight__kywalker and'
    )
    const secondHit = response.results[0].hits[1]._highlightResult
    expect(secondHit?.title?.value).toEqual('Four')
    expect(secondHit?.overview?.value).toEqual(
      "It'__ais-highlight__s__/ais-highlight__ Ted"
    )
  })

  test('Test attributesToSnippet on a null attribute w/ snippetEllipsisText', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'Kill',
          attributesToSnippet: ['overview:2'],
        },
      },
    ])

    const firstHit = response.results[0]?.hits[0]?._highlightResult
    expect(firstHit?.overview?.value).toEqual('null')
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
    // expect(resKeys).toEqual(expect.arrayContaining(Object.keys(dataset[0])))
  })

  test('Test attributes to snippet on non-string-types', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'Jud',
          attributesToSnippet: ['*:2'],
        },
      },
    ])
    const hit = response.results[0].hits[0]._highlightResult

    if (hit?.overview) {
      expect(hit?.overview.value).toEqual('While')
    }

    if (hit?.genres) {
      expect(hit?.genres[0]?.value).toEqual('Action')
      expect(hit?.genres[1]?.value).toEqual('Thriller')
    }
    if (hit?.id) {
      expect(hit?.id.value).toEqual('6')
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
      expect(hit?.object?.value).toEqual('{"id":1,"name":"Nader"}')
    }

    if (hit?.nullField) {
      // @ts-ignore
      expect(hit?.nullField?.value).toEqual('null')
    }
  })
})
