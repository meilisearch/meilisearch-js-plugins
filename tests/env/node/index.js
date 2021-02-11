const {
  instantMeiliSearch: UMDinstantMeiliSearch,
} = require('../../../dist/instant-meilisearch.umd')
const {
  instantMeiliSearch: CJSinstantMeiliSearch,
} = require('../../../dist/instant-meilisearch.cjs')

const UMDclient = UMDinstantMeiliSearch('http://localhost:7700', 'masterKey')
const CJSclient = CJSinstantMeiliSearch('http://localhost:7700', 'masterKey')

module.exports = {
  UMDclient,
  CJSclient,
}
