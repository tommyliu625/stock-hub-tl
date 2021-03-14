import React from 'react'

// eslint-disable-next-line react/display-name
export default (props) => {
  const {links} = props
  return (
    <div className="wsj-detail-div">
      <h3>{links.date}</h3>
      <a href={links.url}>{links.url}</a>
      <p>{links.details}</p>
    </div>
  )
}
