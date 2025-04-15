import { describe, beforeAll, test, expect } from 'vitest'
import {
  searchClient,
  dataset,
  type Movies,
  meilisearchClient,
} from './assets/utils.js'

import { splitSortString } from '../src/contexts/sort-context.js'

describe('Sort browser test', () => {
  beforeAll(async () => {
    await meilisearchClient.deleteIndex('movies').waitTask()
    await meilisearchClient
      .index('movies')
      .updateSettings({
        sortableAttributes: ['release_date', 'title'],
      })
      .waitTask()

    await meilisearchClient.index('movies').addDocuments(dataset).waitTask()
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

  test('split no sorting rule', () => {
    const sortRules = splitSortString('')

    expect(sortRules).toEqual([])
  })
})
