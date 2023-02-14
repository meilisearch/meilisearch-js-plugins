import { FacetDistribution, SearchContext } from '../types'
import { MeiliParamsCreator } from '../adapter'

async function getIndexFacetDistribution(
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

export async function initFacetDistribution(
  searchResolver: any,
  searchContext: SearchContext,
  initialFacetDistribution: Record<string, FacetDistribution>
): Promise<Record<string, FacetDistribution>> {
  // Fetch the initial facets distribution of an Index
  // Used to show the facets when `placeholderSearch` is set to true
  // Used to fill the missing facet values when `keepZeroFacets` is set to true
  if (!initialFacetDistribution[searchContext.indexUid]) {
    initialFacetDistribution[searchContext.indexUid] =
      await getIndexFacetDistribution(searchResolver, searchContext)
  }

  return initialFacetDistribution
}
