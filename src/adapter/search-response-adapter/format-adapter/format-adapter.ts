import { adaptHighlight } from './highlight-adapter'
import { adaptSnippet } from './snippet-adapter'
import { SearchContext } from '../../../types'

/**
 * Adapt Meilisearch formating to formating compliant with instantsearch.js.
 *
 * @param  {Record<string} formattedHit
 * @param  {SearchContext} searchContext
 * @returns {Record}
 */
export function adaptFormating(
  hit: Record<string, any>,
  searchContext: SearchContext
): Record<string, any> {
  const attributesToSnippet = searchContext?.attributesToSnippet
  const ellipsis = searchContext?.snippetEllipsisText
  const preTag = searchContext?.highlightPreTag
  const postTag = searchContext?.highlightPostTag

  if (!hit._formatted) return {}
  const _highlightResult = adaptHighlight(hit, preTag, postTag)

  // what is ellipsis by default
  const _snippetResult = adaptHighlight(
    adaptSnippet(hit, attributesToSnippet, ellipsis),
    preTag,
    postTag
  )

  const highlightedHit = {
    _highlightResult,
    _snippetResult,
  }

  return highlightedHit
}
