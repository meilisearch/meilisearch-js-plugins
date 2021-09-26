import { PaginateHits, GetNumberPages } from '../types'

export const getNumberPages = function (
  hitsLength: number,
  hitsPerPage: number
) {
  if (hitsPerPage > 0) {
    const NumberPages = Math.ceil(hitsLength / hitsPerPage) // total number of pages rounded up to the next largest integer.
    return NumberPages
  }
  return 0
}

export const paginateHits = function (
  hits: Record<string, any>,
  page: number,
  hitsPerPage: number
) {
  const start = page * hitsPerPage
  return hits.splice(start, hitsPerPage)
}
