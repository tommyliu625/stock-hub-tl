import React from 'react'

export default (props) => {
  const {links} = props
  return (
    <div>
      <h6>{links.dateTitle}</h6>
      <a href={links.url}>{links.url}</a>
    </div>
  )
}
