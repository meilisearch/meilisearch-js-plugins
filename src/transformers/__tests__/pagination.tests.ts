import { getNumberPages, paginateHits } from '../'
import { defaultContext } from './utils'

const algoliaNumberPagesBehavior = [
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
  // Not an Algolia behavior. Algolia return an error:
  // "Value too small for \"hitsPerPage\" parameter, expected integer between 0 and 9223372036854775807",
  {
    hitsPerPage: -1,
    hitsLength: 20,
    numberPages: 0,
  },
  // Not an Algolia behavior. Algolia return an error:
  // "Value too small for \"hitsPerPage\" parameter, expected integer between 0 and 9223372036854775807",
  {
    hitsPerPage: 1.5,
    hitsLength: 20,
    numberPages: 14,
  },
]

const algoliaPaginateHitsBehavior = [
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
  // Wrong types
  // Not an Algolia behavior. Algolia return an error:
  // "Value too small for \"hitsPerPage\" parameter, expected integer between 0 and 9223372036854775807",
  {
    hits: [{ id: 1 }, { id: 2 }, { id: 3 }],
    page: 0,
    hitsPerPage: -1,
    returnedHits: [],
  },
]

describe.each(algoliaNumberPagesBehavior)(
  'Get Number Pages tests',
  ({ hitsPerPage, hitsLength, numberPages }) => {
    it(`Should return ${numberPages} pages when hitsPerPage is ${hitsPerPage} and hits length is ${hitsLength}`, () => {
      const response = getNumberPages(hitsLength, {
        ...defaultContext,
        hitsPerPage: hitsPerPage,
      })
      expect(response).toBe(numberPages)
    })
  }
)

describe.each(algoliaPaginateHitsBehavior)(
  'Paginate hits tests',
  ({ hits, page, hitsPerPage, returnedHits }) => {
    it(`Should return ${JSON.stringify(
      returnedHits
    )} when hitsPerPage is ${hitsPerPage}, number of page is ${page} and when hits is ${JSON.stringify(
      hits
    )}`, () => {
      const response = paginateHits(hits, {
        ...defaultContext,
        page,
        hitsPerPage,
      })
      expect(response).toEqual(returnedHits)
    })
  }
)
