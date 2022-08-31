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
    // Set paginationTotalHits to ensure limit is set to 0
    // in order to retrieve 0 documents during the default search request
    pagination: { ...searchContext.pagination, paginationTotalHits: 0 },
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
