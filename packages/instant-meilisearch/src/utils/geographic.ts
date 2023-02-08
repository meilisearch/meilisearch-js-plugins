/**
 * @param  {number} rad
 * @returns {number}
 */
function rad2degr(rad: number): number {
  return (rad * 180) / Math.PI
}

/**
 * @param  {number} degr
 * @returns {number}
 */
function degr2rad(degr: number): number {
  return (degr * Math.PI) / 180
}

/**
 * @param  {number} lat1
 * @param  {number} lng1
 * @param  {number} lat2
 * @param  {number} lng2
 * @returns {string}
 */
export function middleGeoPoints(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): string {
  // convert to radians
  lat1 = degr2rad(lat1)
  lng1 = degr2rad(lng1)

  const x1 = Math.cos(lat1) * Math.cos(lng1)
  const y1 = Math.cos(lat1) * Math.sin(lng1)
  const z1 = Math.sin(lat1)

  // convert to radians
  lat2 = degr2rad(lat2)
  lng2 = degr2rad(lng2)

  const x2 = Math.cos(lat2) * Math.cos(lng2)
  const y2 = Math.cos(lat2) * Math.sin(lng2)
  const z2 = Math.sin(lat2)

  const x = x1 + x2
  const y = y1 + y2
  const z = z1 + z2

  const Hyp = Math.sqrt(x * x + y * y)
  let lng3 = Math.atan2(y, x)
  let lat3 = Math.atan2(z, Hyp)

  if (lng1 < lng2 || (lng1 > lng2 && lng1 > Math.PI && lng2 < -Math.PI)) {
    lat3 = lat3 + Math.PI
    lng3 = lng3 + Math.PI
  } else {
    lat3 = rad2degr(lat3)
    lng3 = rad2degr(lng3)
  }

  if (
    Math.abs(x) < Math.pow(10, -9) &&
    Math.abs(y) < Math.pow(10, -9) &&
    Math.abs(z) < Math.pow(10, -9)
  ) {
    lat3 = 0
    lng3 = 0
  }

  return `${lat3},${lng3}`
}
/**
 * @param  {number} lat1
 * @param  {number} lng1
 * @param  {number} lat2
 * @param  {number} lng2
 * @returns {number}
 */
export function getDistanceInMeter(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  // Haversine Algorithm
  const R = 6371e3 // metres
  const latRad1 = (lat1 * Math.PI) / 180
  const latRad2 = (lat2 * Math.PI) / 180
  const latCenterRad = ((lat2 - lat1) * Math.PI) / 180
  const lngCenterRad = ((lng2 - lng1) * Math.PI) / 180

  const a =
    Math.sin(latCenterRad / 2) * Math.sin(latCenterRad / 2) +
    Math.cos(latRad1) *
      Math.cos(latRad2) *
      Math.sin(lngCenterRad / 2) *
      Math.sin(lngCenterRad / 2)

  const bearing = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const distance = R * bearing // in metres

  return distance
}
