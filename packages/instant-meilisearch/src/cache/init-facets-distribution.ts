import type {
  FacetDistribution,
  SearchContext,
  MeilisearchMultiSearchParams,
  MultiSearchResolver,
  MeilisearchMultiSearchResult,
} from '../types/index.js'
import { MeiliParamsCreator } from '../adapter/index.js'
import { removeDuplicate } from '../utils/index.js'

export function getParametersWithoutFilters(
  searchContext: SearchContext
): MeilisearchMultiSearchParams {
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

  return meilisearchParams.getParams()
}

// Fetch the initial facets distribution of an Index
// Used to show the facets when `placeholderSearch` is set to true
// Used to fill the missing facet values when `keepZeroFacets` is set to true
export async function initFacetDistribution(
  searchResolver: MultiSearchResolver,
  queries: MeilisearchMultiSearchParams[],
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

export function fillMissingFacets(
  initialFacetDistribution: Record<string, FacetDistribution>,
  meilisearchResults: MeilisearchMultiSearchResult[]
) {
  for (const searchResult of meilisearchResults) {
    initialFacetDistribution[searchResult.indexUid] = {
      ...(searchResult.facetDistribution || {}),
      ...(initialFacetDistribution[searchResult.indexUid] || {}),
    }
  }
  return initialFacetDistribution
}
