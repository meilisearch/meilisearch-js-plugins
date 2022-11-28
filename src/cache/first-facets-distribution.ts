import { FacetDistribution, SearchContext } from '../types'
import { MeiliParamsCreator } from '../adapter'

export async function cacheFirstFacetDistribution(
  searchResolver: any,
  searchContext: SearchContext
): Promise<FacetDistribution> {
  const defaultSearchContext = {
    ...searchContext,
    // placeholdersearch true to ensure a request is made
    placeholderSearch: true,
    // query set to empty to ensure retrieving the default facetdistribution
    query: '',
  }
  const meilisearchParams = MeiliParamsCreator(defaultSearchContext)
  meilisearchParams.addFacets()
  meilisearchParams.addPagination()

  // Search response from Meilisearch
  const searchResponse = await searchResolver.searchResponse(
    defaultSearchContext,
    meilisearchParams.getParams()
  )
  return searchResponse.facetDistribution || {}
}
