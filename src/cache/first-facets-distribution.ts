import { FacetsDistribution } from '../types'

export function cacheFirstFacetsDistribution(
  defaultFacetDistribution: FacetsDistribution,
  searchResponse: any
): FacetsDistribution {
  if (
    searchResponse.query === '' &&
    Object.keys(defaultFacetDistribution).length === 0
  ) {
    return searchResponse.facetsDistribution
  }
  return defaultFacetDistribution
}
