import {
  searchClient,
  dataset,
  Movies,
  meilisearchClient,
} from './assets/utils'

describe('Highlight Browser test', () => {
  beforeAll(async () => {
    const deleteTask = await meilisearchClient.deleteIndex('movies')
    await meilisearchClient.waitForTask(deleteTask.taskUid)
    await meilisearchClient
      .index('movies')
      .updateFilterableAttributes(['genres'])
    const documentsTask = await meilisearchClient
      .index('movies')
      .addDocuments(dataset)
    await meilisearchClient.index('movies').waitForTask(documentsTask.taskUid)
  })

  test('one attributesToHighlight on wrong attribute placeholder', async () => {
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

  test('one attributesToHighlight on placeholder search', async () => {
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

  test('no attributesToHighlight on placeholder', async () => {
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

  test('no attributesToHighlight on placeholder', async () => {
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
      expect(highlightedHit?.genres[0]?.value).toEqual('Drama')
      expect(highlightedHit?.genres[1]?.value).toEqual('Crime')
    }
  })

  test('one attributesToHighlight on specific query', async () => {
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

  test('two attributesToHighlight on specific query', async () => {
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

  test('two attributesToHighlight on specific query with empty string value', async () => {
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

  test('two attributesToHighlight on specific query with null value', async () => {
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

  test('two attributesToHighlight on specific query with null value', async () => {
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

  test('two attributesToHighlight on wild card', async () => {
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

  test('two attributesToHighlight with different tags', async () => {
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

  test('attributes to highlight on non-string-types', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'hello',
          attributesToHighlight: ['*'],
        },
      },
    ])

    const hit = response.results[0].hits[0]._highlightResult

    if (hit?.title) {
      expect(hit?.title?.value).toEqual('Ariel')
    }

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
      expect(hit?.objectArray[0]?.name.value).toEqual(
        '__ais-highlight__hello__/ais-highlight__ world'
      )
    }

    if (hit?.object) {
      expect(hit?.object?.id?.value).toEqual('1')

      expect(hit?.object?.name?.value).toEqual('One two')
    }

    if (hit?.nullField) {
      // @ts-ignore
      expect(hit?.nullField?.value).toEqual('null')
    }
  })
})
