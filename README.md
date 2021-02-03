<p align="center">
  <img src="https://raw.githubusercontent.com/meilisearch/integration-guides/master/assets/logos/logo.svg" alt="Instant-MeiliSearch" width="200" height="200" />
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
  <a href="https://github.com/meilisearch/instant-meilisearch/actions"><img src="https://github.com/meilisearch/instant-meilisearch/workflows/Tests/badge.svg?branch=master" alt="Tests"></a>
  <a href="https://github.com/meilisearch/instant-meilisearch/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-informational" alt="License"></a>
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
$ npm install @meilisearch/instant-meilisearch
```

```bash
$ yarn add @meilisearch/instant-meilisearch
```

## Usage

### Basic

```js
import instantMeiliSearch from "@meilisearch/instant-meilisearch";

const searchClient = instantMeiliSearch(
  "https://demos.meilisearch.com",
  "dc3fedaf922de8937fdea01f0a7d59557f1fd31832cb8440ce94231cfdde7f25"
);
```

### Customization

```js
import instantMeiliSearch from "@meilisearch/instant-meilisearch";

const searchClient = instantMeiliSearch(
  "https://demos.meilisearch.com",
  "dc3fedaf922de8937fdea01f0a7d59557f1fd31832cb8440ce94231cfdde7f25",
  {
    paginationTotalHits: 30, // default: 200.
    placeholderSearch: false // default: true.
  }
);
```

- `placeholderSearch` (`true` by default). Displays documents even when the query is empty.

- `paginationTotalHits` (`200` by default): The total (and finite) number of hits you can browse during pagination when using the [pagination widget](https://www.algolia.com/doc/api-reference/widgets/pagination/js/). If the pagination widget is not used, `paginationTotalHits` is ignored.<br>
Which means that, with a `paginationTotalHits` default value of 200, and `hitsPerPage` default value of 20, you can browse `paginationTotalHits / hitsPerPage` => `200 / 20 = 10` pages during pagination. Each of the 10 pages containing 20 results.<br>
The default value of `hitsPerPage` is set to `20` but it can be changed with [`InsantSearch.configure`](https://www.algolia.com/doc/api-reference/widgets/configure/js/#examples).<br>
⚠️ MeiliSearch is not designed for pagination and this can lead to performances issues, so the usage of the pagination widget is not encouraged. However, the `paginationTotalHits` parameter lets you implement this pagination with less performance issue as possible: depending on your dataset (the size of each document and the number of documents) you might decrease the value of `paginationTotalHits`.<br>
More information about MeiliSearch and the pagination [here](https://github.com/meilisearch/documentation/issues/561).

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
- If you use React, you might check out [meilisearch-react](https://github.com/meilisearch/meilisearch-react/)
- If you use Vue, you might check out [meilisearch-vue](https://github.com/meilisearch/meilisearch-vue/)

## Compatibility with MeiliSearch

This package only guarantees the compatibility with the [version v0.19.0 of MeiliSearch](https://github.com/meilisearch/MeiliSearch/releases/tag/v0.19.0).

## Development Workflow and Contributing

Any new contribution is more than welcome in this project!

If you want to know more about the development workflow or want to contribute, please visit our [contributing guidelines](/CONTRIBUTING.md) for detailed instructions!

<hr>

**MeiliSearch** provides and maintains many **SDKs and Integration tools** like this one. We want to provide everyone with an **amazing search experience for any kind of project**. If you want to contribute, make suggestions, or just know what's going on right now, visit us in the [integration-guides](https://github.com/meilisearch/integration-guides) repository.
