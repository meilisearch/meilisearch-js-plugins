import { PACKAGE_VERSION } from '../package-version.js'
import { createSearchClient } from './createSearchClient.js'

/** Create searchClient instance for autocomplete */
const userAgent = `Meilisearch autocomplete-client (v${PACKAGE_VERSION})`
export const meilisearchAutocompleteClient = createSearchClient({ userAgent })
