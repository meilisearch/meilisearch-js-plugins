import { InstantSearchParams, InstantMeiliSearchContext } from '../types'
import { paginateHits } from './pagination'
import {
  createHighlighResult,
  createSnippetResult,
} from './to-instantsearch-highlight'

function parseFormatting(
  formattedHit: any,
  instantSearchParams: InstantSearchParams
) {
  const attributesToSnippet = instantSearchParams?.attributesToSnippet
  const snippetEllipsisText = instantSearchParams?.snippetEllipsisText
  const highlightPreTag = instantSearchParams?.highlightPreTag
  const highlightPostTag = instantSearchParams?.highlightPostTag

  if (!formattedHit || formattedHit.length) return {}
  return {
    _highlightResult: createHighlighResult({
      formattedHit,
      ...instantSearchParams,
    }),
    _snippetResult: createSnippetResult(
      formattedHit,
      attributesToSnippet,
      snippetEllipsisText,
      highlightPreTag,
      highlightPostTag
    ),
  }
}

export function adaptToISHits(
  meiliSearchHits: Array<Record<string, any>>,
  instantSearchParams: InstantSearchParams,
  instantMeiliSearchContext: InstantMeiliSearchContext
) {
  const { primaryKey } = instantMeiliSearchContext
  const { page, hitsPerPage } = instantMeiliSearchContext
  const paginatedHits = paginateHits(meiliSearchHits, page, hitsPerPage)

  return paginatedHits.map((hit: any) => {
    // Creates Hit object compliant with InstantSearch
    if (Object.keys(hit).length > 0) {
      const { _formatted: formattedHit, _matchesInfo, ...restOfHit } = hit
      return {
        ...restOfHit,
        ...parseFormatting(formattedHit, instantSearchParams),
        ...(primaryKey && { objectID: hit[primaryKey] }),
      }
    }
    return hit
  })
}
