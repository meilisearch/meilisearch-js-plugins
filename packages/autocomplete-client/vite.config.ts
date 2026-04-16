/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import tsconfig from '../../tsconfig.json' with { type: 'json' }

export default defineConfig({
  build: {
    sourcemap: true,
    target: tsconfig.compilerOptions.target,
    lib: {
      entry: ['src/index.ts', 'src/meilisearch.ts'],
      formats: ['es'],
    },
  },
  test: {
    include: ['{src,__tests__}/**/*.test.ts'],
    testTimeout: 100_000, // 100 seconds
  },
})
