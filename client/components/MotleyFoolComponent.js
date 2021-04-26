import React from 'react'

export default (props) => {
  const {links} = props
  return (
    <div className="motleyfool-detail-div">
      <h4>{links.author}</h4>
      <a href={links.link}>{links.link}</a>
    </div>
  )
}
