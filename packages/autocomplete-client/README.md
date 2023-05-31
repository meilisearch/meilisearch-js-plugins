<p align="center">
  <img src="https://raw.githubusercontent.com/meilisearch/integration-guides/main/assets/logos/logo.svg" alt="Instant-Meilisearch" width="200" height="200" />
</p>

<h1 align="center">Autocomplete Meilisearch Client</h1>

<h4 align="center">
  <a href="https://github.com/meilisearch/meilisearch">Meilisearch</a> |
  <a href="https://docs.meilisearch.com">Documentation</a> |
  <a href="https://discord.meilisearch.com">Discord</a> |
  <a href="https://roadmap.meilisearch.com/tabs/1-under-consideration">Roadmap</a> |
  <a href="https://www.meilisearch.com">Website</a> |
  <a href="https://docs.meilisearch.com/faq">FAQ</a>
</h4>

<p align="center">
  <a href="https://www.npmjs.com/package/@meilisearch/autocomplete-client"><img src="https://img.shields.io/npm/v/@meilisearch/autocomplete-client.svg" alt="npm version"></a>
  <a href="https://github.com/meilisearch/instant-meilisearch/actions"><img src="https://github.com/meilisearch/instant-meilisearch/workflows/Tests/badge.svg?branch=main" alt="Tests"></a>
  <a href="https://github.com/meilisearch/instant-meilisearch/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-informational" alt="License"></a>
  <a href="https://github.com/meilisearch/meilisearch/discussions" alt="Discussions"><img src="https://img.shields.io/badge/github-discussions-red" /></a>
  <a href="https://ms-bors.herokuapp.com/repositories/48"><img src="https://bors.tech/images/badge_small.svg" alt="Bors enabled"></a>
</p>

