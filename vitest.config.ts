import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    workspace: ['packages/*/vitest.config.ts'],
    fileParallelism: false,
    coverage: { include: ['src/**/*.ts'] },
  },
});
