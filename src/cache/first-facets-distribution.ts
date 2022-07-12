import { FacetDistribution } from '../types'

export function cacheFirstFacetDistribution(
  defaultFacetDistribution: FacetDistribution,
  searchResponse: any
): FacetDistribution {
  if (
    searchResponse.query === '' &&
    Object.keys(defaultFacetDistribution).length === 0
  ) {
    return searchResponse.facetDistribution
  }
  return defaultFacetDistribution
}
