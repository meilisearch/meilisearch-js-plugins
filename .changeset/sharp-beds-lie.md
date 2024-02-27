---
"@meilisearch/instant-meilisearch": minor
---

- exposed created `MeiliSearch` instance
- re-exported all of `"meilisearch"` package

These improvements make it so that no separate `"meilisearch"` package
has to be installed in order to use its exports directly. This
way a single `MeiliSearch` instance can be re-used, and we can potentially
save on bundle size by avoiding a separate different version installation of
`"meilisearch"`.

```typescript
import { instantMeiliSearch, meilisearch } from '@meilisearch/instant-meilisearch'
// re-exported "meilisearch" ^

const {
  meiliSearchInstance,
  // ^ re-usable MeiliSearch instance
  searchClient
} = instantMeiliSearch(/*...*/)
```
