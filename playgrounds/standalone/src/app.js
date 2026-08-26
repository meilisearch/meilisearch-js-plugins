/* eslint-disable no-undef */
import { instantMeiliSearch } from '/node_modules/@meilisearch/instant-meilisearch/dist/instant-meilisearch.standalone.mjs'

const statusElement = document.querySelector('[data-testid="status"]')
const firstHitElement = document.querySelector('[data-testid="first-hit"]')

async function runSmokeSearch() {
  try {
    const { searchClient } = instantMeiliSearch(
      'https://ms-adf78ae33284-106.lon.meilisearch.io',
      'a63da4928426f12639e19d62886f621130f3fa9ff3c7534c5d179f0f51c4f303'
    )

    const response = await searchClient.search([
      {
        indexName: 'steam-video-games',
        params: {
          query: 'counter',
          hitsPerPage: 1,
        },
      },
    ])

    const firstHit = response.results?.[0]?.hits?.[0]?.name

    if (!firstHit) {
      throw new Error('Search completed but returned no hits')
    }

    statusElement.textContent = 'ready'
    firstHitElement.textContent = firstHit
  } catch (error) {
    statusElement.textContent = 'error'
    firstHitElement.textContent =
      error instanceof Error ? error.message : 'Unexpected error'
    console.error(error)
  }
}

void runSmokeSearch()
