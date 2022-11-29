import 'instantsearch.css/themes/algolia-min.css'
import React from 'react'
import {
  InstantSearch,
  SearchBox,
  Highlight,
  RefinementList,
  Index,
  Hits,
  Pagination,
} from 'react-instantsearch-dom'
import { instantMeiliSearch } from '../../../../../src/index'

const searchClient = instantMeiliSearch('http://localhost:7700', 'masterKey', {
  primaryKey: 'id',
  finitePagination: true,
})

const Hit = ({ hit }) => {
  return (
    <div key={hit.id}>
      <div className="hit-name">
        <Highlight attribute="name" hit={hit} />
      </div>
      <div className="hit-name">
        <Highlight attribute="title" hit={hit} />
      </div>
    </div>
  )
}


const MultiIndex = () => (
  <div className="ais-InstantSearch">
    <InstantSearch indexName="movies" searchClient={searchClient}>
      <SearchBox />
      <h2 style={{ textAlign: 'center' }}>Movies</h2>
      <Index indexName="movies">
        <div className="ais-InstantSearch">
          <div className="left-panel">
            <h2 style={{ margin: 0 }}>Genres</h2>
            <RefinementList attribute="genres" />
            <h2 style={{ margin: 0 }}>Color</h2>
            <RefinementList attribute="color" />
            <h2 style={{ margin: 0 }}>Platforms</h2>
            <RefinementList attribute="platforms" />
          </div>
          <div className="right-panel">
            <Hits hitComponent={Hit} />
          </div>
          <Pagination />
        </div>
      </Index>
      <h2 style={{ textAlign: 'center' }}>Games</h2>
      <Index indexName="games">
        <div className="ais-InstantSearch">
          <div className="left-panel">
            <h2 style={{ margin: 0 }}>Genres</h2>
            <RefinementList attribute="genres" />
            <h2 style={{ margin: 0 }}>Color</h2>
            <RefinementList attribute="color" />
            <h2 style={{ margin: 0 }}>Platforms</h2>
            <RefinementList attribute="platforms" />
          </div>
          <div className="right-panel">
            <Hits hitComponent={Hit} />
          </div>
          <Pagination />
        </div>
      </Index>
    </InstantSearch>
  </div>
)

export default MultiIndex
