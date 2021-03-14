import React from 'react'

export default (props) => {
  const {links} = props
  return (
    <div className="finviz-detail-div">
      <h4>{links.dateTitle}</h4>
      <a href={links.url}>{links.url}</a>
    </div>
  )
}
