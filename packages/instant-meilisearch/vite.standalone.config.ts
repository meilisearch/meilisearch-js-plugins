import { defineConfig } from 'vite'
import tsconfig from '../../tsconfig.json' with { type: 'json' }

export default defineConfig({
  build: {
    emptyOutDir: false,
    sourcemap: true,
    target: tsconfig.compilerOptions.target,
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'instant-meilisearch.standalone',
    },
    rollupOptions: {
      external: [],
      output: {
        entryFileNames: 'instant-meilisearch.standalone.mjs',
      },
    },
  },
})
