import { searchClient, dataset, Movies } from './assets/utils'

describe('Instant MeiliSearch Browser test', () => {
  beforeAll(async () => {
    try {
      await searchClient.MeiliSearchClient.deleteIndex('movies')
    } catch (e) {
      // movies does not exist
    }
    const moviesUpdate = await searchClient.MeiliSearchClient.index(
      'movies'
    ).addDocuments(dataset)
    await searchClient.MeiliSearchClient.index('movies').waitForPendingUpdate(
      moviesUpdate.updateId
    )
  })

  test('Test attributesToRetrieve on no attributes', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          attributesToRetrieve: [],
          query: 'ariel',
        },
      },
    ])
    const notRetrieved = [
      'id',
      'overview',
      'genres',
      'poster',
      'release_date',
      'title',
    ]

    const hit = <Movies>response.results[0].hits[0]
    notRetrieved.map((attribute: string) =>
      expect(hit[<any>attribute]).not.toBeDefined()
    )
  })

  test('Test attributesToRetrieve on null', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          attributesToRetrieve: [],
          query: 'ariel',
        },
      },
    ])
    const notRetrieved = [
      'id',
      'overview',
      'genres',
      'poster',
      'release_date',
      'title',
    ]
    const hit = <Movies>response.results[0].hits[0]
    notRetrieved.map((attribute: string) =>
      expect(hit[attribute]).not.toBeDefined()
    )
  })

  test('Test attributesToRetrieve on one non existing attribute', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          attributesToRetrieve: ['test'],
          query: 'ariel',
        },
      },
    ])
    const notRetrieved = [
      'id',
      'overview',
      'genres',
      'poster',
      'release_date',
      'title',
    ]
    const hit = <Movies>response.results[0].hits[0]
    notRetrieved.map(
      (attribute: string) =>
        hit._highlightResult &&
        expect(hit._highlightResult[attribute]).toBeDefined()
    )
  })

  test('Test attributesToRetrieve on one existing attribute', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          attributesToRetrieve: ['title'],
          query: 'ariel',
        },
      },
    ])
    const notRetrieved = ['id', 'overview', 'genres', 'poster', 'release_date']
    const hit = <Movies>response.results[0].hits[0]
    expect(hit.title).toEqual('Ariel')
    notRetrieved.map((attribute: string) =>
      expect(hit[attribute]).not.toBeDefined()
    )
  })

  test('Test attributesToRetrieve on default value', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: 'ariel',
        },
      },
    ])
    const notRetrieved = ['id', 'overview', 'genres', 'poster', 'release_date']
    const hit = <Movies>response.results[0].hits[0]
    expect(hit.title).toEqual('Ariel')
    expect(hit._highlightResult).toBeDefined()
    notRetrieved.map((attribute: string) =>
      expect(hit[attribute]).toBeDefined()
    )
    notRetrieved.map(
      (attribute: string) =>
        hit._highlightResult &&
        expect(hit._highlightResult[attribute]).toBeDefined()
    )
  })

  test('Test attributesToRetrieve on wild card', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: 'ariel',
          attributesToRetrieve: ['*'],
        },
      },
    ])
    const retrieved = [
      'id',
      'overview',
      'genres',
      'poster',
      'release_date',
      'title',
    ]
    const hit = <Movies>response.results[0].hits[0]
    expect(hit.title).toEqual('Ariel')
    retrieved.map((attribute: string) => expect(hit[attribute]).toBeDefined())
    retrieved.map(
      (attribute: string) =>
        hit._highlightResult &&
        expect(hit._highlightResult[attribute]).toBeDefined()
    )
  })
})
