<p align="center">
  <img src="https://raw.githubusercontent.com/meilisearch/integration-guides/main/assets/logos/logo.svg" alt="Instant-MeiliSearch" width="200" height="200" />
</p>

<h1 align="center">Instant MeiliSearch</h1>

<h4 align="center">
  <a href="https://github.com/meilisearch/MeiliSearch">MeiliSearch</a> |
  <a href="https://docs.meilisearch.com">Documentation</a> |
  <a href="https://slack.meilisearch.com">Slack</a> |
  <a href="https://roadmap.meilisearch.com/tabs/1-under-consideration">Roadmap</a> |
  <a href="https://www.meilisearch.com">Website</a> |
  <a href="https://docs.meilisearch.com/faq">FAQ</a>
</h4>

<p align="center">
  <a href="https://www.npmjs.com/package/@meilisearch/instant-meilisearch"><img src="https://img.shields.io/npm/v/@meilisearch/instant-meilisearch.svg" alt="npm version"></a>
  <a href="https://github.com/meilisearch/instant-meilisearch/actions"><img src="https://github.com/meilisearch/instant-meilisearch/workflows/Tests/badge.svg?branch=main" alt="Tests"></a>
  <a href="https://github.com/meilisearch/instant-meilisearch/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-informational" alt="License"></a>
  <a href="https://github.com/meilisearch/MeiliSearch/discussions" alt="Discussions"><img src="https://img.shields.io/badge/github-discussions-red" /></a>
  <a href="https://app.bors.tech/repositories/28908"><img src="https://bors.tech/images/badge_small.svg" alt="Bors enabled"></a>
</p>

<p align="center">⚡ How to integrate a front-end search bar in your website using MeiliSearch</p>

