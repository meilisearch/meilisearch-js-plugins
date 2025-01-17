import { instantMeiliSearch } from '../src/index.js'
import {
  searchClient,
  dataset,
  Movies,
  meilisearchClient,
} from './assets/utils'

import { splitSortString } from '../src/contexts/sort-context.js'

describe('Sort browser test', () => {
  beforeAll(async () => {
    const deleteTask = await meilisearchClient.deleteIndex('movies')
    await meilisearchClient.waitForTask(deleteTask.taskUid)
    await meilisearchClient.index('movies').updateSettings({
      sortableAttributes: ['release_date', 'title'],
    })

    const documentsTask = await meilisearchClient
      .index('movies')
      .addDocuments(dataset)
    await meilisearchClient.index('movies').waitForTask(documentsTask.taskUid)
  })

  test('sort-by one field', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies:release_date:desc',
        params: {
          query: '',
          hitsPerPage: 1,
        },
      },
    ])

    const hits = response.results[0].hits
    expect(hits.length).toBe(1)
  })

  test('sort-by mutiple fields', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies:release_date:desc,title:asc',
        params: {
          query: '',
          hitsPerPage: 1,
        },
      },
    ])

    const hits = response.results[0].hits
    expect(hits.length).toBe(1)
  })

  test('split multiple sorting rules', () => {
    const sortRules = splitSortString(
      '_geoPoint(37.8153, -122.4784):asc,title:asc,description:desc'
    )

    expect(sortRules).toEqual([
      '_geoPoint(37.8153, -122.4784):asc',
      'title:asc',
      'description:desc',
    ])
  })

  test('split multiple sorting rules in different order', () => {
    const sortRules = splitSortString(
      'title:asc,_geoPoint(37.8153, -122.4784):asc,description:desc'
    )

    expect(sortRules).toEqual([
      'title:asc',
      '_geoPoint(37.8153, -122.4784):asc',
      'description:desc',
    ])
  })

  test('split one sorting rule', () => {
    const sortRules = splitSortString('_geoPoint(37.8153, -122.4784):asc')

    expect(sortRules).toEqual(['_geoPoint(37.8153, -122.4784):asc'])
  })

  test.only('split no sorting rule', () => {
    const sortRules = splitSortString('')

    expect(sortRules).toEqual([])
  })
})
