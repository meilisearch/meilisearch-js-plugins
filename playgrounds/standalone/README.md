# Standalone Playground

This playground reproduces loading `@meilisearch/instant-meilisearch` from `node_modules` in a browser with no bundler, no CDN, and no import map, using the standalone ESM artifact that inlines `meilisearch`.

## Run locally

```bash
pnpm dev
```

## Run end-to-end smoke check

```bash
pnpm test:e2e
```
