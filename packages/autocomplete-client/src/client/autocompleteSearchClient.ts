import pkg from '../../package.json' with { type: 'json' }
import { createSearchClient } from './createSearchClient.js'

/** Create searchClient instance for autocomplete */
const userAgent = `Meilisearch autocomplete-client (v${pkg.version})`
export const meilisearchAutocompleteClient = createSearchClient({ userAgent })
