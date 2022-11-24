import 'instantsearch.css/themes/algolia-min.css'
import React from 'react'
import {
  InstantSearch,
  // InfiniteHits,
  SearchBox,
  Stats,
  Highlight,
  // ClearRefinements,
  RefinementList,
  Configure,
  // Configure,
  // SortBy,
  // Snippet,
  Index,
  Hits,
  Pagination,
} from 'react-instantsearch-dom'

import './App.css'
import { instantMeiliSearch } from '../../../../src/index'

// import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';
// import { InstantSearch, SearchBox, Hits, Index, RefinementList } from 'react-instantsearch-hooks-web';

const searchClient = instantMeiliSearch('http://localhost:7700', 'masterKey', {
  primaryKey: 'id',
  finitePagination: true,
  // keepZeroFacets: true,
  // placeholderSearch: false,
})
// const searchClient = algoliasearch(
//   'YS7LADBZMM',
//   'd1d5e8069da9b0fd346128c410828c6a'
// );

const Hit = ({ hit }) => {
  // console.log({ hitname: hit.name || hit.title })

  return (
    <div key={hit.id}>
      <div className="hit-name">
        <Highlight attribute="name" hit={hit} />
      </div>
      <div className="hit-name">
        <Highlight attribute="title" hit={hit} />
      </div>
      {/* <div className="hit-name">
        <Highlight attribute="description" hit={hit} />
      </div>
      <div className="hit-name">
        <Highlight attribute="overview" hit={hit} />
      </div> */}
      {/* <div className="hit-name">
        <Highlight attribute="genres" hit={hit} />
      </div>
      <div className="hit-name">
        <Highlight attribute="color" hit={hit} />
      </div>
      <div className="hit-name">
        <Highlight attribute="platforms" hit={hit} />
      </div> */}
    </div>
  )
}

// Issue on two different refinment list
const App = () => (
  <div className="ais-InstantSearch">
    <InstantSearch indexName="movies" searchClient={searchClient}>
      <SearchBox />
      {/* <h2 style={{ margin: 0 }}>Genres</h2>
      <RefinementList attribute="genres" />
      <h2 style={{ margin: 0 }}>Color</h2>
      <RefinementList attribute="color" /> */}
      <center>
        <h2>Movies</h2>
      </center>
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
          {/* <Configure hitsPerPage={2} snippetEllipsisText={'...'} /> */}
          <Pagination />
        </div>
      </Index>
      <center>
        <h2>Games</h2>
      </center>
      <Index indexName="games">
        <div className="ais-InstantSearch">
          <div className="left-panel">
            <h2 style={{ margin: 0 }}>Genres</h2>
            <RefinementList attribute="genres" />
            <h2 style={{ margin: 0 }}>Color</h2>
            <RefinementList attribute="color" />
            <h2 style={{ margin: 0 }}>Platforms</h2>
            <RefinementList attribute="platforms" />
            {/* <Configure hitsPerPage={2} snippetEllipsisText={'...'} /> */}
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
// const App = () => (
//   <div className="ais-InstantSearch">
//     <InstantSearch indexName="movies" searchClient={searchClient}>
//       <Stats />
//       <div className="left-panel">
//         {/* <h2>Genres</h2>
//         <RefinementList attribute="genres" />
//         <h2>Color</h2>
//         <RefinementList attribute="color" />
//         <h2>Platforms</h2>
//         <RefinementList attribute="platforms" /> */}
//         <Configure
//           attributesToSnippet={['description:10', 'overview:10']}
//           snippetEllipsisText={'...'}
//         />
//       </div>
//       <div className="right-panel">
//         <SearchBox />
//         <h2>Movies</h2>
//         <Index indexName="movies">
//           <Hits hitComponent={Hit} />
//         </Index>
//         <h2>Games</h2>
//         <Index indexName="games">
//           <Hits hitComponent={Hit} />
//         </Index>
//         <Pagination />
//         {/* <Hits hitComponent={Hit} /> */}
//       </div>
//     </InstantSearch>
//   </div>
// )

export default App
