export const removeUndefined = <T>(arr: Array<T | undefined>) => {
  return arr.filter((x) => x !== undefined) as T[]
}
