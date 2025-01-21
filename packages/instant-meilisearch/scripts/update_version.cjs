const pkg = require('../package.json')
const fs = require('node:fs')
const path = require('node:path')

const version = pkg.version
const fileContents = `export const PACKAGE_VERSION = '${version}'
`

const filePath = path.resolve(__dirname, '../src/package-version.ts')

fs.writeFileSync(filePath, fileContents)
