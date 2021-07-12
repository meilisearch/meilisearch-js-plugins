import { FacetsDistribution } from '../types'

type Cache = {
  [category: string]: string[]
}

export const facetCache = (facets?: string[][]) => {
  if (!facets) return
  return facets.reduce<Cache>((cache, facetArray) => {
    for (const facet of facetArray) {
      const re = facet.match(/(.*)="(.*)"/)
      if (re) {
        const category = re[1]
        const prevCache = cache[category] ? cache[category] : []
        cache = {
          ...cache,
          [category]: [...prevCache, re[2]],
        }
      }
    }
    return cache
  }, {} as Cache) // will only change first occurence of `:`
}

export const compareFilters = (
  cache?: Cache,
  distribution?: FacetsDistribution
) => {
  if (cache && distribution) {
    for (const category in cache) {
      for (const facet of cache[category]) {
        if (!Object.keys(distribution[category]).includes(facet)) {
          distribution[category][facet] = 0
        }
      }
    }
  }
  return distribution
}
