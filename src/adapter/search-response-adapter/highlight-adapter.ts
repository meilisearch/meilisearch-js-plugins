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
  highlightPreTag?: string,
  highlightPostTag?: string
): string {
  highlightPreTag = highlightPreTag || '__ais-highlight__'
  highlightPostTag = highlightPostTag || '__/ais-highlight__'
  // Highlight is applied by MeiliSearch (<em> tags)
  // We replace the <em> by the expected tag for InstantSearch
  const stringifiedValue = isString(value) ? value : JSON.stringify(value)

  return stringifiedValue
    .replace(/<em>/g, highlightPreTag)
    .replace(/<\/em>/g, highlightPostTag)
}

/**
 * @param  {Record<string} formattedHit
 * @param  {string} highlightPreTag?
 * @param  {string} highlightPostTag?
 * @returns {Record}
 */
function adaptHighlight(
  formattedHit: Record<string, any>,
  highlightPreTag?: string,
  highlightPostTag?: string
): Record<string, any> {
  // formattedHit is the `_formatted` object returned by MeiliSearch.
  // It contains all the highlighted and croped attributes
  const toHighlightMatch = (value: any) => ({
    value: replaceHighlightTags(value, highlightPreTag, highlightPostTag),
  })
  return Object.keys(formattedHit).reduce((result, key) => {
    const value = formattedHit[key]
    if (Array.isArray(value)) {
      result[key] = value.map((val) => ({
        value: typeof val === 'object' ? JSON.stringify(val) : val,
      }))
    } else if (typeof value === 'object' && value !== null) {
      result[key] = { value: JSON.stringify(value) }
    } else {
      result[key] = toHighlightMatch(value)
    }
    return result
  }, {} as any)
}

/**
 * @param  {string} value
 * @param  {string} snippetEllipsisText?
 * @param  {string} highlightPreTag?
 * @param  {string} highlightPostTag?
 * @returns {string}
 */
function snippetValue(
  value: string,
  snippetEllipsisText?: string,
  highlightPreTag?: string,
  highlightPostTag?: string
): string {
  let newValue = value
  // manage a kind of `...` for the crop until this feature is implemented https://roadmap.meilisearch.com/c/69-policy-for-cropped-values?utm_medium=social&utm_source=portal_share
  // `...` is put if we are at the middle of a sentence (instead at the middle of the document field)
  if (snippetEllipsisText !== undefined && isString(newValue) && newValue) {
    if (
      newValue[0] === newValue[0].toLowerCase() && // beginning of a sentence
      newValue.startsWith('<em>') === false // beginning of the document field, otherwise MeiliSearch would crop around the highligh
    ) {
      newValue = `${snippetEllipsisText}${newValue}`
    }
    if (!!newValue.match(/[.!?]$/) === false) {
      // end of the sentence
      newValue = `${newValue}${snippetEllipsisText}`
    }
  }
  return replaceHighlightTags(newValue, highlightPreTag, highlightPostTag)
}

/**
 * @param  {Record<string} formattedHit
 * @param  {readonlystring[]|undefined} attributesToSnippet
 * @param  {string|undefined} snippetEllipsisText
 * @param  {string|undefined} highlightPreTag
 * @param  {string|undefined} highlightPostTag
 */
function adaptSnippet(
  formattedHit: Record<string, any>,
  attributesToSnippet: readonly string[] | undefined,
  snippetEllipsisText: string | undefined,
  highlightPreTag: string | undefined,
  highlightPostTag: string | undefined
) {
  if (attributesToSnippet === undefined) {
    return null
  }
  attributesToSnippet = attributesToSnippet.map(
    (attribute) => attribute.split(':')[0]
  ) as any[]
  const snippetAll = attributesToSnippet.includes('*')
  // formattedHit is the `_formatted` object returned by MeiliSearch.
  // It contains all the highlighted and croped attributes
  const toSnippetMatch = (value: any) => ({
    value: snippetValue(
      value,
      snippetEllipsisText,
      highlightPreTag,
      highlightPostTag
    ),
  })
  return (Object.keys(formattedHit) as any[]).reduce((result, key) => {
    if (snippetAll || attributesToSnippet?.includes(key)) {
      const value = formattedHit[key]
      result[key] = Array.isArray(value)
        ? value.map(toSnippetMatch)
        : toSnippetMatch(value)
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
  formattedHit: Record<string, any>,
  searchContext: SearchContext
): Record<string, any> {
  const attributesToSnippet = searchContext?.attributesToSnippet
  const snippetEllipsisText = searchContext?.snippetEllipsisText
  const highlightPreTag = searchContext?.highlightPreTag
  const highlightPostTag = searchContext?.highlightPostTag

  if (!formattedHit || formattedHit.length) return {}
  return {
    _highlightResult: adaptHighlight(
      formattedHit,
      highlightPreTag,
      highlightPostTag
    ),
    _snippetResult: adaptSnippet(
      formattedHit,
      attributesToSnippet,
      snippetEllipsisText,
      highlightPreTag,
      highlightPostTag
    ),
  }
}
