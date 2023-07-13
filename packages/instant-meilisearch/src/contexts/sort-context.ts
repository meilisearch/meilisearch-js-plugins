/**
 * Split sort string into an array.
 *
 * Example:
 * '_geoPoint(37.8153, -122.4784):asc,title:asc,description:desc'
 *
 * becomes:
 * [
 * '_geoPoint(37.8153, -122.4784):asc',
 * 'title:asc',
 * 'description:desc',
 * ]
 *
 * @param {string} sortStr
 * @returns {string[]}
 */
export function splitSortString(sortStr: string): string[] {
  if (!sortStr) return []
  const sortRules = sortStr.split(/,(?=\w+:(?:asc|desc))/)

  return sortRules
}
