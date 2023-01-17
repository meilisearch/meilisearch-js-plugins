module.exports = {
  root: true,
  extends: ['eslint-config-meilisearch'],
  // TODO: remove env when the react app inside it has been moved to `playgrounds`
  ignorePatterns: ['node_modules/', 'dist', '.cache', '.turbo', 'env'],
}
