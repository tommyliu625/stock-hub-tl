// import Chart from 'chart.js'
import React, {useState, useEffect} from 'react'
// import {Candlestick} from 'react-chartjs-2'
import {dummyAAPL1YearDaily, dummyAMZN5yearWeekly} from '../dummyData'
import StockChart from './StockChart'
import {timeParse} from 'd3-time-format'
import {connect} from 'react-redux'

// const {stockPrices, info} = dummyAAPL1YearDaily

const ChartComponent = (props) => {
  // console.log('props: ', props)
  if (props.stock.stockPrices) {
    const {stockPrices, info} = props.stock
    // console.log('stockPrices', stockPrices)
    // console.log('info', info)
    let parseDate = stockPrices[0].hasOwnProperty('dateTime')
      ? timeParse('%Y-%m-%d %H:%M:%S')
      : timeParse('%Y-%m-%d')
    let reversePrices = [...stockPrices].reverse()
    // console.log('reversePrices', reversePrices)
    const prices = reversePrices.map((data, i) => {
      let dateTime = data.hasOwnProperty('dateTime') ? data.dateTime : data.date
      return {
        date: new Date(parseDate(dateTime).getTime()),
        open: +data.open,
        high: +data.high,
        close: +data.close,
        low: +data.low,
      }
    })
    // console.log(prices, info['4. Interval'])
    return (
      <div>
        <StockChart key={1} data={prices} interval={info['4. Interval']} />
      </div>
    )
  } else {
    return null
  }
}
const mapState = (state) => {
  return {
    stock: state.singleStock,
  }
}

export default connect(mapState, null)(ChartComponent)
