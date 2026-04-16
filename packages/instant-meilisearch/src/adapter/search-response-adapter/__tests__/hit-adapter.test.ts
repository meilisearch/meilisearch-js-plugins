import { describe, test, expect } from 'vitest'
import { adaptHits } from '../hits-adapter.js'

const searchResponsePositionMatchesFalse = {
  indexUid: 'steam-video-games',
  hits: [
    {
      name: 'Half-Life: Opposing Force',
      description:
        'Return to the Black Mesa Research Facility as one of the military specialists assigned to eliminate Gordon Freeman. Experience an entirely new episode of single player action. Meet fierce alien opponents and experiment with new weaponry. Named Game of the Year by the Academy of Interactive Arts and Sciences.',
      id: '50',
      price: '4.99 $',
      image:
        'http://steam.meilisearch.dev/steam/apps/50/header.jpg?t=1447350813',
      releaseDate: 'Nov 1 1999',
      recommendationCount: 2934,
      platforms: ['MacOS', 'Linux', 'Windows'],
      players: ['Single player', 'Multiplayer'],
      genres: ['Action'],
      misc: [],
      _formatted: {
        name: '__ais-highlight__Half__/ais-highlight__-Life: Opposing Force',
        description:
          'Return to the Black Mesa Research Facility as one of the military specialists assigned to eliminate Gordon Freeman. Experience an entirely new episode of single player action. Meet fierce alien opponents and experiment with new weaponry. Named Game of the Year by the Academy of Interactive Arts and Sciences.',
        id: '50',
        price: '4.99 $',
        image:
          'http://steam.meilisearch.dev/steam/apps/50/header.jpg?t=1447350813',
        releaseDate: 'Nov 1 1999',
        recommendationCount: '2934',
        platforms: ['MacOS', 'Linux', 'Windows'],
        players: ['Single player', 'Multiplayer'],
        genres: ['Action'],
        misc: [],
      },
    },
  ],
  query: 'half',
  processingTimeMs: 2,
  hitsPerPage: 6,
  page: 1,
  totalPages: 39,
  totalHits: 232,
  facetDistribution: {
    genres: {
      Action: 118,
      Adventure: 76,
      Casual: 39,
      RPG: 44,
      Racing: 2,
      Simulation: 35,
      Sports: 10,
      Strategy: 47,
    },
    misc: {
      'Early access': 33,
      'Free to play': 20,
      'VR support': 11,
    },
    platforms: {
      Linux: 68,
      MacOS: 96,
      Windows: 232,
    },
    players: {
      Coop: 32,
      MMO: 5,
      Multiplayer: 76,
      'Single player': 206,
    },
  },
  facetStats: {},
  pagination: {
    hitsPerPage: 6,
    page: 0,
    finite: true,
  },
}

const searchResponsePositionMatchesTrue = {
  indexUid: 'steam-video-games',
  hits: [
    {
      name: 'Half-Life: Opposing Force',
      description:
        'Return to the Black Mesa Research Facility as one of the military specialists assigned to eliminate Gordon Freeman. Experience an entirely new episode of single player action. Meet fierce alien opponents and experiment with new weaponry. Named Game of the Year by the Academy of Interactive Arts and Sciences.',
      id: '50',
      price: '4.99 $',
      image:
        'http://steam.meilisearch.dev/steam/apps/50/header.jpg?t=1447350813',
      releaseDate: 'Nov 1 1999',
      recommendationCount: 2934,
      platforms: ['MacOS', 'Linux', 'Windows'],
      players: ['Single player', 'Multiplayer'],
      genres: ['Action'],
      misc: [],
      _formatted: {
        name: '__ais-highlight__Half__/ais-highlight__-Life: Opposing Force',
        description:
          'Return to the Black Mesa Research Facility as one of the military specialists assigned to eliminate Gordon Freeman. Experience an entirely new episode of single player action. Meet fierce alien opponents and experiment with new weaponry. Named Game of the Year by the Academy of Interactive Arts and Sciences.',
        id: '50',
        price: '4.99 $',
        image:
          'http://steam.meilisearch.dev/steam/apps/50/header.jpg?t=1447350813',
        releaseDate: 'Nov 1 1999',
        recommendationCount: '2934',
        platforms: ['MacOS', 'Linux', 'Windows'],
        players: ['Single player', 'Multiplayer'],
        genres: ['Action'],
        misc: [],
      },
      _matchesPosition: {
        name: [
          {
            start: 0,
            length: 4,
          },
        ],
      },
    },
  ],
  query: 'half',
  processingTimeMs: 2,
  hitsPerPage: 6,
  page: 1,
  totalPages: 39,
  totalHits: 232,
  facetDistribution: {
    genres: {
      Action: 118,
      Adventure: 76,
      Casual: 39,
      RPG: 44,
      Racing: 2,
      Simulation: 35,
      Sports: 10,
      Strategy: 47,
    },
    misc: {
      'Early access': 33,
      'Free to play': 20,
      'VR support': 11,
    },
    platforms: {
      Linux: 68,
      MacOS: 96,
      Windows: 232,
    },
    players: {
      Coop: 32,
      MMO: 5,
      Multiplayer: 76,
      'Single player': 206,
    },
  },
  facetStats: {},
  pagination: {
    hitsPerPage: 6,
    page: 0,
    finite: true,
  },
}

