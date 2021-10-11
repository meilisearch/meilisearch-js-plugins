import { InsideBoundingBox } from '../../types'
import { getDistanceInMeter, middleGeoPoints } from '../../utils/geographic'

export function adaptGeoPointsRules(
  insideBoundingBox?: InsideBoundingBox
): { filter: string; sort: string } | undefined {
  if (insideBoundingBox && typeof insideBoundingBox === 'string') {
    const [lat1Raw, lng1Raw, lat2Raw, lng2Raw] = insideBoundingBox.split(',')

    const [lat1, lng1, lat2, lng2] = [
      parseFloat(lat1Raw),
      parseFloat(lng1Raw),
      parseFloat(lat2Raw),
      parseFloat(lng2Raw),
    ]
    const distanceInMeter = getDistanceInMeter(lat1, lng1, lat2, lng2)

    const { lat3, lng3 } = middleGeoPoints(lat1, lng1, lat2, lng2)

    // check if radius is big enough
    const filter = `_geoRadius(${lat3}, ${lng3}, ${Math.ceil(
      distanceInMeter / 2
    )})`

    const sort = `_geoPoint(${lat3}, ${lng3}):asc`

    return { filter, sort }
  }
  return undefined
}
