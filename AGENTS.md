# AGENTS.md

Use `pnpm`, not `npm`.

This repository is a monorepo that contains two packages: `@meilisearch/instant-meilisearch` and `@meilisearch/autocomplete-client`.

## Development

- Use `nvm use` to use the correct Node version.

## Code conventions

- Prefer self-descriptive code to comments. Only use commands for complex logic due to specificity of libraries or to explain business logic.

## Testing

- `pnpm test` - run tests for both packages
- `pnpm test path/to/file.test.ts` - run specific test files
