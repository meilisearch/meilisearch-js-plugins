# AGENTS.md

Use `pnpm`, not `npm`.

This repository is a monorepo that contains two packages: `@meilisearch/instant-meilisearch` and `@meilisearch/autocomplete-client`.

## Development

- Use `nvm use` to use the correct Node version
- Use `pnpm style:fix` to lint and format code

## Code conventions

- Prefer self-descriptive code to comments. Only use comments for complex logic.

## Testing

- `pnpm test` - run tests for both packages
- `pnpm test path/to/file.test.ts` - run specific test files
