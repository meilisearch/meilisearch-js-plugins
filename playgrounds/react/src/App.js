import 'instantsearch.css/themes/algolia-min.css'
import React, { Component } from 'react'
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
import { instantMeiliSearch } from '../../../src/client/index'

const searchClient = instantMeiliSearch(
  'https://demos.meilisearch.com',
  'dc3fedaf922de8937fdea01f0a7d59557f1fd31832cb8440ce94231cfdde7f25',
  {
    paginationTotalHits: 60,
    primaryKey: 'id',
  }
)

class App extends Component {
  render() {
    return (
      <div className="ais-InstantSearch">
        <h1>MeiliSearch + React InstantSearch</h1>
        <h2>
          Search in Steam video games{' '}
          <span role="img" aria-label="emoji">
            🎮
          </span>
        </h2>
        <p>
          This is not the official Steam dataset but only for demo purpose.
          Enjoy searching with MeiliSearch!
        </p>
        <InstantSearch
          indexName="steam-video-games"
          searchClient={searchClient}
        >
          <Stats />
          <div className="left-panel">
            <ClearRefinements />
            <h2>Genres</h2>
            <RefinementList attribute="genres" />
            <h2>Players</h2>
            <RefinementList attribute="players" />
            <h2>Platforms</h2>
            <RefinementList attribute="platforms" />
            <h2>Misc</h2>
            <RefinementList attribute="misc" />
            <Configure hitsPerPage={6} />
          </div>
          <div className="right-panel">
            <SearchBox />
            <InfiniteHits hitComponent={Hit} />
          </div>
        </InstantSearch>
      </div>
    )
  }
}

function Hit(props) {
  return (
    <div key={props.hit.id}>
      <div className="hit-name">
        <Highlight attribute="name" hit={props.hit} />
      </div>
      <img src={props.hit.image} align="left" alt={props.hit.name} />
      <div className="hit-info">price: {props.hit.price}</div>
      <div className="hit-info">release date: {props.hit.releaseDate}</div>
    </div>
  )
}

export default App
