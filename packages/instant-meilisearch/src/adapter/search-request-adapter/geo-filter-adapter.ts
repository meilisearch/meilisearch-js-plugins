import { SearchContext } from '../../types'

export function adaptGeoFilter({
  insideBoundingBox,
  aroundLatLng,
  aroundRadius,
  minimumAroundRadius,
}: SearchContext): string | undefined {
  let middlePoint: string[] | undefined
  let radius: number | undefined
  let filter: string | undefined

  if (aroundLatLng) {
    const [lat3Str, lng3Str] = aroundLatLng.split(',')
    const lat3 = Number.parseFloat(lat3Str).toFixed(5)
    const lng3 = Number.parseFloat(lng3Str).toFixed(5)
    middlePoint = [lat3, lng3]
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
    const [lat1Raw, lng1Raw, lat2Raw, lng2Raw] = insideBoundingBox.split(',')

    const [lat1, lng1, lat2, lng2] = [
      parseFloat(lat1Raw),
      parseFloat(lng1Raw),
      parseFloat(lat2Raw),
      parseFloat(lng2Raw),
    ]

    filter = `_geoBoundingBox([${lat1}, ${lng1}], [${lat2}, ${lng2}])`
    console.log(insideBoundingBox, filter)
  } else if (middlePoint != null && radius != null) {
    const [lat3, lng3] = middlePoint
    filter = `_geoRadius(${lat3}, ${lng3}, ${radius})`
  }

  return filter
}
