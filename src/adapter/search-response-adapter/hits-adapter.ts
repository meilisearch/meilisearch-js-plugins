import type { InstantSearchParams, SearchContext } from '../../types'
import { adaptPagination } from './pagination-adapter'
import { adaptFormating } from './highlight-adapter'

/**
 * @param  {Array<Record<string} meiliSearchHits
 * @param  {InstantSearchParams} instantSearchParams
 * @param  {SearchContext} instantMeiliSearchContext
 * @returns any
 */
export function adaptHits(
  meiliSearchHits: Array<Record<string, any>>,
  instantSearchParams: InstantSearchParams,
  instantMeiliSearchContext: SearchContext
): any {
  const { hitsPerPage, primaryKey, page } = instantMeiliSearchContext
  const paginatedHits = adaptPagination(meiliSearchHits, page, hitsPerPage)

  return paginatedHits.map((hit: any) => {
    // Creates Hit object compliant with InstantSearch
    if (Object.keys(hit).length > 0) {
      const { _formatted: formattedHit, _matchesInfo, ...restOfHit } = hit
      return {
        ...restOfHit,
        ...adaptFormating(formattedHit, instantSearchParams),
        ...(primaryKey && { objectID: hit[primaryKey] }),
      }
    }
    return hit
  })
}
