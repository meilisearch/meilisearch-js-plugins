import { FacetDistribution, SearchContext } from '../types'
import { MeiliParamsCreator } from '../adapter'

export async function cacheFirstFacetDistribution(
  searchResolver: any,
  searchContext: SearchContext
): Promise<FacetDistribution> {
  const meilisearchParams = MeiliParamsCreator(searchContext)
  meilisearchParams.addFacets()
  meilisearchParams.addAttributesToRetrieve()

  // Search response from Meilisearch
  const searchResponse = await searchResolver.searchResponse(
    // placeholdersearch true to ensure a request is made
    // query set to empty to ensure default facetdistributionap
    { ...searchContext, placeholderSearch: true, query: '' },
    meilisearchParams.getParams()
  )
  return searchResponse.facetDistribution || {}
}
