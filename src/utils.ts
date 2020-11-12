type NoUndefined<T> = {
  [P in keyof T]-?: Exclude<T[P], undefined>
}

export function removeUndefinedFromObject<
  T extends Record<string, any>,
  K extends keyof T & string
>(object: T) {
  return (Object.keys(object) as K[]).reduce((result, key) => {
    if (object[key] !== undefined) {
      result[key] = object[key]
    }
    return result
  }, {} as NoUndefined<T>)
}

export function isString(str: any) {
  return typeof str === 'string' || str instanceof String
}
