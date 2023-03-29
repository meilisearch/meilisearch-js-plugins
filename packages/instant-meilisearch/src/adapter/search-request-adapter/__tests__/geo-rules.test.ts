import { adaptGeoSearch } from '../geo-rules-adapter'

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
