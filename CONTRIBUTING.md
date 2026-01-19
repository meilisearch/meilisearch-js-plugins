# Contributing

First of all, thank you for contributing to Meilisearch! The goal of this document is to provide everything you need to know in order to contribute to Meilisearch and its different integrations.

- [Coding with AI](#coding-with-ai)
- [Assumptions](#assumptions)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Git Guidelines](#git-guidelines)
- [Release Process (for internal team only)](#release-process-for-internal-team-only)

## Coding with AI

We accept the use of AI-powered tools (GitHub Copilot, ChatGPT, Claude, Cursor, etc.) for contributions, whether for code, tests, or documentation.

⚠️ However, transparency is required: if you use AI assistance, please mention it in your PR description. This helps maintainers during code review and ensure the quality of contributions.

What we expect:
- **Disclose AI usage**: A simple note like "Used GitHub Copilot for autocompletion" or "Generated initial test structure with ChatGPT" is sufficient.
- **Specify the scope**: Indicate which parts of your contribution involved AI assistance.
- **Review AI-generated content**: Ensure you understand and have verified any AI-generated code before submitting.

## Assumptions

1. **You're familiar with [GitHub](https://github.com) and the [Pull Request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests) (PR) workflow.**
2. **You've read the Meilisearch [documentation](https://www.meilisearch.com/docs) and the [README](/README.md).**
3. **You know about the [Meilisearch community](https://discord.com/invite/meilisearch). Please use this for help.**

## How to Contribute

1. Make sure that the contribution you want to make is explained or detailed in a GitHub issue! Find an [existing issue](https://github.com/meilisearch/meilisearch-js-plugins/issues/) or [open a new one](https://github.com/meilisearch/meilisearch-js-plugins/issues/new).
2. Once done, [fork the instant-meilisearch repository](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) in your own GitHub account. Ask a maintainer if you want your issue to be checked before making a PR.
3. [Create a new Git branch](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-and-deleting-branches-within-your-repository).
4. Review the [Development Workflow](#development-workflow) section that describes the steps to maintain the repository.
5. Make your changes on your branch. If you use AI tools during your work, remember to disclose it in your PR description (see [Coding with AI](#coding-with-ai)).
6. [Submit the branch as a PR](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork) pointing to the `main` branch of the main instant-meilisearch repository. A maintainer should comment and/or review your Pull Request within a few days. Although depending on the circumstances, it may take longer.<br>
 We do not enforce a naming convention for the PRs, but **please use something descriptive of your changes**, having in mind that the title of your PR will be automatically added to the next [release changelog](https://github.com/meilisearch/meilisearch-js-plugins/releases/).

## Development Workflow

### Setup

```bash
pnpm install
```

### Tests and Linter

Each PR should pass the tests and the linter to be accepted.

```bash
# Tests with Vitest
docker pull getmeili/meilisearch-enterprise:latest # Fetch the latest version of Meilisearch image from Docker Hub
docker run -p 7700:7700 getmeili/meilisearch-enterprise:latest meilisearch --master-key=masterKey --no-analytics
# Integration tests
pnpm test
# End-to-end tests
pnpm test:e2e
# Linter
pnpm style
# Linter with fixing
pnpm style:fix
# Build the project
pnpm build
```

If you want to test a specific package, from the root directory run any of the above command with the `filter` flag.

Example:
```
turbo run test --filter=@meilisearch/instant-meilisearch
```

### Versioning with Changesets

⚠️ This step is crucial to merge a PR containing impacting changes for the package(s)! ⚠️

💡 Example of PR that does [NOT require a changeset](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md#not-every-change-requires-a-changeset): updating the README.md or changes in tests files.

We use [changesets](https://github.com/Noviny/changesets) to do versioning.

For each PR that changes something in the package(s), you need to [add a changeset](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md) by running `pnpm changeset`.

This command will run questions:
- select the packages concerned by the PR changes
- indicate how these changes impact the version (press enter to skip the question if you don't want to upgrade the `major` or the `minor`)
- Write a brief summary of the changes

Modification will be applied to the `.changesets` directory. These changes should added to your PR.

Before the release, the new files in `.changesets` will be automatically removed. See our [release process](release-on-github-and-npm).

### Playgrounds

#### @meilisearch/instant-meilisearch playgrounds

To test directly your changes in `@meilisearch/instant-meilisearch`, you can run the following playgrounds:

`Vue 3`
```bash
pnpm playground:vue
```

`React`:

```bash
pnpm playground:react
```

`Vanilla JS`:
```
pnpm playground:javascript
```

`HTML`:
```
pnpm playground:html
```

An additional playground is provided to test out the [GeoSearch](./packages/instant-meilisearch#-geo-search).

```bash
pnpm playground:geosearch
```

Note: If the Google Maps stopped working, please create a new [Google Api Key](https://developers.google.com/maps/documentation/javascript/get-api-key) and add it in the `.env` file at the root of the playground: `/playgrounds/geo-javascript`

#### @meilisearch/instant-meilisearch playgrounds

To test directly your changes made in `@meilisearch/autocomplete-client`, you can run the following playground:

```
pnpm playground:autocomplete
```

## Git Guidelines

### Git Branches

All changes must be made in a branch and submitted as PR.
We do not enforce any branch naming style, but please use something descriptive of your changes.

### Git Commits

As minimal requirements, your commit message should:
- be capitalized
- not finish by a dot or any other punctuation character (!,?)
- start with a verb so that we can read your commit message this way: "This commit will ...", where "..." is the commit message.
  e.g.: "Fix the home page button" or "Add more tests for create_index method"

We don't follow any other convention, but if you want to use one, we recommend [this one](https://chris.beams.io/posts/git-commit/).

### GitHub Pull Requests

Some notes on GitHub PRs:

- [Convert your PR as a draft](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/changing-the-stage-of-a-pull-request) if your changes are a work in progress: no one will review it until you pass your PR as ready for review.<br>
  The draft PR can be very useful if you want to show that you are working on something and make your work visible.
- All PRs must be reviewed and approved by at least one maintainer.
- The PR title should be accurate and descriptive of the changes. The title of the PR will be indeed automatically added to the next [release changelogs](https://github.com/meilisearch/meilisearch-js-plugins/releases/).

## Release Process (for the internal team only)

Meilisearch tools follow the [Semantic Versioning Convention](https://semver.org/).

### Release on GitHub and npm

This repository uses the [changesets](https://github.com/Noviny/changesets) library to handle the version updates and the publishing on GitHub and `npm`.

⚠️ Each PR merged on `main` involving a change in the package(s) should contain modifications in the `.changeset` folder. See [changeset section](#versioning-with-changesets).

Each merge on `main` triggers the [`release` CI](./.github/workflows/publish.yml) generating a PR titled `Version Packages`. This PR updates the versions and contains changelogs of the impacted packages based on the `pnpm changesets` commands you ran on each PR.

To release on GitHub and `npm` you must merge this `Version packages` PR. This will trigger the publishing action and create the GitHub and `npm` releases for all affected packages.

See more in depth explaination on [versioning](https://github.com/changesets/changesets/blob/main/docs/command-line-options.md#version), [publishing](https://github.com/changesets/changesets/blob/main/docs/command-line-options.md#publish) and the [changesets github-action](https://github.com/changesets/action).

If you merged a beta branch, that was released, into main, you were probably in the `changesets` [pre-release](https://github.com/changesets/changesets/blob/main/docs/prereleases.md) mode (see section on [releasing a beta](#release-a-beta-version)). If the `pre.json` file is present in the `.changesets` folder, you need to exit that mode. This is possible by running `pnpm changeset pre exit`. Once done, create a PR with the changes and merge it to main.

#### Codesandbox update

Once the version is available on npm, please update the instant-meilisearch version used in the different Code-Sandboxes we provide:

- [Meilisearch + InstantSearch](https://codesandbox.io/s/ms-is-mese9)
- [Meilisearch + Vue 2 InstantSearch](https://codesandbox.io/s/ms-vue-is-1d6bi)
- [Meilisearch + Vue 3 InstantSearch](https://codesandbox.io/s/ms-vue3-is-0293zk)
- [Meilisearch + React InstantSearch](https://codesandbox.io/s/ms-react-is-sh9ud)

If you don't have the access to do it, please request it internally.

#### Release a `beta` Version

This package is able to create multiple types of betas:
- A standard package beta, working on the latest version of Meilisearch.
- A beta implementing the changes of a rc version of Meilisearch.
- A beta implementing a specific feature `prototype` of Meilisearch.

Here are the steps to release a beta version of this package depending on its type:

1. Create a new branch containing the changes with the correct name format following these rules:
    - `package beta`: create a branch `beta/xx-xx` with the context of your beta.
      Example: `beta/refactor`.
    - Meilisearch `pre-release beta`: create a branch originating from `bump-meilisearch-v*.*.*` named `pre-release-beta/v*.*.*`. <br>
      Example: `pre-release-beta/v0.30.0`
    - Meilisearch `prototype beta`: create a branch `prototype-beta/xx-xx`. Where `xxx` has the same name as the docker image containing the prototype.
        Example: If the [docker image](https://hub.docker.com/r/getmeili/meilisearch-enterprise/tags) is named: `prototype-multi-search-0`, the branch should be named: `prototype-beta/prototype-multi-search`

2. Enable the pre-release mode by running `pnpm changeset pre enter [X]`. `X` is the part after the `/` of your beta branch. Example for `beta/refactor`, X would be `refactor`. This will create a `pre.json` file in `.changesets` that must be pushed on your beta branch.

3. Commit and push your related PRs to the newly created branch (step 1).

4. When a PR is merged onto your beta branch, the [release CI](./.github/workflows/publish.yml) opens a PR named `Version Packages (X)` (see step 2 for `X`). This PR contains all the changesets and the version update based on the type of changes in the changesets.

5. To publish the release on GitHub and `npm`, you need to merge the `Version Packages (X)` PR. This will trigger the publishing.

<hr>

Thank you again for reading this through. We can not wait to begin to work with you if you make your way through this contributing guide ❤️
