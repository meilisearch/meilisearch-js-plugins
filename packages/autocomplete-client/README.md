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

<div align="center">
<!-- TODO: provide our own code-sandbox -->
  <a href="https://codesandbox.io/s/github/algolia/autocomplete/tree/next/examples/playground?file=/app.tsx">
    <img src="./media/autocomplete-example.png" alt="Screenshot" width="600px">
  </a>
</div>

Since `autocomplete.js` provides the possibility to use a custom `data source`, we are able to plug into it. Nonetheless, it has been created by Algolia and thus some of its components only works with Algolia.


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
- `meilisearchAutocompleteClient`: the search client.
- `getMeilisearchResults`: The data source handler.

## Getting started

In the following


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
            return html` <div>
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
