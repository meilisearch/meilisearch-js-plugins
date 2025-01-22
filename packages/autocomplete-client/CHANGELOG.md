# @meilisearch/autocomplete-client

## 0.6.0

### Minor Changes

- fe45115: - Jest -> Vitest
  - Rollup -> Vite
  - `"type": "module"`
  - update `meilisearch-js` to latest version
  - update everything else that caused a conflict to the latest version, and adapt code

### Patch Changes

- Updated dependencies [fe45115]
  - @meilisearch/instant-meilisearch@0.24.0

## 0.5.0

### Minor Changes

- 731254f: Add highlight metadata

## 0.4.1

### Patch Changes

- 7bc6b54: Fix rollup importing wrong "meilisearch"

## 0.4.0

### Minor Changes

- 26e7cfd: - update `meilisearch` js client
  - update `parcel` and `turbo`
  - get rid of angular playground tests, as [angular-instantsearch got deprecated](https://www.algolia.com/blog/algolia/migrating-from-angular-instantsearch/)

### Patch Changes

- Updated dependencies [26e7cfd]
  - @meilisearch/instant-meilisearch@0.21.0

## 0.3.0

### Minor Changes

- 00f30c9: Remove node 14 and 16 from workflow

## 0.2.2

### Patch Changes

- 5b6be19: Added ability to override a selection of Meilisearch search parameters.

  ⚠️ The returned value of the core `instantMeiliSearch` function has changed!

  This change was necessary for the aforementioned ability to be implemented and
  applied in a clean manner.
  The necessary migration should be of minimal impact.

  ### Migration

  Change the following

  ```js
  // 1.
  const client = instantMeiliSearch(/*...*/);
  // 2.
  const searchClient = instantMeiliSearch(/*...*/);
  // 3.
  instantsearch({
    indexName: "movies",
    searchClient: instantMeiliSearch(/*...*/),
  });
  ```

  to the following

  ```js
  // 1.
  const { searchClient: client } = instantMeiliSearch(/*...*/);
  // 2.
  const { searchClient } = instantMeiliSearch(/*...*/);
  // 3.
  instantsearch({
    indexName: "movies",
    searchClient: instantMeiliSearch(/*...*/).searchClient,
  });
  ```

- Updated dependencies [5b6be19]
- Updated dependencies [06377ef]
  - @meilisearch/instant-meilisearch@1.0.0

## 0.2.1

### Patch Changes

- 753e9ba: Fix the getting started wrongly instanciating the autocomplete client

## 0.2.0

### Minor Changes

- 0f44764: Creation of search client compatible with autocomplete.

### Patch Changes

- Updated dependencies [0f44764]
  - @meilisearch/instant-meilisearch@0.13.2
