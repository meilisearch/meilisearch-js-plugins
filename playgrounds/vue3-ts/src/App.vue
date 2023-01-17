<template>
  <div>
    <header class="header">
      <h1 class="header-title">MeiliSearch + Vue 3 InstantSearch</h1>
      <p class="header-subtitle">Search in Steam video games 🎮</p>
    </header>
    <p class="disclaimer">
      This is not the official Steam dataset but only for demo purpose. Enjoy
      searching with MeiliSearch!
    </p>
    <div class="container">
      <ais-instant-search
        :search-client="searchClient"
        index-name="steam-video-games"
      >
        <div class="search-panel__filters">
          <h2>Genres</h2>
          <ais-refinement-list attribute="genres" />
          <h2>Players</h2>
          <ais-refinement-list attribute="players" />
          <h2>Platforms</h2>
          <ais-refinement-list attribute="platforms" />
          <h2>Misc</h2>
          <ais-refinement-list attribute="misc" />
        </div>
        <div class="search-panel__results">
          <ais-search-box placeholder="Search here…" />
          <ais-hits>
            <template v-slot:item="{ item }">
              <div>
                <div class="hit-name">
                  <ais-highlight :hit="item" attribute="name" />
                </div>
                <img :src="item.image" align="left" :alt="item.image" />
                <div class="hit-description">
                  <ais-snippet :hit="item" attribute="description" />
                </div>
                <div class="hit-info">price: {{ item.price }}</div>
                <div class="hit-info">release date: {{ item.releaseDate }}</div>
              </div>
            </template>
          </ais-hits>
          <ais-configure
            :attributesToSnippet="['description:50']"
            snippetEllipsisText="…"
          />
        </div>
        <ais-pagination />
      </ais-instant-search>
    </div>
  </div>
</template>

<script lang="ts">
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'

export default {
  data() {
    return {
      searchClient: instantMeiliSearch(
        'https://ms-adf78ae33284-106.lon.meilisearch.io',
        'a63da4928426f12639e19d62886f621130f3fa9ff3c7534c5d179f0f51c4f303',
        {
          finitePagination: true,
        }
      ),
    }
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

.ais-Highlight-highlighted {
  background: cyan;
  font-style: normal;
}

.disclaimer {
  margin-left: 1em;
}

.hit-name {
  margin-bottom: 0.5em;
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

.hit-description {
  font-size: 90%;
  margin-bottom: 0.5em;
  color: grey;
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
.ais-SearchBox-form {
  margin-bottom: 20px;
}
</style>
