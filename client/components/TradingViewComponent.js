import React, {useEffect, useState} from 'react'

// eslint-disable-next-line react/display-name
export default (props) => {
  const {info} = props
  return (
    <div className="tradingview-detail-div">
      <h6>{info.timeDate}</h6>
      <h2>{info.title}</h2>
      <p>{info.body}</p>
    </div>
  )
}
