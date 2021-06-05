import React from 'react'

// eslint-disable-next-line react/display-name
export default (props) => {
  const {info} = props
  return (
    <div className="seekingalpha-detail-div">
      <h3>{info.title}</h3>
      <a href={info.link}>{info.link}</a>
      <h5>{info.date}</h5>
    </div>
  )
}
