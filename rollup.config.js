import nodeResolve from '@rollup/plugin-node-resolve'
import { resolve } from 'path'
import commonjs from '@rollup/plugin-commonjs'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'
import { terser } from 'rollup-plugin-terser'

function getOutputFileName(fileName, isProd = false) {
  return isProd ? fileName.replace(/\.js$/, '.min.js') : fileName
}

const env = process.env.NODE_ENV || 'development'
const LIB_NAME = 'instantMeiliSearch'
const ROOT = resolve(__dirname, '.')

module.exports = [
  // browser-friendly IIFE build
  {
    input: 'src/index.js', // directory to transpilation of typescript
    output: {
      name: LIB_NAME,
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
    input: 'src/index.js',
    external: ['meilisearch'],
    output: [
      {
        file: getOutputFileName(
          // will add .min. in filename if in production env
          resolve(ROOT, pkg.cjs),
          env === 'production'
        ),
        exports: 'default',
        format: 'cjs',
        sourcemap: env === 'production', // create sourcemap for error reporting in production mode
      },
      {
        file: getOutputFileName(
          resolve(ROOT, pkg.module),
          env === 'production'
        ),
        exports: 'default',
        format: 'es',
        sourcemap: env === 'production', // create sourcemap for error reporting in production mode
      },
    ],
    plugins: [
      env === 'production' ? terser() : {}, // will minify the file in production mode
    ],
  },
]
