import React from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import SingleIndex from './components/SingleIndex'
import MultiIndex from './components/MultiIndex'

import './App.css'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<SingleIndex />} />
        <Route path="multi-index" element={<MultiIndex />} />
      </Routes>
      <Outlet />
    </div>
  )
}

export default App
