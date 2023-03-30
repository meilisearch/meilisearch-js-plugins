import { InstantSearchGeoParams } from '../../types'

export function adaptGeoSearch({
  insideBoundingBox,
  aroundLatLng,
  aroundRadius,
  minimumAroundRadius,
}: InstantSearchGeoParams): string | undefined {
  let middlePoint: string[] | undefined
  let radius: number | undefined
  let filter: string | undefined

  if (aroundLatLng) {
    const [lat, lng] = aroundLatLng
      .split(',')
      .map((pt) => Number.parseFloat(pt).toFixed(5))

    middlePoint = [lat, lng]
  }

  if (aroundRadius != null || minimumAroundRadius != null) {
    if (aroundRadius === 'all') {
      console.warn(
        'instant-meilisearch is not compatible with the `all` value on the aroundRadius parameter'
      )
    } else if (aroundRadius != null) {
      radius = aroundRadius
    } else {
      radius = minimumAroundRadius
    }
  }

  if (insideBoundingBox && typeof insideBoundingBox === 'string') {
    const [lat1, lng1, lat2, lng2] = insideBoundingBox
      .split(',')
      .map((pt) => parseFloat(pt))

    filter = `_geoBoundingBox([${lat1}, ${lng1}], [${lat2}, ${lng2}])`
  } else if (middlePoint != null && radius != null) {
    const [lat, lng] = middlePoint

    filter = `_geoRadius(${lat}, ${lng}, ${radius})`
  }

  return filter
}
