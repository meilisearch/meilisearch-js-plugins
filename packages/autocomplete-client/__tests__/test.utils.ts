import { meilisearchClient } from '../src'

const HOST = 'http://localhost:7700'
const API_KEY = 'masterKey'
const basicClient = meilisearchClient(HOST, API_KEY)
export { HOST, API_KEY, basicClient }
