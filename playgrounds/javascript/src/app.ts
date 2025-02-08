import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'
import { default as instantsearch } from 'instantsearch.js'
import {
  clearRefinements,
  configure,
  hits,
  pagination,
  refinementList,
  searchBox,
  sortBy,
} from 'instantsearch.js/es/widgets'

const search = instantsearch({
  indexName: 'steam-video-games',
  searchClient: instantMeiliSearch(
    'https://ms-adf78ae33284-106.lon.meilisearch.io',
    'a63da4928426f12639e19d62886f621130f3fa9ff3c7534c5d179f0f51c4f303',
    {
      finitePagination: true,
    }
  ).searchClient,
})

search.addWidgets([
  sortBy({
    container: '#sort-by',
    items: [
      { value: 'steam-video-games', label: 'Relevant' },
      {
        value: 'steam-video-games:recommendationCount:desc',
        label: 'Most Recommended',
      },
      {
        value: 'steam-video-games:recommendationCount:asc',
        label: 'Least Recommended',
      },
    ],
  }),
  searchBox({
    container: '#searchbox',
  }),
  clearRefinements({
    container: '#clear-refinements',
  }),
  refinementList({
    container: '#genres-list',
    attribute: 'genres',
  }),
  refinementList({
    container: '#players-list',
    attribute: 'players',
  }),
  refinementList({
    container: '#platforms-list',
    attribute: 'platforms',
  }),
  configure({
    hitsPerPage: 6,
    attributesToSnippet: ['description:150'],
  }),
  refinementList({
    container: '#misc-list',
    attribute: 'misc',
  }),
  hits({
    container: '#hits',
    templates: {
      item: `
        <div>
          <div class="hit-name">
            {{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}
          </div>
          <img src="{{image}}" align="left" />
          <div class="hit-name">
            {{#helpers.highlight}}{ "attribute": "description" }{{/helpers.highlight}}
          </div>
          <div class="hit-info">price: {{price}}</div>
          <div class="hit-info">release date: {{releaseDate}}</div>
          <div class="hit-info">Recommendation: {{recommendationCount}}</div>
        </div>
      `,
    },
  }),
  pagination({
    container: '#pagination',
  }),
])

search.start()
