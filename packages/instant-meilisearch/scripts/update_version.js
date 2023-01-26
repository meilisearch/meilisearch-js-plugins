const pkg = require('../package.json')
const fs = require('fs')
const path = require('path')

const version = pkg.version
const fileContents = `export const PACKAGE_VERSION = '${version}'
`

const filePath = path.resolve(__dirname, '../src/package-version.ts')

console.log(filePath)
fs.writeFileSync(filePath, fileContents)
