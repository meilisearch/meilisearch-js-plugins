/**
 * @param  {any[]} hits
 * @returns {Array<Record<string, any>>}
 */
export function adaptGeoResponse(hits: any[]): Array<Record<string, any>> {
  for (let i = 0; i < hits.length; i++) {
    const objectID = `${i + Math.random() * 1000000}`
    if (hits[i]._geo) {
      hits[i]._geoloc = hits[i]._geo
      hits[i].objectID = objectID
    }

    if (hits[i]._formatted?._geo) {
      hits[i]._formatted._geoloc = hits[i]._formatted._geo
      hits[i]._formatted.objectID = objectID
    }
  }
  return hits
}
