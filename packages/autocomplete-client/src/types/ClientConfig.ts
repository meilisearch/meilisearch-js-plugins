import { instantMeilisearch } from '@meilisearch/instant-meilisearch'
import type { MeilisearchOptions } from './MeilisearchOptions.js'

export type InstantMeilisearch = typeof instantMeilisearch
export type MeilisearchURL = Parameters<InstantMeilisearch>[0]
export type MeilisearchApiKey = Parameters<InstantMeilisearch>[1]
export type ClientConfig = {
  url: MeilisearchURL
  apiKey: MeilisearchApiKey
  options?: MeilisearchOptions
}
