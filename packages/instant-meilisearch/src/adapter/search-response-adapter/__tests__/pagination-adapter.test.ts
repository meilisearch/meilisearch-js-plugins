import { adaptPaginationParameters } from '../pagination-adapter'
import { ceiledDivision } from './../__tests__/assets/number'

const numberPagesTestParameters = [
  {
    hitsPerPage: 0,
    hitsLength: 100,
    numberPages: 0,
    page: 0,
  },
  {
    hitsPerPage: 1,
    hitsLength: 100,
    numberPages: 100,
    page: 1,
  },
  {
    hitsPerPage: 20,
    hitsLength: 24,
    numberPages: 2,
    page: 1,
  },
  {
    hitsPerPage: 20,
    hitsLength: 0,
    numberPages: 0,
    page: 1,
  },
  {
    hitsPerPage: 0,
    hitsLength: 0,
    numberPages: 0,
    page: 1,
  },
  // Not an Algolia behavior. Algolia returns an error:
  // "Value too small for \"hitsPerPage\" parameter, expected integer between 0 and 9223372036854775807",
  {
    hitsPerPage: 1.5,
    hitsLength: 20,
    numberPages: 14,
  },
]

const finitePaginateHitsTestsParameters = [
  // Empty hits
  {
    searchResponse: {
      hits: [],
      page: 0,
      hitsPerPage: 20,
      totalPages: 0,
    },
    adaptedPagination: {
      page: 0,
      hitsPerPage: 20,
      nbPages: 0,
    },
  },
  {
    searchResponse: { hits: [], page: 100, hitsPerPage: 0, totalPages: 0 },
    adaptedPagination: {
      page: 100,
      hitsPerPage: 0,
      nbPages: 0,
    },
  },
  {
    searchResponse: { hits: [], page: 100, hitsPerPage: 20, totalPages: 0 },
    adaptedPagination: {
      page: 100,
      hitsPerPage: 20,
      nbPages: 0,
    },
  },

  // Page 0
  {
    searchResponse: {
      hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
      page: 0,
      hitsPerPage: 20,
      totalPages: 1,
    },
    adaptedPagination: {
      page: 0,
      hitsPerPage: 20,
      nbPages: 1,
    },
  },
  {
    searchResponse: {
      hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
      page: 0,
      hitsPerPage: 0,
      totalPages: 0,
    },
    adaptedPagination: {
      page: 0,
      hitsPerPage: 0,
      nbPages: 0,
    },
  },
  {
    searchResponse: {
      hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
      page: 0,
      hitsPerPage: 20,
      totalPages: 1,
    },
    adaptedPagination: {
      page: 0,
      hitsPerPage: 20,
      nbPages: 1,
    },
  },
  {
    searchResponse: {
      hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
      page: 0,
      hitsPerPage: 2,
      totalPages: 2,
    },
    adaptedPagination: {
      page: 0,
      hitsPerPage: 2,
      nbPages: 2,
    },
  },

  // Page 1
  {
    searchResponse: {
      hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
      page: 1,
      hitsPerPage: 2,
      totalPages: 2,
    },
    adaptedPagination: {
      page: 1,
      hitsPerPage: 2,
      nbPages: 2,
    },
  },
  {
    searchResponse: {
      hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
      page: 1,
      hitsPerPage: 20,
      totalPages: 1,
    },
    adaptedPagination: {
      page: 1,
      hitsPerPage: 20,
      nbPages: 1,
    },
  },
  {
    searchResponse: {
      hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
      page: 1,
      hitsPerPage: 0,
      totalPages: 0,
    },
    adaptedPagination: {
      page: 1,
      hitsPerPage: 0,
      nbPages: 0,
    },
  },

  // Page 2
  {
    searchResponse: {
      hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
      page: 2,
      hitsPerPage: 20,
      totalPages: 1,
    },
    adaptedPagination: {
      page: 2,
      hitsPerPage: 20,
      nbPages: 1,
    },
  },
  {
    searchResponse: {
      hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
      page: 2,
      hitsPerPage: 20,
      totalPages: 1,
    },
    adaptedPagination: {
      hitsPerPage: 20,
      nbPages: 1,
      page: 2,
    },
  },
  {
    searchResponse: {
      hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
      page: 2,
      hitsPerPage: 0,
      totalPages: 0,
    },
    adaptedPagination: {
      page: 2,
      nbPages: 0,
      hitsPerPage: 0,
    },
  },
]

