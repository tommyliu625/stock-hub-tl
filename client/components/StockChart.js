import React from 'react'
import PropTypes from 'prop-types'
import {scaleTime} from 'd3-scale'
import {utcDay} from 'd3-time'
import {ChartCanvas, Chart} from 'react-stockcharts'
import {CandlestickSeries} from 'react-stockcharts/lib/series'
import {XAxis, YAxis} from 'react-stockcharts/lib/axes'
import {fitWidth} from 'react-stockcharts/lib/helper'
import {discontinuousTimeScaleProvider} from 'react-stockcharts/lib/scale'
import {timeIntervalBarWidth} from 'react-stockcharts/lib/utils'

let StockChart = (props) => {
  console.log('props', props)
  const {type, width, data, ratio} = props
  const xAccessor = (d) => d.date

  const xExtents = [xAccessor(data[0]), xAccessor(data[data.length - 1])]
  return (
    <ChartCanvas
      height={400}
      ratio={ratio}
      width={width}
      margin={{left: 50, right: 50, top: 10, bottom: 30}}
      type={type}
      seriesName="AAPL"
      data={data}
      xAccessor={xAccessor}
      xScale={scaleTime()}
      xExtents={xExtents}
    >
      <Chart id={1} yExtents={(d) => [d.high, d.low]}>
        <XAxis axisAt="bottom" orient="bottom" ticks={6} />
        <YAxis axisAt="left" orient="left" ticks={5} />
        <CandlestickSeries width={timeIntervalBarWidth(utcDay)} />
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

export default StockChart
