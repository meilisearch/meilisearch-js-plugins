/**
 * @param  {any[]} hits
 * @returns {Array<Record<string, any>>}
 */
export function adaptGeoResponse(hits: any[]): Array<Record<string, any>> {
  for (let i = 0; i < hits.length; i++) {
    if (hits[i]._geo) {
      hits[i]._geoloc = {
        lat: hits[i]._geo.lat,
        lng: hits[i]._geo.lng,
      }

      hits[i].objectID = `${i + Math.random() * 1000000}`
      delete hits[i]._geo
    }
  }
  return hits
}
