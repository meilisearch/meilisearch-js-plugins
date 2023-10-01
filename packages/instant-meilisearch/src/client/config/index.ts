import {
  InstantMeiliSearchOptions,
  InstantMeiliSearchConfig,
  ApiKeyCallback,
} from '../../types'
import { isPureObject } from '../../utils/object'

/**
 * Get the configuration of instant meilisearch
 *
 * @param {InstantMeiliSearchOptions} option
 * @returns {InstantMeiliSearchConfig}
 */

export function getInstantMeilisearchConfig(
  options: InstantMeiliSearchOptions
): InstantMeiliSearchConfig {
  const defaultOptions = {
    placeholderSearch: true,
    keepZeroFacets: false,
    clientAgents: [],
    finitePagination: false,
  }

  return {
    ...defaultOptions,
    ...options,
  }
}

/**
 * Resolves apiKey if it is a function
 * @param  {string | ApiKeyCallback} apiKey
 * @returns {string} api key value
 */
export function getApiKey(apiKey: string | ApiKeyCallback): string {
  // If apiKey is function, call it to get the apiKey
  if (typeof apiKey === 'function') {
    const apiKeyFnValue = apiKey()
    if (typeof apiKeyFnValue !== 'string') {
      throw new TypeError(
        'Provided apiKey function (2nd parameter) did not return a string, expected string'
      )
    }

    return apiKeyFnValue
  }

  return apiKey
}

/**
 * Validates host and apiKey parameters, throws if invalid
 * @param hostUrl
 * @param apiKey
 */
export function validateInstantMeiliSearchParams(
  hostUrl: string,
  apiKey: string | (() => string),
  instantMeiliSearchOptions: InstantMeiliSearchOptions
) {
  const { requestConfig, httpClient } = instantMeiliSearchOptions
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

  // Validate requestConfig
  if (requestConfig !== undefined && !isPureObject(requestConfig)) {
    throw new TypeError('Provided requestConfig should be an object')
  }

  // Validate custom HTTP client
  if (httpClient && typeof httpClient !== 'function') {
    throw new TypeError('Provided custom httpClient should be a function')
  }
}
