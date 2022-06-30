import { FacetsDistribution } from '../types'

export function cacheFirstFacetDistribution(
  defaultFacetDistribution: FacetsDistribution,
  searchResponse: any
): FacetsDistribution {
  if (
    searchResponse.query === '' &&
    Object.keys(defaultFacetDistribution).length === 0
  ) {
    return searchResponse.facetDistribution
  }
  return defaultFacetDistribution
}
