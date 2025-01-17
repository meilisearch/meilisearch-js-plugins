/** @type {import('ts-jest').JestConfigWithTsJest} **/
const baseConfig = {
  coveragePathIgnorePatterns: ['<rootDir>(/.*)*/assets/'],
  testPathIgnorePatterns: ['<rootDir>(/.*)*/assets', 'test.utils'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  // Transform all JS and TS files with `ts-jest`
  transform: {
    '^.+.(ts|js)?$': [
      'ts-jest',
      {
        // use ESM because we're loading the ESM build of `meilisearch-js`
        useESM: true,
      },
    ],
  },
  // Allow `ts-jest` to resolve relative JS imports, e.g., `./folder/index.js`
  // See https://github.com/kulshekhar/ts-jest/issues/1057
  moduleNameMapper: {
    '(.+)\\.js': '$1',
  },
  // Treat TS as ESM. JS is automatically treated as ESM
  // if package.json has `"type": "module"`
  extensionsToTreatAsEsm: ['.ts'],
}

/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  verbose: true,
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  collectCoverage: true,
  projects: [
    {
      ...baseConfig,
      // globals: {
      //   'ts-jest': { tsconfig: 'tsconfig.test.json' },
      //   fetch: globalThis.fetch,
      // },
      // preset: 'ts-jest',
      displayName: 'dom',
      // testPathIgnorePatterns: [...ignoreFiles],
      // coveragePathIgnorePatterns: ['<rootDir>(/.*)*/assets/'],
    },
    {
      ...baseConfig,
      // globals: {
      //   'ts-jest': { tsconfig: 'tsconfig.test.json' },
      //   fetch: globalThis.fetch,
      // },
      // preset: 'ts-jest',
      displayName: 'node',
      testEnvironment: 'node',
      // coveragePathIgnorePatterns: ['<rootDir>(/.*)*/assets/'],
      // testPathIgnorePatterns: ['<rootDir>(/.*)*/assets', 'test.utils'],
    },
  ],
}
