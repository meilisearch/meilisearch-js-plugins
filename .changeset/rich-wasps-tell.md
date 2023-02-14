---
"@meilisearch/instant-meilisearch": minor
---

- Compatibility with the `Index` widget is added.

## Drawback

Currently, for each index a request is made on, a separated request is made to Meilisearch. For example, if you have two indexes on which to search, two http requests are made.

In the next release of Meilisearch, a new `multi-search` API route is planned to be released (see [PR](https://github.com/meilisearch/meilisearch/pull/3417)). When it is released, the work-around will be removed and only one HTTP request will be done in all cases!
