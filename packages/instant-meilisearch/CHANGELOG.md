# @meilisearch/instant-meilisearch

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

  See [complete explanation here](https://github.com/meilisearch/instant-meilisearch/issues/884)

- 72de4c8: - Compatibility with the `Index` widget is added.

  ## Drawback

  Currently, for each index a request is made on, a separated request is made to Meilisearch. For example, if you have two indexes on which to search, two http requests are made.

  In the next release of Meilisearch, a new `multi-search` API route is planned to be released (see [PR](https://github.com/meilisearch/meilisearch/pull/3417)). When it is released, the work-around will be removed and only one HTTP request will be done in all cases!

### Patch Changes

- 33ae56b: Migrate the current repository to a turbo architecture

## 0.10.2-turbo-migration.0

### Patch Changes

- 33ae56b: Migrate the current repository to a turbo architecture
