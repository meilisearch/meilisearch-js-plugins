import { PACKAGE_VERSION } from '../package-version'
import { createSearchClient } from './createSearchClient'

/**
 * Create searchClient instance for autocomplete
 */
const userAgent = `Meilisearch autocomplete-client (v${PACKAGE_VERSION})`
export const meilisearchAutocompleteClient = createSearchClient({ userAgent })
