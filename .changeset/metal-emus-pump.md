---
"@meilisearch/instant-meilisearch": major
"@meilisearch/autocomplete-client": patch
---

Added ability to override a selection of Meilisearch search parameters.

  ⚠️ The returned value of the core `instantMeiliSearch` function has changed!

  This change was necessary for the aforementioned ability to be implemented and
  applied in a clean manner.
  The necessary migration should be of minimal impact.

  ### Migration

  Change the following

  ```js
  // 1.
  const client = instantMeiliSearch(/*...*/)
  // 2.
  const searchClient = instantMeiliSearch(/*...*/)
  // 3.
  instantsearch({
    indexName: 'movies',
    searchClient: instantMeiliSearch(/*...*/),
  })
  ```

  to the following

  ```js
  // 1.
  const { searchClient: client } = instantMeiliSearch(/*...*/)
  // 2.
  const { searchClient } = instantMeiliSearch(/*...*/)
  // 3.
  instantsearch({
    indexName: 'movies',
    searchClient: instantMeiliSearch(/*...*/).searchClient,
  })
  ```
