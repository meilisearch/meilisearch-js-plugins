import { isString } from '../../utils'
import { SearchContext } from '../../types'

/**
 * Replace `em` tags in highlighted MeiliSearch hits to
 * provided tags by instantsearch.js.
 *
 * @param  {string} value
 * @param  {string} highlightPreTag?
 * @param  {string} highlightPostTag?
 * @returns {string}
 */
function replaceHighlightTags(
  value: any,
  preTag?: string,
  postTag?: string
): string {
  preTag = preTag || '__ais-highlight__'
  postTag = postTag || '__/ais-highlight__'
  // Highlight is applied by MeiliSearch (<em> tags)
  // We replace the <em> by the expected tag for InstantSearch
  const stringifiedValue = isString(value) ? value : JSON.stringify(value)

  return stringifiedValue.replace(/<em>/g, preTag).replace(/<\/em>/g, postTag)
}

function addHighlightTags(value: string, preTag?: string, postTag?: string) {
  return {
    value: replaceHighlightTags(value, preTag, postTag),
  }
}

function resolveHighlightValue(
  value: string,
  preTag?: string,
  postTag?: string
) {
  if (typeof value === 'string') {
    // String
    return addHighlightTags(value, preTag, postTag)
  } else if (value === undefined) {
    // undefined
    return { value: JSON.stringify(null) }
  } else {
    // Other
    return { value: JSON.stringify(value) }
  }
}

/**
 * @param  {Record<string} formattedHit
 * @param  {string} highlightPreTag?
 * @param  {string} highlightPostTag?
 * @returns {Record}
 */
function adaptHighlight(
  hit: Record<string, any>,
  preTag?: string,
  postTag?: string
): Record<string, any> {
  // hit is the `_formatted` object returned by MeiliSearch.
  // It contains all the highlighted and croped attributes

  return Object.keys(hit).reduce((result, key) => {
    const value = hit[key]

    if (Array.isArray(value)) {
      // Array
      result[key] = value.map((elem) =>
        resolveHighlightValue(elem, preTag, postTag)
      )
    } else {
      result[key] = resolveHighlightValue(value, preTag, postTag)
    }
    return result
  }, {} as any)
}

/**
 * @param  {string} value
 * @param  {string} preTag?
 * @param  {string} postTag?
 * @param  {string} ellipsis?
 * @returns {string}
 */
function resolveSnippetValue(
  value: string,
  preTag?: string,
  postTag?: string,
  ellipsis?: string
): { value: string } {
  let newValue = value

  // Manage ellpsis on cropped values until this feature is implemented https://roadmap.meilisearch.com/c/69-policy-for-cropped-values?utm_medium=social&utm_source=portal_share in MeiliSearch
  if (newValue && ellipsis !== undefined && isString(newValue)) {
    if (
      newValue[0] === newValue[0].toLowerCase() && // beginning of a sentence
      newValue.startsWith('<em>') === false // beginning of the document field, otherwise MeiliSearch would crop around the highlight
    ) {
      newValue = `${ellipsis}${newValue}`
    }
    if (!!newValue.match(/[.!?]$/) === false) {
      // end of the sentence
      newValue = `${newValue}${ellipsis}`
    }
  }
  return resolveHighlightValue(newValue, preTag, postTag)
}

/**
 * @param  {Record<string} hit
 * @param  {readonlystring[]|undefined} attributes
 * @param  {string|undefined} ellipsis
 * @param  {string|undefined} preTag
 * @param  {string|undefined} postTage
 */
function adaptSnippet(
  hit: Record<string, any>,
  attributes: readonly string[] | undefined,
  ellipsis: string | undefined,
  pretag: string | undefined,
  postTag: string | undefined
) {
  if (attributes === undefined) {
    return null
  }
  attributes = attributes.map((attribute) => attribute.split(':')[0]) as any[]
  const snippetAll = attributes.includes('*')

  // hit is the `_formatted` object returned by MeiliSearch.
  // It contains all the highlighted and croped attributes

  return (Object.keys(hit) as any[]).reduce((result, key) => {
    if (snippetAll || attributes?.includes(key)) {
      const value = hit[key]
      if (Array.isArray(value)) {
        // Array
        result[key] = value.map((elem) =>
          resolveSnippetValue(elem, pretag, postTag, ellipsis)
        )
      } else {
        result[key] = resolveSnippetValue(value, pretag, postTag, ellipsis)
      }
    }
    return result
  }, {} as any)
}

/**
 * Adapt MeiliSearch formating to formating compliant with instantsearch.js.
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

  if (!hit || hit.length) return {}
  const highlightedHit = {
    _highlightResult: adaptHighlight(hit, preTag, postTag),
    _snippetResult: adaptSnippet(
      hit,
      attributesToSnippet,
      ellipsis,
      preTag,
      postTag
    ),
  }
  return highlightedHit
}
