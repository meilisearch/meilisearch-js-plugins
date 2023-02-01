const ignoreFiles = ['<rootDir>(/.*)*/assets']

module.exports = {
  verbose: true,
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  collectCoverage: true,
  projects: [
    {
      globals: {
        'ts-jest': {
          tsconfig: 'tsconfig.test.json',
        },
      },
      preset: 'ts-jest',
      displayName: 'dom',
      testPathIgnorePatterns: [...ignoreFiles],
      coveragePathIgnorePatterns: ['<rootDir>(/.*)*/assets/'],
    },
    {
      globals: {
        'ts-jest': {
          tsconfig: 'tsconfig.test.json',
        },
      },
      preset: 'ts-jest',
      displayName: 'node',
      testEnvironment: 'node',
      coveragePathIgnorePatterns: ['<rootDir>(/.*)*/assets/'],
      testPathIgnorePatterns: [...ignoreFiles],
    },
  ],
}
