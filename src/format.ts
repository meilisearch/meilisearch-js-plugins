import { ISSearchParams } from './types'
import { isString } from './utils'

function replaceHighlightTags(
  value: string,
  highlightPreTag?: string,
  highlightPostTag?: string
): string {
  // Value has to be a string to have highlight.
  // Highlight is applied by MeiliSearch (<em> tags)
  // We replace the <em> by the expected tag for InstantSearch
  highlightPreTag = highlightPreTag || '__ais-highlight__'
  highlightPostTag = highlightPostTag || '__/ais-highlight__'
  if (isString(value)) {
    return value
      .replace(/<em>/g, highlightPreTag)
      .replace(/<\/em>/g, highlightPostTag)
  }
  // We JSON stringify to avoid loss of nested information
  return JSON.stringify(value)
}

function createHighlighResult<T extends Record<string, any>>({
  formattedHit,
  highlightPreTag,
  highlightPostTag,
}: { formattedHit: T } & ISSearchParams) {
  // formattedHit is the `_formatted` object returned by MeiliSearch.
  // It contains all the highlighted and croped attributes
  return Object.keys(formattedHit).reduce((result, key) => {
    ;(result[key] as any) = {
      value: replaceHighlightTags(
        formattedHit[key],
        highlightPreTag,
        highlightPostTag
      ),
    }
    return result
  }, {} as T)
}

function snippetFinalValue(
  value: string,
  snippetEllipsisText?: string,
  highlightPreTag?: string,
  highlightPostTag?: string
) {
  let newValue = value
  // manage a kind of `...` for the crop until this issue is solved: https://github.com/meilisearch/MeiliSearch/issues/923
  // `...` is put if we are at the middle of a sentence (instead at the middle of the document field)
  if (snippetEllipsisText !== undefined && isString(newValue)) {
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

function createSnippetResult<
  T extends Record<string, any>,
  K extends keyof T & string
>({
  formattedHit,
  attributesToSnippet,
  snippetEllipsisText,
  highlightPreTag,
  highlightPostTag,
}: { formattedHit: T } & ISSearchParams) {
  if (attributesToSnippet === undefined) {
    return null
  }
  attributesToSnippet = attributesToSnippet.map(
    (attribute) => attribute.split(':')[0]
  ) as K[]
  // formattedHit is the `_formatted` object returned by MeiliSearch.
  // It contains all the highlighted and croped attributes
  return (Object.keys(formattedHit) as K[]).reduce((result, key) => {
    if (attributesToSnippet!.includes(key)) {
      ;(result[key] as any) = {
        value: snippetFinalValue(
          formattedHit[key],
          snippetEllipsisText,
          highlightPreTag,
          highlightPostTag
        ),
      }
    }
    return result
  }, {} as T)
}

export { createHighlighResult, createSnippetResult }
