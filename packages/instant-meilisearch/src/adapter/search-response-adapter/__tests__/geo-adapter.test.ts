import { adaptGeoResponse } from '../geo-reponse-adapter'

describe('Geopoint adapter', () => {
  test('_geoloc field should be created in hit object with _geo fields', () => {
    const hits = [
      {
        id: 2,
        _geo: {
          lat: 1,
          lng: 2,
        },
        _formatted: {
          _geo: {
            lat: 1,
            lng: 2,
          },
        },
      },
    ]

    const adaptedHits = adaptGeoResponse(hits)

    expect(adaptedHits[0]._geoloc).toEqual(hits[0]._geo)
    expect(adaptedHits[0]._geo).toEqual(hits[0]._geo)
    expect(adaptedHits[0]._formatted._geoloc).toEqual(hits[0]._formatted._geo)
    expect(adaptedHits[0]._formatted._geo).toEqual(hits[0]._formatted._geo)
    expect(adaptedHits[0].objectID).toBeDefined()
    expect(adaptedHits[0]._formatted.objectID).toEqual(adaptedHits[0].objectID)
  })

  test('_geoloc field should not be created in hit object without _geo fields', () => {
    const hits = [
      {
        id: 2,
      },
      {
        id: 1,
        _formatted: {},
      },
    ]

    const adaptedHits = adaptGeoResponse(hits)

    expect(adaptedHits[0]._geoloc).toBeUndefined()
    expect(adaptedHits[0]._geo).toBeUndefined()
    expect(adaptedHits[0]._formatted).toBeUndefined()
    expect(adaptedHits[1]._geoloc).toBeUndefined()
    expect(adaptedHits[1]._geo).toBeUndefined()
    expect(adaptedHits[1]._formatted._geoloc).toBeUndefined()
    expect(adaptedHits[1]._formatted._geo).toBeUndefined()
  })
})
