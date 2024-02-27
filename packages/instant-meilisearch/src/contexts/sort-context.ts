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
  const regex = /[^:]+:(?:asc|desc)/g
  const sortRules: string[] = []

  let match
  while ((match = regex.exec(sortStr)) !== null) {
    sortRules.push(match[0])
  }

  return sortRules.map((str) => str.replace(/^,+|,+$/, ''))
}
