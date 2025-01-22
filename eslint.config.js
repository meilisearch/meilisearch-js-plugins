import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import tsdoc from 'eslint-plugin-tsdoc'
import vitest from '@vitest/eslint-plugin'
import globals from 'globals'
import prettier from 'eslint-config-prettier'
import pluginCypress from 'eslint-plugin-cypress/flat'
import pluginReact from 'eslint-plugin-react'
import pluginVue from 'eslint-plugin-vue'

export default tseslint.config([
  { ignores: ['{packages,playgrounds}/*/dist/'] },
  eslint.configs.recommended,
  {
    files: ['**/*.{js,cjs,mjs}'],
    languageOptions: { globals: globals.node },
  },
  // TSDoc
  {
    // TODO: Ignore test files between src files
    files: ['packages/*/src/**/*.ts'],
    plugins: { tsdoc },
    rules: { 'tsdoc/syntax': 'off' },
  },
  // Vue
  {
    files: ['playgrounds/vue3/src/*.{js,vue}'],
    extends: [pluginVue.configs['flat/recommended']],
  },
  // React
  {
    files: ['playgrounds/{local-react,react}/src/*.jsx'],
    extends: [
      pluginReact.configs.flat.recommended,
      pluginReact.configs.flat['jsx-runtime'],
    ],
    settings: { react: { version: 'detect' } },
    languageOptions: { globals: globals.browser },
    // TODO: Remove rules
    rules: {
      'react/prop-types': 'off',
    },
  },
  // Cypress
  {
    files: [
      'playgrounds/{autocomplete,local-react}/cypress/integration/*.spec.js',
    ],
    extends: [pluginCypress.configs.recommended],
    // TODO: Remove rules
    rules: {
      'cypress/no-unnecessary-waiting': 'off',
      'cypress/unsafe-to-chain-command': 'off',
    },
  },
  // TypeScript
  {
    files: ['**/*.ts'],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // TODO: Remove the ones between "~~", adapt code
      // ~~
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      // ~~
      '@typescript-eslint/array-type': ['off', { default: 'array-simple' }],
      // TODO: Should be careful with this rule, should leave it be and disable
      //       it within files where necessary with explanations
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        // argsIgnorePattern: https://eslint.org/docs/latest/rules/no-unused-vars#argsignorepattern
        // varsIgnorePattern: https://eslint.org/docs/latest/rules/no-unused-vars#varsignorepattern
        { args: 'all', argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  // Vitest
  {
    files: ['packages/*/{src,__tests__}/**/*.test.ts'],
    extends: [vitest.configs.recommended],
    // TODO: Remove rules
    rules: {
      'vitest/no-identical-title': 'off',
      'vitest/valid-title': 'off',
    },
  },
  // Disable any style linting, as prettier takes care of that separately
  prettier,
])
