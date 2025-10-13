import { describe, beforeAll, test, expect } from 'vitest'
import {
  searchClient,
  geoDataset,
  type City,
  meilisearchClient,
} from './assets/utils.js'

describe('Instant Meilisearch Browser test', () => {
  beforeAll(async () => {
    await meilisearchClient.deleteIndex('geotest').waitTask()
    await meilisearchClient
      .index('geotest')
      .updateFilterableAttributes(['_geo', '_geojson'])
      .waitTask()
    await meilisearchClient
      .index('geotest')
      .updateSortableAttributes(['_geo'])
      .waitTask()
    await meilisearchClient.index('geotest').addDocuments(geoDataset).waitTask()
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
    expect(hits.length).toEqual(5)
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
    expect(hits.length).toEqual(2)
    expect(hits[0].city).toEqual('Brussels')
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
    expect(hits.length).toEqual(2)
    expect(hits[0].city).toEqual('Brussels')
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
    expect(hits.length).toEqual(2)
    expect(hits[0].city).toEqual('Brussels')
  })

  test('insidePolygon in geo search', async () => {
    const response = await searchClient.search<City>([
      {
        indexName: 'geotest',
        params: {
          query: '',
          // Simple triangle roughly around Brussels area
          insidePolygon: [
            [50.95, 4.1],
            [50.75, 4.6],
            [50.70, 4.2],
          ],
        },
      },
    ])

    const hits = response.results[0].hits
    // Expect Brussels to be included
    expect(hits.find((h: City) => h.city === 'Brussels')).toBeTruthy()
    // Expect far cities like Paris to be excluded
    expect(hits.find((h: City) => h.city === 'Paris')).toBeFalsy()
  })

  test('insidePolygon ignores documents without _geojson', async () => {
    // Add a document inside the polygon but only with _geo (no _geojson)
    await meilisearchClient
      .index('geotest')
      .addDocuments([
        {
          id: 'geo-only',
          city: 'GeoOnly',
          _geo: { lat: 50.80, lng: 4.35 },
        },
      ])
      .waitTask()

    const response = await searchClient.search<City>([
      {
        indexName: 'geotest',
        params: {
          query: '',
          insidePolygon: [
            [50.95, 4.1],
            [50.75, 4.6],
            [50.70, 4.2],
          ],
        },
      },
    ])

    const hits = response.results[0].hits
    // Should not include the _geo-only document
    expect(hits.find((h: any) => h.city === 'GeoOnly')).toBeFalsy()

    // Cleanup
    await meilisearchClient.index('geotest').deleteDocument('geo-only').waitTask()
  })

  test('aroundRadius matches _geojson-only documents', async () => {
    // Add a document only with _geojson near Brussels
    await meilisearchClient
      .index('geotest')
      .addDocuments([
        {
          id: 'geojson-only',
          city: 'GeoJSONOnly',
          _geojson: { type: 'Point', coordinates: [4.35, 50.8467] },
        },
      ])
      .waitTask()

    const response = await searchClient.search<City>([
      {
        indexName: 'geotest',
        params: {
          query: '',
          aroundRadius: 5000,
          aroundLatLng: '50.8466, 4.35',
        },
      },
    ])

    const hits = response.results[0].hits
    expect(hits.find((h: any) => h.city === 'GeoJSONOnly')).toBeTruthy()

    // Cleanup
    await meilisearchClient
      .index('geotest')
      .deleteDocument('geojson-only')
      .waitTask()
  })
})
