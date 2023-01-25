const pkg = require('../package.json')
const fs = require('fs')
const path = require('path')

const version = pkg.version

const pckVersion = `export const PACKAGE_VERSION = '${version}'
`

const p = path.resolve(__dirname, '../src/package-version.ts')

console.log(p)
fs.writeFileSync(p, pckVersion)
