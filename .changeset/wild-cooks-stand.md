---
'@meilisearch/autocomplete-client': minor
'@meilisearch/instant-meilisearch': minor
---

# Rename MeiliSearch to Meilisearch

- Following https://github.com/meilisearch/meilisearch-js/pull/2144 rename every uppercase "S" in "\*MeiliSearch\*" to lower case "s"

## Migration

```diff
- import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
+ import { instantMeilisearch } from "@meilisearch/instant-meilisearch";
// ... same pattern for every other export
```
