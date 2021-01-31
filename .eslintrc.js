module.exports = {
  // extends: [
  //   ['standard', 'plugin:prettier/recommended'],
  // ],
  overrides: [
    {
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
      files: ['*.js'],
    },
    {
      files: ['*.ts'],
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
      extends: [
        'standard',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:prettier/recommended',
        'prettier/@typescript-eslint',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: ['tsconfig.eslint.json'],
        projectFolderIgnoreList: ['dist', 'playgrounds'],
      },
      plugins: ['jsdoc', '@typescript-eslint', 'prettier', 'jest'],
      rules: {
        'no-dupe-class-members': 'off', // Off due to conflict with typescript overload functions
        'prettier/prettier': ['error', {}, { usePrettierrc: true }],
        '@typescript-eslint/array-type': ['warn', { default: 'array-simple' }],
        '@typescript-eslint/return-await': 'off',
        'jsdoc/check-alignment': 'error',
        'jsdoc/check-indentation': 'error',
        '@typescript-eslint/space-before-function-paren': 0,
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-throw-literal': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-module-boundary-types': 'off',
        '@typescript-eslint/prefer-regexp-exec': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unnecessary-type-assertion': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/member-delimiter-style': [
          'error',
          {
            multiline: {
              delimiter: 'none', // 'none' or 'semi' or 'comma'
              requireLast: true,
            },
            singleline: {
              delimiter: 'semi', // 'semi' or 'comma'
              requireLast: false,
            },
          },
        ],
        'comma-dangle': 'off',
      },
    },
  ],
}
