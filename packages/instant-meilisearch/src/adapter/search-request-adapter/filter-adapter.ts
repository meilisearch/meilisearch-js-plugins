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
  // TODO: What if escape facet values is enabled?
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
 * Can return empty string or empty array, but not an array of empty strings
 * or empty arrays.
 *
 * @param  {(filter: string) => string} transformCallback
 * @param  {SearchContext['facetFilters']} filters
 * @returns {Filter}
 */
function transformFilters(
  transformCallback: (filter: string) => string,
  filters: NonNullable<SearchContext['facetFilters']>
): Filter {
  // Note on `Array.isArray`:
  // https://github.com/microsoft/TypeScript/issues/17002
  // Typescript has problems with readonly, which makes it undesirable in
  // most situations, the crux of the issue being that `Array.isArray`
  // will return true for mutable arrays as well as immutable ones. Since Instantsearch.js
  // decided to use readonly, we have to type cast, while keeping as much of the type
  // safety as possible.
  return typeof filters === 'string'
    ? transformCallback(filters)
    : filters
        .map((filter) =>
          (<(value: readonly any[] | any) => value is readonly any[]>(
            Array.isArray
          ))(filter)
            ? filter
                .map((nestedFilter) => transformCallback(nestedFilter))
                // TODO: Do these filters have any purpose? Can we actually get empty strings? Should we handle empty strings?
                //       Maybe handling these should be the responsibility of instantsearch.js and/or the user and their input.
                //       Instead of these empty filters quietly being swallowed, they might even get us an error message, and
                //       we might know something is wrong?
                .filter((elem) => elem !== '')
            : transformCallback(filter)
        )
        // works on strings too, as they're somewhat of an array
        .filter((elem) => elem.length !== 0)
}

/**
 * Return the filter in an array if it is a string
 * If filter is array, return without change.
 *
 * @param  {Filter} [filter]
 * @returns {Array|undefined}
 */
function nonEmptyFilterToArray(
  filter?: Filter
): Array<string | string[]> | undefined {
  return filter !== undefined && filter.length !== 0
    ? // Filter is a string
      typeof filter === 'string'
      ? [filter]
      : // Filter is either a one- or two-dimensional array of strings
        filter
    : undefined
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
  // TODO: If we are trimming this, shouldn't we trim the other ones too?
  const adaptedFilters = filters?.trim()
  const adaptedNumericFilters = nonEmptyFilterToArray(transformedNumericFilters)
  const adaptedFacetFilters = nonEmptyFilterToArray(transformedFacetFilters)

  const adaptedFilter: Filter = []

  if (adaptedFilters !== undefined && adaptedFilters !== '') {
    adaptedFilter.push(adaptedFilters)
  }

  if (adaptedNumericFilters !== undefined) {
    adaptedFilter.push(...adaptedNumericFilters)
  }

  if (adaptedFacetFilters !== undefined) {
    adaptedFilter.push(...adaptedFacetFilters)
  }

  return adaptedFilter
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
