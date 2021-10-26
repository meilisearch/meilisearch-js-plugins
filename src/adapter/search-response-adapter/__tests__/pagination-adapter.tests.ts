import { adaptPagination } from '../pagination-adapter'
import { ceiledDivision } from '../../../utils'

const numberPagesTestParameters = [
  {
    hitsPerPage: 0,
    hitsLength: 100,
    numberPages: 0,
  },
  {
    hitsPerPage: 1,
    hitsLength: 100,
    numberPages: 100,
  },
  {
    hitsPerPage: 20,
    hitsLength: 24,
    numberPages: 2,
  },
  {
    hitsPerPage: 20,
    hitsLength: 0,
    numberPages: 0,
  },
  {
    hitsPerPage: 0,
    hitsLength: 0,
    numberPages: 0,
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
    returnedHits: [],
  },
  {
    hits: [],
    page: 100,
    hitsPerPage: 0,
    returnedHits: [],
  },
  {
    hits: [],
    page: 100,
    hitsPerPage: 20,
    returnedHits: [],
  },

  // Page 0
  {
    hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
    page: 0,
    hitsPerPage: 20,
    returnedHits: [{ id: 1 }, { id: 2 }, { id: 3 }],
  },
  {
    hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
    page: 0,
    hitsPerPage: 0,
    returnedHits: [],
  },
  {
    hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
    page: 0,
    hitsPerPage: 20,
    returnedHits: [{ id: 1 }, { id: 2 }, { id: 3 }],
  },
  {
    hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
    page: 0,
    hitsPerPage: 2,
    returnedHits: [{ id: 1 }, { id: 2 }],
  },

  // Page 1
  {
    hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
    page: 1,
    hitsPerPage: 2,
    returnedHits: [{ id: 3 }],
  },
  {
    hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
    page: 1,
    hitsPerPage: 20,
    returnedHits: [],
  },
  {
    hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
    page: 1,
    hitsPerPage: 0,
    returnedHits: [],
  },

  // Page 2
  {
    hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
    page: 2,
    hitsPerPage: 20,
    returnedHits: [],
  },
  {
    hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
    page: 2,
    hitsPerPage: 20,
    returnedHits: [],
  },
  {
    hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
    page: 2,
    hitsPerPage: 0,
    returnedHits: [],
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
  ({ hits, page, hitsPerPage, returnedHits }) => {
    it(`Should return ${JSON.stringify(
      returnedHits
    )} when hitsPerPage is ${hitsPerPage}, number of page is ${page} and when hits is ${JSON.stringify(
      hits
    )}`, () => {
      const response = adaptPagination(hits, page, hitsPerPage)
      expect(response).toEqual(returnedHits)
    })
  }
)

it('Should throw when hitsPerPage is negative', () => {
  try {
    const hits: string[] = []
    const hitsPerPage = -1
    const page = 0
    adaptPagination(hits, page, hitsPerPage)
  } catch (e: any) {
    expect(e.message).toBe(
      'Value too small for "hitsPerPage" parameter, expected integer between 0 and 9223372036854775807'
    )
    expect(e.name).toBe('TypeError')
  }
})
