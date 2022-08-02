import {
  searchClient,
  geoDataset,
  City,
  meilisearchClient,
} from './assets/utils'

describe('Instant Meilisearch Browser test', () => {
  beforeAll(async () => {
    const deleteTask = await meilisearchClient.deleteIndex('geotest')
    await meilisearchClient.waitForTask(deleteTask.taskUid)
    await meilisearchClient
      .index('geotest')
      .updateFilterableAttributes(['_geo'])
    await meilisearchClient.index('geotest').updateSortableAttributes(['_geo'])
    const documentsTask = await meilisearchClient
      .index('geotest')
      .addDocuments(geoDataset)
    await meilisearchClient.index('movies').waitForTask(documentsTask.taskUid)
  })

  test('aroundRadius and aroundLatLng in geo search', async () => {
    const response = await searchClient.search<City>([
      {
        indexName: 'geotest',
        params: {
          query: '',
          aroundRadius: 100000,
          aroundLatLng: '50.83094249790228, 4.368630010322772',
        },
      },
    ])

    const hits = response.results[0].hits
    expect(hits.length).toEqual(14)
    expect(hits[0].city).toEqual('Lille')
  })

  test('aroundLatLng being overwritten by insideBoundingBox in geo search', async () => {
    const response = await searchClient.search<City>([
      {
        indexName: 'geotest',
        params: {
          query: '',
          aroundRadius: 100000,
          aroundLatLng: '50.83094249790228, 4.368630010322772',
          insideBoundingBox:
            '50.680720183653065, 3.273798366642514,50.55969330590075, 2.9625244444490253',
        },
      },
    ])

    const hits = response.results[0].hits
    expect(hits.length).toEqual(7)
    expect(hits[0].city).toEqual('Lille')
  })

  test('insideBoundingBox in geo search', async () => {
    const response = await searchClient.search<City>([
      {
        indexName: 'geotest',
        params: {
          query: '',
          insideBoundingBox:
            '51.29613859469906, 4.911139116616028,50.42574330144633, 3.9566714733443122',
        },
      },
    ])

    const hits = response.results[0].hits
    expect(hits.length).toEqual(4)
    expect(hits[0].city).toEqual('Ghent')
  })

  test('insideBoundingBox and aroundRadius in geo search', async () => {
    const response = await searchClient.search<City>([
      {
        indexName: 'geotest',
        params: {
          query: '',
          aroundRadius: 1,
          insideBoundingBox:
            '51.29613859469906, 4.911139116616028,50.42574330144633, 3.9566714733443122',
        },
      },
    ])

    const hits = response.results[0].hits
    expect(hits.length).toEqual(4)
    expect(hits[0].city).toEqual('Ghent')
  })

  test('insideBoundingBox and aroundLatLng in geo search', async () => {
    const response = await searchClient.search<City>([
      {
        indexName: 'geotest',
        params: {
          query: '',
          aroundLatLng: '50.22326791296595, 2.7681166283566405',
          insideBoundingBox:
            '51.29613859469906, 4.911139116616028,50.42574330144633, 3.9566714733443122',
        },
      },
    ])

    const hits = response.results[0].hits
    expect(hits.length).toEqual(4)
    expect(hits[0].city).toEqual('Ghent')
  })
})
