import React from 'react'

// eslint-disable-next-line react/display-name
export default (props) => {
  const {info} = props
  return (
    <div className="seekingalpha-detail-div">
      <h4>{info.title}</h4>
      <a href={info.link}>{info.link}</a>
      <h6>{info.date}</h6>
    </div>
  )
}
