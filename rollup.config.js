import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import { resolve } from 'path'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

import pkg from './package.json'

function getOutputFileName(fileName, isProd = false) {
  return isProd ? fileName.replace(/\.js$/, '.min.js') : fileName
}

const env = process.env.NODE_ENV || 'development'
const ROOT = resolve(__dirname, '.')

const PLUGINS = [
  typescript({
    useTsconfigDeclarationDir: true,
    tsconfigOverride: {
      // allowJs: false,
      includes: ['src'],
      exclude: ['tests', 'examples', '*.js', 'scripts'],
      esModuleInterop: true,
    },
  }),
]
module.exports = [
  // browser-friendly IIFE build
  {
    input: 'src/index.ts', // directory to transpilation of typescript
    output: {
      name: 'window',
      extend: true,
      file: getOutputFileName(
        // will add .min. in filename if in production env
        resolve(ROOT, pkg.browser),
        env === 'production'
      ),
      format: 'umd',
      sourcemap: env === 'production', // create sourcemap for error reporting in production mode
      globals: {
        meilisearch: 'meilisearch',
      },
    },
    plugins: [
      ...PLUGINS,
      nodeResolve({
        mainFields: ['jsnext', 'browser', 'main'],
        preferBuiltins: true,
        browser: true,
      }),
      commonjs(),
      babel(),
      // json(),
      env === 'production' ? terser() : {}, // will minify the file in production mode
    ],
  },
  {
    input: 'src/index.ts',
    external: ['meilisearch'],
    output: [
      {
        file: getOutputFileName(
          // will add .min. in filename if in production env
          resolve(ROOT, pkg.cjs),
          env === 'production'
        ),
        exports: 'named',
        format: 'cjs',
        sourcemap: env === 'production', // create sourcemap for error reporting in production mode
      },
      {
        file: getOutputFileName(
          resolve(ROOT, pkg.module),
          env === 'production'
        ),
        exports: 'named',
        format: 'es',
        sourcemap: env === 'production', // create sourcemap for error reporting in production mode
      },
    ],
    plugins: [
      env === 'production' ? terser() : {}, // will minify the file in production mode
      ...PLUGINS,
    ],
  },
]
