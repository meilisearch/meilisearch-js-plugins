import { adaptGeoPointsRules } from '../geo-rules-adapter'

test('Adapt geoPoints rules without a boundingBox', () => {
  const rules = adaptGeoPointsRules()
  expect(rules).toBeUndefined()
})

test('Adapt geoPoints rules with same 0 lat and 0 lng geo points', () => {
  const rules = adaptGeoPointsRules('0,0,0,0')

  expect(rules?.filter).toBe('_geoRadius(0, 0, 0)')
  expect(rules?.sort).toBe('_geoPoint(0, 0):asc')
})

test('Adapt geoPoints rules with integer geo points', () => {
  const rules = adaptGeoPointsRules('1,2,3,4')
  expect(rules?.filter).toBe(
    '_geoRadius(2.0003044085023727, 2.999390393801055, 157202)'
  )
  expect(rules?.sort).toBe(
    '_geoPoint(2.0003044085023727, 2.999390393801055):asc'
  )
})
