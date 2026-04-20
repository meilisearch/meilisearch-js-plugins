# @meilisearch/autocomplete-client

## 0.8.0

### Minor Changes

- 9642256: # Rework exports and bundling
  - Update usage of `MeiliSearch` to lower case `Meilisearch` to eliminate some possible issues arising from JSPM and maybe other CDNs/package resolvers (#1472, #1468)
  - From now on [`meilisearch`](https://github.com/meilisearch/meilisearch-js/) is marked as a peer dependency
  - Update README.md to show the HTML example with [`importmap`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap)
  - Changed TypeScript settings, and adapted some files to it, so we can let in the future Node.js execute `*.ts` files directly; for now executing them with [`tsx`](https://github.com/privatenumber/tsx)
  - There is no need anymore for separate version file within source files, as they import the package JSON file to get the version
  - Node.js ^20 can now `require(esm)`, so there's no point in bundling to commonjs anymore
    - https://vite.dev/blog/announcing-vite8#node-js-support
    - https://github.com/vitejs/vite/blob/main/packages/vite/package.json
  - Remove UMD bundle, modern browsers support importing ESM from URLs and `type="module"` scripts for almost a decade now, even Node.js supports requiring ESM as stated above
  - Remove any fields regarding exports outside of `"exports"` field, all supported Node.js versions support "exports" field, as do all modern bundlers and CDNs
  - Make use of [`publishConfig`](https://pnpm.io/package_json#publishconfig), so we can export to other workspace packages the TypeScript source files
    - Thanks to this change, running build script is only required for publishing, and not for developing
  - Put `package.json` into exports, mainly so bundlers can read it via directly importing it, and it seems to be the industry norm

  ## Migration
  1.  - CommonJS and UMD bundles aren't available anymore
      - `package.json` `"main"` and `"types"` fields aren't available anymore

  If you relied on any of these outdated features, you will have to bundle for any target environment that requires them, or update the environment if that's possible.
  2. From now on [`meilisearch`](https://github.com/meilisearch/meilisearch-js/) is a peer dependency (if the package manager used doesn't automatically install it, add it to the list of dependencies manually):

  ```diff
  - import { meilisearch } from '@meilisearch/instant-meilisearch'
  - import { meilisearch } from '@meilisearch/autocomplete-client'
  + import * as meilisearch from 'meilisearch'
  + import { Meilisearch } from 'meilisearch'
  ```

### Patch Changes

- Updated dependencies [9642256]
  - @meilisearch/instant-meilisearch@0.31.0

## 0.7.0

### Minor Changes

- 4bcefa0: Add Meilisearch analytics compatibility

### Patch Changes

- Updated dependencies [4bcefa0]
  - @meilisearch/instant-meilisearch@0.30.0

## 0.6.1

### Patch Changes

- cfc1608: Bump dependency versions
- Updated dependencies [cfc1608]
  - @meilisearch/instant-meilisearch@0.29.1

## 0.6.0

### Minor Changes

- fe45115: - Jest -> Vitest
  - Rollup -> Vite
  - `"type": "module"`
  - update `meilisearch-js` to latest version
  - update everything else that caused a conflict to the latest version, and adapt code

### Patch Changes

- Updated dependencies [fe45115]
  - @meilisearch/instant-meilisearch@0.24.0

## 0.5.0

### Minor Changes

- 731254f: Add highlight metadata

## 0.4.1

### Patch Changes

- 7bc6b54: Fix rollup importing wrong "meilisearch"

## 0.4.0

### Minor Changes

- 26e7cfd: - update `meilisearch` js client
  - update `parcel` and `turbo`
  - get rid of angular playground tests, as [angular-instantsearch got deprecated](https://www.algolia.com/blog/algolia/migrating-from-angular-instantsearch/)

### Patch Changes

- Updated dependencies [26e7cfd]
  - @meilisearch/instant-meilisearch@0.21.0

## 0.3.0

### Minor Changes

- 00f30c9: Remove node 14 and 16 from workflow

## 0.2.2

### Patch Changes

- 5b6be19: Added ability to override a selection of Meilisearch search parameters.

  ⚠️ The returned value of the core `instantMeiliSearch` function has changed!

  This change was necessary for the aforementioned ability to be implemented and
  applied in a clean manner.
  The necessary migration should be of minimal impact.

  ### Migration

  Change the following

  ```js
  // 1.
  const client = instantMeiliSearch(/*...*/)
  // 2.
  const searchClient = instantMeiliSearch(/*...*/)
  // 3.
  instantsearch({
    indexName: 'movies',
    searchClient: instantMeiliSearch(/*...*/),
  })
  ```

  to the following

  ```js
  // 1.
  const { searchClient: client } = instantMeiliSearch(/*...*/)
  // 2.
  const { searchClient } = instantMeiliSearch(/*...*/)
  // 3.
  instantsearch({
    indexName: 'movies',
    searchClient: instantMeiliSearch(/*...*/).searchClient,
  })
  ```

- Updated dependencies [5b6be19]
- Updated dependencies [06377ef]
  - @meilisearch/instant-meilisearch@1.0.0

## 0.2.1

### Patch Changes

- 753e9ba: Fix the getting started wrongly instanciating the autocomplete client

## 0.2.0

### Minor Changes

- 0f44764: Creation of search client compatible with autocomplete.

### Patch Changes

- Updated dependencies [0f44764]
  - @meilisearch/instant-meilisearch@0.13.2
