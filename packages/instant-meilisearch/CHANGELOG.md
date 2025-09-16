# @meilisearch/instant-meilisearch

## 0.27.1

### Patch Changes

- 83040e5a: Fix search client type, bump meilisearch-js dependency
- 7e0dcc11: Fix search client type

## 0.27.0

### Minor Changes

- 9bcef24: Bump meilisearch dependency to v0.51

## 0.26.0

### Minor Changes

- 3085de3: Bump meilisearch to v0.50.0
  - This change has a breaking change in Meilisearch dependency, where the Meilisearch class parameter `requestConfig` has been changed to `requestInit`

## 0.25.0

### Minor Changes

- b10435d: Stabilize AI search

## 0.24.0

### Minor Changes

- fe45115: - Jest -> Vitest
  - Rollup -> Vite
  - `"type": "module"`
  - update `meilisearch-js` to latest version
  - update everything else that caused a conflict to the latest version, and adapt code

## 0.23.0

### Minor Changes

- a794b88: Update meilisearch-js to v0.47
- f966050: Use Meilisearch v1.12 new highlight behavior

## 0.22.0

### Minor Changes

- 5b56a06: Update meilisearch version to v0.45.0

## 0.21.1

### Patch Changes

- 1e7bf78: Fix wrong "meilisearch" client being imported in UMD bundle.

## 0.21.0

### Minor Changes

