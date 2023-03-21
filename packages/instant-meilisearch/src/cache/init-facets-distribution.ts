import {
  FacetDistribution,
  SearchContext,
  MeiliSearchMultiSearchParams,
  MultiSearchResolver,
} from '../types'
import { MeiliParamsCreator } from '../adapter'
import { removeDuplicate } from '../utils'

export function getParametersWithoutFilters(
  searchContext: SearchContext
): MeiliSearchMultiSearchParams {
  const defaultSearchContext = {
    ...searchContext,
    // placeholdersearch true to ensure a request is made
    placeholderSearch: true,
    // query set to empty to ensure retrieving the default facetdistribution
    query: '',
  }
  const meilisearchParams = MeiliParamsCreator(defaultSearchContext)
  meilisearchParams.addFacets()
  meilisearchParams.addIndexUid()
  meilisearchParams.addPagination()

  return meilisearchParams.getParams()
}

// Fetch the initial facets distribution of an Index
// Used to show the facets when `placeholderSearch` is set to true
// Used to fill the missing facet values when `keepZeroFacets` is set to true
export async function initFacetDistribution(
  searchResolver: MultiSearchResolver,
  queries: MeiliSearchMultiSearchParams[],
  initialFacetDistribution: Record<string, FacetDistribution>
): Promise<Record<string, FacetDistribution>> {
  const removeIndexUidDuplicates = removeDuplicate('indexUid')

  const searchQueries = queries
    .filter(removeIndexUidDuplicates) // only make one request per indexUid
    .filter(({ indexUid }) => {
      // avoid requesting on indexes that already have an initial facetDistribution
      return !Object.keys(initialFacetDistribution).includes(indexUid)
    })

  if (searchQueries.length === 0) return initialFacetDistribution

  const results = await searchResolver.multiSearch(searchQueries, [])

  for (const searchResult of results) {
    initialFacetDistribution[searchResult.indexUid] =
      searchResult.facetDistribution || {}
  }

  return initialFacetDistribution
}
