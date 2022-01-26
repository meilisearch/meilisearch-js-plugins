import { searchClient, dataset, Movies } from './assets/utils'

describe('Instant Meilisearch Browser test', () => {
  beforeAll(async () => {
    const deleteTask = await searchClient.MeiliSearchClient.deleteIndex(
      'movies'
    )
    await searchClient.MeiliSearchClient.waitForTask(deleteTask.uid)

    const documentsTask = await searchClient.MeiliSearchClient.index(
      'movies'
    ).addDocuments(dataset)
    await searchClient.MeiliSearchClient.index('movies').waitForTask(
      documentsTask.uid
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
    const hit = <Movies>response.results[0].hits[0]
    expect(hit.id).not.toBeDefined()
    expect(hit.overview).not.toBeDefined()
    expect(hit.genres).not.toBeDefined()
    expect(hit.release_date).not.toBeDefined()
    expect(hit.title).not.toBeDefined()
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

    const hit = <Movies>response.results[0].hits[0]
    expect(hit.id).not.toBeDefined()
    expect(hit.overview).not.toBeDefined()
    expect(hit.genres).not.toBeDefined()
    expect(hit.poster).not.toBeDefined()
    expect(hit.release_date).not.toBeDefined()
    expect(hit.title).not.toBeDefined()
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

    const hit = <Movies>response.results[0].hits[0]

    expect(hit._highlightResult?.id).toBeDefined()
    expect(hit._highlightResult?.overview).toBeDefined()
    expect(hit._highlightResult?.genres).toBeDefined()
    expect(hit._highlightResult?.poster).toBeDefined()
    expect(hit._highlightResult?.release_date).toBeDefined()
    expect(hit._highlightResult?.title).toBeDefined()
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
    const hit = <Movies>response.results[0].hits[0]
    expect(hit.title).toEqual('Ariel')
    expect(hit.id).not.toBeDefined()
    expect(hit.overview).not.toBeDefined()
    expect(hit.genres).not.toBeDefined()
    expect(hit.poster).not.toBeDefined()
    expect(hit.release_date).not.toBeDefined()
    expect(hit.title).toBeDefined()
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

    const hit = <Movies>response.results[0].hits[0]
    expect(hit.title).toEqual('Ariel')
    expect(hit._highlightResult).toBeDefined()

    expect(hit.id).toBeDefined()
    expect(hit.overview).toBeDefined()
    expect(hit.genres).toBeDefined()
    expect(hit.poster).toBeDefined()
    expect(hit.release_date).toBeDefined()
    expect(hit.title).toBeDefined()

    expect(hit._highlightResult?.id).toBeDefined()
    expect(hit._highlightResult?.overview).toBeDefined()
    expect(hit._highlightResult?.genres).toBeDefined()
    expect(hit._highlightResult?.poster).toBeDefined()
    expect(hit._highlightResult?.release_date).toBeDefined()
    expect(hit._highlightResult?.title).toBeDefined()
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

    const hit = <Movies>response.results[0].hits[0]
    expect(hit.title).toEqual('Ariel')
    expect(hit._highlightResult?.id).toBeDefined()
    expect(hit._highlightResult?.overview).toBeDefined()
    expect(hit._highlightResult?.genres).toBeDefined()
    expect(hit._highlightResult?.poster).toBeDefined()
    expect(hit._highlightResult?.release_date).toBeDefined()
    expect(hit._highlightResult?.title).toBeDefined()
  })
})
