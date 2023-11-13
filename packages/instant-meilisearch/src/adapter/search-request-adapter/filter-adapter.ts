import type { Filter, SearchContext } from '../../types'

const filterEscapeRegExp = /([\\"])/g

function getValueWithEscapedBackslashesAndQuotes(value: string): string {
  return value.replace(filterEscapeRegExp, '\\$1')
}

/**
 * Transform InstantSearch [facet filter](https://www.algolia.com/doc/api-reference/api-parameters/facetFilters/)
 * to Meilisearch compatible filter format.
 * Change sign from `:` to `=`
 * "facet:facetValue" becomes "facet=facetValue"
 *
 * Wrap both the facet and its facet value between quotes.
 * This avoids formatting issues on facets containing multiple words.
 * Escape backslash \\ and quote " characters.
 *
 * 'My facet:My facet value' becomes '"My facet":"My facet value"'
 *
 * @param {string} filter
 * @returns {string}
 */
function transformFacetFilter(filter: string): string {
  const escapedFilter = getValueWithEscapedBackslashesAndQuotes(filter)
  const colonIndex = escapedFilter.indexOf(':')
  const attribute = escapedFilter.slice(0, colonIndex)
  const value = escapedFilter.slice(colonIndex + 1)
  return `"${attribute}"="${value}"`
}

// Matches first occurrence of an operator
const numericSplitRegExp = /(?<!(?:[<!>]?=|<|>|:).*)([<!>]?=|<|>|:)/

/**
 * Transform InstantSearch [numeric filter](https://www.algolia.com/doc/api-reference/api-parameters/numericFilters/)
 * to Meilisearch compatible filter format.
 *
 * 'price:5.99 TO 100' becomes '"price" 5.99 TO 100'
 *
 * 'price = 5.99' becomes '"price"=5.99'
 *
 * Wrap the attribute between quotes.
 * Escape backslash (\\) and quote (") characters.
 *
 * @param {string} filter
 * @returns {string}
 */
function transformNumericFilter(filter: string): string {
  // TODO: Warn users to not enable facet values escape for negative numbers.
  //       https://github.com/algolia/instantsearch/blob/da701529ed325bb7a1d782e80cb994711e20d94a/packages/instantsearch.js/src/lib/utils/escapeFacetValue.ts#L13-L21
  const [attribute, operator, value] = filter.split(numericSplitRegExp)
  const escapedAttribute = getValueWithEscapedBackslashesAndQuotes(attribute)
  return `"${escapedAttribute.trim()}"${
    operator === ':' ? ' ' : operator
  }${value.trim()}`
}

/**
 * Iterate over all filters.
 * Return the filters in a Meilisearch compatible format.
 *
 * @param  {(filter: string) => string} transformCallback
 * @param  {SearchContext['facetFilters']} filters
 * @returns {Filter}
 */
function transformFilters(
  transformCallback: (filter: string) => string,
  filters: NonNullable<SearchContext['facetFilters']>
): Filter {
  return typeof filters === 'string'
    ? transformCallback(filters)
    : filters.map((filter) =>
        typeof filter === 'string'
          ? transformCallback(filter)
          : filter.map((nestedFilter) => transformCallback(nestedFilter))
      )
}

/**
 * Return the filter in an array if it is a string
 * If filter is array, return without change.
 *
 * @param  {Filter} [filter]
 * @returns {Array|undefined}
 */
function filterToArray(filter?: Filter): Array<string | string[]> | undefined {
  return typeof filter === 'string' ? [filter] : filter
}

/**
 * Merge filters, transformedNumericFilters and transformedFacetFilters
 * together.
 *
 * @param  {string} filters
 * @param  {Filter} transformedNumericFilters
 * @param  {Filter} transformedFacetFilters
 * @returns {Filter}
 */
function mergeFilters(
  filters?: string,
  transformedNumericFilters?: Filter,
  transformedFacetFilters?: Filter
): Filter {
  const adaptedNumericFilters = filterToArray(transformedNumericFilters)
  const adaptedFacetFilters = filterToArray(transformedFacetFilters)

  const adaptedFilters: Filter = []

  if (filters !== undefined) {
    adaptedFilters.push(filters)
  }

  if (adaptedNumericFilters !== undefined) {
    adaptedFilters.push(...adaptedNumericFilters)
  }

  if (adaptedFacetFilters !== undefined) {
    adaptedFilters.push(...adaptedFacetFilters)
  }

  return adaptedFilters
}

/**
 * Adapt instantsearch.js filters to Meilisearch filters by
 * combining and transforming all provided filters.
 *
 * @param  {string|undefined} filters
 * @param  {SearchContext['numericFilters']} numericFilters
 * @param  {SearchContext['facetFilters']} facetFilters
 * @returns {Filter}
 */
export function adaptFilters(
  filters: string | undefined,
  numericFilters: SearchContext['numericFilters'],
  facetFilters: SearchContext['facetFilters']
): Filter {
  const transformedNumericFilters =
    numericFilters !== undefined
      ? transformFilters(transformNumericFilter, numericFilters)
      : numericFilters
  const transformedFacetFilters =
    facetFilters !== undefined
      ? transformFilters(transformFacetFilter, facetFilters)
      : facetFilters

  return mergeFilters(
    filters,
    transformedNumericFilters,
    transformedFacetFilters
  )
}
