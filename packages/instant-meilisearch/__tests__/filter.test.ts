import { describe, beforeAll, test, expect } from 'vitest'
import {
  searchClient,
  dataset,
  type Movies,
  meilisearchClient,
} from './assets/utils.js'

describe('Instant Meilisearch Browser test', () => {
  beforeAll(async () => {
    const deleteTask = await meilisearchClient.deleteIndex('movies')
    await meilisearchClient.waitForTask(deleteTask.taskUid)
    await meilisearchClient
      .index('movies')
      .updateFilterableAttributes([
        'genres',
        'title',
        'numberField',
        'crazy_\\_"field"',
      ])
    const documentsTask = await meilisearchClient
      .index('movies')
      .addDocuments(dataset)
    await meilisearchClient.index('movies').waitForTask(documentsTask.taskUid)
  })

  test('one string facet on filter without a query', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: '',
          facetFilters: ['genres:Adventure'],
        },
      },
    ])

    const hits = response.results[0].hits
    expect(hits.length).toEqual(1)
    expect(hits[0].title).toEqual('Star Wars')
  })

  test('one facet on filter with a query', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'four',
          facetFilters: ['genres:Crime'],
        },
      },
    ])

    const hits = response.results[0].hits
    expect(hits.length).toEqual(2)
    expect(hits[0].title).toEqual('Four Rooms')
  })

  test('multiple on filter without a query', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: '',
          facetFilters: ['genres:Comedy', 'genres:Crime'],
        },
      },
    ])

    const hits = response.results[0].hits
    expect(hits.length).toEqual(2)
    expect(hits[0].title).toEqual('Ariel')
  })

  test('multiple on filter with a query', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'ar',
          facetFilters: ['genres:Comedy', 'genres:Crime'],
        },
      },
    ])

    const hits = response.results[0].hits

    expect(hits.length).toEqual(2)
    expect(hits[0].title).toEqual('Ariel')
  })

  test('multiple nested on filter with a query', async () => {
    const params = {
      indexName: 'movies',
      params: {
        query: 'night',
        facetFilters: [['genres:action', 'genres:Thriller'], ['genres:crime']],
      },
    }

    const response = await searchClient.search<Movies>([params])

    const hits = response.results[0].hits
    expect(hits[0].title).toEqual('Judgment Night')
  })

  test('multiple nested array in filter without a query', async () => {
    const params = {
      indexName: 'movies',
      params: {
        query: '',
        facetFilters: [['genres:action', 'genres:Thriller'], ['genres:crime']],
      },
    }

    const response = await searchClient.search<Movies>([params])

    const hits = response.results[0].hits
    expect(hits[0].title).toEqual('Judgment Night')
  })

  test('multiple nested arrays on filter with a query', async () => {
    const params = {
      indexName: 'movies',
      params: {
        query: 'ar',
        facetFilters: [['genres:Drama', 'genres:Thriller'], ['title:Ariel']],
      },
    }

    const response = await searchClient.search<Movies>([params])

    const hits = response.results[0].hits
    expect(hits[0].title).toEqual('Ariel')
  })

  test('multiple nested arrays on filter without a query', async () => {
    const params = {
      indexName: 'movies',
      params: {
        query: '',
        facetFilters: [['genres:Drama', 'genres:Thriller'], ['title:Ariel']],
      },
    }

    const response = await searchClient.search<Movies>([params])

    const hits = response.results[0].hits
    expect(hits[0].title).toEqual('Ariel')
  })

  test('numeric filter', async () => {
    const expectArrayEquivalence = <T>(actual: T[], expected: T[]) => {
      expect(actual).toEqual(expect.arrayContaining(expected))
      expect(expected).toEqual(expect.arrayContaining(actual))
    }

    const response1 = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: '',
          numericFilters: 'numberField:5 TO 15',
        },
      },
    ])
    expectArrayEquivalence(
      response1.results.flatMap((result: any) =>
        result.hits.map((hit: any) => hit.numberField)
      ),
      [5, 10, 15]
    )

    const response2 = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: '',
          numericFilters: ['numberField > 5', 'numberField < 15'],
        },
      },
    ])
    expectArrayEquivalence(
      response2.results.flatMap((result: any) =>
        result.hits.map((hit: any) => hit.numberField)
      ),
      [10]
    )

    const response3 = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: '',
          numericFilters: ['numberField >= 5', 'numberField <= 15'],
        },
      },
    ])
    expectArrayEquivalence(
      response3.results.flatMap((result: any) =>
        result.hits.map((hit: any) => hit.numberField)
      ),
      [5, 10, 15]
    )

    const response4 = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: '',
          numericFilters: 'numberField = 5',
        },
      },
    ])
    expectArrayEquivalence(
      response4.results.flatMap((result: any) =>
        result.hits.map((hit: any) => hit.numberField)
      ),
      [5]
    )

    const response5 = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: '',
          numericFilters: 'numberField != 5',
        },
      },
    ])
    expectArrayEquivalence(
      response5.results.flatMap((result: any) =>
        result.hits.map((hit: any) => hit.numberField).filter((v: any) => v !== undefined)
      ),
      [10, 15]
    )
  })

  test('quotation marks and backslashes', () => {
    const params = {
      indexName: 'movies',
      params: {
        query: '',
        facetFilters: 'crazy_\\_"field":real \\"crazy"',
      },
    }

    return expect(searchClient.search<Movies>([params])).resolves.toBeTruthy()
  })
})
