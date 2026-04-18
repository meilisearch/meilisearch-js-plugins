---
'@meilisearch/autocomplete-client': minor
'@meilisearch/instant-meilisearch': minor
---

# Rework exports and bundling

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

1.
  - CommonJS and UMD bundles aren't available anymore
  - `package.json` `"main"` and `"types"` fields aren't available anymore

If you relied on any of these outdated features, you will have to bundle for any target environment that requires them, or update the environment if that's possible.

2. From now on [`meilisearch`](https://github.com/meilisearch/meilisearch-js/) is a peer dependency (if the package manager used doesn't automatically install it, add it to the list of dependencies manually):

```diff
- import { meilisearch } from '@meilisearch/instant-meilisearch'
- import { meilisearch } from '@meilisearch/autocomplete-client'
+ import * as meilisearch from 'meilisearch'
+ import { Meilisearch } from 'meilisearch'
```
