const instantMeiliSearch = require('../../dist/instant-meilisearch.cjs')

const test = instantMeiliSearch('http://localhost:7700', 'masterKey')
console.log({ test })
