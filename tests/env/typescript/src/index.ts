import { instantMeiliSearch } from '../../../../'
import instantsearch from 'instantsearch.js'

const search= instantsearch({
  indexName: 'steam-video-games',
  searchClient: instantMeiliSearch(
    'https://demos.meilisearch.com',
    'dc3fedaf922de8937fdea01f0a7d59557f1fd31832cb8440ce94231cfdde7f25',
    {
      paginationTotalHits: 5,
      placeholderSearch: false
    }
  ),
})

search.addWidgets([
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
          <div class="hit-info">price: {{price}}</div>
          <div class="hit-info">release date: {{releaseDate}}</div>
        </div>
      `,
    },
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
])

search.start()
