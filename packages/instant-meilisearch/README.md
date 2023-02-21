<p align="center">
  <img src="https://raw.githubusercontent.com/meilisearch/integration-guides/main/assets/logos/logo.svg" alt="Instant-Meilisearch" width="200" height="200" />
</p>

<h1 align="center">Instant Meilisearch</h1>

<h4 align="center">
  <a href="https://github.com/meilisearch/meilisearch">Meilisearch</a> |
  <a href="https://docs.meilisearch.com">Documentation</a> |
  <a href="https://discord.meilisearch.com">Discord</a> |
  <a href="https://roadmap.meilisearch.com/tabs/1-under-consideration">Roadmap</a> |
  <a href="https://www.meilisearch.com">Website</a> |
  <a href="https://docs.meilisearch.com/faq">FAQ</a>
</h4>

<p align="center">
  <a href="https://www.npmjs.com/package/@meilisearch/instant-meilisearch"><img src="https://img.shields.io/npm/v/@meilisearch/instant-meilisearch.svg" alt="npm version"></a>
  <a href="https://github.com/meilisearch/instant-meilisearch/actions"><img src="https://github.com/meilisearch/instant-meilisearch/workflows/Tests/badge.svg?branch=main" alt="Tests"></a>
  <a href="https://github.com/meilisearch/instant-meilisearch/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-informational" alt="License"></a>
  <a href="https://github.com/meilisearch/meilisearch/discussions" alt="Discussions"><img src="https://img.shields.io/badge/github-discussions-red" /></a>
  <a href="https://ms-bors.herokuapp.com/repositories/48"><img src="https://bors.tech/images/badge_small.svg" alt="Bors enabled"></a>
</p>

<p align="center">⚡ How to integrate a front-end search bar in your website using Meilisearch</p>

