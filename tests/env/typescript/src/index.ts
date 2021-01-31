import { instantMeiliSearch } from '../../../../'

const client = instantMeiliSearch('http://localhost:7700', 'masterKey')
console.log({ client })