**MeiliSearch** is an open-source search engine. [Discover what MeiliSearch is!](https://github.com/meilisearch/MeiliSearch)

This library is a plugin to establish the communication between your [MeiliSearch](https://github.com/meilisearch/MeiliSearch) instance and the open-source [InstantSearch](https://github.com/algolia/instantsearch.js) tools (powered by Algolia) for your front-end application.<br>
Instead of reinventing the wheel, we have opted to reuse the InstantSearch library for our own front-end tooling. We will contribute upstream any improvements that may result from our adoption of InstantSearch.

If you use React or Vue, you might want to check out these repositories:

- [meilisearch-react](https://github.com/meilisearch/meilisearch-react/)
- [meilisearch-vue](https://github.com/meilisearch/meilisearch-vue/)

NB: If you don't have any MeiliSearch instance running and containing your data, you should take a look at this [getting started page](https://docs.meilisearch.com/learn/tutorials/getting_started.html).

## Installation

Use `npm` or `yarn` to install `instant-meilisearch`:

```bash
npm install @meilisearch/instant-meilisearch
```

```bash
yarn add @meilisearch/instant-meilisearch
```

## Usage

### Basic

```js
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";

const searchClient = instantMeiliSearch(
  "https://demos.meilisearch.com",
  "dc3fedaf922de8937fdea01f0a7d59557f1fd31832cb8440ce94231cfdde7f25"
);
```

### Customization

```js
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";

const searchClient = instantMeiliSearch(
  "https://demos.meilisearch.com",
  "dc3fedaf922de8937fdea01f0a7d59557f1fd31832cb8440ce94231cfdde7f25",
  {
    paginationTotalHits: 30, // default: 200.
    placeholderSearch: false, // default: true.
    primaryKey: 'id' // default: undefined
  }
);
```

- `placeholderSearch` (`true` by default). Displays documents even when the query is empty.

- `paginationTotalHits` (`200` by default): The total (and finite) number of hits you can browse during pagination when using the [pagination widget](https://www.algolia.com/doc/api-reference/widgets/pagination/js/). If the pagination widget is not used, `paginationTotalHits` is ignored.<br>
Which means that, with a `paginationTotalHits` default value of 200, and `hitsPerPage` default value of 20, you can browse `paginationTotalHits / hitsPerPage` => `200 / 20 = 10` pages during pagination. Each of the 10 pages containing 20 results.<br>
The default value of `hitsPerPage` is set to `20` but it can be changed with [`InsantSearch.configure`](https://www.algolia.com/doc/api-reference/widgets/configure/js/#examples).<br>
⚠️ MeiliSearch is not designed for pagination and this can lead to performances issues, so the usage of the pagination widget is not encouraged. However, the `paginationTotalHits` parameter lets you implement this pagination with less performance issue as possible: depending on your dataset (the size of each document and the number of documents) you might decrease the value of `paginationTotalHits`.<br>
More information about MeiliSearch and the pagination [here](https://github.com/meilisearch/documentation/issues/561).
- `primaryKey` (`undefined` by default): Specify the field in your documents containing the [unique identifier](https://docs.meilisearch.com/learn/core_concepts/documents.html#primary-field). By adding this option, we avoid instantSearch errors that are thrown in the browser console. In `React` particulary, this option removes the `Each child in a list should have a unique "key" prop` error.

## Example with InstantSearch

The open-source [InstantSearch](https://www.algolia.com/doc/api-reference/widgets/js/) library powered by Algolia provides all the front-end tools you need to highly customize your search bar environment.

In `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
  </head>

  <body>
    <div>
      <div id="searchbox"></div>
      <div id="hits"></div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/@meilisearch/instant-meilisearch/dist/instant-meilisearch.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/instantsearch.js@4"></script>
    <script src="./app.js"></script>
  </body>
</html>
```

In `app.js`:

```js
const search = instantsearch({
  indexName: "steam-video-games",
  searchClient: instantMeiliSearch(
    "https://demos.meilisearch.com",
    "dc3fedaf922de8937fdea01f0a7d59557f1fd31832cb8440ce94231cfdde7f25",
  )
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: "#searchbox"
  }),
  instantsearch.widgets.hits({
    container: "#hits",
    templates: {
      item: `
        <div>
          <div class="hit-name">
            {{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}
          </div>
        </div>
      `
    }
  })
]);

search.start();
```

🚀 For a full getting started example, please take a look at this CodeSandbox:

[![Edit MS + IS](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/ms-is-mese9?fontsize=14&hidenavigation=1&theme=dark)

💡 If you have never used InstantSearch, we recommend reading this [getting started documentation](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/js/).


## More Documentation

- The open-source InstantSearch library is widely used and well documented in the [Algolia documentation](https://www.algolia.com/doc/api-reference/widgets/js/). It provides all the widgets to customize and improve your search bar environment in your website.
- The [MeiliSearch documentation](https://docs.meilisearch.com/).
- If you use React, check out [meilisearch-react](https://github.com/meilisearch/meilisearch-react/)
- If you use Vue, check out [meilisearch-vue](https://github.com/meilisearch/meilisearch-vue/)
- If you use Angular, check out [meilisearch-angular](https://github.com/meilisearch/meilisearch-angular/)

## Compatibility with MeiliSearch

This package only guarantees the compatibility with the [version v0.20.0 of MeiliSearch](https://github.com/meilisearch/MeiliSearch/releases/tag/v0.20.0).

## Development Workflow and Contributing

Any new contribution is more than welcome in this project!

If you want to know more about the development workflow or want to contribute, please visit our [contributing guidelines](/CONTRIBUTING.md) for detailed instructions!

<hr>

**MeiliSearch** provides and maintains many **SDKs and Integration tools** like this one. We want to provide everyone with an **amazing search experience for any kind of project**. If you want to contribute, make suggestions, or just know what's going on right now, visit us in the [integration-guides](https://github.com/meilisearch/integration-guides) repository.


## Component References

### InstantSearch

[instantSearch references](https://www.algolia.com/doc/api-reference/widgets/instantsearch/js/)

#### Options
- IndexName: Name of your index. _required_
- SearchClient: Search Client, in our case instantMeiliSearch. _required_
- ❌ numberLocale: Did not work with both algoliasearch and instantMeiliSearch
- ✅ searchFunction: Overide the search function provided by the search client.
- ✅ initialUiState: Search state on start.
- ✅ onStateChange: Change Search State on change (see option above).
- ✅ stalledSearchDelay: Time in ms before search is considered stalled. [Used for loader](https://www.algolia.com/doc/guides/building-search-ui/going-further/improve-performance/js/#using-the-searchbox)
- ✅ routing: browser URL synchronization, search parameters appear in current URL ([guide](https://www.algolia.com/doc/guides/building-search-ui/going-further/routing-urls/js/)).
- ✅ insightsClient: Hook analytics to search actions ([see insight section](#insight))

Main wrapper for InstantSearch

```js
const search = instantsearch({
  indexName: 'instant_search',
  searchClient: instantMeiliSearch(
    'https://demos.meilisearch.com',
    'dc3fedaf922de8937fdea01f0a7d59557f1fd31832cb8440ce94231cfdde7f25',
  ),
  ...optionalParameters
});
```


### ❌ Index
[Index references](https://www.algolia.com/doc/api-reference/widgets/index-widget/js/)

No compatibility because MeiliSearch does not support federated Search. [See roadmap](https://roadmap.meilisearch.com/c/74-multi-index-search?utm_medium=social&utm_source=portal_share).

### SearchBox
[SearchBox references](https://www.algolia.com/doc/api-reference/widgets/search-box/js/)

- ✅ container: The CSS Selector or HTMLElement to insert the widget into. _required_
- ✅ placeholder: Placeholder of the searchbox.
- ✅ autofocus: Wether the searchbox is focused on arrival.
- ✅ searchAsYouType: Wether result appear as you type or after pressing enter.
- ❌ showReset: Did not work with both algoliasearch and instantMeiliSearch
- ❌ showSubmit: Did not work with both algoliasearch and instantMeiliSearch
- ✅ showLoadingIndicator: Wether to show the spinning loader.
- ✅ queryHook: A function that is called just before the search is triggered.
- ✅ templates: The [templates](https://www.algolia.com/doc/api-reference/widgets/search-box/js/#templates) to use for the widget.
- ✅ cssClasses: The CSS classes to override.

### Configure
- [Configure references](https://www.algolia.com/doc/api-reference/widgets/configure/js/): See #389

Detailed compatibility can be found in [this issue](https://github.com/meilisearch/instant-meilisearch/issues/389).

### ❌ ConfigureRelatedItems

[ConfigureRelatedItems references](https://www.algolia.com/doc/api-reference/widgets/configure-related-items/js/).

No compatibility because the component uses [sumOrFiltersScores](https://www.algolia.com/doc/api-reference/api-parameters/sumOrFiltersScores/) and [optionalFilters](https://www.algolia.com/doc/api-reference/api-parameters/optionalFilters/) search parameters that do not exist in MeiliSearch.

### Panel

[Panel references](https://www.algolia.com/doc/api-reference/widgets/panel/js/)

Widget wrapper.

- ✅ hidden: Function to determine if pannel should be hidden on earch render.
- ✅ collapsed: Function to determine if pannel should be collapsed on earch render.
- ✅ templates: The [templates](https://www.algolia.com/doc/api-reference/widgets/search-box/js/#templates) to use for the widget.
- ✅ cssClasses: The CSS classes to override.

### ❌ Autocomplete

Deprecated component in InstantSearch.

MeiliSearch does not support the [autocomplete package](https://github.com/algolia/autocomplete)

### Voice Search

[Voice Search references](https://www.algolia.com/doc/api-reference/widgets/voice-search/js/)

Should be compatible but no tests have been made to confirm it works.

### Insight

[Insight references](https://www.algolia.com/doc/api-reference/widgets/insights/js/)

Should be compatible but no tests have been mode to confirm it works. More details about the subject are [given in this issue](https://github.com/meilisearch/instant-meilisearch/issues/410).

Require instantSearch v4.8.3 or later

- ✅ insightsClient: Insight Client uses [search-insight.js](https://github.com/algolia/search-insights.js).
- ✅ insightsInitParams: Insight params.
- ✅ onEvent?: function triggered on events.


### Middleware

[Middleware references](https://www.algolia.com/doc/api-reference/widgets/middleware/js/)

Give possibility to provide `onStateChange`, `subscribe` and `unsubscribe` functions. As it is linked only to UI components it is compatible with InstantMeiliSearch.

### renderState

[renderState references](https://www.algolia.com/doc/api-reference/widgets/render-state/js/#examples)

Provides all the data and functions from the widgets.

It is usable only on the widgets that are compatible with instantMeiliSearch.

### Hits

[hits references](https://www.algolia.com/doc/api-reference/widgets/hits/js/)

Used to display a list of results.

- ✅ container: The CSS Selector or HTMLElement to insert the hits into. _required_
- ✅ escapeHTML: Escapes HTML tags in string values in returned hits.
- ✅ transformItems: Function thats maps over every hit the provided logic.
- ✅ templates: The [templates](https://www.algolia.com/doc/api-reference/widgets/search-box/js/#templates) to use for the widget.
- ✅ cssClasses: The CSS classes to override.

### infiniteHits

[infiniteHits references](https://www.algolia.com/doc/api-reference/widgets/infinite-hits/js/)

- ✅ container: The CSS Selector or HTMLElement to insert the hits into. _required_
- ✅ escapeHTML: Escapes HTML tags in string values in returned hits.
- ✅ transformItems: Function thats maps over every hit the provided logic.
- ✅ templates: The [templates](https://www.algolia.com/doc/api-reference/widgets/search-box/js/#templates) to use for the widget.
- ✅ cssClasses: The CSS classes to override.
- ❌ showPrevious: Did not work with both algoliasearch and instantMeiliSearch
- ❌ cache: Not added in InstantMeiliSearch


### Highlight

[highlight references](https://www.algolia.com/doc/api-reference/widgets/highlight/js/)

The highlight function returns any attribute from a hit into its highlighted form, when relevant.

- ✅ attribute: The attribute of the record to highlight. _required_
- ✅ hit: Hit object. _required_
- ✅ highlightedTagName: HTML element to wrap the highlighted parts of the string.

### Snippet

[Snippet references](https://www.algolia.com/doc/api-reference/widgets/snippet/react/)

- ✅ attribute: The attribute of the record to highlight. _required_
- ✅ hit: Hit object. _required_
- ✅ highlightedTagName: HTML element to wrap the highlighted parts of the string.

### ❌ Geo Search

[Geo search references](https://www.algolia.com/doc/api-reference/widgets/geo-search/js/)


No compatibility because MeiliSearch does not support Geo Search.
[See roadmap](https://roadmap.meilisearch.com/c/33-geo-search?utm_medium=social&utm_source=portal_share)

### ❌ Answers

[Answers references](https://www.algolia.com/doc/api-reference/widgets/answers/js/).

No compatibility because MeiliSearch does not support this feature.


### RefinementList


- ✅ container: The CSS Selector or HTMLElement to insert the refinements. _required_
- ✅ attribute: The Facet to display,
- ✅ // Optional parameters
- ✅ operator: string,
- ✅ limit: number,
- ✅ showMore: boolean,
- ✅ showMoreLimit: number,
- ✅ searchable: boolean,
- ✅ searchablePlaceholder: string,
- ✅ searchableIsAlwaysActive: boolean,
- ✅ searchableEscapeFacetValues: boolean,
- ✅ sortBy: string[]|function,
- ✅ templates: object,
- ✅ cssClasses: object,
- ✅ transformItems: function,
