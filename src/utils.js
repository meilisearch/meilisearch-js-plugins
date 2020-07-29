function removeUndefinedFromObject(object) {
  return Object.keys(object).reduce((result, key) => {
    if (object[key] !== undefined) {
      result[key] = object[key]
    }
    return result
  }, {})
}

function isString(str) {
  return typeof str === 'string' || str instanceof String
}

export { isString, removeUndefinedFromObject }
