import { defineProject } from 'vitest/config'
import pkg from './package.json' with { type: 'json' }

const globalVarName = pkg.name
  .substring(pkg.name.lastIndexOf('/') + 1)
  .replace(/-./g, (x) => x[1].toUpperCase())

export default defineProject({
  build: {
    sourcemap: true,
    target: 'es6',
    lib: {
      entry: 'src/index.ts',
      name: globalVarName,
      formats: ['umd'],
      fileName: (format, entryName) => {
        switch (format) {
          case 'umd':
            return `umd/${entryName}.min.js`
          default:
            throw new Error(`unsupported format ${format}`)
        }
      },
    },
    // the following code enables Vite in UMD mode to extend the global object with all of
    // the exports, and not just a property of it ( https://github.com/vitejs/vite/issues/11624 )
    rollupOptions: {
      external: ['meilisearch'],
      output: {
        globals: {
          'meilisearch': 'meilisearch'
        },
        footer: `(function () {
                if (typeof self !== "undefined") {
                  var clonedGlobal = Object.assign({}, self.${globalVarName});
                  delete clonedGlobal.default;
                  Object.assign(self, clonedGlobal);
                }
            })();`,
      },
    },
  },
  test: {
    include: ['{src,__tests__}/**/*.test.ts'],
    testTimeout: 100_000, // 100 seconds
  },
})
