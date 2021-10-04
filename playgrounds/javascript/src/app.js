import { instantMeiliSearch } from '../../../src/client/index'
import injectScript from 'scriptjs'
// console.log(process.env.local)
console.log(process.env.GOOGLE_API)

const GOOGLE_API = process.env.GOOGLE_API

injectScript(
  `https://maps.googleapis.com/maps/api/js?v=quarterly&key=${GOOGLE_API}`,
  () => {
    const search = instantsearch({
      indexName: 'geo',
      searchClient: instantMeiliSearch('http://localhost:7700', 'masterKey', {
        limitPerRequest: 30,
      }),
      // routing: true,
      searchFunction: function (helper) {
        console.log(helper)
        // helper.setQueryParameter('aroundRadius', 75000)
        // helper.setQueryParameter('aroundLatLngViaIP', true)
        // helper.setQueryParameter('query', 'Lille')

        // helper.setQueryParameter('aroundRadius', somevalue);
        helper.search()
      },
      // urlSync: {
      //   trackedParameters: [
      //     'attribute:*',
      //     'query',
      //     'page',
      //     'hitsPerPage',
      //     'aroundLatLngViaIP',
      //     'aroundRadius',
      //     'insideBoundingBox',
      //   ],
      // },
    })

    search.addWidgets([
      instantsearch.widgets.searchBox({
        container: '#searchbox',
      }),
      instantsearch.widgets.clearRefinements({
        container: '#clear-refinements',
      }),
      instantsearch.widgets.configure({
        hitsPerPage: 6,
        attributesToSnippet: ['description:150'],
      }),
      instantsearch.widgets.geoSearch({
        container: '#maps',
        googleReference: window.google,
        initialZoom: 5,
        initialPosition: {
          lat: 50.655250871381355,
          lng: 4.843585698860502,
        },
      }),
      instantsearch.widgets.hits({
        container: '#hits',
        templates: {
          item: `
            <div>
              <div class="hit-name">
                {{#helpers.highlight}}{ "attribute": "city" }{{/helpers.highlight}}
              </div>
              <div class="hit-info">id: {{id}}</div>
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
