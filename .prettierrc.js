// https://prettier.io/docs/en/options.html

export default {
  plugins: ['./node_modules/prettier-plugin-jsdoc/dist/index.js'],
  // https://github.com/hosseinmd/prettier-plugin-jsdoc#tsdoc
  tsdoc: true,
  // TODO: Remove everything underneath and remove .editorconfig!
  singleQuote: true,
  arrowParens: 'always',
  semi: false,
  bracketSpacing: true,
  trailingComma: 'es5',
  printWidth: 80,
}
