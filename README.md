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

If you use Angular, React, or Vue, you might want to check out these repositories:

- [meilisearch-angular](https://github.com/meilisearch/meilisearch-angular/)
- [meilisearch-react](https://github.com/meilisearch/meilisearch-react/)
- [meilisearch-vue](https://github.com/meilisearch/meilisearch-vue/)

NB: If you don't have any MeiliSearch instance running and containing your data, you should take a look at this [getting started page](https://docs.meilisearch.com/learn/tutorials/getting_started.html).

## Table of Contents <!-- omit in toc -->

- [🔧 Installation](#-installation)
- [🎬 Usage](#-usage)
- [⚡️ Example with InstantSearch](#-example-with-instantSearch)
- [🤖 Compatibility with MeiliSearch and InstantSearch](#-compatibility-with-meilisearch-and-instantsearch)
- [📜 API Resources](#-api-resources)
- [⚙️ Development Workflow and Contributing](#️-development-workflow-and-contributing)

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
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'

const searchClient = instantMeiliSearch(
  'https://demos.meilisearch.com',
  'dc3fedaf922de8937fdea01f0a7d59557f1fd31832cb8440ce94231cfdde7f25'
)
```

### Customization

```js
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'

const searchClient = instantMeiliSearch(
  'https://demos.meilisearch.com',
  'dc3fedaf922de8937fdea01f0a7d59557f1fd31832cb8440ce94231cfdde7f25',
  {
    paginationTotalHits: 30, // default: 200.
    placeholderSearch: false, // default: true.
    primaryKey: 'id', // default: undefined
  }
)
```

- `placeholderSearch` (`true` by default). Displays documents even when the query is empty.

- `paginationTotalHits` (`200` by default): The total (and finite) number of hits you can browse during pagination when using the [pagination widget](https://www.algolia.com/doc/api-reference/widgets/pagination/js/). If the pagination widget is not used, `paginationTotalHits` is ignored.<br>
  Which means that, with a `paginationTotalHits` default value of 200, and `hitsPerPage` default value of 20, you can browse `paginationTotalHits / hitsPerPage` => `200 / 20 = 10` pages during pagination. Each of the 10 pages containing 20 results.<br>
  The default value of `hitsPerPage` is set to `20` but it can be changed with [`InsantSearch.configure`](https://www.algolia.com/doc/api-reference/widgets/configure/js/#examples).<br>
  ⚠️ MeiliSearch is not designed for pagination and this can lead to performances issues, so the usage of the pagination widget is not encouraged. However, the `paginationTotalHits` parameter lets you implement this pagination with less performance issue as possible: depending on your dataset (the size of each document and the number of documents) you might decrease the value of `paginationTotalHits`.<br>
  More information about MeiliSearch and the pagination [here](https://github.com/meilisearch/documentation/issues/561).
- `primaryKey` (`undefined` by default): Specify the field in your documents containing the [unique identifier](https://docs.meilisearch.com/learn/core_concepts/documents.html#primary-field). By adding this option, we avoid instantSearch errors that are thrown in the browser console. In `React` particularly, this option removes the `Each child in a list should have a unique "key" prop` error.

## Example with InstantSearch

The open-source [InstantSearch](https://www.algolia.com/doc/api-reference/widgets/js/) library powered by Algolia provides all the front-end tools you need to highly customize your search bar environment.

InstantSearch requires that you provide an indexName. The indexName corresponds to the [index `uid`](https://docs.meilisearch.com/learn/core_concepts/indexes.html#indexes) in which your document are stored in MeiliSearch.

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
  indexName: 'steam-video-games',
  searchClient: instantMeiliSearch(
    'https://demos.meilisearch.com',
    'dc3fedaf922de8937fdea01f0a7d59557f1fd31832cb8440ce94231cfdde7f25'
  ),
})

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: `
        <div>
          <div class="hit-name">
            {{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}
          </div>
        </div>
      `,
    },
  }),
])

search.start()
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


## 🤖 Compatibility with MeiliSearch and InstantSearch

**Supported InstantSearch.js versions**:

This package only guarantees the compatibility with the [version v4 of InstantSearch.js](https://github.com/algolia/instantsearch.js/releases/tag/v4.24.1). It may work with older or newer InstantSearch versions, but these are not tested nor officially supported at this time.

**Supported MeiliSearch versions**:

This package only guarantees the compatibility with the [version v0.22.0 of MeiliSearch](https://github.com/meilisearch/MeiliSearch/releases/tag/v0.22.0).

**Node / NPM versions**:

- NodeJS >= 12.10 <= 14
- NPM >= 6.x

## API resources

List of all the components that are available in [instantSearch](https://github.com/algolia/instantsearch.js) and their compatibilty with [MeiliSearch](https://github.com/meilisearch/meilisearch/).

### Table Of Widgets

- ✅ [InstantSearch](#-instantsearch)
- ❌[index](#-index)
- ✅ [SearchBox](#-searchbox)
- ✅ [Configure](#-configure)
- ❌[ConfigureRelatedItems](#-configure-related-items)
- ❌[Autocomplete](#-autocomplete)
- ✅ [Voice Search](#-voice-search)
- ✅ [Insight](#-insight)
- ✅ [Middleware](#-middleware)
- ✅ [RenderState](#-renderstate)
- ✅ [Hits](#-hits)
- ✅ [InfiniteHits](#-infinitehits)
- ✅ [Highlight](#-highlight)
- ✅ [Snippet](#-snippet)
- ❌[Geo Search](#-geo-search)
- ❌[Answers](#-answers)
- ✅ [RefinementList](#-refinementlist)
- ❌[HierarchicalMenu](#-hierarchicalmenu)
- ✅ [RangeSlider](#-rangeslider)
- ✅ [Menu](#-menu)
- ✅ [currentRefinements](#-currentrefinements)
- ✅ [RangeInput](#-rangeinput)
- ✅ [MenuSelect](#-menuselect)
- ✅ [ToggleRefinement](#-togglerefinement)
- ✅ [NumericMenu](#-numericmenu)
- ❌[RatingMenu](#-ratingmenu)
- ✅ [ClearRefinements](#-clearrefinements)
- ✅ [Pagination](#-pagination)
- ✅ [HitsPerPage](#-hitsperpage)
- ❌[Breadcrumb](#-breadcrumb)
- ✅ [Stats](#-stats)
- ❌[Analytics](#-analytics)
- ❌[QueryRuleCustomData](#-queryrulecustomdata)
- ❌[QueryRuleContext](#-queryrulecontext)
- ✅ [SortBy](#-sortby)
- ❌[RelevantSort](#-relevantsort)
- ✅ [Routing](#-routing)


### ✅ InstantSearch

[instantSearch references](https://www.algolia.com/doc/api-reference/widgets/instantsearch/js/)

`instantSearch` is the main component. It manages the widget and lets you add new ones.

- ✅ IndexName: [`uid` of your index](https://docs.meilisearch.com/learn/core_concepts/indexes.html#indexes). _required_
- ✅ SearchClient: Search client, in our case instantMeiliSearch. See [customization](#customization) for details on options. _required_
- ❌ numberLocale: Does not work with both Algoliasearch and InstantMeiliSearch.
- ✅ searchFunction: Surcharge the search function provided by the search client.
- ✅ initialUiState: Determine the search state on app start.
- ✅ onStateChange: Change search state on change (see option above).
- ✅ stalledSearchDelay: Time in ms before search is considered stalled. [Used for loader](https://www.algolia.com/doc/guides/building-search-ui/going-further/improve-performance/js/#using-the-searchbox).
- ✅ routing: browser URL synchronization, search parameters appear in current URL ([guide](https://www.algolia.com/doc/guides/building-search-ui/going-further/routing-urls/js/)).
- ✅ insightsClient: Hook analytics to search actions ([see insight section](#insight)).

```js
const search = instantsearch({
  indexName: 'instant_search',
  searchClient: instantMeiliSearch(
    'https://demos.meilisearch.com',
    'dc3fedaf922de8937fdea01f0a7d59557f1fd31832cb8440ce94231cfdde7f25',
    {
      // ... InstantMeiliSearch options
    }
  ),
  // ... InstantSearch options
  routing: true // for example
})
```

### ❌ Index

[Index references](https://www.algolia.com/doc/api-reference/widgets/index-widget/js/)

`Index` is the component that lets you apply widgets to a dedicated index. It’s useful if you want to build an interface that targets multiple indices.

Not compatible as MeiliSearch does not support federated search on multiple indexes.

If you'd like to see federated search implemented please vote for it in the [roadmap](https://roadmap.meilisearch.com/c/74-multi-index-search?utm_medium=social&utm_source=portal_share).

### ✅ SearchBox

[SearchBox references](https://www.algolia.com/doc/api-reference/widgets/search-box/js/)

The `searchBox` widget is used to let the user perform a text-based query.

- ✅ container: The CSS Selector or HTMLElement to insert the widget into. _required_
- ✅ placeholder: Placeholder of the search box.
- ✅ autofocus: Whether the search box is focused on arrival.
- ✅ searchAsYouType: Whether result appears as you type or after pressing enter.
- ❌ showReset: Does not work with both algoliaSearch and instantMeiliSearche
- ❌ showSubmit: Does not work with both algoliaSearch and instantMeiliSearch
- ✅ showLoadingIndicator: Whether to show the spinning loader.
- ✅ queryHook: A function that is called just before the search is triggered.
- ✅ templates: The templates to use for the widget.
- ✅ cssClasses: The CSS classes to override.

```js
instantsearch.widgets.searchBox({
  container: '#searchbox',
  autofocus: true,
  ...searchBoxOptions
}),
```

### ✅ Configure

- [Configure references](https://www.algolia.com/doc/api-reference/widgets/configure/js/): See #389

The `configure` widget lets you provide raw search parameters to the Algolia API without rendering anything.

Because these are the search parameters of AlgoliaSearch and not the InstantSearch parameters, some of them are ignored by InstantSearch.<br>
Since we do not act as AlgoliaSearch on search parameters, detailed compatibility can be found in [this issue](https://github.com/meilisearch/instant-meilisearch/issues/389).<br>
This component should only be used if no other component provides the same configuration.

We also suggest looking at [MeiliSearch's search parameters](https://docs.meilisearch.com/reference/features/search_parameters.html) to determine how they act.

```js
instantsearch.widgets.configure({
  hitsPerPage: 6,
  // other algoliaSearch parameters
})
```

### ❌ ConfigureRelatedItems

[ConfigureRelatedItems references](https://www.algolia.com/doc/api-reference/widgets/configure-related-items/js/).

No compatibility with MeiliSearch because the component uses [sumOrFiltersScores](https://www.algolia.com/doc/api-reference/api-parameters/sumOrFiltersScores/) and [optionalFilters](https://www.algolia.com/doc/api-reference/api-parameters/optionalFilters/) search parameters that do not exist in MeiliSearch.

### Panel

[Panel references](https://www.algolia.com/doc/api-reference/widgets/panel/js/)

The `panel` widget wraps other widgets in a consistent panel design.

- ✅ hidden: Function to determine if pannel should be hidden on earch render.
- ✅ collapsed: Function to determine if pannel should be collapsed on earch render.
- ✅ templates: The templates to use for the widget.
- ✅ cssClasses: The CSS classes to override.

### ❌ Autocomplete

[Autocomplete references](https://www.algolia.com/doc/api-reference/widgets/autocomplete/js/)

Deprecated component in InstantSearch in favor of [autocomplete package](https://github.com/algolia/autocomplete).

InstantMeiliSearch is not compatible with the autocomplete package.

### ✅ Voice Search

[Voice Search references](https://www.algolia.com/doc/api-reference/widgets/voice-search/js/)

The `voiceSearch` widget lets the user perform a voice-based query.

### ✅ Insight

[Insight references](https://www.algolia.com/doc/api-reference/widgets/insights/js/)

Search Insights lets you report click, conversion and view metrics.

More details about the subject are [given in this issue](https://github.com/meilisearch/instant-meilisearch/issues/410).

Requires InstantSearch v4.8.3 or later.

- ✅ insightsClient: Insight client uses [search-insight.js](https://github.com/algolia/search-insights.js).
- ✅ insightsInitParams: Insight params.
- ✅ onEvent?: function triggered on events.

### ✅ Middleware

[Middleware references](https://www.algolia.com/doc/api-reference/widgets/middleware/js/)

Middleware is a function returning an object with `onStateChange`, `subscribe` and `unsubscribe` functions. With the middleware API, you can inject functionalities in the InstantSearch lifecycle.

### ✅ renderState

[renderState references](https://www.algolia.com/doc/api-reference/widgets/render-state/js/#examples)

Provides all the data and functions from the widgets.

It works only on widgets that are compatible with instantMeiliSearch.

### ✅ Hits

[hits references](https://www.algolia.com/doc/api-reference/widgets/hits/js/)

Used to display a list of results.

- ✅ container: The CSS Selector or HTMLElement to insert the hits into. _required_
- ✅ escapeHTML: Escapes HTML tags in string values in returned hits.
- ✅ transformItems: Function that maps over every hit the provided logic.
- ✅ templates: The templates to use for the widget.
- ✅ cssClasses: The CSS classes to override.

```js
instantsearch.widgets.hits({
  container: '#hits',
  templates: {
    item: `
        <div>
          <div class="hit-name">
            {{#helpers.highlight}}{ "attribute": "title" }{{/helpers.highlight}}
          </div>
        </div>
      `,
  },
})
```

### ✅ InfiniteHits

[infiniteHits references](https://www.algolia.com/doc/api-reference/widgets/infinite-hits/js/)

The `infiniteHits` widget is used to display a list of results with a “Show more” button.

- ✅ container: The CSS Selector or HTMLElement to insert the hits into. _required_
- ✅ escapeHTML: Escapes HTML tags in string values in returned hits.
- ✅ transformItems: Function that maps over every hit the provided logic.
- ✅ templates: The templates to use for the widget.
- ✅ cssClasses: The CSS classes to override.
- ❌ showPrevious: Does not work with both Algoliasearch and InstantMeiliSearch.
- ❌ cache: Not added in InstantMeiliSearch.

```js
instantsearch.widgets.infiniteHits({
  container: '#infinite-hits',
  templates: {
    item: `
      <h2>
        {{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}
      </h2>
    `,
  },
})
```

### ✅ Highlight

[highlight references](https://www.algolia.com/doc/api-reference/widgets/highlight/js/)

The `highlight` function returns an attribute from a hit into its highlighted form, when relevant.

- ✅ attribute: The attribute of the record to highlight. _required_
- ✅ hit: Hit object. _required_
- ✅ highlightedTagName: HTML element to wrap the highlighted parts of the string.

See [Hits](#hits) for an example.

### ✅ Snippet

[Snippet references](https://www.algolia.com/doc/api-reference/widgets/snippet/js/)

The `snippet` function returns an attribute from a hit into its snippet form, when relevant.

- ✅ attribute: The attribute of the record to snippet and highlight. _required_
- ✅ hit: Hit object. _required_
- ✅ highlightedTagName: HTML element to wrap the highlighted parts of the string.

Note that the attribute has to be added to `attributesToSnippet` in [configuration](#configuration). Highlight is applied on snippeted fields.

Snippeting is called `cropping` in MeiliSearch, [more about it here](https://docs.meilisearch.com/reference/features/search_parameters.html#attributes-to-retrieve). It is possible to change the size of the snippeting by adding its character size in the attributesToSnippet parameter. <br>
For example: `"description:40"`.

The `40` value represents the number of characters (rounded down to always have full words) and not the number of words. Thus, the snippet string size is always equal to or lower than `40` characters.

```js
instantsearch.widgets.configure({
  attributesToSnippet: ['description:40'],
})
```

```js
instantsearch.widgets.hits({
  // ...
  templates: {
    item: `
      <p>{{#helpers.snippet}}{ "attribute": "description" }{{/helpers.snippet}}</p>
    `,
  },
})
```

### ❌ Geo Search

[Geo search references](https://www.algolia.com/doc/api-reference/widgets/geo-search/js/)

No compatibility because MeiliSearch does not support Geo Search.

If you'd like to see it implemented please vote for it in the [roadmap](https://roadmap.meilisearch.com/c/33-geo-search?utm_medium=social&utm_source=portal_share).

### ❌ Answers

[Answers references](https://www.algolia.com/doc/api-reference/widgets/answers/js/).

No compatibility because MeiliSearch does not support this experimental feature.

### ✅ RefinementList

[Refinement list references](https://www.algolia.com/doc/api-reference/widgets/refinement-list/js/)

The `refinementList` widget is one of the most common widgets you can find in a search UI. With this widget, the user can filter the dataset based on facets.

- ✅ container: The CSS Selector or HTMLElement to insert the refinements. _required_
- ✅ attribute: The facet to display _required_
- ✅ operator: How to apply facets, "AND" or "OR"
- ✅ limit: How many facet values to retrieve.
- ✅ showMore: Whether to display a button that expands the number of items.
- ✅ showMoreLimit: The maximum number of displayed items. Does not work when showMoreLimit > limit.
- ❌ searchable: Whether to add a search input to let the user search for more facet values. Not supported by MeiliSearch. If you'd like to see it implemented [please vote](https://roadmap.meilisearch.com/c/64-search-for-facet-values?utm_medium=social&utm_source=portal_share).
- ❌ searchablePlaceholder: The value of the search input’s placeholder. Not supported, see `searchable`.
- ❌ searchableIsAlwaysActive: When false, disables the facet search input. Not supported, see `searchable`.
- ❌ searchableEscapeFacetValues: When true, escapes the facet values. Not supported, see `searchable`.
- ❌ sortBy: Not supported natively but can be implemented manually using `transformItems` options.
- ✅ transformItems: A function to transform the items passed to the templates.
- ✅ templates: The templates to use for the widget.
- ✅ cssClasses: The CSS classes to override.

The following example will create a UI component with the a list of genres on which you will be able to facet.

```js
instantsearch.widgets.refinementList({
  container: '#refinement-list',
  attribute: 'genres',
})
```

### ❌ HierarchicalMenu

[Hierarchical menu references](https://www.algolia.com/doc/api-reference/widgets/hierarchical-menu/js/)

The `hierarchicalMenu` widget is used to create a navigation based on a hierarchy of facet attributes. It is commonly used for categories with subcategories.

No compatibility because MeiliSearch does not support hierarchical facets.

If you'd like get nested facets/hierarchical facets implemented, please vote for it in the [roadmap](https://roadmap.meilisearch.com/c/97-nested-facets?utm_medium=social&utm_source=portal_share).

### ✅ RangeSlider

[Range slider references](https://www.algolia.com/doc/api-reference/widgets/range-slider/js/)

The `rangeSlider` widget provides a user-friendly way to filter the results, based on a single numeric range.

- ✅ container: The CSS Selector or HTMLElement to insert the refinements. _required_
- ✅ attribute: The name of the attribute in the document. _required_.
- ✅ min: The minimum value for the input. _required_
- ✅ max: The maximum value for the input. _required_
- ❌ precision: The number of digits after the decimal point to use. Not compatible as only integers work with `rangeSlider`.
- ✅ step: The number of steps between each handle move.
- ✅ pips: Whether to show slider pips (ruler marks).
- ✅ tooltips: Whether to show tooltips. The default tooltips show the raw value.
- ✅ cssClasses: The CSS classes to override.

#### ⚠️ The component is compatible but only by applying the following requirements:

#### 1. Manual Min Max

Min and max of attributes are not returned from MeiliSearch and thus **must be set manually**.

```js
  instantsearch.widgets.rangeSlider({
    // ...
    min: 0,
    max: 100000,
  }),
```

#### 2. Attribute must be in `filterableAttributes`

If the attribute is not in the [`filterableAttributes`](https://docs.meilisearch.com/reference/features/filtering_and_faceted_search.html#configuring-filters) setting list, filtering on this attribute is not possible.

Example:
Given the attribute `id` that has not been added in `filterableAttributes`:

```js
  instantsearch.widgets.rangeSlider({
    attribute: 'id',
    // ...
  }),
```

The widget throws the following error:

```json
{
  "message": "  .. attribute `id` is not filterable, available filterable attributes are: author, price, genres",
  "errorCode": "bad_request",
  "errorType": "invalid_request_error",
  "errorLink": "https://docs.meilisearch.com/errors#bad_request"
}
```

To avoid this error, the attribute must be added to the [`filterableAttributes` setting](https://docs.meilisearch.com/reference/api/filterable_attributes.html#get-filterable-attributes).

After these steps, `rangeSlider` becomes compatible.

### ✅ Menu

[Menu references](https://www.algolia.com/doc/api-reference/widgets/menu/js/)

The `menu` widget displays a menu that lets the user choose a single value for a specific attribute.

- ✅ container: The CSS Selector or HTMLElement to insert the menu. _required_
- ✅ attribute: the name of the facet attribute. _required_
- ✅ limit: How many facet values to retrieve.
- ✅ showMore: Whether to display a button that expands the number of items.
- ✅ showMoreLimit: The maximum number of displayed items. Does not work when `showMoreLimit > limit`
- ❌ sortBy: Not supported natively but can be implemented manually using `transformItems` options.
- ✅ transformItems: A function to transform the items passed to the templates.
- ✅ templates: The templates to use for the widget.
- ✅ cssClasses: The CSS classes to override.

### ✅ currentRefinements

[currentRefinements](https://www.algolia.com/doc/api-reference/widgets/current-refinements/js/)

The `currentRefinements` widget displays a list of refinements applied to the search.

- ✅ container: The CSS Selector or HTMLElement to insert the current refinements UI. _required_
- ✅ includedAttributes: The facet name of which checked attributes are included.
- ✅ excludedAttributes: The facet name of which checked attributes are excluded.
- ✅ cssClasses: The CSS classes to override.
- ✅ transformItems: A function to transform the items passed to the templates.

### ✅ RangeInput

[Range input references](https://www.algolia.com/doc/api-reference/widgets/range-input/js/)

The `rangeInput` widget allows a user to select a numeric range using a minimum and maximum input.

- ✅ container: The CSS Selector or HTMLElement to insert widget into. _required_
- ✅ attribute: The name of the attribute in the document. _required_.
- ✅ min: The minimum value for the input.
- ✅ max: The maximum value for the input
- ✅ precision: The number of digits after the decimal point to use.
- ✅ templates: The templates to use for the widget.
- ✅ cssClasses: The CSS classes to override.

⚠️ Not compatible with MeiliSearch by default, needs a workaround. See workaround in [RangeSlider](#rangeslider) section.

### ✅ MenuSelect

[Menu select references](https://www.algolia.com/doc/api-reference/widgets/menu-select/js/)

The `menuSelect` widget allows a user to select a single value to refine inside a select element.

- ✅ container: The CSS Selector or HTMLElement to insert widget into. _required_
- ✅ attribute: The name of the attribute in the document. _required_.
- ✅ limit: How many facet values to retrieve.
- ❌ [sortBy](https://www.algolia.com/doc/api-reference/widgets/menu-select/js/#widget-param-sortby): Not supported natively but can be implemented manually using `transformItems` options.
- ✅ templates: The templates to use for the widget.
- ✅ cssClasses: The CSS classes to override.
- ✅ transformItems: A function to transform the items passed to the templates.

### ✅ ToggleRefinement

[Toggle refinement references](https://www.algolia.com/doc/api-reference/widgets/toggle-refinement/js/)

The numericMenu widget displays a list of numeric filters in a list. Those numeric filters are pre-configured when creating the widget.

- ✅ container: The CSS Selector or HTMLElement to insert the widget into. _required_
- ✅ attribute: The name of the attribute on which apply the refinement. _required_
- ✅ on: The value of the refinement to apply on the attribute when checked.
- ✅ off: The value of the refinement to apply on the attribute when unchecked.
- ✅ templates: The templates to use for the widget.
- ✅ cssClasses: The CSS classes to override.

The toggleRefinement widget provides an on/off filtering feature based on an attribute value.

### ✅ NumericMenu

[Numeric Menu references](https://www.algolia.com/doc/api-reference/widgets/numeric-menu/js/)

The `numericMenu` widget displays a list of numeric filters in a list. Those numeric filters are pre-configured when creating the widget.

- ✅ container: The CSS Selector or HTMLElement to insert the widget into. _required_
- ✅ attribute: The name of the attribute in the document. _required_.
- ✅ items: A list of all the options to display. _required_
- ✅ templates: The templates to use for the widget.
- ✅ cssClasses: The CSS classes to override.
- ✅ transformItems: function receiving the items, called before displaying them.

### ❌ RatingMenu

[Rating menu references](https://www.algolia.com/doc/api-reference/widgets/rating-menu/js/)

The `RatingMenu` widget lets the user refine search results by clicking on stars. The stars are based on the selected attribute.

No compatibility because MeiliSearch does not support integers as facet and instantSearch uses facets information to showcase the UI elements.

### ✅ ClearRefinements

[Clear refinements references](https://www.algolia.com/doc/api-reference/widgets/clear-refinements/js/)

The `clearRefinement` widget displays a button that lets the user clean every refinement applied to the search. You can control which attributes are impacted by the button with the options.

- ✅ container: The CSS Selector or HTMLElement to insert the widget into. _required_

```js
instantsearch.widgets.clearRefinements({
    container: '#clear-refinements',
  }),
```

### ✅ Pagination

[Pagination references](https://www.algolia.com/doc/api-reference/widgets/pagination/js/)

The `pagination` widget displays a pagination system allowing the user to change the current page.

We do not recommend using this widget as pagination slows the search responses. Instead, the [InfiniteHits](#InfiniteHits) component is recommended.

- ✅ container: The CSS Selector or HTMLElement to insert the widget into. _required_
- ✅ showFirst: Whether to display the first-page link.
- ✅ showPrevious: Whether to display the previous page link.
- ✅ showNext: Whether to display the next page link.
- ✅ showLast: Whether to display the last page link.
- ✅ padding: The number of pages to display on each side of the current page.
- ✅ totalPages: The maximum number of pages to browse.
- ✅ scrollTo: Where to scroll after a click. Set to false to disable.
- ✅ templates: The templates to use for the widget.
- ✅ cssClasses: The CSS classes to override.

```js
instantsearch.widgets.pagination({
  container: '#pagination',
})
```

### ✅ HitsPerPage

[Hits per page references](https://www.algolia.com/doc/api-reference/widgets/hits-per-page/js/)

The `hitsPerPage` widget displays a dropdown menu to let the user change the number of displayed hits.

- ✅ container: The CSS Selector or HTMLElement to insert the widget into. _required_
- ✅ [items](https://www.algolia.com/doc/api-reference/widgets/hits-per-page/js/#widget-param-items): The list of available options _required_
- ✅ cssClasses: The CSS classes to override.
- ✅ transformItems: function receiving the items, called before displaying them.

### ❌ Breadcrumb

[Breadcrumb references](https://www.algolia.com/doc/api-reference/widgets/breadcrumb/js/)

The `breadcrumb` widget is a secondary navigation scheme that lets the user see where the current page is in relation to the facet’s hierarchy.

No compatibility because MeiliSearch does not support hierarchical facets.

If you'd like get nested facets implemented, please vote for it in the [roadmap](https://roadmap.meilisearch.com/c/97-nested-facets?utm_medium=social&utm_source=portal_share).

### ✅ Stats

[Stats references](https://www.algolia.com/doc/api-reference/widgets/stats/js/)

The `stats` widget displays the total number of matching hits and the time it took to get them (time spent in the Algolia server).

- ✅ container: The CSS Selector or HTMLElement to insert the widget into. _required_
- ✅ cssClasses: The CSS classes to override.
- ✅ transformItems: function receiving the items, called before displaying them.

```js
instantsearch.widgets.stats({
  container: '#stats',
})
```

### ❌ Analytics

[Analytics](https://www.algolia.com/doc/api-reference/widgets/analytics/js/)

Deprecated. See [Insight](#Insight).

### ❌ QueryRuleCustomData

[QueryRuleCustomData references](https://www.algolia.com/doc/api-reference/widgets/query-rule-custom-data/js/)

You may want to use this widget to display banners or recommendations returned by [Rules](https://www.algolia.com/doc/api-client/methods/rules/), and that match search parameters.

No compatibility because MeiliSearch does not support Rules.

### ❌ QueryRuleContext

[Query rule context references](https://www.algolia.com/doc/api-reference/widgets/query-rule-context/js/)

The queryRuleContext widget lets you apply ruleContexts based on filters to trigger context-dependent [Rules](https://www.algolia.com/doc/api-client/methods/rules/).

No compatibility because MeiliSearch does not support Rules.

### ✅ SortBy

[Sort by references](https://www.algolia.com/doc/api-reference/widgets/sort-by/js/)

The `sortBy` widget is used to create multiple sort formulas. Allowing a user to change the way hits are sorted.

- ✅ container: The CSS Selector or HTMLElement to insert the widget into. _required_
- ✅ items: The list of different sorting possibilities. _required_
- ✅ cssClasses: The CSS classes to override.
- ✅ transformItems: function receiving the items, called before displaying them.

The usage of the `SortBy` widget differs from the one found in Algolia's documentation. In instant-meilisearch the following is possible:

- Sort using different indexes.
- Different `sort` rules on the same index.

The items list is composed of objects containing every sort possibilities you want to provide to your user. Each objects must contain two fields:
  - `label`: What is showcased on the user interface ex: `Sort by Ascending Price`
  - `value`: The sort formula.

#### Sort formula

A sort formula is expressed like this: `index:attribute:order`.

`index` is mandatory, and when adding `attribute:order`, they must always be added together.

When sorting on an attribute, the attribute has to be added in the [`SortableAttributes`](#link-to-doc) setting on your index.

Example:
```js
[
  { label: 'Sort By Price', value: 'clothes:price:asc' }
]
```

In this scenario, in the `clothes` index, we want the price to be sorted in an ascending way. For this formula to be valid, `price` must be added in the `sortableAttributes` settings of the `clothes` index.

#### Relevancy

The importance of the sort value is determined by the [`ranking-rules`](https://docs.meilisearch.com/learn/core_concepts/relevancy.html#ranking-rules) of each index. It is possible to change the ranking-rules in the index settings. Or make multiple indexes with different ranking-rules order. See [relevancy guide](https://docs.meilisearch.com/learn/core_concepts/relevancy.html#relevancy).

#### Example

```js
  instantsearch.widgets.sortBy({
    container: '#sort-by',
    items: [
      { value: 'clothes', label: 'Relevant' }, // default index
      {
        value: 'clothes:price:asc', // Sort on descending price
        label: 'Ascending price using query time sort',
      },
      {
        value: 'clothes:price:asc', // Sort on ascending price
        label: 'Descending price using query time sort',
      },
      {
        value: 'clothes-sorted', // different index with different ranking rules.
        label: 'Custom sort using a different index',
      },
    ],
  }),
```

### ❌ RelevantSort

[Relevant Sort references](https://www.algolia.com/doc/api-reference/widgets/relevant-sort/js/)

Virtual indices allow you to use Relevant sort, a sorting mechanism that favors relevancy over the attribute you’re sorting on.

### ✅ Routing

Routing is configured inside `instantSearch` component. Please refer [to the documentation](https://www.algolia.com/doc/api-reference/widgets/simple-state-mapping/js/) for further implementation information.


## Development Workflow and Contributing

Any new contribution is more than welcome in this project!

If you want to know more about the development workflow or want to contribute, please visit our [contributing guidelines](/CONTRIBUTING.md) for detailed instructions!

<hr>

**MeiliSearch** provides and maintains many **SDKs and Integration tools** like this one. We want to provide everyone with an **amazing search experience for any kind of project**. If you want to contribute, make suggestions, or just know what's going on right now, visit us in the [integration-guides](https://github.com/meilisearch/integration-guides) repository.
