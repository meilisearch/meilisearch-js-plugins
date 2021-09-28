import { instantMeiliSearch } from '../../../src/index'
import injectScript from 'scriptjs'

injectScript(
  'https://maps.googleapis.com/maps/api/js?v=quarterly&key=AIzaSyBNrL9pJHScT2Xma6OdhyVZLBGO9v7JcAA',
  () => {
    const search = instantsearch({
      indexName: 'steam-video-games',
      searchClient: instantMeiliSearch(
        'https://demo-steam.meilisearch.com',
        '90b03f9c47d0f321afae5ae4c4e4f184f53372a2953ab77bca679ff447ecc15c',
        {
          limitPerRequest: 30,
        }
      ),
      searchFunction: function (helper) {
        console.log(JSON.stringify())
        helper.setQueryParameter('aroundRadius', 75000)
        helper.setQueryParameter('aroundLatLngViaIP', true)
        // helper.setQueryParameter('aroundRadius', somevalue);
        helper.search()
      },
      urlSync: {
        trackedParameters: [
          'attribute:*',
          'query',
          'page',
          'hitsPerPage',
          'aroundLatLngViaIP',
          'aroundRadius',
        ],
      },
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
      instantsearch.widgets.geoSearch({
        container: '#maps',
        googleReference: window.google,
        enableRefineControl: true,
        enableRefineOnMapMove: false,
        initialPosition: {
          lat: 45.7597786530353,
          lng: 4.843585698860502,
        },
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
  }
)
