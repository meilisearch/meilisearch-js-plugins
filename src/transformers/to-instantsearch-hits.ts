import { TransformToISHitsm } from '../types/types'
import { paginateHits } from './pagination'
import {
  createHighlighResult,
  createSnippetResult,
} from './to-instantsearch-highlight'

export const transformToISHits: TransformToISHitsm = function (
  meiliSearchHits,
  instantSearchParams,
  instantMeiliSearchContext
) {
  const { primaryKey } = instantMeiliSearchContext
  const paginatedHits = paginateHits(meiliSearchHits, instantMeiliSearchContext)

  return paginatedHits.map((hit: any) => {
    const { _formatted: formattedHit, ...restOfHit } = hit

    // Creates Hit object compliant with InstantSearch
    return {
      ...restOfHit,
      _highlightResult: createHighlighResult({
        formattedHit,
        ...instantSearchParams,
      }),
      _snippetResult: createSnippetResult({
        formattedHit,
        ...instantSearchParams,
      }),
      ...(primaryKey && { objectID: hit[primaryKey] }),
    }
  })
}
