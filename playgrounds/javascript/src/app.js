import { instantMeiliSearch } from '../../../src/index'

const search = instantsearch({
  indexName: 'steam-video-games',
  searchClient: instantMeiliSearch(
    'https://integration-demos.meilisearch.com',
    '99d1e034ed32eb569f9edc27962cccf90b736e4c5a70f7f5e76b9fab54d6a185',
    {
      limitPerRequest: 30,
    }
  ),
})

search.addWidgets([
  instantsearch.widgets.sortBy({
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
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.clearRefinements({
    container: '#clear-refinements',
  }),
  instantsearch.widgets.refinementList({
    container: '#genres-list',
    attribute: 'genres',
  }),
  instantsearch.widgets.refinementList({
    container: '#players-list',
    attribute: 'players',
  }),
  instantsearch.widgets.refinementList({
    container: '#platforms-list',
    attribute: 'platforms',
  }),
  instantsearch.widgets.configure({
    hitsPerPage: 6,
    attributesToSnippet: ['description:150'],
  }),
  instantsearch.widgets.refinementList({
    container: '#misc-list',
    attribute: 'misc',
  }),
  instantsearch.widgets.hits({
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
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
])

search.start()
