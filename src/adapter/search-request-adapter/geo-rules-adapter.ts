import { SearchContext, GeoSearchContext } from '../../types'
import { getDistanceInMeter, middleGeoPoints } from '../../utils/geographic'

export function adaptGeoPointsRules(
  geoSearchContext: GeoSearchContext
): { filter?: string; sort?: string } | undefined {
  const {
    insideBoundingBox,
    aroundLatLng,
    aroundRadius,
    minimumAroundRadius,
  } = geoSearchContext

  let middlePoint
  let radius

  if (aroundLatLng) {
    middlePoint = aroundLatLng
  }
  if (aroundRadius || minimumAroundRadius) {
    radius = aroundRadius
  }

  // If insideBoundingBox is provided it takes precedent over all other options
  if (insideBoundingBox && typeof insideBoundingBox === 'string') {
    const [lat1Raw, lng1Raw, lat2Raw, lng2Raw] = insideBoundingBox.split(',')

    const [lat1, lng1, lat2, lng2] = [
      parseFloat(lat1Raw),
      parseFloat(lng1Raw),
      parseFloat(lat2Raw),
      parseFloat(lng2Raw),
    ]
    radius = getDistanceInMeter(lat1, lng1, lat2, lng2) / 2
    middlePoint = middleGeoPoints(lat1, lng1, lat2, lng2)
  }

  if (middlePoint && radius) {
    const [lat3, lng3] = middlePoint.split(',')

    // check if radius is big enough
    const filter = `_geoRadius(${lat3}, ${lng3}, ${radius})`

    const sort = `_geoPoint(${lat3}, ${lng3}):asc`

    return { filter, sort }
  } else if (middlePoint) {
    const [lat3, lng3] = middlePoint.split(',')
    const sort = `_geoPoint(${lat3}, ${lng3}):asc`
    return { sort }
  }
  return undefined
}

export function createGeoSearchContext(
  searchContext: SearchContext
): GeoSearchContext {
  const geoContext: Record<string, any> = {}
  const {
    aroundLatLng,
    aroundLatLngViaIP,
    aroundRadius,
    aroundPrecision,
    minimumAroundRadius,
    insideBoundingBox,
    insidePolygon,
  } = searchContext

  if (aroundLatLng) {
    // only filter
    geoContext.aroundLatLng = aroundLatLng
  }

  if (aroundLatLngViaIP) {
    console.warn('instant-meilisearch: `aroundLatLngViaIP` is not supported.')
  }

  if (aroundRadius) {
    geoContext.aroundRadius = aroundRadius
  }

  if (aroundPrecision) {
    console.warn(`instant-meilisearch: \`aroundPrecision\` is not supported.
    See this discussion to track its implementation https://github.com/meilisearch/product/discussions/264`)
  }

  if (minimumAroundRadius && aroundLatLng) {
    geoContext.minimumAroundRadius = minimumAroundRadius
  }

  if (insideBoundingBox) {
    geoContext.insideBoundingBox = insideBoundingBox
  }
  // TODO: issue
  if (insidePolygon) {
    geoContext.insidePolygon = insidePolygon
  }
  return geoContext
}
