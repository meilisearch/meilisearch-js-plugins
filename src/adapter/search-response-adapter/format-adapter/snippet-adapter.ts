import { isString } from '../../../utils'

function nakedOfTags(str: string) {
  return str.replace(/<em>/g, '').replace(/<\/em>/g, '')
}

function addEllipsis(value: any, formatValue: string, ellipsis: string): any {
  // Manage ellpsis on cropped values until this feature is implemented https://roadmap.meilisearch.com/c/69-policy-for-cropped-values?utm_medium=social&utm_source=portal_share in MeiliSearch

  let ellipsedValue = formatValue

  if (
    isString(formatValue) &&
    value.toString().length > nakedOfTags(formatValue).length
  ) {
    if (
      formatValue[0] === formatValue[0].toLowerCase() && // beginning of a sentence
      formatValue.startsWith('<em>') === false // beginning of the document field, otherwise MeiliSearch would crop around the highlight
    ) {
      ellipsedValue = `${ellipsis}${formatValue.trim()}`
    }
    if (!!formatValue.match(/[.!?]$/) === false) {
      // end of the sentence
      ellipsedValue = `${formatValue.trim()}${ellipsis}`
    }
  }
  return ellipsedValue
}

/**
 * @param  {string} value
 * @param  {string} ellipsis?
 * @returns {string}
 */
function resolveSnippet(value: any, formatValue: any, ellipsis?: string): any {
  if (!ellipsis || !(typeof formatValue === 'string')) {
    return formatValue
  } else if (Array.isArray(value)) {
    // Array
    return value.map((elem) => addEllipsis(elem, formatValue, ellipsis))
  }
  return addEllipsis(value, formatValue, ellipsis)
}

/**
 * @param  {Record<string} hit
 * @param  {readonlystring[]|undefined} attributes
 * @param  {string|undefined} ellipsis
 */
export function adaptSnippet(
  hit: Record<string, any>,
  attributes: readonly string[] | undefined,
  ellipsis: string | undefined
): Record<string, any> {
  // hit is the `_formatted` object returned by MeiliSearch.
  // It contains all the highlighted and croped attributes

  const formattedHit = hit._formatted
  const newHit = hit._formatted

  if (attributes === undefined) {
    return hit
  }

  // All attributes that should be snippeted and their snippet size
  const snippets = attributes.map(
    (attribute) => attribute.split(':')[0]
  ) as any[]

  // Find presence of a wildcard *
  const wildCard = snippets.includes('*')

  if (wildCard) {
    // In case of *
    for (const attribute in formattedHit) {
      newHit[attribute] = resolveSnippet(
        hit[attribute],
        formattedHit[attribute],
        ellipsis
      )
    }
  } else {
    // Itterate on all attributes that needs snippeting
    for (const attribute of snippets) {
      newHit[attribute] = resolveSnippet(
        hit[attribute],
        formattedHit[attribute],
        ellipsis
      )
    }
  }
  hit._formatted = newHit

  return hit
}
