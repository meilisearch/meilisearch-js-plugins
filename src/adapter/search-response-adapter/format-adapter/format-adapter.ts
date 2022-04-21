import { adaptHighlight } from './highlight-adapter'
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
  const preTag = searchContext?.highlightPreTag
  const postTag = searchContext?.highlightPostTag

  if (!hit._formatted) return {}
  const _formattedResult = adaptHighlight(hit, preTag, postTag)

  const highlightedHit = {
    // We could not determine what the differences are between those two fields.
    _highlightResult: _formattedResult,
    _snippetResult: _formattedResult,
  }

  return highlightedHit
}
