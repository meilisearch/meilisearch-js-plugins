const prettierRules = require('./prettier')

module.exports = {
  overrides: [
    {
      /*
       * REACT
       */
      files: ['**/*.jsx', '**/*.tsx'],
      env: {
        es2020: true,
        commonjs: true, // Needed to avoid import is reserved error
        node: true,
        browser: true,
        jest: true,
      },
      parser: 'babel-eslint',
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:prettier/recommended',
      ],
      plugins: ['react'],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      rules: {
        'react/prop-types': 0,
        'prettier/prettier': ['error', prettierRules],
      },
      settings: {
        react: {
          version: 'latest',
        },
      },
    },
    {
      /*
       * JS
       */
      files: ['**/*.js', '**/*.cjs'],
      env: {
        browser: true,
        es2020: true,
        'jest/globals': true,
        node: true,
        jasmine: true,
      },
      globals: {
        instantsearch: true,
        instantMeiliSearch: true,
        page: true, // for jest/puppeteer tests in tests/env/express
        browser: true, // for jest/puppeteer tests in tests/env/express
        context: true, // for jest/puppeteer tests in tests/env/express
        jestPuppeteer: true, // for jest/puppeteer tests in tests/env/express
        jasmine: true, // for angular e2e tests in playground/angular
      },
      extends: [
        'standard',
        'plugin:prettier/recommended',
        'eslint:recommended',
        'plugin:cypress/recommended',
      ],
      plugins: ['jest'],
      parserOptions: {
        ecmaVersion: 2020,
      },
      rules: {
        'cypress/no-unnecessary-waiting': 'off',
        'prettier/prettier': ['error', prettierRules],
      },
    },
    {
      /*
       * VUE FILES
       */

      files: ['**/*.vue'],
      env: {
        browser: true,
        commonjs: true,
        es6: true,
      },
      extends: [
        'plugin:prettier/recommended',
        'plugin:vue/essential',
        'plugin:vue/base',
      ],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: 'babel-eslint',
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      plugins: ['vue', 'jsdoc'],
      rules: {
        'prettier/prettier': ['error', prettierRules],
      },
    },
    {
      /*
       * TYPESCRIPT
       */
      files: ['*.ts'],
      env: {
        browser: true,
        es2020: true,
        'jest/globals': true,
        jasmine: true,
      },
      globals: {
        page: true, // for jest/puppeteer tests in tests/env/express
        browser: true, // for jest/puppeteer tests in tests/env/express
        context: true, // for jest/puppeteer tests in tests/env/express
        jestPuppeteer: true, // for jest/puppeteer tests in tests/env/express
        jasmine: true, // for angular e2e tests in playground/angular
      },
      extends: [
        'standard',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:prettier/recommended',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: ['tsconfig.eslint.json'],
        projectFolderIgnoreList: ['dist'],
      },

      plugins: ['jsdoc', '@typescript-eslint', 'jest'],
      rules: {
        '@typescript-eslint/no-empty-interface': 'off', // Due to vue-instantsearch not having typings
        'no-dupe-class-members': 'off', // Off due to conflict with typescript overload functions
        '@typescript-eslint/array-type': ['warn', { default: 'array-simple' }],
        '@typescript-eslint/return-await': 'off',
        'jsdoc/check-alignment': 'error',
        'jsdoc/check-indentation': 'error',
        '@typescript-eslint/space-before-function-paren': 0,
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-module-boundary-types': 'off',
        '@typescript-eslint/prefer-regexp-exec': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unnecessary-type-assertion': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
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
        'prettier/prettier': ['error', prettierRules],
        '@typescript-eslint/no-unused-vars': [
          'warn',
          { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
        ],
      },
    },
  ],
}
