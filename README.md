<p align="center">
  <img src="https://raw.githubusercontent.com/meilisearch/integration-guides/master/assets/logos/logo.svg" alt="Instant-MeiliSearch" width="200" height="200" />
</p>

<h1 align="center">Instant MeiliSearch</h1>

<h4 align="center">
  <a href="https://github.com/meilisearch/MeiliSearch">MeiliSearch</a> |
  <a href="https://www.meilisearch.com">Website</a> |
  <a href="https://blog.meilisearch.com">Blog</a> |
  <a href="https://twitter.com/meilisearch">Twitter</a> |
  <a href="https://docs.meilisearch.com">Documentation</a> |
  <a href="https://docs.meilisearch.com/faq">FAQ</a>
</h4>

<p align="center">
  <a href="https://www.npmjs.com/package/@meilisearch/instant-meilisearch"><img src="https://img.shields.io/npm/v/@meilisearch/instant-meilisearch.svg" alt="npm version"></a>
  <a href="https://github.com/meilisearch/instant-meilisearch/actions"><img src="https://github.com/meilisearch/instant-meilisearch/workflows/Tests/badge.svg?branch=master" alt="Tests"></a>
  <a href="https://github.com/meilisearch/instant-meilisearch/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-informational" alt="License"></a>
  <a href="https://slack.meilisearch.com"><img src="https://img.shields.io/badge/slack-MeiliSearch-blue.svg?logo=slack" alt="Slack"></a>
  <a href="https://github.com/meilisearch/MeiliSearch/discussions" alt="Discussions"><img src="https://img.shields.io/badge/github-discussions-red" /></a>
</p>

<p align="center">⚡ How to integrate a front-end search bar in your website using MeiliSearch</p>

**MeiliSearch** is a powerful, fast, open-source, easy to use and deploy search engine. Both searching and indexing are highly customizable. Features such as typo-tolerance, filters, and synonyms are provided out-of-the-box.

This library is a plugin to establish the communication between your [MeiliSearch](https://github.com/meilisearch/MeiliSearch) instance and the open-source [InstantSearch](https://github.com/algolia/instantsearch.js) tools (powered by Algolia) for your front-end application.

If you use React or Vue, you might want to check out these repositories:

- [meilisearch-react](https://github.com/meilisearch/meilisearch-react/)
- [meilisearch-vue](https://github.com/meilisearch/meilisearch-vue/)

NB: If you don't have any MeiliSearch instance running and containing your data, you should take a look at this [getting started page](https://docs.meilisearch.com/guides/introduction/quick_start_guide.html).

## Usage

### Basic

```js
const searchClient = instantMeiliSearch(
  "https://demos.meilisearch.com",
  "dc3fedaf922de8937fdea01f0a7d59557f1fd31832cb8440ce94231cfdde7f25"
);
```

### Customization

```js
const searchClient = instantMeiliSearch(
  "https://demos.meilisearch.com",
  "dc3fedaf922de8937fdea01f0a7d59557f1fd31832cb8440ce94231cfdde7f25",
  {
    hitsPerPage: 6, // default: 10
    limitPerRequest: 30 // default: 50
  }
);
```

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

    <script src="https://cdn.jsdelivr.net/npm/@meilisearch/instant-meilisearch/dist/instant-meilisearch.umd.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/instantsearch.js@4"></script>
    <script src="./app.js"></script>
  </body>
</html>
```

In `app.js`:

```js
const search = instantsearch({
  indexName: "codesandbox-IS",
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

This package is compatible with the following MeiliSearch versions:

- `v0.12.X`

## Development Workflow and Contributing

Any new contribution is more than welcome in this project!

If you want to know more about the development workflow or want to contribute, please visit our [contributing guidelines](/CONTRIBUTING.md) for detailed instructions!

<hr>

**MeiliSearch** provides and maintains many **SDKs and Integration tools** like this one. We want to provide everyone with an **amazing search experience for any kind of project**. If you want to contribute, make suggestions, or just know what's going on right now, visit us in the [integration-guides](https://github.com/meilisearch/integration-guides) repository.
