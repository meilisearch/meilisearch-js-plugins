const ignoreFiles = ['<rootDir>(/.*)*/assets', 'test.utils']

module.exports = {
  verbose: true,
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  collectCoverage: true,
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  projects: [
    {
      globals: {
        'ts-jest': { tsconfig: 'tsconfig.test.json' },
        fetch: globalThis.fetch,
      },
      preset: 'ts-jest',
      displayName: 'dom',
      testPathIgnorePatterns: [...ignoreFiles],
      coveragePathIgnorePatterns: ['<rootDir>(/.*)*/assets/'],
    },
    {
      globals: {
        'ts-jest': { tsconfig: 'tsconfig.test.json' },
        fetch: globalThis.fetch,
      },
      preset: 'ts-jest',
      displayName: 'node',
      testEnvironment: 'node',
      coveragePathIgnorePatterns: ['<rootDir>(/.*)*/assets/'],
      testPathIgnorePatterns: [...ignoreFiles],
    },
  ],
}
