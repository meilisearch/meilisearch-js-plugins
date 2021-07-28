import { addMissingFacetZeroFields } from '../'

const FacetsDistributionTestData = [
  {
    title: 'One field in cache present in distribution',
    cache: {
      genre: ['comedy'],
    },
    facetsDistribution: {
      genre: {
        comedy: 1,
      },
    },
    expectedDistribution: {
      genre: {
        comedy: 1,
      },
    },
  },
  {
    title: 'One field in cache not present in distribution',
    cache: {
      genre: ['comedy'],
    },
    facetsDistribution: {},
    expectedDistribution: {
      genre: {
        comedy: 0,
      },
    },
  },
  {
    title: 'two field in cache only one present in distribution',
    cache: {
      genre: ['comedy'],
      title: ['hamlet'],
    },
    facetsDistribution: {
      genre: {
        comedy: 12,
      },
    },
    expectedDistribution: {
      genre: {
        comedy: 12,
      },
      title: {
        hamlet: 0,
      },
    },
  },
  {
    title:
      'two field in cache w/ different facet name none present in distribution',
    cache: {
      genre: ['comedy'],
      title: ['hamlet'],
    },
    facetsDistribution: {},
    expectedDistribution: {
      genre: {
        comedy: 0,
      },
      title: {
        hamlet: 0,
      },
    },
  },
  {
    title:
      'two field in cache w/ different facet name both present in distribution',
    cache: {
      genre: ['comedy'],
      title: ['hamlet'],
    },
    facetsDistribution: {
      genre: {
        comedy: 12,
      },
      title: {
        hamlet: 1,
      },
    },
    expectedDistribution: {
      genre: {
        comedy: 12,
      },
      title: {
        hamlet: 1,
      },
    },
  },
  {
    title:
      'Three field in cache w/ different facet name two present in distribution',
    cache: {
      genre: ['comedy', 'horror'],
      title: ['hamlet'],
    },
    facetsDistribution: {
      genre: {
        comedy: 12,
      },
      title: {
        hamlet: 1,
      },
    },
    expectedDistribution: {
      genre: {
        comedy: 12,
        horror: 0,
      },
      title: {
        hamlet: 1,
      },
    },
  },
  {
    title: 'Cache is undefined and facets distribution is not',
    cache: undefined,
    facetsDistribution: {
      genre: {
        comedy: 12,
      },
    },
    expectedDistribution: {
      genre: {
        comedy: 12,
      },
    },
  },
  {
    title: 'Cache is empty object and facets distribution is not',
    cache: {},
    facetsDistribution: {
      genre: {
        comedy: 12,
      },
    },
    expectedDistribution: {
      genre: {
        comedy: 12,
      },
    },
  },
  {
    title: 'Cache is empty object and facets distribution empty object',
    cache: {},
    facetsDistribution: {},
    expectedDistribution: {},
  },
  {
    title: 'Cache is undefined and facets distribution empty object',
    cache: undefined,
    facetsDistribution: {},
    expectedDistribution: {},
  },
  {
    title: 'Cache is undefined and facets distribution is undefined',
    cache: undefined,
    facetsDistribution: undefined,
    expectedDistribution: {},
  },
]

describe.each(FacetsDistributionTestData)(
  'Facet cache tests',
  ({ cache, facetsDistribution, expectedDistribution, title }) => {
    it(title, () => {
      const returnedDistribution = addMissingFacetZeroFields(
        cache,
        facetsDistribution
      )
      expect(returnedDistribution).toMatchObject(expectedDistribution)
    })
  }
)
