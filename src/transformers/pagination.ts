import { PaginateHits, GetNumberPages } from '../types'

export const getNumberPages: GetNumberPages = function (
  hitsLength,
  { hitsPerPage }
) {
  const adjust = hitsLength % hitsPerPage! === 0 ? 0 : 1
  return Math.floor(hitsLength / hitsPerPage!) + adjust // total number of pages
}

export const paginateHits: PaginateHits = function (
  hits,
  { page, hitsPerPage }
) {
  const start = page * hitsPerPage
  return hits.splice(start, hitsPerPage)
}
