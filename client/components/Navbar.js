import React from 'react'
import {Link} from 'react-router-dom'

const Navbar = () => {
  return (
    <div id="navbar">
      <div id="nav-link-div">
        <Link
          className="nav-link"
          // to="/stockchart"
          onClick={() => {
            window.location.href = '/stockchart'
          }}
        >
          Stock Chart
        </Link>
        <Link
          className="nav-link"
          // to="/stocknews"
          onClick={() => {
            window.location.href = '/stocknews'
          }}
        >
          Stock News
        </Link>
      </div>
      <p>Stock Hub</p>
    </div>
  )
}

export default Navbar
