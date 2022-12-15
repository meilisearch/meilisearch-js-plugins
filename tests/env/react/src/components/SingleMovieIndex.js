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
} from 'react-instantsearch-dom'
import { instantMeiliSearch } from '../../../../../src/index'

const searchClient = instantMeiliSearch('http://localhost:7700', 'masterKey', {
  primaryKey: 'id',
  keepZeroFacets: true,
})

const SingleIndex = () => (
  <div className="ais-InstantSearch">
    <h1>Meilisearch + React InstantSearch</h1>
    <h2>Search in movies</h2>

    <InstantSearch indexName="movies" searchClient={searchClient}>
      <Stats />
      <div className="left-panel">
        <ClearRefinements />
        <h2>Genres</h2>
        <RefinementList attribute="genres" />
        <h2>Players</h2>
        <RefinementList attribute="color" />
        <h2>Platforms</h2>
        <RefinementList attribute="platforms" />
      </div>
      <div className="right-panel">
        <SearchBox />
        <InfiniteHits hitComponent={Hit} />
      </div>
    </InstantSearch>
  </div>
)

const Hit = ({ hit }) => {
  return (
    <div key={hit.id}>
      <div className="hit-name">
        <Highlight attribute="title" hit={hit} />
      </div>
      <div className="hit-name">
        <Highlight attribute="genres" hit={hit} />
      </div>
      <div className="hit-name">
        <Highlight attribute="color" hit={hit} />
      </div>
      <div className="hit-name">
        <Highlight attribute="platforms" hit={hit} />
      </div>
    </div>
  )
}

export default SingleIndex
