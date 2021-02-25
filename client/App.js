import React from 'react'
import {BrowserRouter as Router, Link, Route} from 'react-router-dom'
import SearchBar from './components/SearchBar'
import ChartComponent from './components/ChartComponent'

const Routes = () => {
  return (
    <Router>
      <div>
        <main>
          <h1>Welcome to my AWP Project</h1>
          <SearchBar />
          <ChartComponent />
        </main>
      </div>
    </Router>
  )
}

export default Routes
