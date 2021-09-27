import { FacetsDistribution, Cache } from '../types'

/**
 * Adapt MeiliSearch facetsDistribution to instantsearch.js facetsDistribution
 * by completing the list of distribution with the facets that are checked in the components.
 *
 * To be aware of which field are checked a cache is provided that was made prior of the search request.
 *
 * @param  {Cache} cache?
 * @param  {FacetsDistribution} distribution?
 * @returns FacetsDistribution
 */
export function facetsDistributionAdapter(
  cache?: Cache,
  distribution?: FacetsDistribution
): FacetsDistribution {
  distribution = distribution || {}
  if (cache && Object.keys(cache).length > 0) {
    for (const cachedFacet in cache) {
      for (const cachedField of cache[cachedFacet]) {
        // if cached field is not present in the returned distribution

        if (
          !distribution[cachedFacet] ||
          !Object.keys(distribution[cachedFacet]).includes(cachedField)
        ) {
          // add 0 value
          distribution[cachedFacet] = distribution[cachedFacet] || {}
          distribution[cachedFacet][cachedField] = 0
        }
      }
    }
  }
  return distribution
}
