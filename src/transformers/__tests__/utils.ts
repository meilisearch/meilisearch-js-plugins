import { MeiliSearch } from 'meilisearch'
const HOST = 'http://localhost:7700'

const defaultContext = {
  client: new MeiliSearch({ host: HOST }),
  paginationTotalHits: 200,
  primaryKey: undefined,
  placeholderSearch: true,
  hitsPerPage: 20,
  page: 0,
}

export { defaultContext }
