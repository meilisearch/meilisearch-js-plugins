/** @type {import('ts-jest').JestConfigWithTsJest} **/
const baseConfig = {
  testPathIgnorePatterns: ['<rootDir>(/.*)*/assets'],
  coveragePathIgnorePatterns: ['<rootDir>(/.*)*/assets/'],
  setupFilesAfterEnv: ['<rootDir>/scripts/jest_teardown.js'],
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
  projects: [
    {
      ...baseConfig,
      testEnvironment: 'node',
      displayName: 'node',
    },
    {
      ...baseConfig,
      displayName: 'dom',
    },
  ],
}
