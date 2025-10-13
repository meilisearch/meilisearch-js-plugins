import { test, expect } from 'vitest'
import { adaptGeoSearch } from '../geo-rules-adapter.js'

test('Adapt instantsearch geo parameters to meilisearch filters without a boundingBox', () => {
  const filter = adaptGeoSearch({})
  expect(filter).toBeUndefined()
})

test('Adapt instantsearch geo parameters to meilisearch filters with same 0 lat and 0 lng geo points', () => {
  const filter = adaptGeoSearch({
    insideBoundingBox: '0,0,0,0',
  })

  expect(filter).toBe('_geoBoundingBox([0, 0], [0, 0])')
})

test('Adapt instantsearch geo parameters to meilisearch filters with integer geo points', () => {
  const filter = adaptGeoSearch({
    insideBoundingBox: '1,2,3,4',
  })

  expect(filter).toBe('_geoBoundingBox([1, 2], [3, 4])')
})

test('Adapt instantsearch geo parameters to meilisearch filters with only a radius', () => {
  const filter = adaptGeoSearch({
    aroundRadius: 1,
  })

  expect(filter).toBeUndefined()
})

test('Adapt instantsearch geo parameters to meilisearch filters with only an aroundLatLng', () => {
  const filter = adaptGeoSearch({
    aroundLatLng: '51.1241999, 9.662499900000057',
  })

  expect(filter).toBeUndefined()
})

test('Adapt instantsearch geo parameters to meilisearch filters with an aroundLatLng and a radius', () => {
  const filter = adaptGeoSearch({
    aroundLatLng: '51.1241999, 9.662499900000057',
    aroundRadius: 1,
  })

  expect(filter).toBe('_geoRadius(51.12420, 9.66250, 1)')
})

test('Adapt instantsearch geo parameters to meilisearch filters with an aroundLatLng and a 0 radius', () => {
  const filter = adaptGeoSearch({
    aroundLatLng: '51.1241999, 9.662499900000057',
    aroundRadius: 0,
  })

  expect(filter).toBe('_geoRadius(51.12420, 9.66250, 0)')
})

test('Adapt instantsearch geo parameters to meilisearch filters with aroundLatLng, radius and insideBoundingBox', () => {
  const filter = adaptGeoSearch({
    aroundLatLng: '51.1241999, 9.662499900000057',
    aroundRadius: 1,
    insideBoundingBox: '1,2,3,4',
  })

  expect(filter).toBe('_geoBoundingBox([1, 2], [3, 4])')
})
test('Adapt instantsearch geo parameters to meilisearch filters with a radius and insideBoundingBox', () => {
  const filter = adaptGeoSearch({
    aroundRadius: 1,
    insideBoundingBox: '1,2,3,4',
  })

  expect(filter).toBe('_geoBoundingBox([1, 2], [3, 4])')
})
test('Adapt instantsearch geo parameters to meilisearch filters with aroundLatLng and insideBoundingBox', () => {
  const filter = adaptGeoSearch({
    aroundLatLng: '51.1241999, 9.662499900000057',
    insideBoundingBox: '1,2,3,4',
  })

  expect(filter).toBe('_geoBoundingBox([1, 2], [3, 4])')
})

test('Adapt instantsearch geo parameters to meilisearch filters with insidePolygon (triangle)', () => {
  const filter = adaptGeoSearch({
    insidePolygon: [
      [50.0, 3.0],
      [50.7, 3.2],
      [50.6, 2.9],
    ],
  })

  expect(filter).toBe('_geoPolygon([50, 3], [50.7, 3.2], [50.6, 2.9])')
})

test('Adapt instantsearch geo parameters to meilisearch filters with insidePolygon (quadrilateral)', () => {
  const filter = adaptGeoSearch({
    insidePolygon: [
      [50.9, 4.1],
      [50.9, 4.6],
      [50.7, 4.6],
      [50.7, 4.1],
    ],
  })

  expect(filter).toBe(
    '_geoPolygon([50.9, 4.1], [50.9, 4.6], [50.7, 4.6], [50.7, 4.1])'
  )
})

test('insidePolygon takes precedence over insideBoundingBox and around*', () => {
  const filter = adaptGeoSearch({
    insidePolygon: [
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    insideBoundingBox: '1,2,3,4',
    aroundLatLng: '51.1241999, 9.662499900000057',
    aroundRadius: 10,
  })

  expect(filter).toBe('_geoPolygon([1, 1], [2, 2], [3, 3])')
})

test('Invalid insidePolygon (<3 points) gracefully ignored', () => {
  const filter = adaptGeoSearch({
    insidePolygon: [
      [1, 1],
      [2, 2],
    ],
  })

  expect(filter).toBeUndefined()
})
