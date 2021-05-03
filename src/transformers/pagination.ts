import { PaginateHits, GetNumberPages } from '../types'

export const getNumberPages: GetNumberPages = function (
  hitsLength,
  { hitsPerPage }
) {
  if (hitsPerPage > 0) {
    const NumberPages = Math.ceil(hitsLength / hitsPerPage) // total number of pages rounded up to the next largest integer.
    return NumberPages
  }
  return 0
}

export const paginateHits: PaginateHits = function (
  hits,
  { page, hitsPerPage }
) {
  const start = page * hitsPerPage
  return hits.splice(start, hitsPerPage)
}
