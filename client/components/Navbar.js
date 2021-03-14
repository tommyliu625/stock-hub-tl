import React from 'react'
import {Link} from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-sm bg-dark">
      <div className="container-fluid">
        <Link className="nav-link" to="/">
          Home
        </Link>
        <Link className="nav-link" to="/stockchart">
          Stock Chart
        </Link>
        <Link className="nav-link" to="/chat">
          Chat
        </Link>{' '}
        <Link className="nav-link" to="/stocknews">
          Stock News
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
