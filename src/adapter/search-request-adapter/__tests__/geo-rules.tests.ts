import { adaptGeoPointsRules } from '../geo-rules-adapter'

test('Adapt geoPoints rules without a boundingBox', () => {
  const rules = adaptGeoPointsRules()
  expect(rules).toBeUndefined()
})

test('Adapt geoPoints rules with same 0 lat and 0 lng geo points', () => {
  const rules = adaptGeoPointsRules({
    insideBoundingBox: '0,0,0,0',
  })

  expect(rules?.filter).toBe('_geoRadius(0.00000, 0.00000, 0)')
})

test('Adapt geoPoints rules with integer geo points', () => {
  const rules = adaptGeoPointsRules({
    insideBoundingBox: '1,2,3,4',
  })
  expect(rules?.filter).toBe('_geoRadius(3.17650, 3.19394, 157201.47551181243)')
})

test('Try geoContext with only a radius', () => {
  const rules = adaptGeoPointsRules({
    aroundRadius: 1,
  })
  expect(rules).toBeUndefined()
})

test('Try geoContext with an aroundLatLng', () => {
  const rules = adaptGeoPointsRules({
    aroundLatLng: '51.1241999, 9.662499900000057',
  })
  expect(rules?.filter).toBeUndefined()
})

test('Try geoContext with an aroundLatLng and a radius', () => {
  const rules = adaptGeoPointsRules({
    aroundLatLng: '51.1241999, 9.662499900000057',
    aroundRadius: 1,
  })
  expect(rules?.filter).toBe('_geoRadius(51.12420, 9.66250, 1)')
})

test('Try geoContext with an aroundLatLng and a 0 radius', () => {
  const rules = adaptGeoPointsRules({
    aroundLatLng: '51.1241999, 9.662499900000057',
    aroundRadius: 0,
  })
  expect(rules?.filter).toBe('_geoRadius(51.12420, 9.66250, 0)')
})

test('Try geoContext with aroundLatLng, radius and insideBoundingBox', () => {
  const rules = adaptGeoPointsRules({
    aroundLatLng: '51.1241999, 9.662499900000057',
    aroundRadius: 1,
    insideBoundingBox: '1,2,3,4',
  })
  expect(rules?.filter).toBe('_geoRadius(3.17650, 3.19394, 157201.47551181243)')
})
test('Try geoContext with a radius and insideBoundingBox', () => {
  const rules = adaptGeoPointsRules({
    aroundRadius: 1,
    insideBoundingBox: '1,2,3,4',
  })
  expect(rules?.filter).toBe('_geoRadius(3.17650, 3.19394, 157201.47551181243)')
})
test('Try geoContext with aroundLatLng and insideBoundingBox', () => {
  const rules = adaptGeoPointsRules({
    aroundLatLng: '51.1241999, 9.662499900000057',
    insideBoundingBox: '1,2,3,4',
  })
  expect(rules?.filter).toBe('_geoRadius(3.17650, 3.19394, 157201.47551181243)')
})
