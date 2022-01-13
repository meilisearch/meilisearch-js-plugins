import { instantMeiliSearch } from '../../../src/index'

const search = instantsearch({
  indexName: 'steam-video-games',
  searchClient: instantMeiliSearch(
    'https://integration-demos.meilisearch.com',
    'SEJe5jmM54f7afa09d0500b1fcc5bbeda8e4667453f5af2707c7fd62db6e4727701be0ae',
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