describe('Hit adapter', () => {
  test('_matchesPosition should be created in hit object with meiliSearchParams.showMatchesPosition=true', () => {
    const expectedPositionMatch = {
      name: [
        {
          start: 0,
          length: 4,
        },
      ],
    }

    const config = {
      placeholderSearch: true,
      keepZeroFacets: false,
      clientAgents: [],
      finitePagination: true,
      meiliSearchParams: {
        showMatchesPosition: true,
      },
    }

    const adaptedHits = adaptHits(searchResponsePositionMatchesTrue, config)

    expect(adaptedHits[0]._matchesPosition).toEqual(expectedPositionMatch)
  })

  test('_matchesPosition should NOT be created in hit object with meiliSearchParams.showMatchesPosition=false', () => {
    const config = {
      placeholderSearch: true,
      keepZeroFacets: false,
      clientAgents: [],
      finitePagination: true,
      meiliSearchParams: {
        showMatchesPosition: false,
      },
    }

    const adaptedHits = adaptHits(searchResponsePositionMatchesFalse, config)

    expect(adaptedHits[0]).not.toHaveProperty('_matchesPosition')
  })

  test('__position should be injected on each hit (page 0)', () => {
    const config = {
      placeholderSearch: true,
      keepZeroFacets: false,
      clientAgents: [],
      finitePagination: true,
    }

    const searchResponse = {
      ...searchResponsePositionMatchesFalse,
      hits: [
        { id: '1', name: 'Hit 1' },
        { id: '2', name: 'Hit 2' },
        { id: '3', name: 'Hit 3' },
      ],
      pagination: {
        hitsPerPage: 6,
        page: 0,
        finite: true,
      },
    }

    const adaptedHits = adaptHits(searchResponse, config)

    expect(adaptedHits[0].__position).toBe(1)
    expect(adaptedHits[1].__position).toBe(2)
    expect(adaptedHits[2].__position).toBe(3)
  })

  test('__position should account for pagination (page 1)', () => {
    const config = {
      placeholderSearch: true,
      keepZeroFacets: false,
      clientAgents: [],
      finitePagination: true,
    }

    const searchResponse = {
      ...searchResponsePositionMatchesFalse,
      hits: [
        { id: '7', name: 'Hit 7' },
        { id: '8', name: 'Hit 8' },
      ],
      pagination: {
        hitsPerPage: 6,
        page: 1,
        finite: true,
      },
    }

    const adaptedHits = adaptHits(searchResponse, config)

    // page 1 * 6 hitsPerPage = starting at position 7
    expect(adaptedHits[0].__position).toBe(7)
    expect(adaptedHits[1].__position).toBe(8)
  })

  test('__position should account for different hitsPerPage', () => {
    const config = {
      placeholderSearch: true,
      keepZeroFacets: false,
      clientAgents: [],
      finitePagination: true,
    }

    const searchResponse = {
      ...searchResponsePositionMatchesFalse,
      hits: [
        { id: '21', name: 'Hit 21' },
        { id: '22', name: 'Hit 22' },
      ],
      pagination: {
        hitsPerPage: 10,
        page: 2,
        finite: true,
      },
    }

    const adaptedHits = adaptHits(searchResponse, config)

    // page 2 * 10 hitsPerPage = starting at position 21
    expect(adaptedHits[0].__position).toBe(21)
    expect(adaptedHits[1].__position).toBe(22)
  })
})
