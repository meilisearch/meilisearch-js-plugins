import { resolve } from 'node:path'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

function getOutputFileName(fileName, isProd = false) {
  return isProd ? fileName.replace(/\.js$/, '.min.js') : fileName
}

const env = process.env.NODE_ENV || 'development'
const ROOT = resolve(__dirname, '.')
const INPUT = 'src/index.ts'

/** @type {import('rollup').Plugin[]} */
const COMMON_PLUGINS = [
  typescript({
    // useTsconfigDeclarationDir: true,
    tsconfigOverride: {
      includes: ['src'],
      exclude: [
        'tests',
        '*.js',
        'scripts',
        '**/__tests__/*.ts',
        'playgrounds',
        'dist',
      ],
      // esModuleInterop: true,
    },
  }),
]

/** @type {import('rollup').RollupOptions[]} */
const ROLLUP_OPTIONS = [
  // TODO: Suspicious, it looks like it's UMD not browser-friendly IIFE build
  // browser-friendly IIFE build
  {
    input: INPUT, // directory to transpilation of typescript
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
      ...COMMON_PLUGINS,
      nodeResolve(),
      // commonjs(),
      // babel(),
      // json(),
      env === 'production' ? terser() : {}, // will minify the file in production mode
    ],
  },
  // {
  //   input: INPUT,
  //   external: ['meilisearch'],
  //   output: [
  //     {
  //       file: getOutputFileName(
  //         // will add .min. in filename if in production env
  //         resolve(ROOT, pkg.cjs),
  //         env === 'production'
  //       ),
  //       exports: 'named',
  //       format: 'cjs',
  //       sourcemap: env === 'production', // create sourcemap for error reporting in production mode
  //     },
  //     {
  //       file: getOutputFileName(
  //         resolve(ROOT, pkg.module),
  //         env === 'production'
  //       ),
  //       exports: 'named',
  //       format: 'es',
  //       sourcemap: env === 'production', // create sourcemap for error reporting in production mode
  //     },
  //   ],
  //   plugins: [
  //     env === 'production' ? terser() : {}, // will minify the file in production mode
  //     ...COMMON_PLUGINS,
  //   ],
  // },
]

module.exports = ROLLUP_OPTIONS
