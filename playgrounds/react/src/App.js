import 'instantsearch.css/themes/algolia-min.css'
import React from 'react'
import {
  InstantSearch,
  InfiniteHits,
  SearchBox,
  Stats,
  Highlight,
  ClearRefinements,
  RefinementList,
  Configure,
} from 'react-instantsearch-dom'
import './App.css'
import { instantMeiliSearch } from '../../../src/index'

const searchClient = instantMeiliSearch(
  // 'https://demos.meilisearch.com',
  // 'dc3fedaf922de8937fdea01f0a7d59557f1fd31832cb8440ce94231cfdde7f25',
  'http://localhost:7700',
  'masterKey',
  {
    paginationTotalHits: 60,
    primaryKey: 'id',
  }
)

const App = () => (
  <div className="ais-InstantSearch">
    <h1>MeiliSearch + React InstantSearch</h1>
    <h2>
      Search in Steam video games{' '}
      <span role="img" aria-label="emoji">
        🎮
      </span>
    </h2>
    <p>
      This is not the official Steam dataset but only for demo purpose. Enjoy
      searching with MeiliSearch!
    </p>
    <InstantSearch indexName="movies" searchClient={searchClient}>
      <Stats />
      <div className="left-panel">
        <ClearRefinements />
        <h2>Genres</h2>
        <RefinementList attribute="genres" />
        <h2>Title</h2>
        <RefinementList attribute="title" />
        {/* <h2>Platforms</h2>
        <RefinementList attribute="platforms" />
        <h2>Misc</h2>
        <RefinementList attribute="misc" /> */}
        <Configure hitsPerPage={6} />
      </div>
      <div className="right-panel">
        <SearchBox />
        <InfiniteHits hitComponent={Hit} />
      </div>
    </InstantSearch>
  </div>
)

const Hit = ({ hit }) => (
  <div key={hit.id}>
    <div className="hit-name">
      <Highlight attribute="title" hit={hit} />
    </div>
    <img src={hit.image} align="left" alt={hit.name} />
    <div className="hit-name">
      <Highlight attribute="overview" hit={hit} />
    </div>
    <div className="hit-info">price: {hit.price}</div>
    <div className="hit-info">release date: {hit.releaseDate}</div>
  </div>
)

export default App
