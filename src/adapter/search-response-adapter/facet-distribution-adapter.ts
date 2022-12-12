import { FacetDistribution, SearchContext } from '../../types'

function getFacetNames(
  facets: SearchContext['facets'] | string
): Readonly<string[]> {
  if (!facets) return []
  else if (typeof facets === 'string') return [facets]
  return facets
}

// Fills the missing facetValue in the current facet distribution if `keepZeroFacet` is true
// using the initial facet distribution.
// Ex:
// Initial distribution: { genres: { horror: 10, comedy: 4 } }
// Current distribution: { genres: { horror: 3 }}
// returned distribution: { genres: { horror: 3, comedy: 0 }}
function fillMissingFacetValues(
  facets: SearchContext['facets'] | string,
  defaultFacetDistribution: FacetDistribution,
  currentFacetDistribution: FacetDistribution
): FacetDistribution {
  const facetNames = getFacetNames(facets)
  const filledDistribution: FacetDistribution = {}

  for (const facet of facetNames) {
    for (const facetValue in defaultFacetDistribution[facet]) {
      if (!filledDistribution[facet]) {
        // initialize sub object
        filledDistribution[facet] = currentFacetDistribution[facet] || {}
      }
      if (!filledDistribution[facet][facetValue]) {
        filledDistribution[facet][facetValue] = 0
      } else {
        filledDistribution[facet][facetValue] =
          currentFacetDistribution[facet][facetValue]
      }
    }
  }

  return filledDistribution
}

function adaptFacetDistribution(
  keepZeroFacets: boolean,
  facets: SearchContext['facets'] | string,
  defaultFacetDistribution: FacetDistribution,
  facetDistribution: FacetDistribution | undefined
) {
  if (keepZeroFacets) {
    facetDistribution = facetDistribution || {}
    return fillMissingFacetValues(
      facets,
      defaultFacetDistribution,
      facetDistribution
    )
  }
  return facetDistribution
}

export { adaptFacetDistribution }
