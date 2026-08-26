---
'@meilisearch/instant-meilisearch': patch
---

Add a standalone browser ESM artifact at `dist/instant-meilisearch.standalone.mjs` that bundles the `meilisearch` runtime dependency, enabling direct `<script type="module">` usage from `node_modules` without a bundler, CDN, or import map for `meilisearch` (fixes #1509).

Follow-up (external docs repo): replace the stale UMD usage on meilisearch.com with standalone/import-map guidance.
