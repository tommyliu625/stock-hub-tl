import React from 'react'
import PropTypes from 'prop-types'
import {scaleTime} from 'd3-scale'
import * as d3 from 'd3'
import {utcDay, utcMinute, utcHour, utcWeek, utcMonth} from 'd3-time'
import {ChartCanvas, Chart} from 'react-stockcharts'
import {CandlestickSeries} from 'react-stockcharts/lib/series'
import {XAxis, YAxis} from 'react-stockcharts/lib/axes'
import {fitWidth} from 'react-stockcharts/lib/helper'
import {timeIntervalBarWidth, last} from 'react-stockcharts/lib/utils'
import {connect} from 'react-redux'

let periodToTimeIntervalMap = {
  '1mmin': utcMinute,
  '5min': utcMinute.every(5),
  '15min': utcMinute.every(5),
  '30min': utcMinute.every(30),
  '60min': utcHour,
  daily: utcDay,
  weekly: utcWeek,
  monthly: utcMonth,
}

let StockChart = (props) => {
  console.log(d3)
  let {type, width, data, ratio, interval} = props
  const xAccessor = (d) => d.date
  const start = xAccessor(data[0])
  const end = xAccessor(data[data.length - 1])
  const xExtents = [start, end]
  return (
    <ChartCanvas
      height={400}
      ratio={ratio}
      width={width}
      margin={{left: 50, right: 50, top: 10, bottom: 30}}
      type={type}
      seriesName="Chart"
      data={data}
      xAccessor={xAccessor}
      xExtents={xExtents}
      xScale={d3.scaleTime().domain([start, end])}
      // xScale={d3.scaleTime().domain(data.map(xAccessor))}
      // displayXAccessor={xAccessor(data)}
    >
      {/* periodToTimeIntervalMap[interval] */}
      <Chart id={1} yExtents={(d) => [d.high, d.low]}>
        <XAxis axisAt="bottom" orient="bottom" ticks={6} />
        <YAxis axisAt="left" orient="left" ticks={5} />
        <CandlestickSeries
          width={timeIntervalBarWidth(periodToTimeIntervalMap[interval])}
        />
      </Chart>
    </ChartCanvas>
  )
}

StockChart.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['svg', 'hybrid']).isRequired,
}

StockChart.defaultProps = {
  type: 'svg',
}
StockChart = fitWidth(StockChart)

const mapState = (state) => {
  return {
    stock: state.singleStock,
  }
}

export default connect(mapState, null)(StockChart)
