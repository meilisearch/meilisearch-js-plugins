import { searchClient, geoDataset, City } from './assets/utils'

describe('Instant MeiliSearch Browser test', () => {
  beforeAll(async () => {
    try {
      await searchClient.MeiliSearchClient.deleteIndex('movies')
    } catch (e) {
      // movies does not exist
    }
    await searchClient.MeiliSearchClient.index(
      'movies'
    ).updateFilterableAttributes(['_geo'])
    await searchClient.MeiliSearchClient.index(
      'movies'
    ).updateSortableAttributes(['_geo'])
    const moviesUpdate = await searchClient.MeiliSearchClient.index(
      'movies'
    ).addDocuments(geoDataset)
    await searchClient.MeiliSearchClient.index('movies').waitForPendingUpdate(
      moviesUpdate.updateId
    )
  })

  test.only('Test aroundRadius and aroundLatLng in geo search', async () => {
    const response = await searchClient.search<City>([
      {
        indexName: 'movies',
        params: {
          query: '',
          aroundRadius: 100000,
          aroundLatLng: '50.83094249790228, 4.368630010322772',
        },
      },
    ])
    const hits = response.results[0].hits
    expect(hits.length).toEqual(13)
    expect(hits[0].city).toEqual('Brussels')
  })

  // test('Test one facet on filter with a query', async () => {
  //   const response = await searchClient.search<City>([
  //     {
  //       indexName: 'movies',
  //       params: {
  //         query: 'four',
  //         facetFilters: ['genres:Crime'],
  //       },
  //     },
  //   ])
  //   const hits = response.results[0].hits
  //   expect(hits.length).toEqual(2)
  //   expect(hits[0].title).toEqual('Four Rooms')
  // })

  // test('Test one string facet on filter without a query', async () => {
  //   const response = await searchClient.search<City>([
  //     {
  //       indexName: 'movies',
  //       params: {
  //         query: '',
  //         facetFilters: ['genres:Adventure'],
  //       },
  //     },
  //   ])
  //   const hits = response.results[0].hits
  //   expect(hits.length).toEqual(1)
  //   expect(hits[0].title).toEqual('Star Wars')
  // })

  // test('Test one facet on filter with a query', async () => {
  //   const response = await searchClient.search<City>([
  //     {
  //       indexName: 'movies',
  //       params: {
  //         query: 'four',
  //         facetFilters: ['genres:Crime'],
  //       },
  //     },
  //   ])
  //   const hits = response.results[0].hits
  //   expect(hits.length).toEqual(2)
  //   expect(hits[0].title).toEqual('Four Rooms')
  // })

  // test('Test multiple on filter without a query', async () => {
  //   const response = await searchClient.search<City>([
  //     {
  //       indexName: 'movies',
  //       params: {
  //         query: '',
  //         facetFilters: ['genres:Comedy', 'genres:Crime'],
  //       },
  //     },
  //   ])
  //   const hits = response.results[0].hits
  //   expect(hits.length).toEqual(2)
  //   expect(hits[0].title).toEqual('Ariel')
  // })

  // test('Test multiple on filter with a query', async () => {
  //   const response = await searchClient.search<City>([
  //     {
  //       indexName: 'movies',
  //       params: {
  //         query: 'ar',
  //         facetFilters: ['genres:Comedy', 'genres:Crime'],
  //       },
  //     },
  //   ])
  //   const hits = response.results[0].hits
  //   expect(hits.length).toEqual(2)
  //   expect(hits[0].title).toEqual('Ariel')
  // })

  // test('Test multiple nested on filter with a query', async () => {
  //   const params = {
  //     indexName: 'movies',
  //     params: {
  //       query: 'night',
  //       facetFilters: [['genres:action', 'genres:Thriller'], ['genres:crime']],
  //     },
  //   }
  //   const response = await searchClient.search<City>([params])
  //   const hits = response.results[0].hits
  //   expect(hits[0].title).toEqual('Judgment Night')
  // })

  // test('Test multiple nested on filter without a query', async () => {
  //   const params = {
  //     indexName: 'movies',
  //     params: {
  //       query: '',
  //       facetFilters: [['genres:action', 'genres:Thriller'], ['genres:crime']],
  //     },
  //   }
  //   const response = await searchClient.search<City>([params])
  //   const hits = response.results[0].hits
  //   expect(hits[0].title).toEqual('Kill Bill: Vol. 1')
  // })

  // test('Test multiple nested arrays on filter with a query', async () => {
  //   const params = {
  //     indexName: 'movies',
  //     params: {
  //       query: 'ar',
  //       facetFilters: [['genres:Drama', 'genres:Thriller'], ['title:Ariel']],
  //     },
  //   }
  //   const response = await searchClient.search<City>([params])
  //   const hits = response.results[0].hits
  //   expect(hits[0].title).toEqual('Ariel')
  // })

  // test('Test multiple nested arrays on filter without a query', async () => {
  //   const params = {
  //     indexName: 'movies',
  //     params: {
  //       query: '',
  //       facetFilters: [['genres:Drama', 'genres:Thriller'], ['title:Ariel']],
  //     },
  //   }

  //   const response = await searchClient.search<City>([params])
  //   const hits = response.results[0].hits
  //   expect(hits[0].title).toEqual('Ariel')
  // })
})