const lazyPaginateHitsTestsParameters = [
  // Empty hits
  {
    searchResponse: {
      hits: [],
      limit: 21,
      offset: 0,
    },
    paginationState: {
      hitsPerPage: 20,
      page: 0,
    },
    adaptedPagination: {
      page: 0,
      hitsPerPage: 20,
      nbPages: 1,
    },
  },
  {
    searchResponse: { hits: [], limit: 0, offset: 0 },
    paginationState: {
      page: 100,
      hitsPerPage: 0,
    },
    adaptedPagination: {
      page: 100,
      hitsPerPage: 0,
      nbPages: 0,
    },
  },
  {
    searchResponse: { hits: [], limit: 21, offset: 0 },
    paginationState: {
      page: 100,
      hitsPerPage: 20,
    },
    adaptedPagination: {
      page: 100,
      hitsPerPage: 20,
      nbPages: 1,
    },
  },

  // // Page 0
  {
    searchResponse: {
      hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
      limit: 21,
      offset: 0,
    },
    paginationState: {
      page: 0,
      hitsPerPage: 20,
    },
    adaptedPagination: {
      page: 0,
      hitsPerPage: 20,
      nbPages: 1,
    },
  },
  {
    searchResponse: {
      hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
      limit: 0,
      offset: 0,
    },
    paginationState: {
      page: 0,
      hitsPerPage: 0,
    },
    adaptedPagination: {
      page: 0,
      hitsPerPage: 0,
      nbPages: 0,
    },
  },
  {
    searchResponse: {
      hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
      limit: 21,
      offset: 0,
    },
    paginationState: {
      page: 0,
      hitsPerPage: 20,
    },
    adaptedPagination: {
      page: 0,
      hitsPerPage: 20,
      nbPages: 1,
    },
  },
  {
    searchResponse: {
      hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
      limit: 3,
      offset: 0,
    },
    paginationState: {
      page: 0,
      hitsPerPage: 2,
    },
    adaptedPagination: {
      page: 0,
      hitsPerPage: 2,
      nbPages: 2,
    },
  },

  // // Page 1
  {
    searchResponse: {
      hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
      limit: 2,
      offset: 1,
    },
    paginationState: {
      page: 1,
      hitsPerPage: 1,
    },
    adaptedPagination: {
      page: 1,
      hitsPerPage: 1,
      nbPages: 3,
    },
  },
  {
    searchResponse: {
      hits: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
      limit: 3,
      offset: 2,
    },
    paginationState: {
      page: 1,
      hitsPerPage: 2,
    },
    adaptedPagination: {
      page: 1,
      hitsPerPage: 2,
      nbPages: 3,
    },
  },

  // Page 2
  {
    searchResponse: {
      hits: [{ id: 3 }],
      limit: 2,
      offset: 2,
    },
    paginationState: {
      page: 2,
      hitsPerPage: 1,
    },
    adaptedPagination: {
      page: 2,
      hitsPerPage: 1,
      nbPages: 3,
    },
  },
]

describe.each(numberPagesTestParameters)(
  'Get Number Pages tests',
  ({ hitsPerPage, hitsLength, numberPages }) => {
    it(`Should return ${numberPages} pages when hitsPerPage is ${hitsPerPage} and hits length is ${hitsLength}`, () => {
      const response = ceiledDivision(hitsLength, hitsPerPage)
      expect(response).toBe(numberPages)
    })
  }
)

describe.each(finitePaginateHitsTestsParameters)(
  'Finite paginate hits tests',
  ({
    searchResponse: { hits, page, hitsPerPage, totalPages },
    adaptedPagination,
  }) => {
    it(`should return ${JSON.stringify(
      adaptedPagination
    )} when hitsPerPage is ${hitsPerPage}, number of page is ${page} and when hits is ${JSON.stringify(
      hits
    )}`, () => {
      const response = adaptPaginationParameters(
        {
          hits,
          page,
          hitsPerPage,
          processingTimeMs: 0,
          query: '',
          totalPages,
          indexUid: '',
        },
        { hitsPerPage, page, finite: true }
      )

      expect(response).toEqual(adaptedPagination)
    })
  }
)

describe.each(lazyPaginateHitsTestsParameters)(
  'Lazy paginate hits tests',
  ({
    searchResponse: { hits, limit, offset },
    paginationState: { page, hitsPerPage },
    adaptedPagination,
  }) => {
    it(`should return ${JSON.stringify(
      adaptedPagination
    )} where limit is ${limit} in the response and where the instantsearch pagination context is page: ${page} and hitsPerPage: ${hitsPerPage}`, () => {
      const response = adaptPaginationParameters(
        { hits, limit, offset, processingTimeMs: 0, query: '', indexUid: '' },
        { hitsPerPage, page, finite: false }
      )

      expect(response).toEqual(adaptedPagination)
    })
  }
)

it('Should throw when hitsPerPage is negative', () => {
  try {
    const hits: Array<Record<string, any>> = []
    const hitsPerPage = -1
    const page = 0
    adaptPaginationParameters(
      {
        hits,
        page: page + 1,
        hitsPerPage,
        processingTimeMs: 0,
        query: '',
        indexUid: '',
      },
      { hitsPerPage, page, finite: true }
    )
  } catch (e: any) {
    expect(e.message).toBe(
      'Value too small for "hitsPerPage" parameter, expected integer between 0 and 9223372036854775807'
    )
    expect(e.name).toBe('TypeError')
  }
})
