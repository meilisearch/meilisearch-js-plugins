<p align="center">
  <img src="https://raw.githubusercontent.com/meilisearch/integration-guides/main/assets/logos/logo.svg" alt="Instant-Meilisearch" width="200" height="200" />
</p>

<h1 align="center">Meilisearch Javascript plugins</h1>

<p align="center">
  <a href="https://github.com/meilisearch/meilisearch-js-plugins/actions"><img src="https://github.com/meilisearch/meilisearch-js-plugins/workflows/Tests/badge.svg?branch=main" alt="Tests"></a>
  <a href="https://github.com/meilisearch/meilisearch-js-plugins/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-informational" alt="License"></a>
  <a href="https://github.com/meilisearch/meilisearch/discussions" alt="Discussions"><img src="https://img.shields.io/badge/github-discussions-red" /></a>
  <a href="https://ms-bors.herokuapp.com/repositories/48"><img src="https://bors.tech/images/badge_small.svg" alt="Bors enabled"></a>
</p>

**Meilisearch** is an open-source search engine. [Discover what Meilisearch is!](https://github.com/meilisearch/meilisearch)

This repository contains clients and plugins to use Meilisearch with third party tools.

## Table of Contents <!-- omit in toc -->

- [📖 Documentation](#-documentation)
- [🐱 Plugins](#-plugins)
- [⚙️ Development Workflow and Contributing](#️-development-workflow-and-contributing)

## 📖 Documentation

For general information on how to use Meilisearch—such as our API reference, tutorials, guides, and in-depth articles—refer to our [main documentation website](https://docs.meilisearch.com/).

## 🐱 Plugins

### Plugins in this repository
|                                                    |                                                                                           |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [`instant-meilisearch`](./packages/instant-meilisearch)  | The search client for [instantsearch.js](https://github.com/algolia/instantsearch).                                         |
| [`autocomplete-client`](./packages/autocomplete-client)  | The search client for [autocomplete](https://github.com/algolia/autocomplete).                                         |
|                              |                                         |

### Other Plugins

|                                                    |                                                                                           |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [`strapi-plugin-meilisearch`](https://github.com/meilisearch/strapi-plugin-meilisearch)  | The plugin to add and synchronize your [Strapi](https://strapi.io/) collections on Meilisearch.                                         |
| [`firestore-meilisearch`](https://github.com/meilisearch/firestore-meilisearch/)  | The plugin to synchronize your [firestore](https://firebase.google.com/docs/firestore) data on Meilisearch.                                         |
| [`gatsby-plugin-meilisearch`](https://github.com/meilisearch/gatsby-plugin-meilisearch/)  | The plugin to index your [Gatsby](https://www.gatsbyjs.com/) content to Meilisearch.                                         |
| [`docs-searchbar.js`](https://github.com/meilisearch/docs-searchbar.js)  | A search bar integration for all kinds of documentation.                                         |
| [`vuepress-plugin-meilisearch`](https://github.com/meilisearch/vuepress-plugin-meilisearch)  | The plugin to use docs-searchbar.js with `vuepress`.                                         |
|                              |                                         |

## ⚙️ Development Workflow and Contributing

Any new contribution is more than welcome in this project!

If you want to know more about the development workflow or want to contribute to the plugins in this repository, please visit our [contributing guidelines](/CONTRIBUTING.md) for detailed instructions!

<hr>

**Meilisearch** provides and maintains many **SDKs and Integration tools** like this one. We want to provide everyone with an **amazing search experience for any kind of project**. If you want to contribute, make suggestions, or just know what's going on right now, visit us in the [integration-guides](https://github.com/meilisearch/integration-guides) repository.