**Meilisearch** is an open-source search engine. [Discover what Meilisearch is!](https://github.com/meilisearch/meilisearch)

This library is the search client that you should use to make [Meilisearch](https://github.com/meilisearch/meilisearch) work with [autocomplete](https://github.com/algolia/autocomplete). Autocomplete, an open-source project developed by Algolia, is a JavaScript library that lets you quickly build an autocomplete experiences.

Since `autocomplete.js` provides the possibility to use a custom `data source`, we are able to plug into it. Nonetheless, it has been created by Algolia and thus some of its components only works with Algolia.


## Table of Contents <!-- omit in toc -->

- [📖 Documentation](#-documentation)
- [🔧 Installation](#-installation)
- [🎬 Usage](#-usage)
- [🎬 Getting started](#-getting-started)
- [💅 Customization](#-customization)
- [🤖 Compatibility with Meilisearch and Autocomplete](#-compatibility-with-meilisearch-and-autocomplete)
- [⚙️ Development Workflow and Contributing](#️-development-workflow-and-contributing)


## 📖 Documentation

For general information on how to use Meilisearch—such as our API reference, tutorials, guides, and in-depth articles—refer to our [main documentation website](https://docs.meilisearch.com/).

For information on how to use the `autocomplete` library refer to its [documentation](https://www.algolia.com/doc/ui-libraries/autocomplete/introduction/what-is-autocomplete/). It provides all the necessary information to set up your autocomplete experience.

## 🔧 Installation

Use `npm` or `yarn` to install the autocomplete client for Meilisearch.

```
yarn add @meilisearch/autocomplete-client
# or
npm install @meilisearch/autocomplete-client
```

`@meilisearch/autocomplete-client` is a client for `autocomplete`. It does not import the library.<br>
To be able to use both, you need to [install `autocomplete`](https://www.algolia.com/doc/ui-libraries/autocomplete/introduction/getting-started/) as well.

## 🎬 Usage

The Meilisearch Autocomplete client provides 2 methods:
- `meilisearchAutocompleteClient({ host, url, options? })`: The search client.
  - `url`: The URL to your Meilisearch instance.
  - `apiKey`: A valid API key with enough rights to search. ⚠️ Avoid using the admin key or master key
  - `options`: Additional options. See [this section](#-customization)
- `getMeilisearchResults(searchClient, queries)`: The data source handler.
  - `searchClient`: The client created with `meilisearchAutocompleteClient`
  - `queries`: An array of queries. See [this documentation](https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-js/getAlgoliaResults/#param-queries-2) on what `queries` accepts.


## 🎬 Getting started

To make `autocomplete` work with Meilisearch, create the `autocompleteSearchClient` and provide it to the `getMeilisearchResults` method as the `searchClient`.
The following code provides a basic working code example.

```js
import { autocomplete } from '@algolia/autocomplete-js'
import {
  meilisearchAutocompleteClient,
  getMeilisearchResults,
} from '@meilisearch/autocomplete-client'
import '@algolia/autocomplete-theme-classic'

const searchClient = meilisearchAutocompleteClient(
  'https://ms-adf78ae33284-106.lon.meilisearch.io', // Host
  'a63da4928426f12639e19d62886f621130f3fa9ff3c7534c5d179f0f51c4f303'  // API key
)

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search for games',
  getSources({ query }) {
    return [
      {
        sourceId: 'steam-video-games',
        getItems() {
          return getMeilisearchResults({
            searchClient,
            queries: [
              {
                indexName: 'steam-video-games',
                query,
              },
            ],
          })
        },
        templates: {
          item({ item, components, html }) {
            return html`<div>
              <div>${item.name}</div>
              <div>${item.description}</div>
            </div>`
          },
        },
      },
    ]
  },
})

```

## 💅 Customization

The `options` field in the `meilisearchAutocompleteClient` function provides the possibility to alter the default behavior of the search.

- [`placeholderSearch`](#placeholder-search): Enable or disable placeholder search (default: `true`).
- [`primaryKey`](#primary-key): Specify the primary key of your documents (default `undefined`).
- [`keepZeroFacets`](#keep-zero-facets): Show the facets value even when they have 0 matches (default `false`).
- [`matchingStrategy`](#matching-strategy): Determine the search strategy on words matching (default `last`).
- [`requestConfig`](#request-config): Use custom request configurations.
- ['httpClient'](#custom-http-client): Use a custom HTTP client.

```js
const client = meilisearchAutocompleteClient({
  url: 'http://localhost:7700',
  apiKey: 'searchKey',
  options: {
    placeholderSearch: false,
  },
})
```

### Placeholder Search

Placeholders search means showing results even when the search query is empty. By default it is `true`.
When placeholder search is set to `false`, no results appears when the search box is empty.

```js
{ placeholderSearch : true } // default true
```

### Primary key

Specify the field in your documents containing the [unique identifier](https://docs.meilisearch.com/learn/core_concepts/documents.html#primary-field) (`undefined` by default). By adding this option, we avoid errors that are thrown in some environments. For example, In `React` particularly, this option removes the `Each child in a list should have a unique "key" prop` error.

```js
{ primaryKey : 'id' } // default: undefined
```

### Keep zero facets

`keepZeroFacets` set to `true` keeps the facets even when they have 0 matching documents (default `false`).

If in your autocomplete implementation you are showing the facet values distribution, same values may completely disapear when they have no matching documents in the current filtering state.

By setting this option to `true`, the facet values do not disapear and instead are given the distribution `0`.

With `keepZeroFacets` set to `true`:

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
{ matchingStrategy: 'all' }  // default last
```

### Request Config

You can provide a custom request configuration. Available field can be [found here](https://fetch.spec.whatwg.org/#requestinit).

For example, with custom headers:

```ts
{
  requestConfig: {
    headers: {
      Authorization: AUTH_TOKEN
    },
    credentials: 'include'
  }
}
```


### Custom HTTP client

You can use your own HTTP client, for example, with [`axios`](https://github.com/axios/axios).

```ts
{
  httpClient: async (url, opts) => {
    const response = await $axios.request({
      url,
      data: opts?.body,
      headers: opts?.headers,
      method: (opts?.method?.toLocaleUpperCase() as Method) ?? 'GET'
    })
    return response.data
  }
}
```

## 🤖 Compatibility with Meilisearch and Autocomplete

**Supported autocomplete versions**:

This package only guarantees the compatibility with the [version v1.x.x of Autocomplete](https://github.com/algolia/autocomplete). It may work with older or newer versions, but these are not tested nor officially supported at this time.

**API compatibility with `autocomplete`**
Some `autocomplete` parameters are not working using the meilisearch autocomplete client.

- The autocomplete [insights parameter](https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-js/autocomplete/#param-insights)
- The [autocomplete-plugin-algolia-insights](https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-algolia-insights/) plugin

**Supported Meilisearch versions**:

This package guarantees compatibility with [version v1.x of Meilisearch](https://github.com/meilisearch/meilisearch/releases/latest), but some features may not be present. Please check the [issues](https://github.com/meilisearch/instant-meilisearch/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22+label%3Aenhancement) for more info.

**Node / NPM versions**:

- NodeJS >= 14 <= 18

## ⚙️ Development Workflow and Contributing

Any new contribution is more than welcome in this project!

If you want to know more about the development workflow or want to contribute, please visit our [contributing guidelines](../../CONTRIBUTING.md) for detailed instructions!

<hr>

**Meilisearch** provides and maintains many **SDKs and Integration tools** like this one. We want to provide everyone with an **amazing search experience for any kind of project**. If you want to contribute, make suggestions, or just know what's going on right now, visit us in the [integration-guides](https://github.com/meilisearch/integration-guides) repository.
