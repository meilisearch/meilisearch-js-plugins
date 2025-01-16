/** @type {import('ts-jest').JestConfigWithTsJest} **/
const baseConfig = {
  testPathIgnorePatterns: ['<rootDir>(/.*)*/assets'],
  coveragePathIgnorePatterns: ['<rootDir>(/.*)*/assets/'],
  setupFilesAfterEnv: ['<rootDir>/scripts/jest_teardown.js'],
  transform: {
    "^.+.(ts|js)?$": ["ts-jest", {
      useESM: true,
    }],
  },
  moduleNameMapper: {
    "(.+)\\.js": "$1"
  },
  extensionsToTreatAsEsm: ['.ts'],
}

/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  projects: [
    {
      ...baseConfig,
      testEnvironment: "node",
      displayName: "node",
    },
    {
      ...baseConfig,
      displayName: "dom",
    },
  ],
}
