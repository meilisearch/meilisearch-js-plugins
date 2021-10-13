import { instantMeiliSearch } from '../../../src/client/index'
import injectScript from 'scriptjs'

const GOOGLE_API = process.env.GOOGLE_API

injectScript(
  `https://maps.googleapis.com/maps/api/js?v=quarterly&key=${GOOGLE_API}`,
  () => {
    const search = instantsearch({
      indexName: 'countries_playground',
      searchClient: instantMeiliSearch('http://localhost:7700', 'masterKey', {
        limitPerRequest: 200,
      }),
      initialUiState: {
        countries_playground: {
          geoSearch: {
            boundingBox:
              '51.21699878945007, 4.867560211665137,50.433157541783224, 3.938237196122078',
          },
        },
      },
    })

    search.addWidgets([
      instantsearch.widgets.searchBox({
        container: '#searchbox',
      }),
      instantsearch.widgets.configure({
        hitsPerPage: 6,
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
