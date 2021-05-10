import { mergeFiltersAndNumericFilters } from '../'

const filtersTestsParameters = [
  {
    filters: '',
    numericFilters: [],
    returnFilter: '',
  },
  {
    filters: 'hello = hello',
    numericFilters: [],
    returnFilter: '(hello = hello)',
  },
  {
    filters: '(hello = hello AND (hello1 = hello1 OR hello2 = hello2))',
    numericFilters: [],
    returnFilter: '((hello = hello AND (hello1 = hello1 OR hello2 = hello2)))',
  },
  {
    filters: '(hello = hello AND (hello1 = hello1 OR hello2 = hello2))',
    numericFilters: [],
    returnFilter: '((hello = hello AND (hello1 = hello1 OR hello2 = hello2)))',
  },
  {
    filters: '',
    numericFilters: [' 1 < hello ', ' hello < 2 '],
    returnFilter: '1 < hello AND hello < 2',
  },
  {
    filters: ' ',
    numericFilters: [' ', ' '],
    returnFilter: '',
  },
  {
    filters: 'hello = hello AND hello1 = hello1',
    numericFilters: [' 1 < hello ', ' hello < 2 '],
    returnFilter:
      '1 < hello AND hello < 2 AND (hello = hello AND hello1 = hello1)',
  },
]

describe.each(filtersTestsParameters)(
  'Filter tests',
  ({ filters, numericFilters, returnFilter }) => {
    it(`Should return ${returnFilter} pages when filter is ${filters} and Numeric Filters is ${JSON.stringify(
      numericFilters
    )}`, () => {
      const response = mergeFiltersAndNumericFilters(filters, numericFilters)
      expect(response).toBe(returnFilter)
    })
  }
)
