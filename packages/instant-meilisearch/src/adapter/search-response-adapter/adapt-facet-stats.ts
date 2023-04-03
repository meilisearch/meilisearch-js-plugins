import {
  AlgoliaSearchResponse,
  MeiliFacetStats,
  AlgoliaFacetStats,
} from '../../types'

export function adaptFacetStats(
  meiliFacetStats: MeiliFacetStats
): AlgoliaSearchResponse['facets_stats'] {
  const facetStats = Object.keys(meiliFacetStats).reduce(
    (stats: AlgoliaFacetStats, facet: string) => {
      stats[facet] = { ...meiliFacetStats[facet], avg: 0, sum: 0 } // Set at 0 as these numbers are not provided by Meilisearch

      return stats
    },
    {} as AlgoliaFacetStats
  )
  return facetStats
}
