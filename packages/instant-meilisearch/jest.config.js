const ignoreFiles = ['<rootDir>/playgrounds', '<rootDir>/tests/assets']

module.exports = {
  verbose: true,
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    'cypress/',
    'playgrounds/',
    'scripts',
    'templates',
    'tests',
    '__tests__',
  ],
  projects: [
    {
      displayName: 'build',
      testEnvironment: 'node',
      testPathIgnorePatterns: [...ignoreFiles, '<rootDir>/tests/*.ts'],
      testMatch: ['**/*.tests.js', '/tests/**/*.js'],
    },
    {
      globals: {
        'ts-jest': {
          tsconfig: 'tsconfig.test.json',
        },
      },
      preset: 'ts-jest',
      displayName: 'dom',
      testPathIgnorePatterns: [...ignoreFiles, '<rootDir>/tests/build*'],
      testMatch: ['**/*.tests.ts', '/tests/**/*.ts'],
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
      testPathIgnorePatterns: [...ignoreFiles],
      testMatch: ['**/*.tests.ts', '/tests/**/*.ts'],
    },
  ],
}
