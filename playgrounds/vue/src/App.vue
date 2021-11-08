<template>
  <div>
    <header class="header">
      <h1 class="header-title">MeiliSearch + Vue InstantSearch</h1>
      <p class="header-subtitle">Search in Steam video games 🎮</p>
    </header>
    <p class="disclaimer">
      This is not the official Steam dataset but only for demo purpose. Enjoy
      searching with MeiliSearch!
    </p>
    <div class="container">
      <ais-instant-search
        :search-client="searchClient"
        index-name="bgg"
        routing="true"
      >
        <ais-stats />
        <div class="search-panel__filters">
          <ais-configure>
            <div slot-scope="{ searchParameters, refine }">
              <div class="range-wrapper">
                <div class="range">
                  <label>Min publish year</label>
                  <input type="number" v-model="minNumber" />
                </div>
                <div class="range">
                  <label>Max publish year</label>
                  <input type="number" v-model="maxNumber" />
                </div>
                <button
                  class="ais-ClearRefinements-button"
                  @click="
                    (event) => {
                      const filters = [
                        minNumber === '' ? '' : `yearPublished > ${minNumber}`,
                        maxNumber === '' ? '' : `yearPublished < ${maxNumber}`,
                      ]
                        .filter((filter) => filter)
                        .join(' AND ')
                      refine({
                        ...searchParameters,
                        filters,
                      })
                    }
                  "
                >
                  Ok
                </button>
              </div>
            </div>
          </ais-configure>

          <h4>Max Difficulty</h4>
          <ais-numeric-menu
            attribute="difficulty"
            :items="[
              { label: 'All' },
              { label: '1', end: 2 },
              { label: '2', end: 3 },
              { label: '3', end: 4 },
              { label: '4', end: 5 },
              { label: '5', end: 6 },
            ]"
          />
          <br />
          <!-- <ais-clear-refinements>
            <span slot="resetLabel">Clear all filters</span>
          </ais-clear-refinements>
          <h2>Categories</h2>
          <ais-refinement-list limit="3" attribute="boardgamecategory" />
          <h2>Mechanics</h2>
          <ais-refinement-list attribute="boardgamemechanic" />
          <h2>Designers</h2>
          <ais-refinement-list attribute="boardgamedesigner" />
          <h2>Artists</h2>
          <ais-refinement-list attribute="boardgameartist" /> -->
        </div>

        <div class="search-panel__results">
          <ais-search-box placeholder="Search here…" />

          <ais-hits>
            <template slot="item" slot-scope="{ item }">
              <div>
                <div class="hit-name">
                  <ais-highlight :hit="item" attribute="name" />
                </div>
                <a
                  class="hit-wrapper"
                  :href="`https://boardgamegeek.com/boardgame/${item.id}`"
                >
                  <img :src="item.image" align="left" :alt="item.image" />
                </a>
                <div class="hit-description">
                  <ais-snippet :hit="item" attribute="description" />
                </div>
                <div class="hit-info">min player: {{ item.minplayers }}</div>
                <div class="hit-info">max player: {{ item.maxplayers }}</div>
                <div class="hit-info">difficulty: {{ item.difficulty }}</div>
                <div class="hit-info">
                  yearPublished: {{ item.yearPublished }}
                </div>
              </div>
            </template>
          </ais-hits>

          <ais-configure
            :attributesToSnippet="['description:50']"
            snippetEllipsisText="…"
          />
          <ais-pagination />
        </div>
      </ais-instant-search>
    </div>
  </div>
</template>

<script>
import 'instantsearch.css/themes/algolia-min.css'
import { instantMeiliSearch } from '../../../src/index'

export default {
  data() {
    return {
      recommendation: '',
      searchClient: instantMeiliSearch(
        'http://localhost:7700',
        '90b03f9c47d0f321afae5ae4c4e4f184f53372a2953ab77bca679ff447ecc15c'
      ),
    }
  },
  methods: {
    order: function (event, searchParameters, refine) {
      refine({
        ...searchParameters,
        sort: this.recommendation,
      })
    },
  },
}
</script>

<style>
body,
h1 {
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
}

.ais-Hits-item {
  margin-bottom: 1em;
  width: calc(50% - 1rem);
}

.ais-Hits-item img {
  margin-right: 1em;
  width: 100%;
  height: 100%;
  margin-bottom: 0.5em;
}

.ais-Highlight-highlighted,
.ais-Snippet-highlighted {
  background: cyan;
  font-style: normal;
}

.disclaimer {
  margin-left: 1em;
}

.hit-name {
  margin-bottom: 0.5em;
}

.hit-description {
  font-size: 90%;
  margin-bottom: 0.5em;
  color: grey;
}

.hit-info {
  font-size: 90%;
}

.header {
  display: flex;
  align-items: center;
  min-height: 50px;
  padding: 0.5rem 1rem;
  background-image: linear-gradient(to right, #4dba87, #2f9088);
  color: #fff;
  margin-bottom: 1rem;
}

.header-title {
  font-size: 1.2rem;
  font-weight: normal;
}

.header-title::after {
  content: ' ▸ ';
  padding: 0 0.5rem;
}

.header-subtitle {
  font-size: 1.2rem;
}

.container {
  padding: 1rem;
}

.ais-InstantSearch {
  max-width: 960px;
  overflow: hidden;
  margin: 0;
}

.search-panel__filters {
  float: left;
  width: 200px;
}

.search-panel__results {
  margin-left: 210px;
}

.ais-SearchBox {
  margin-bottom: 2rem;
}

.ais-Pagination {
  margin: 2rem auto;
  text-align: center;
}
</style>
