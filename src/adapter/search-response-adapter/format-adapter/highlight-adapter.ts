import { isString } from '../../../utils'
/**
 * Replace `em` tags in highlighted MeiliSearch hits to
 * provided tags by instantsearch.js.
 *
 * @param  {string} value
 * @param  {string} highlightPreTag?
 * @param  {string} highlightPostTag?
 * @returns {string}
 */
function replaceDefaultEMTag(
  value: any,
  preTag = '__ais-highlight__',
  postTag = '__/ais-highlight__'
): string {
  // Highlight is applied by MeiliSearch (<em> tags)
  // We replace the <em> by the expected tag for InstantSearch
  const stringifiedValue = isString(value) ? value : JSON.stringify(value)

  return stringifiedValue.replace(/<em>/g, preTag).replace(/<\/em>/g, postTag)
}

function addHighlightTags(
  value: any,
  preTag?: string,
  postTag?: string
): string {
  if (typeof value === 'string') {
    // String
    return replaceDefaultEMTag(value, preTag, postTag)
  } else if (value === undefined) {
    // undefined
    return JSON.stringify(null)
  } else {
    // Other
    return JSON.stringify(value)
  }
}

export function resolveHighlightValue(
  value: any,
  preTag?: string,
  postTag?: string
): { value: string } | Array<{ value: string }> {
  if (Array.isArray(value)) {
    // Array
    return value.map((elem) => ({
      value: addHighlightTags(elem, preTag, postTag),
    }))
  } else {
    return { value: addHighlightTags(value, preTag, postTag) }
  }
}

/**
 * @param  {Record<string} formattedHit
 * @param  {string} highlightPreTag?
 * @param  {string} highlightPostTag?
 * @returns {Record}
 */
export function adaptHighlight(
  hit: Record<string, any>,
  preTag?: string,
  postTag?: string
): Record<string, any> {
  // hit is the `_formatted` object returned by MeiliSearch.
  // It contains all the highlighted and croped attributes

  if (!hit._formatted) return hit._formatted
  return Object.keys(hit._formatted).reduce((result, key) => {
    const value = hit._formatted[key]

    result[key] = resolveHighlightValue(value, preTag, postTag)
    return result
  }, {} as any)
}
