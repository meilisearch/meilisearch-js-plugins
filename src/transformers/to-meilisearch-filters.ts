import { MergeFiltersAndNumericFilters } from '../types'

const mergeFiltersAndNumericFilters: MergeFiltersAndNumericFilters = (
  filters,
  numericFilters
) => {
  const trimFilters = filters ? filters.trim() : ''
  const enClosedFilter = trimFilters ? `(${trimFilters})` : ''
  const joinedNumericFilters = numericFilters
    ? numericFilters
        .map((filter) => filter.trim())
        .filter((x) => x)
        .join(' AND ')
    : ''

  const filter = [joinedNumericFilters, enClosedFilter]
    .filter((x) => x)
    .join(' AND ')
    .trim()
  return filter
}

export { mergeFiltersAndNumericFilters }
