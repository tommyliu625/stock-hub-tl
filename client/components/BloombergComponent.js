import React from 'react'

// eslint-disable-next-line react/display-name
export default (props) => {
  const {info} = props
  return (
    <div className="bloomberg-detail-div">
      <h3>{info.date}</h3>
      <h1>{info.headline}</h1>
      <a href={info.link}>{info.link}</a>
    </div>
  )
}
