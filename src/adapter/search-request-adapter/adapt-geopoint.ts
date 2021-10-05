function getDistanceInMeter(
  lat1: number,
  lat2: number,
  lng1: number,
  lng2: number
): number {
  const R = 6371e3 // metres
  const latRad1 = (lat1 * Math.PI) / 180 // φ, λ in radians
  const latRad2 = (lat2 * Math.PI) / 180
  const latCenterRad = ((lat2 - lat1) * Math.PI) / 180
  const lngCenterRad = ((lng2 - lng1) * Math.PI) / 180

  const a =
    Math.sin(latCenterRad / 2) * Math.sin(latCenterRad / 2) +
    Math.cos(latRad1) *
    Math.cos(latRad2) *
    Math.sin(lngCenterRad / 2) *
    Math.sin(lngCenterRad / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const d = R * c // in metres
  return d
}

function rad2degr(rad: number): number {
  return (rad * 180) / Math.PI
}
function degr2rad(degr: number): number {
  return (degr * Math.PI) / 180
}

export function adaptGeoPoint(
  insideBoundingBox: string
): [string, string] | undefined {
  // console.log({ insideBoundingBox })
  if (insideBoundingBox) {
    const [lat1Raw, lng1Raw, lat2Raw, lng2Raw] = insideBoundingBox.split(',')

    const [lat1, lng1, lat2, lng2] = [
      parseFloat(lat1Raw),
      parseFloat(lng1Raw),
      parseFloat(lat2Raw),
      parseFloat(lng2Raw),
    ]
    const distanceInMeter = getDistanceInMeter(lat1, lat2, lng1, lng2)
    const height = getDistanceInMeter(lat1, lat2, 0, 0)
    const width = getDistanceInMeter(0, 0, lng1, lng2)

    console.log({ height, width })

    const λ1 = (lat1 * Math.PI) / 180 // φ, λ in radians
    const λ2 = (lat2 * Math.PI) / 180 // φ, λ in radians
    const φ1 = (lng1 * Math.PI) / 180 // φ, λ in radians
    const φ2 = (lng2 * Math.PI) / 180 // φ, λ in radians

    const Bx = Math.cos(φ2) * Math.cos(λ2 - λ1)
    const By = Math.cos(φ2) * Math.sin(λ2 - λ1)
    const φ3 = Math.atan2(
      Math.sin(φ1) + Math.sin(φ2),
      Math.sqrt((Math.cos(φ1) + Bx) * (Math.cos(φ1) + Bx) + By * By)
    )
    const λ3 = λ1 + Math.atan2(By, Math.cos(φ1) + Bx)
    const latInDegrees = rad2degr(λ3)
    const lngInDegrees = rad2degr(φ3)

    const filter = `_geoRadius(${latInDegrees}, ${lngInDegrees}, ${Math.floor(
      distanceInMeter / 2
    )})`

    const sort = `_geoPoint(${latInDegrees}, ${lngInDegrees}):asc`
    console.log({ filter, sort })

    return [filter, sort]
  }
  return undefined
}
