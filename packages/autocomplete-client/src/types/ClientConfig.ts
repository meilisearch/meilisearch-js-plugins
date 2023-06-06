import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'
import { MeilisearchOptions } from './MeilisearchOptions'

export type InstantMeilisearch = typeof instantMeiliSearch
export type MeilisearchURL = Parameters<InstantMeilisearch>[0]
export type MeilisearchApiKey = Parameters<InstantMeilisearch>[1]
export type ClientConfig = {
  url: MeilisearchURL
  apiKey: MeilisearchApiKey
  options?: MeilisearchOptions
}
