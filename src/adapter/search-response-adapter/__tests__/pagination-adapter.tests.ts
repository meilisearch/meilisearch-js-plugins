import { adaptPaginationContext } from '../pagination-adapter'
import { ceiledDivision } from '../../../utils'

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

const paginateHitsTestsParameters = [
  // Empty hits
  {
    hits: [],
    page: 0,
    hitsPerPage: 20,
    returnedPagination: {
      page: 0,
      hitsPerPage: 20,
      nbPages: 0,
    },
  },
  {
    hits: [],
    page: 100,
    hitsPerPage: 0,
    returnedPagination: {
      page: 100,
      hitsPerPage: 0,
      nbPages: 0,
    },
  },
  {
    hits: [],
    page: 100,
    hitsPerPage: 20,
    returnedPagination: {
      page: 100,
      hitsPerPage: 20,
      nbPages: 0,
    },
  },

  // Page 0
  {
    hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
    page: 0,
    hitsPerPage: 20,
    returnedPagination: {
      page: 0,
      hitsPerPage: 20,
      nbPages: 1,
    },
  },
  {
    hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
    page: 0,
    hitsPerPage: 0,
    returnedPagination: {
      page: 0,
      hitsPerPage: 0,
      nbPages: 0,
    },
  },
  {
    hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
    page: 0,
    hitsPerPage: 20,
    returnedPagination: {
      page: 0,
      hitsPerPage: 20,
      nbPages: 1,
    },
  },
  {
    hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
    page: 0,
    hitsPerPage: 2,
    returnedPagination: {
      page: 0,
      hitsPerPage: 2,
      nbPages: 2,
    },
  },

  // Page 1
  {
    hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
    page: 1,
    hitsPerPage: 2,
    returnedPagination: {
      page: 1,
      hitsPerPage: 2,
      nbPages: 2,
    },
  },
  {
    hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
    page: 1,
    hitsPerPage: 20,
    returnedPagination: {
      page: 1,
      hitsPerPage: 20,
      nbPages: 1,
    },
  },
  {
    hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
    page: 1,
    hitsPerPage: 0,
    returnedPagination: {
      page: 1,
      hitsPerPage: 0,
      nbPages: 0,
    },
  },

  // Page 2
  {
    hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
    page: 2,
    hitsPerPage: 20,
    returnedPagination: {
      page: 2,
      hitsPerPage: 20,
      nbPages: 1,
    },
  },
  {
    hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
    page: 2,
    hitsPerPage: 20,
    returnedPagination: {
      hitsPerPage: 20,
      nbPages: 1,
      page: 2,
    },
  },
  {
    hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
    page: 2,
    hitsPerPage: 0,
    returnedPagination: {
      page: 2,
      nbPages: 0,
      hitsPerPage: 0,
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

describe.each(paginateHitsTestsParameters)(
  'Paginate hits tests',
  ({ hits, page, hitsPerPage, returnedPagination }) => {
    it(`Should return ${JSON.stringify(
      returnedPagination
    )} when hitsPerPage is ${hitsPerPage}, number of page is ${page} and when hits is ${JSON.stringify(
      hits
    )}`, () => {
      const response = adaptPaginationContext(
        { hits, page: page + 1, hitsPerPage, processingTimeMs: 0, query: '' },
        { hitsPerPage, page }
      )
      expect(response).toEqual(returnedPagination)
    })
  }
)

describe.each(paginateHitsTestsParameters)(
  'Paginate hits tests',
  ({ hits, page, hitsPerPage, returnedPagination }) => {
    it(`Should return ${JSON.stringify(
      returnedPagination
    )} when hitsPerPage is ${hitsPerPage}, number of page is ${page} and when hits is ${JSON.stringify(
      hits
    )} but there is no page and hitsPerPage fields returned by Meilisearch`, () => {
      const response = adaptPaginationContext(
        { hits, processingTimeMs: 0, query: '' },
        { hitsPerPage, page }
      )
      expect(response).toEqual(returnedPagination)
    })
  }
)

it('Should throw when hitsPerPage is negative', () => {
  try {
    const hits: Array<Record<string, any>> = []
    const hitsPerPage = -1
    const page = 0
    adaptPaginationContext(
      { hits, page: page + 1, hitsPerPage, processingTimeMs: 0, query: '' },
      { hitsPerPage, page }
    )
  } catch (e: any) {
    expect(e.message).toBe(
      'Value too small for "hitsPerPage" parameter, expected integer between 0 and 9223372036854775807'
    )
    expect(e.name).toBe('TypeError')
  }
})
