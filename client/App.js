import React from 'react'
import {BrowserRouter as Router, Link, Route} from 'react-router-dom'
import SearchBar from './components/SearchBar'
import ChartComponent from './components/ChartComponent'
import Navbar from './components/Navbar'
import Routes from './routes'

import Home from './components/StockChartComponent'

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <main>
          <Routes />
        </main>
      </div>
    </Router>
  )
}

export default App