- 26e7cfd: - update `meilisearch` js client
  - update `parcel` and `turbo`
  - get rid of angular playground tests, as [angular-instantsearch got deprecated](https://www.algolia.com/blog/algolia/migrating-from-angular-instantsearch/)

## 0.20.1

### Patch Changes

- fa02104: Don't write objectID property if it already exists when adapting geosearch.

## 0.20.0

### Minor Changes

- 1885691: Update meilisearch version to v0.42.0

## 0.19.3

### Patch Changes

- d167b70: Add support for [ranking score threshold](https://www.meilisearch.com/docs/reference/api/search#ranking-score-threshold?utm_campaign=oss&utm_source=github&utm_medium=instant-meilisearch)

## 0.19.2

### Patch Changes

- f2bb298: Add support for distinct attribute

## 0.19.1

### Patch Changes

- 114aece: Fix \_matchesPosition not being included in hits

## 0.19.0

### Minor Changes

- 7c4ecf6: Update meilisearch dependency version to v0.41.0

## 0.18.1

### Patch Changes

- ac74ef7: Update meilisearch-js dependency to v0.40 (ignore previous version v0.39)

## 0.18.0

### Minor Changes

- 12b2fe8: Update minimum meilisearch version to v0.39.0

## 0.17.0

### Minor Changes

- 234d699: - exposed created `MeiliSearch` instance

  - re-exported all of `"meilisearch"` package

  These improvements make it so that no separate `"meilisearch"` package
  has to be installed in order to use its exports directly. This
  way a single `MeiliSearch` instance can be re-used, and we can potentially
  save on bundle size by avoiding a separate different version installation of
  `"meilisearch"`.

  ```typescript
  import {
    instantMeiliSearch,
    meilisearch,
  } from "@meilisearch/instant-meilisearch";
  // re-exported "meilisearch" ^

  const {
    meiliSearchInstance,
    // ^ re-usable MeiliSearch instance
    searchClient,
  } = instantMeiliSearch(/*...*/);
  ```

- 767a334: Update meilisearch-js version

## 0.16.0

### Minor Changes

- b1343c1: Enable experimental hybrid search

## 0.15.0

### Minor Changes

- 72726ac: Update meilisearch-js version
- 36b5a62: Fixed RegExp in filter-adapter.ts and sort-context.ts to work in Safari

## 0.14.0

### Minor Changes

- 5b6be19 & ed8b6a3: Added ability to override a selection of Meilisearch search parameters.

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

### Patch Changes

- 06377ef: Fixes issue where backslashes ("\") and quotes (`"`) are not escaped in filters.

## [DEPRECATED] 1.0.0

### Major Changes

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

### Patch Changes

- 06377ef: Fixes issue where backslashes ("\") and quotes (`"`) are not escaped in filters.

## 0.13.6

### Patch Changes

- abd298e: Fix HierarchicalMenu when keepZeroFacets is set to true
- 52c3d9b: Update the meilisearch-js version

## 0.13.5

### Patch Changes

- ddf98c6: Fixes bug where search on facets would fail when using the sortBy widget

## 0.13.4

### Patch Changes

- 04326fe: Make instant-meilisearch templates available again on npm package
- 7e62f88: Add compatibility with the `searchable` parameter of the [`RefinementList`](https://www.algolia.com/doc/api-reference/widgets/refinement-list/js/) widget

## 0.13.3

### Patch Changes

- 93812d5: Fix bug where sort-by failed on geo_points

## 0.13.2

### Patch Changes

- 0f44764: Export a new type `AlgoliaSearchForFacetValuesResponse`

## 0.13.1

### Patch Changes

- bcf09c9: Fixes a bug where if a facet contained multiple words it failed

## 0.13.0

### Minor Changes

- f205acd: Makes the umd build work in a nodeJs environment

### Patch Changes

- d47cd27: Add the possibility to provide a custom HTTP request and custom requests configurations

## 0.12.0

### Minor Changes

- 3be2aaf: Replaces search with multiSearch API.
- 3098d6c: Add support for multiple sort attributes

### Patch Changes

- c6b3c09: Use the `_geoBoundingBox` filter to adapt the `insideBoundingBox`parameter
- 0211825: Add the facetStats of numeric facets, giving access to the min and max value of these facets.
  The following widgets are now compatible with Meilisearch: `RangeSlider` and `RangeInput`

## 0.11.1

### Patch Changes

- 8ad13aa: Fix the initial facet distribution cache when performing a sort-by

## 0.11.0

### Minor Changes

- 72de4c8: - Change the behavior of the `or` operator parameter on the [`RefinmentList`](https://www.algolia.com/doc/api-reference/widgets/refinement-list/js/) widget.

  ⚠️ This impacts the facet distribution number

  ## Drawback

  Currently, for each `facet value` selected in a different `facet` a separate request is made to Meilisearch. Plus, an additional one containing all the facets filters. It results in tedious search requests and a high bandwidth cost.
  For example, if I select `Adventure` on genres and `Multiplayer` on players, one request is made with both facet filters, one with only `genres=Adventure` and one with only `players=Multiplayer`

  In the next release of Meilisearch, a new `multi-search` API route is planned to be released (see [PR](https://github.com/meilisearch/meilisearch/pull/3417)). When it is released, the work-around will be removed and only one HTTP request will be done in all cases!

  ## Explanation

  The way the `facetDistribution` is calculated changed. The `facetDistribution` shows the numbers of hits for each facet. For example:

  Given the following facet:

  ```
  Genres
  - [ ] Adventure 7
  ```

  The `facetDistribution` provides the information that there are `7` hits containing the adventure genre.

  For the example, let's take the following facets:

  ```
  Genres
  - [ ] Adventure 7
  - [ ] Action 5
  - [ ] Science Fiction 5
  Players
  - [ ] Multiplayer 11
  - [ ] Single player 7
  ```

  Before, when selecting a facet value in a certain facet, the distribution of that facet was impacted.

  ```
  - [x] Adventure 7
  - [ ] Action 3 // <- number changed from 5 to 3
  - [ ] Science Fiction 1 // <- number changed from 5 to 1
  Players
  - [ ] Multiplayer 6
  - [ ] Single player 3
  ```

  With the new behavior, the distributed number are not changed when facet values are selected inside the same facet because a facet distribution is computed with a dedicated search request.

  ```
  Genres
  - [x] Adventure 7
  - [ ] Action 5 // <- number did not change
  - [ ] Science Fiction 5 // <- number did not change
  Players
  - [ ] Multiplayer 6
  - [ ] Single player 3
  ```

  ```
  Genres
  - [x] Adventure 7 // changed because of Multiplayer
  - [ ] Action 4
  - [ ] Science Fiction 3
  Players
  - [x] Multiplayer 6
  - [ ] Single player 3
  ```

  This is the conventional way of calculating the facet distribution. Similar to Algolia's behavior. If you prefer the old behavior, please consider opening an issue.

  See [complete explanation here](https://github.com/meilisearch/meilisearch-js-plugins/issues/884)

- 72de4c8: - Compatibility with the `Index` widget is added.

  ## Drawback

  Currently, for each index a request is made on, a separated request is made to Meilisearch. For example, if you have two indexes on which to search, two http requests are made.

  In the next release of Meilisearch, a new `multi-search` API route is planned to be released (see [PR](https://github.com/meilisearch/meilisearch/pull/3417)). When it is released, the work-around will be removed and only one HTTP request will be done in all cases!

### Patch Changes

- 33ae56b: Migrate the current repository to a turbo architecture

## 0.10.2-turbo-migration.0

### Patch Changes

- 33ae56b: Migrate the current repository to a turbo architecture
