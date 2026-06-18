---
'@meilisearch/autocomplete-client': minor
'@meilisearch/instant-meilisearch': patch
---

Make runtime dependency boundaries explicit in Vite library builds by externalizing
`@meilisearch/instant-meilisearch` and `meilisearch` in `@meilisearch/autocomplete-client`,
and `meilisearch` in `@meilisearch/instant-meilisearch`.

`@meilisearch/autocomplete-client` now declares `@meilisearch/instant-meilisearch` as a
peer dependency to reflect the runtime contract instead of relying on transitive installation.
