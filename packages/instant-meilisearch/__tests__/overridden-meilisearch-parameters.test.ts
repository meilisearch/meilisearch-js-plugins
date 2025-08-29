import { describe, beforeAll, test, expect } from 'vitest'
import { instantMeiliSearch } from '../src/index.js'
import { dataset, meilisearchClient, type Movies } from './assets/utils.js'

describe('InstantMeiliSearch overridden parameters', () => {
  beforeAll(async () => {
    await meilisearchClient.deleteIndex('movies').waitTask()
    await meilisearchClient.index('movies').addDocuments(dataset).waitTask()
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

    setMeiliSearchParams({
      indexesOverrides: {
        movies: { highlightPreTag: '<span>', highlightPostTag: '</span>' },
      },
    })
    const thirdResponse = await searchClient.search<Movies>(queryParams)

    const thirdHits = thirdResponse.results[0].hits
    expect(thirdHits.length).toEqual(1)
    expect(thirdHits[0]._highlightResult?.overview?.value).toContain(
      '<span>While racing to a boxing match</span>'
    )
  })

  test('sort parameter precedence: per-index overrides global overrides', async () => {
    await meilisearchClient
      .index('movies')
      .updateSettings({
        sortableAttributes: ['release_date', 'title'],
      })
      .waitTask()

    const { searchClient, setMeiliSearchParams } = instantMeiliSearch(
      'http://localhost:7700',
      'masterKey',
      {
        meiliSearchParams: {
          sort: ['title:asc'],
        },
      }
    )

    const queryParams = [
      {
        indexName: 'movies',
        params: { query: '', hitsPerPage: 3 },
      },
    ]

    // Test global sort override - should sort by title ascending
    const globalResponse = await searchClient.search<Movies>(queryParams)
    const globalHits = globalResponse.results[0].hits
    expect(globalHits.length).toBeGreaterThan(1)
    // Verify titles are sorted in ascending order
    const globalTitles = globalHits
      .map((hit: Movies) => hit.title)
      .filter(Boolean)
    expect(globalTitles).toEqual([...globalTitles].sort())

    // Test per-index sort override takes precedence over global
    setMeiliSearchParams({
      sort: ['title:asc'],
      indexesOverrides: {
        movies: { sort: ['title:desc'] },
      },
    })

    const perIndexResponse = await searchClient.search<Movies>(queryParams)
    const perIndexHits = perIndexResponse.results[0].hits
    expect(perIndexHits.length).toBeGreaterThan(1)
    // Verify titles are sorted in descending order
    const perIndexTitles = perIndexHits
      .map((hit: Movies) => hit.title)
      .filter(Boolean)
    expect(perIndexTitles).toEqual([...perIndexTitles].sort().reverse())
  })
})
