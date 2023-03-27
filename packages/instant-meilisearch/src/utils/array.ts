export const removeUndefined = <T>(arr: Array<T | undefined>) => {
  return arr.filter((x) => x !== undefined) as T[]
}

export function removeDuplicate(key: string) {
  const indexes: string[] = []

  return (object: Record<string, any>) => {
    if (indexes.includes(object[key])) {
      return false
    }

    indexes.push(object[key])

    return true
  }
}
