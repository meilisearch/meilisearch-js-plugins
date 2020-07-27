module.exports = {
  env: {
    browser: true,
    es2020: true,
    'jest/globals': true,
  },
  globals: {
    page: true, // for jest/puppeteer tests in examples/express
    browser: true, // for jest/puppeteer tests in examples/express
    context: true, // for jest/puppeteer tests in examples/express
    jestPuppeteer: true, // for jest/puppeteer tests in examples/express
  },
  extends: ['standard', 'plugin:prettier/recommended'],
  plugins: ['jest'],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {},
}
