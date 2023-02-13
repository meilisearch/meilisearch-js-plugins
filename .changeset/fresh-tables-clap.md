---
"@meilisearch/instant-meilisearch": minor
---

- Change the behavior of the `or` operator parameter on the [`RefinmentList`](https://www.algolia.com/doc/api-reference/widgets/refinement-list/js/) widget.

⚠️ This impacts the facet distribution number

## Drawback

Currently, for each `facet value` selected in a different `facet` a separate request is made to Meilisearch. Plus, an additional one containing all the facets filters. It results in tedious search requests and a high bandwidth cost.
For example, if I select `Adventure` on genres and `Multiplayer` on players, one request is made with both facet filters, one with only `genres=Adventure` and one with only `players=Multiplayer`

In the next release of Meilisearch, the `multi-index` route should be released (see [PR](https://github.com/meilisearch/meilisearch/pull/3417)). When it is released, the work-around will be removed and only one request will be done in all cases!


## Explaination

The way the `facet distribution` is calculated changed. The `facet distribution` shows the numbers of hits for each facet. For example:

Given the following facet:

```
Genres
- [ ] Adventure 7
```

The `facet distribution` provides the information that there are 7 hits containing the adventure genre.

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

In the new behavior the distribution number are not changed when facet values are selected inside the same facet.

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

See [complete explaination here](https://github.com/meilisearch/instant-meilisearch/issues/884)