**Meilisearch** is an open-source search engine. [Discover what Meilisearch is!](https://github.com/meilisearch/meilisearch)

This library is the search client that you should use to make [Meilisearch](https://github.com/meilisearch/meilisearch) work with [InstantSearch](https://github.com/algolia/instantsearch.js). InstantSearch, an open-source project developed by Algolia, is the tool that renders all the components needed to start searching in your front-end application.

Instead of reinventing the wheel, we have opted to reuse the InstantSearch library for our own front-end tooling. We will contribute upstream any improvements that may result from our adoption of InstantSearch.

If you use Angular, React, or Vue, you might want to check out these repositories:

- [meilisearch-angular](https://github.com/meilisearch/meilisearch-angular/)
- [meilisearch-react](https://github.com/meilisearch/meilisearch-react/)
- [meilisearch-vue](https://github.com/meilisearch/meilisearch-vue/)

NB: If you don't have any Meilisearch instance running and containing your data, you should take a look at this [getting started page](https://docs.meilisearch.com/learn/tutorials/getting_started.html).

## Table of Contents <!-- omit in toc -->

- [📖 Documentation](#-documentation)
- [🔧 Installation](#-installation)
- [🎬 Usage](#-usage)
- [💅 Customization](#-customization)
- [🪡 Example with InstantSearch](#-example-with-instantsearch)
- [🤖 Compatibility with Meilisearch and InstantSearch](#-compatibility-with-meilisearch-and-instantsearch)
- [📜 API Resources](#-api-resources)
- [⚙️ Development Workflow and Contributing](#️-development-workflow-and-contributing)

## 📖 Documentation

For general information on how to use Meilisearch—such as our API reference, tutorials, guides, and in-depth articles—refer to our [main documentation website](https://docs.meilisearch.com/).

## 🔧 Installation

Use `npm` or `yarn` to install `instant-meilisearch`:

```bash
npm install @meilisearch/instant-meilisearch
```

```bash
yarn add @meilisearch/instant-meilisearch
```

`instant-meilisearch` is a client for `instantsearch.js`. It does not create any UI component by itself.<br>
To be able to create a search interface, you'll need to [install `instantsearch.js`](https://www.algolia.com/doc/guides/building-search-ui/installation/js/) as well.

## 🎬 Usage

### Basic

```js
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'

const searchClient = instantMeiliSearch(
  'https://ms-adf78ae33284-106.lon.meilisearch.io', // Host
  'a63da4928426f12639e19d62886f621130f3fa9ff3c7534c5d179f0f51c4f303' // API key
)
```

### Parameters

- `Host` - URL of Meilisearch instance
- `API Key` - Meilisearch access API Key. This can either be a string or a synchronous function that returns a string. ⚠️ Prefer using a key with only [search permissions](https://docs.meilisearch.com/learn/security/master_api_keys.html#master-key-and-api-keys) as it is used on your front-end.

## 💅 Customization

`instant-meilisearch` offers some options you can set to further fit your needs.

- [`placeholderSearch`](#placeholder-search): Enable or disable placeholder search (default: `true`).
- [`finitePagination`](#finite-pagination): Enable finite pagination when using the the [`pagination`](#-pagination) widget (default: `false`) .
- [`primaryKey`](#primary-key): Specify the primary key of your documents (default `undefined`).
- [`keepZeroFacets`](#keep-zero-facets): Show the facets value even when they have 0 matches (default `false`).
- [`matchingStrategy`](#matching-strategy): Determine the search strategy on words matching (default `last`).

The options are added as the third parameter of the `instantMeilisearch` function.

```js
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'

const searchClient = instantMeiliSearch(
  'https://ms-adf78ae33284-106.lon.meilisearch.io',
  'a63da4928426f12639e19d62886f621130f3fa9ff3c7534c5d179f0f51c4f303',
  {
    placeholderSearch: false, // default: true.
    primaryKey: 'id', // default: undefined
    // ...
  }
)
```

### Placeholder Search

Placeholders search means showing results even when the search query is empty. By default it is `true`.
When placeholder search is set to `false`, no results appears when searching on no characters. For example, if the query is "" no results appear.

```js
{ placeholderSearch : true } // default true
```

### Finite Pagination

Finite pagination is used when you want to add a numbered pagination at the bottom of your hits (for example: `<< < 1, 2, 3 > >>`).

It requires the usage of the [`Pagination` widget](#-pagination).

Example:

```js
{ finitePagination: true } // default: false
```


### Primary key

Specify the field in your documents containing the [unique identifier](https://docs.meilisearch.com/learn/core_concepts/documents.html#primary-field) (`undefined` by default). By adding this option, we avoid instantSearch errors that are thrown in the browser console. In `React` particularly, this option removes the `Each child in a list should have a unique "key" prop` error.

```js
{ primaryKey : 'id' } // default: undefined
```

### Keep zero facets

`keepZeroFacets` set to `true` keeps the facets even when they have 0 matching documents (default `false`).

When using `refinementList` it happens that by checking some facets, the ones with no more valid documents disapear.
Nonetheless you might want to still showcase them even if they have 0 matched documents with the current request:

Without `keepZeroFacets` set to `true`:
genres:
  - [x] horror (2000)
  - [x] thriller (214)
  - [ ] comedy (0)

With `keepZeroFacets` set to `false`, `comedy` disapears:

genres:
  - [x] horror (2000)
  - [x] thriller (214)

```js
{ keepZeroFacets : true } // default: false
```

### Matching strategy

`matchingStrategy` gives you the possibility to choose how Meilisearch should handle the presence of multiple query words, see [documentation](https://docs.meilisearch.com/reference/api/search.html#matching-strategy).

For example, if your query is `hello world` by default Meilisearch returns documents containing either both `hello` and `world` or documents that only contain `hello`. This is the `last` strategy, where words are stripped from the right.
The other strategy is `all`, where both `hello` and `world` **must** be present in a document for it to be returned.


```js
{
  matchingStrategy: 'all' // default last
}
```

## 🪡 Example with InstantSearch

The open-source [InstantSearch](https://www.algolia.com/doc/api-reference/widgets/js/) library powered by Algolia provides all the front-end tools you need to highly customize your search bar environment.

InstantSearch requires that you provide an indexName. The indexName corresponds to the [index `uid`](https://docs.meilisearch.com/learn/core_concepts/indexes.html#indexes) in which your document are stored in Meilisearch.

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
    'https://ms-adf78ae33284-106.lon.meilisearch.io',
    'a63da4928426f12639e19d62886f621130f3fa9ff3c7534c5d179f0f51c4f303'
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
- The [Meilisearch documentation](https://docs.meilisearch.com/).
- If you use React, check out [meilisearch-react](https://github.com/meilisearch/meilisearch-react/)
- If you use Vue, check out [meilisearch-vue](https://github.com/meilisearch/meilisearch-vue/)
- If you use Angular, check out [meilisearch-angular](https://github.com/meilisearch/meilisearch-angular/)


## 🤖 Compatibility with Meilisearch and InstantSearch

**Supported InstantSearch.js versions**:

This package only guarantees the compatibility with the [version v4 of InstantSearch.js](https://github.com/algolia/instantsearch.js/releases/tag/v4.24.1). It may work with older or newer InstantSearch versions, but these are not tested nor officially supported at this time.

**Supported Meilisearch versions**:

This package only guarantees the compatibility with the [version v1.0.0 of Meilisearch](https://github.com/meilisearch/meilisearch/releases/tag/v1.0.0).

**Node / NPM versions**:

- NodeJS >= 12.10 <= 18
- NPM >= 6.x

## 📜 API resources

List of all the components that are available in [instantSearch](https://github.com/algolia/instantsearch.js) and their compatibility with [Meilisearch](https://github.com/meilisearch/meilisearch/).

### Table Of Widgets

- ✅ [InstantSearch](#-instantsearch)
- ❌ [index](#-index)
- ✅ [SearchBox](#-searchbox)
- ✅ [Configure](#-configure)
- ❌ [ConfigureRelatedItems](#-configure-related-items)
- ❌ [Autocomplete](#-autocomplete)
- ✅ [Voice Search](#-voice-search)
- ✅ [Insight](#-insight)
- ✅ [Middleware](#-middleware)
- ✅ [RenderState](#-renderstate)
- ✅ [Hits](#-hits)
- ✅ [InfiniteHits](#-infinitehits)
- ✅ [Highlight](#-highlight)
- ✅ [Snippet](#-snippet)
- ✅ [Geo Search](#-geo-search)
- ❌ [Answers](#-answers)
- ✅ [RefinementList](#-refinementlist)
- ✅ [HierarchicalMenu](#-hierarchicalmenu)
- ✅ [RangeSlider](#-rangeslider)
- ✅ [Menu](#-menu)
- ✅ [currentRefinements](#-currentrefinements)
- ✅ [RangeInput](#-rangeinput)
- ✅ [MenuSelect](#-menuselect)
- ✅ [ToggleRefinement](#-togglerefinement)
- ✅ [NumericMenu](#-numericmenu)
- ✅ [RatingMenu](#-ratingmenu)
- ✅ [ClearRefinements](#-clearrefinements)
- ✅ [Pagination](#-pagination)
- ✅ [HitsPerPage](#-hitsperpage)
- ✅ [Breadcrumb](#-breadcrumb)
- ✅ [Stats](#-stats)
- ❌ [Analytics](#-analytics)
- ❌ [QueryRuleCustomData](#-queryrulecustomdata)
- ❌ [QueryRuleContext](#-queryrulecontext)
- ✅ [SortBy](#-sortby)
- ❌ [RelevantSort](#-relevantsort)
- ✅ [Routing](#-routing)


### ✅ InstantSearch

[instantSearch references](https://www.algolia.com/doc/api-reference/widgets/instantsearch/js/)

`instantSearch` is the main component. It manages the widget and lets you add new ones.

- ✅ IndexName: [`uid` of your index](https://docs.meilisearch.com/learn/core_concepts/indexes.html#indexes). _required_
- ✅ SearchClient: Search client, in our case instant-meilisearch. See [customization](#-customization) for details on options. _required_
- ❌ numberLocale: Does not work with both Algoliasearch and instant-meilisearch.
- ✅ searchFunction: Surcharge the search function provided by the search client.
- ✅ initialUiState: Determine the search state on app start.
- ✅ onStateChange: Change search state on change (see option above).
- ✅ stalledSearchDelay: Time in ms before search is considered stalled. [Used for loader](https://www.algolia.com/doc/guides/building-search-ui/going-further/improve-performance/js/#using-the-searchbox).
- ✅ routing: browser URL synchronization, search parameters appear in current URL ([guide](https://www.algolia.com/doc/guides/building-search-ui/going-further/routing-urls/js/)).
- ✅ insightsClient: Hook analytics to search actions ([see insight section](#-insight)).

```js
const search = instantsearch({
  indexName: 'instant_search',
  searchClient: instantMeiliSearch(
    'https://ms-adf78ae33284-106.lon.meilisearch.io',
    'a63da4928426f12639e19d62886f621130f3fa9ff3c7534c5d179f0f51c4f303',
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

Not compatible as Meilisearch does not support federated search on multiple indexes.

If you'd like to see federated search implemented please vote for it in the [roadmap](https://roadmap.meilisearch.com/c/74-multi-index-search?utm_medium=social&utm_source=portal_share).

### ✅ SearchBox

[SearchBox references](https://www.algolia.com/doc/api-reference/widgets/search-box/js/)

The `searchBox` widget is used to let the user perform a text-based query.

- ✅ container: The CSS Selector or HTMLElement to insert the widget into. _required_
- ✅ placeholder: Placeholder of the search box.
- ✅ autofocus: Whether the search box is focused on arrival.
- ✅ searchAsYouType: Whether result appears as you type or after pressing enter.
- ❌ showReset: Does not work with both algoliasearch and instant-meilisearch
- ❌ showSubmit: Does not work with both algoliasearch and instant-meilisearch
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

We also suggest looking at [Meilisearch's search parameters](https://docs.meilisearch.com/reference/features/search_parameters.html) to determine how they act.

```js
instantsearch.widgets.configure({
  hitsPerPage: 20,
  // other algoliasearch parameters
})
```

### ❌ ConfigureRelatedItems

[ConfigureRelatedItems references](https://www.algolia.com/doc/api-reference/widgets/configure-related-items/js/).

No compatibility with Meilisearch because the component uses [sumOrFiltersScores](https://www.algolia.com/doc/api-reference/api-parameters/sumOrFiltersScores/) and [optionalFilters](https://www.algolia.com/doc/api-reference/api-parameters/optionalFilters/) search parameters that do not exist in Meilisearch.

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

InstantMeilisearch is not compatible with the autocomplete package.

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

It works only on widgets that are compatible with `instant-meilisearch`.

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
- ❌ showPrevious: Does not work with both Algoliasearch and InstantMeilisearch.
- ❌ cache: Not added in InstantMeilisearch.

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

See [Hits](#-hits) for an example.

### ✅ Snippet

[Snippet references](https://www.algolia.com/doc/api-reference/widgets/snippet/js/)

The `snippet` function returns an attribute from a hit into its snippet form, when relevant.

- ✅ attribute: The attribute of the record to snippet and highlight. _required_
- ✅ hit: Hit object. _required_
- ✅ highlightedTagName: HTML element to wrap the highlighted parts of the string.

Note that the attribute has to be added to `attributesToSnippet` in [configuration](#-configure). Highlight is applied on snippeted fields.

Snippeting is called `cropping` in Meilisearch, [more about it here](https://docs.meilisearch.com/reference/features/search_parameters.html#attributes-to-retrieve). It is possible to change the size of the snippeting by adding its character size in the attributesToSnippet parameter. <br>
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

### ✅ Geo Search

[Geo search references](https://www.algolia.com/doc/api-reference/widgets/geo-search/js/)

The `geoSearch` widget displays search results on a Google Map. It lets you search for results based on their position and provides some common usage patterns such as “search on map interactions”.

- ✅ container: The CSS Selector or HTMLElement to insert the Google maps into. _required_
- ✅ googleReference: The reference to the global window.google object. See the [Google Maps](https://developers.google.com/maps/documentation/javascript/overview) documentation for more information. _required_

- ✅ initialZoom: When no search results are found, google map will default to this zoom.
- ✅ initialPosition: When no search results are found, google map will default to this position.
- ✅ mapOptions: The options forwarded to the Google Maps constructor.
- ❔ builtInMarker: Used to customize Google Maps markers. Because of lack of tests we cannot guarantee its compatibility. For more information please visit [InstantSearch related documentation](https://www.algolia.com/doc/api-reference/widgets/geo-search/js/#widget-param-builtinmarker).
- customHTMLMarker: Same as `builtInMarker`. Because of lack of tests, we cannot guarantee its compatibility. For more information please visit [InstantSearch related documentation](https://www.algolia.com/doc/api-reference/widgets/geo-search/js/#widget-param-customhtmlmarker).
- ✅ enableRefine: If true, the map is used for refining the search. Otherwise, it’s only for display purposes.
- ✅ enableClearMapRefinement: If `true`, a button is displayed on the map when the refinement is coming from interacting with it, to remove it.
- ✅ enableRefineControl: If `true`, the map is used for refining the search. Otherwise, it’s only for display purposes.
- ✅ enableRefineOnMapMove: If `true`, a button is displayed on the map when the refinement is coming from interacting with it, to remove it.,
- ✅ templates: The templates to use for the widget.
- ✅ cssClasses: The CSS classes to override.

[See our playground for a working exemple](./playgrounds/geo-javascript/src/app.js) and this section in our [contributing guide](./CONTRIBUTING.md#-geo-search-playground) to set up your `Meilisearch`.

#### Requirements

The Geosearch widgey only works with a valid Google API key.

In order to communicate your Google API key, your `instantSearch` widget should be surrounded by the following function:

```js
import injectScript from 'scriptjs'

injectScript(
  `https://maps.googleapis.com/maps/api/js?v=quarterly&key=${GOOGLE_API}`,
  () => {
      const search = instantsearch({
      indexName: 'geo',
      // ...
      })
      // ...
  })
```

Replace `${GOOGLE_API}` with you google api key.

See [code example in the playground](./playgrounds/geo-javascript/src/app.js)

### Usage

The classic usage, with only the `required` elements, renders an embedded Google Map on which you can move and refine search based on the position maps.

```js
  instantsearch.widgets.geoSearch({
    container: '#maps',
    googleReference: window.google,
  }),
```

For further customization, for example to determine an initial position for the map. Contrary to `initialZoom` and `initialPosition`, triggers a search request with the provided information.

The following parameters exist:

- `boundingBox`: The Google Map window box. It is used as parameter in a search request. It takes precedent on all the following parameters.
- `aroundLatLng`: The middle point of the Google Map. If `insideBoundingBox` or `boundingBox` is present, it is ignored.
- `aroundRadius`: The radius around a Geo Point, used for sorting in the search request. It only works if `aroundLatLng` is present as well. If `insideBoundingBox` or `boundingBox` is present, it is ignored.


For exemple, by adding `boundingBox` in the [`instantSearch`](#-instantsearch) widget parameters, the parameter will be used as a search parameter for the first request.

```js
  initialUiState: {
    geo: {
      geoSearch: {
        boundingBox:
          '50.680720183653065, 3.273798366642514,50.55969330590075, 2.9625244444490253',
      },
    },
  },
```
Without providing this parameter, Google Maps will default to a window containing all markers from the provided search results.

Alternatively, the parameters can be passed through the [`searchFunction`](https://www.algolia.com/doc/api-reference/widgets/instantsearch/js/#widget-param-searchfunction) parameter of the [`instantSearch`](#-instantsearch) widget. Contrary to `initialUiState` these parameters overwrite the values on each search.

```js
  searchFunction: function (helper) {
    helper.setQueryParameter('aroundRadius', 75000)
    helper.setQueryParameter('aroundLatLng', '51.1241999, 9.662499900000057');
    helper.search()
  },
```

[Read the guide on how GeoSearch works in Meilisearch](https://docs.meilisearch.com/reference/features/geosearch.html#geosearch).

### ❌ Answers

[Answers references](https://www.algolia.com/doc/api-reference/widgets/answers/js/).

No compatibility because Meilisearch does not support this experimental feature.

### ✅ RefinementList

[Refinement list references](https://www.algolia.com/doc/api-reference/widgets/refinement-list/js/)

The `refinementList` widget is one of the most common widgets you can find in a search UI. With this widget, the user can filter the dataset based on facets.

- ✅ container: The CSS Selector or HTMLElement to insert the refinements. _required_
- ✅ attribute: The facet to display _required_
- ✅ operator: How to apply facets, `and` or `or` (`and` is the default value).
- ✅ limit: How many facet values to retrieve.
- ✅ showMore: Whether to display a button that expands the number of items.
- ✅ showMoreLimit: The maximum number of displayed items. Does not work when showMoreLimit > limit.
- ❌ searchable: Whether to add a search input to let the user search for more facet values. Not supported by Meilisearch. If you'd like to see it implemented [please vote](https://roadmap.meilisearch.com/c/64-search-for-facet-values?utm_medium=social&utm_source=portal_share).
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

⚠️ To make refinementList work, [please refer to this](#hierarchical-menu-usage).

### ✅ HierarchicalMenu

[Hierarchical menu references](https://www.algolia.com/doc/api-reference/widgets/hierarchical-menu/js/)

The `hierarchicalMenu` widget is used to create navigation based on a hierarchy of facet attributes. It is commonly used for categories with subcategories. See [usage](#hierarchical-menu-usage) below.

- ✅ container: The CSS Selector or HTMLElement to insert the refinements. _required_
- ✅ attribute: The name of the attributes to generate the menu with. _required_.
- ✅ limit: How many facet values to retrieve.
- ✅ showMore: Whether to display a button that expands the number of items.
- ✅ showMoreLimit: The maximum number of displayed items (min `2`).
- ❌ separator: The level separator used in the records. (default `>`).
- 🤷‍♀️ rootPath: The prefix path to use if the first level is not the root level.
- ❌ showParentLevel: Whether to show the siblings of the selected parent level of the current refined value.
- ✅ sortBy: How to sort refinements. [See guide](https://www.algolia.com/doc/api-reference/widgets/hierarchical-menu/js/#widget-param-sortby)
- ✅ templates: The templates to use for the widget.- ✅ templates: The templates to use for the widget.
- ✅ cssClasses: The CSS classes to override.

#### Hierarchical Menu Usage
To make it work with Meilisearch your documents must have a specific structure, an explanation of the structure can [be found here](https://www.algolia.com/doc/api-reference/widgets/hierarchical-menu/js/#requirements).

Contrary to `instantsearch.js`, the hierarchical fields are added in [`filterableAttributes`](https://docs.meilisearch.com/reference/api/filterable_attributes.html#update-filterable-attributes).

Example:
Give the following document structure:
```json
{
    "id": 1,
    "name": "Basic T-shirt",
    "categories.lvl0": "Men",
    "categories.lvl1": "Men > clothes",
    "categories.lvl2": "Men > clothes > t-shirt"
  }
```

You have to add the fields `categories.lvl0`, `categories.lvl1` and `categories.lvl2` in the `filterableAttributes` in your Meilisearch settings.
```json
{
  "filterableAttributes": [
    "categories.lvl0",
    "categories.lvl1",
    "categories.lvl2"
  ]
}
```


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

Min and max of attributes are not returned from Meilisearch and thus **must be set manually**.

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

⚠️ Not compatible with Meilisearch by default, needs a workaround. See workaround in [RangeSlider](#-rangeslider) section.

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

### ✅ RatingMenu

[Rating menu references](https://www.algolia.com/doc/api-reference/widgets/rating-menu/js/)

The `RatingMenu` widget lets the user refine search results by clicking on stars. The stars are based on the selected attribute.

- ✅ container: The CSS Selector or HTMLElement to insert the widget into. _required_
- ✅ attribute: The name of the attribute in the document. _required_.
- ✅ max: The maximum value for the rating. This value is exclusive, which means the number of stars will be the provided value, minus one.
- ✅ templates: The templates to use for the widget.
- ✅ cssClasses: The CSS classes to override.

Contrary to `instantsearch.js`, To be able to use `RatingMenu` the field containing the rating has to be added in the [`filterableAttributes`](https://docs.meilisearch.com/reference/api/filterable_attributes.html#update-filterable-attributes) setting in your index settings.

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

The `pagination` widget displays a pagination system allowing the user to change the current page. It should be used alongside the [`finitePagination`](#finite-pagination) setting to render the correct amount of pages.

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

### ✅ Breadcrumb

[Breadcrumb references](https://www.algolia.com/doc/api-reference/widgets/breadcrumb/js/)

The `breadcrumb` widget is a secondary navigation scheme that lets the user see where the current page is in relation to the facet’s hierarchy. The `HierarchicalMenu` widget has the same requirements, see its [usage](#hierarchical-menu-usage) to make breadcrumb work.

- ✅ container: The CSS Selector or HTMLElement to insert the refinements. _required_
- ✅ attribute: The name of the attributes to generate the menu with. _required_.
- ❌ separator: The level separator used in the records. (default `>`).
- 🤷‍♀️ rootPath: The prefix path to use if the first level is not the root level.
- ✅ templates: The templates to use for the widget.
- ✅ cssClasses: The CSS classes to override.


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

Deprecated. See [Insight](#-insight).

### ❌ QueryRuleCustomData

[QueryRuleCustomData references](https://www.algolia.com/doc/api-reference/widgets/query-rule-custom-data/js/)

You may want to use this widget to display banners or recommendations returned by [Rules](https://www.algolia.com/doc/api-client/methods/rules/), and that match search parameters.

No compatibility because Meilisearch does not support Rules.

### ❌ QueryRuleContext

[Query rule context references](https://www.algolia.com/doc/api-reference/widgets/query-rule-context/js/)

The queryRuleContext widget lets you apply ruleContexts based on filters to trigger context-dependent [Rules](https://www.algolia.com/doc/api-client/methods/rules/).

No compatibility because Meilisearch does not support Rules.

### ✅ SortBy

[Sort by references](https://www.algolia.com/doc/api-reference/widgets/sort-by/js/)

The `SortBy` widget is used to create multiple sort formulas. Allowing a user to change the way hits are sorted.

- ✅ container: The CSS Selector or HTMLElement to insert the widget into. _required_
- ✅ items: The list of different sorting possibilities. _required_
- ✅ cssClasses: The CSS classes to override.
- ✅ transformItems: function receiving the items, called before displaying them.

The usage of the `SortBy` widget differs from the one found in Algolia's documentation. In instant-meilisearch the following is possible:

- Sort using different indexes.
- Different `sort` rules on the same index.

The items list is composed of objects containing every sort possibility you want to provide to your user. Each object must contain two fields:
  - `label`: What is showcased on the user interface ex: `Sort by Ascending Price`
  - `value`: The sort formula.

#### Sort formula

A sort formula is expressed like this: `index:attribute:order`.

`index` is mandatory, and when adding `attribute:order`, they must always be added together.

When sorting on an attribute, the attribute has to be added to the [`sortableAttributes`](https://docs.meilisearch.com/reference/api/sortable_attributes.html) setting on your index.

Example:
```js
[
  { label: 'Sort By Price', value: 'clothes:price:asc' }
]
```

In this scenario, in the `clothes` index, we want the price to be sorted in an ascending way. For this formula to be valid, `price` must be added to the `sortableAttributes` settings of the `clothes` index.

#### Relevancy

The impact sorting has on the returned hits is determined by the [`ranking-rules`](https://docs.meilisearch.com/learn/core_concepts/relevancy.html#ranking-rules) ordered list of each index. The `sort` ranking-rule position in the list makes sorting documents more or less important than other rules. If you want to change the sort impact on the relevancy, it is possible to change it in the [ranking-rule setting](https://docs.meilisearch.com/learn/core_concepts/relevancy.html#relevancy). For example, to favor exhaustivity over relevancy.

See [relevancy guide](https://docs.meilisearch.com/learn/core_concepts/relevancy.html#relevancy).

#### Example

```js
  instantsearch.widgets.sortBy({
    container: '#sort-by',
    items: [
      { value: 'clothes', label: 'Relevant' }, // default index
      {
        value: 'clothes:price:desc', // Sort on descending price
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


## ⚙️ Development Workflow and Contributing

Any new contribution is more than welcome in this project!

If you want to know more about the development workflow or want to contribute, please visit our [contributing guidelines](/CONTRIBUTING.md) for detailed instructions!

<hr>

**Meilisearch** provides and maintains many **SDKs and Integration tools** like this one. We want to provide everyone with an **amazing search experience for any kind of project**. If you want to contribute, make suggestions, or just know what's going on right now, visit us in the [integration-guides](https://github.com/meilisearch/integration-guides) repository.
