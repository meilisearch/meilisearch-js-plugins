interface HighlightMetadata {
  value: string
  fullyHighlighted: boolean
  matchLevel: 'none' | 'partial' | 'full'
  matchedWords: string[]
}

/**
 * Calculate the highlight metadata for a given highlight value.
 * @param query - The query string.
 * @param preTag - The pre tag.
 * @param postTag - The post tag.
 * @param highlightValue - The highlight value response from Meilisearch.
 * @returns The highlight metadata.
 */
export function calculateHighlightMetadata(
  query: string,
  preTag: string,
  postTag: string,
  highlightValue: string
): HighlightMetadata {
  // Extract all highlighted segments
  const highlightRegex = new RegExp(`${preTag}(.*?)${postTag}`, 'g')
  const matches: string[] = []
  let match
  while ((match = highlightRegex.exec(highlightValue)) !== null) {
    matches.push(match[1])
  }

  // Remove highlight tags to get the highlighted text without the tags
  const cleanValue = highlightValue.replace(
    new RegExp(`${preTag}|${postTag}`, 'g'),
    ''
  )

  // Determine if the entire attribute is highlighted
  // fullyHighlighted = true if cleanValue and the concatenation of all matched segments are identical
  const highlightedText = matches.join('')
  const fullyHighlighted = cleanValue === highlightedText

  // Determine match level:
  // - 'none' if no matches
  // - 'partial' if some matches but not fully highlighted
  // - 'full' if the highlighted text is the entire field value content
  let matchLevel: 'none' | 'partial' | 'full' = 'none'
  if (matches.length > 0) {
    matchLevel = cleanValue.includes(query) ? 'full' : 'partial'
  }

  return {
    value: highlightValue,
    fullyHighlighted,
    matchLevel,
    matchedWords: matches,
  }
}
