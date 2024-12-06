import { instantMeiliSearch } from '../src'
import { dataset, meilisearchClient, Movies } from './assets/utils'

describe('InstantMeiliSearch overridden parameters', () => {
  beforeAll(async () => {
    const deleteTask = await meilisearchClient.deleteIndex('movies')
    await meilisearchClient.waitForTask(deleteTask.taskUid)
    const documentsTask = await meilisearchClient
      .index('movies')
      .addDocuments(dataset)
    await meilisearchClient.index('movies').waitForTask(documentsTask.taskUid)
  })

  test('instantiating with, and changing overridden Meilisearch parameters', async () => {
    const { searchClient, setMeiliSearchParams } = instantMeiliSearch(
      'http://localhost:7700',
      'masterKey',
      {
        meiliSearchParams: {
          highlightPreTag: '<em>',
          highlightPostTag: '</em>',
          attributesToSearchOn: ['overview'],
        },
      }
    )

    const queryParams = [
      {
        indexName: 'movies',
        params: { query: '"While racing to a boxing match"' },
      },
    ]
    const firstResponse = await searchClient.search<Movies>(queryParams)

    const firstHits = firstResponse.results[0].hits
    expect(firstHits.length).toEqual(1)
    expect(firstHits[0]._highlightResult?.overview?.value).toContain(
      '<em>While racing to a boxing match</em>'
    )

    setMeiliSearchParams({
      highlightPreTag: '<om>',
      highlightPostTag: '</om>',
    })

    const secondResponse = await searchClient.search<Movies>(queryParams)

    const secondHits = secondResponse.results[0].hits
    expect(secondHits.length).toEqual(1)
    expect(secondHits[0]._highlightResult?.overview?.value).toContain(
      '<om>While racing to a boxing match</om>'
    )
  })
})
