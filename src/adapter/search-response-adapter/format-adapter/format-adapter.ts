import { isPureObject } from '../../../utils'

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
    return JSON.stringify(value)
  }
}

/**
 * Recursif function wrap the deepest possible value
 * the following way: { value: "xx" }.
 *
 * For example:
 *
 * {
 * "rootField": { "value": "x" }
 * "nestedField": { child: { value: "y" } }
 * }
 *
 * recursivity continues until the value is not an array or an object.
 *
 * @param  {any} value - value of a field
 *
 * @returns Record<string, any>
 */
function wrapValue(value: any): Record<string, any> {
  if (Array.isArray(value)) {
    // Array
    return value.map((elem) => wrapValue(elem))
  } else if (isPureObject(value)) {
    // Object
    return Object.keys(value).reduce<Record<string, any>>(
      (nested: Record<string, any>, key: string) => {
        nested[key] = wrapValue(value[key])

        return nested
      },
      {}
    )
  } else {
    return { value: stringifyValue(value) }
  }
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
  const _formattedResult = wrapValue(hit)

  const highlightedHit = {
    // We could not determine what the differences are between those two fields.
    _highlightResult: _formattedResult,
    _snippetResult: _formattedResult,
  }

  return highlightedHit
}
