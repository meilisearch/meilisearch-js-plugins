/**
 * Stringify values following instantsearch practices.
 *
 * @param  {any} value - value that needs to be stringified
 */
function stringifyValue(value: any) {
  if (typeof value === 'string') {
    // String
    return value
  } else if (value === undefined) {
    // undefined
    return JSON.stringify(null)
  } else {
    // Other
    return JSON.stringify(value)
  }
}

/**
 * Wrap formated values into a instantsearch compatible format.
 * value => { name: value }
 *
 * @param  {Record<string, any>} hit - Hit whose fields to adapt
 *
 * @returns {Record<string, any>} Hit
 */
function adaptValueFormat(hit: Record<string, any>): Record<string, any> {
  return Object.keys(hit).reduce((result, key) => {
    const value = hit[key]

    if (Array.isArray(value)) {
      // Array
      result[key] = value.map((elem) => ({
        value: stringifyValue(elem),
      }))
    } else {
      result[key] = { value: stringifyValue(value) }
    }

    return result
  }, {} as any)
}

/**
 * Adapt Meilisearch formatted fields to a format compliant to instantsearch.js.
 *
 * @param  {Record<string} formattedHit
 * @param  {SearchContext} searchContext
 * @returns {Record}
 */
export function adaptFormattedFields(
  hit: Record<string, any>
): Record<string, any> {
  if (!hit) return {}
  const _formattedResult = adaptValueFormat(hit)

  const highlightedHit = {
    // We could not determine what the differences are between those two fields.
    _highlightResult: _formattedResult,
    _snippetResult: _formattedResult,
  }

  return highlightedHit
}
