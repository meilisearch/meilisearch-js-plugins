import { autocomplete } from '@algolia/autocomplete-js'
import {
  meilisearchAutocompleteClient,
  getMeilisearchResults,
} from '@meilisearch/autocomplete-client'
import '@algolia/autocomplete-theme-classic'

const client = meilisearchAutocompleteClient({
  url: 'http://localhost:7700',
  apiKey: 'masterKey',
})

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search for games',
  openOnFocus: true,
  debug: true,
  getSources({ query }) {
    return [
      {
        sourceId: 'steam-video-games',
        getItems() {
          const description = getMeilisearchResults({
            searchClient: client,
            queries: [
              {
                indexName: 'steam-video-games',
                query,
                params: {
                  hitsPerPage: 10,
                  attributesToSnippet: ['name:10', 'description:5'],
                  snippetEllipsisText: '..',
                },
              },
            ],
          })

          return description
        },
        templates: {
          item({ item, components, html }) {
            return html`<div class="aa-ItemWrapper">
              <div class="aa-ItemContent">
                <div class="aa-ItemIcon aa-ItemIcon--alignTop">
                  <img
                    src="${item.image}"
                    alt="${item.name}"
                    width="40"
                    height="40"
                  />
                </div>
                <div class="aa-ItemContentBody">
                  <div class="aa-ItemContentTitle">
                    ${components.Highlight({
                      hit: item,
                      attribute: 'name',
                      tagName: 'test',
                    })}
                  </div>
                  <div class="aa-ItemContentDescription">
                    ${components.Snippet({
                      hit: item,
                      attribute: 'description',
                    })}
                  </div>
                </div>
                <div class="aa-ItemActions">
                  <button
                    class="aa-ItemActionButton aa-DesktopOnly aa-ActiveOnly"
                    type="button"
                    title="Select"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="currentColor"
                    >
                      <path
                        d="M18.984 6.984h2.016v6h-15.188l3.609 3.609-1.406 1.406-6-6 6-6 1.406 1.406-3.609 3.609h13.172v-4.031z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>`
          },
        },
      },
    ]
  },
})
