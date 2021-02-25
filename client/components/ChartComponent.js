// import Chart from 'chart.js'
import React, {useState, useEffect} from 'react'
// import {Candlestick} from 'react-chartjs-2'
import {dummyDaily} from '../dummyData'
import {TypeChooser} from 'react-stockcharts/lib/helper'
import StockChart from './StockChart'
import {timeParse} from 'd3-time-format'
const {stockPrices} = dummyDaily
let parseDate = timeParse('%Y-%m-%d')
const prices = stockPrices.reverse().map((data, i) => {
  return {
    date: new Date(parseDate(data.time).getTime()),
    open: +data.open,
    high: +data.high,
    close: +data.close,
    low: +data.low,
  }
})

const ChartComponent = () => {
  const [chartsToDisplay, setChartsToDisplay] = useState([])
  const getData = async () => {
    const charts = []
    await charts.push(<StockChart key={1} data={prices} />)
    setChartsToDisplay(charts)
  }
  useEffect(() => {
    getData()
  }, [])
  return <div>{chartsToDisplay}</div>
}

// class ChartComponent extends React.Component {
//   componentDidMount() {
//     let parseDate = timeParse('%Y-%m-%d')
//     const prices = stockPrices.reverse().map((data, i) => {
//       return {
//         date: new Date(parseDate(data.time).getTime()),
//         open: +data.open,
//         high: +data.high,
//         close: +data.close,
//         low: +data.low,
//       }
//     })
//     this.setState({
//       data: prices,
//     })
//   }
//   render() {
//     if (this.state == null) {
//       return <div>Loading...</div>
//     }
//     return (
//       <TypeChooser>
//         {(type) => <StockChart type={type} data={this.state.data} />}
//       </TypeChooser>
//     )
//   }
// }

// class StockChart extends React.Component {
//   componentDidMount() {
//     this.setState({
//       data: stockPrices,
//     })
//   }
//   render() {
//     return (
//       <div>
//         <h1>Bar Chart</h1>
//         <Candlestick data={this.state.data} options={options} />
//       </div>
//     )
//   }
// }

export default ChartComponent
