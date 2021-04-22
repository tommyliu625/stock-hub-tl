import React from 'react'

// eslint-disable-next-line react/display-name
export default (props) => {
  const {info} = props
  return (
    <div className="bloomberg-detail-div">
      <h4>{info.date}</h4>
      <h3>{info.headline}</h3>
      <a href={info.link}>{info.link}</a>
    </div>
  )
}
