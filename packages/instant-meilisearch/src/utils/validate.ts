/**
 * apiKey callback definition
 * @callback apiKeyCallback
 * @returns {string} - The apiKey to use
 */

/**
 * Validates host and apiKey parameters, throws if invalid
 * @param hostUrl
 * @param apiKey
 */
export function validateInstantMeiliSearchParams(
  hostUrl: string,
  apiKey: string | (() => string)
) {
  // Validate host url
  if (typeof hostUrl !== 'string') {
    throw new TypeError(
      'Provided hostUrl value (1st parameter) is not a string, expected string'
    )
  }

  // Validate api key
  if (typeof apiKey !== 'string' && typeof apiKey !== 'function') {
    throw new TypeError(
      'Provided apiKey value (2nd parameter) is not a string or a function, expected string or function'
    )
  }
}
